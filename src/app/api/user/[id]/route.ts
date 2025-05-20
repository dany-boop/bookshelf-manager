import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { writeFile } from 'fs/promises';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/user');
const ONE_MB = 1024 * 1024; // 1MB in bytes

async function saveImage(file: File): Promise<string | null> {
  const isSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL; // Check if Supabase is configured

  if (isSupabase) {
    return uploadToSupabase(file);
  } else {
    return saveLocally(file);
  }
}

async function uploadToSupabase(file: File): Promise<string | null> {
  try {
    const fileExt = path.extname(file.name);
    const fileName = `${nanoid()}${fileExt}`;
    const filePath = `user/${fileName}`;
    const imageBuffer = Buffer.from(await file.arrayBuffer());

    // Optimize image if > 1MB
    let optimizedBuffer = imageBuffer;
    if (file.size > ONE_MB) {
      optimizedBuffer = await sharp(imageBuffer)
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    const { data, error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
      .upload(filePath, optimizedBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return null;
    }

    return supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
      .getPublicUrl(filePath).data.publicUrl;
  } catch (err) {
    console.error('Supabase upload failed:', err);
    return null;
  }
}
// save photo
async function saveLocally(file: File): Promise<string> {
  const extension = path.extname(file.name);
  const fileName = `${nanoid()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  // Convert file to a Buffer.
  const imageBuffer = Buffer.from(await file.arrayBuffer());

  // Optimize the image if larger than 1MB.
  if (file.size > ONE_MB) {
    await sharp(imageBuffer)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toFile(filePath);
  } else {
    // Otherwise, simply write the file.
    await writeFile(filePath, imageBuffer);
  }

  return `/uploads/user/${fileName}`;
}

// delete file
async function deleteImage(filePath: string): Promise<void> {
  try {
    // Verify file exists
    await fs.promises.access(filePath, fs.constants.F_OK);
    console.log('Deleting file at:', filePath);
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error('Failed to delete file:', error);
  }
}

async function deleteImageFromSupabase(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
      .remove([filePath]); // filePath refers to the path of the image in Supabase storage

    if (error) {
      console.error('Failed to delete image from Supabase:', error);
      throw new Error('Failed to delete image from Supabase');
    }

    console.log('Image deleted from Supabase:', filePath);
  } catch (err) {
    console.error('Error deleting image from Supabase:', err);
  }
}

// get user by id
export async function GET(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        photo_url: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/:id
 */
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Parse the form data.
    const formData = await req.formData();
    const data = Object.fromEntries(formData);
    const { email, password, username } = data;

    // Fetch existing user record.
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newPhotoFile = formData.get('photo_url') as File | null;

    // Validate at least one field is provided for update.
    if (!email && !password && !username && !newPhotoFile) {
      return NextResponse.json(
        { error: 'No fields provided for update' },
        { status: 400 }
      );
    }

    // Prepare update payload.
    const updateData: any = {};
    if (email) updateData.email = email.toString();
    if (password) {
      updateData.password = await bcrypt.hash(password.toString(), 10);
    }
    if (username) updateData.username = username.toString();

    // Handle photo update.
    if (newPhotoFile instanceof File) {
      const newPhotoUrl = await saveImage(newPhotoFile);
      updateData.photo_url = newPhotoUrl;
      // Delete old photo if exists.
      if (existingUser.photo_url) {
        const oldPhotoPath = path.join(process.cwd(), existingUser.photo_url);
        if (existingUser.photo_url.startsWith('/uploads')) {
          await deleteImage(oldPhotoPath);
        } else {
          const imagePath = existingUser.photo_url.split('/').pop();
          if (imagePath) {
            await deleteImageFromSupabase(`book/${imagePath}`);
          } // Return a 204 No Content status.
        }
      }
    }

    // Update the user record.
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export function OPTIONS(): NextResponse {
  return NextResponse.json({ methods: ['PUT', 'DELETE'] });
}
