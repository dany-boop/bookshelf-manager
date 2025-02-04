/**
 * @fileoverview User API endpoints for updating and deleting a user.
 * This module handles:
 * - PUT: To update a user's details (including optional photo upload).
 * - DELETE: To delete a user (and optionally remove the user's photo from storage).
 *
 * Best practices implemented:
 * - Clean, modular code with detailed documentation.
 * - Performance optimization: Only optimize the photo if its size exceeds 1MB.
 * - Robust error handling: Every branch returns an appropriate HTTP response.
 *
 * Model:
 *   model User {
 *     id        String   @id @default(cuid())
 *     email     String   @unique
 *     password  String
 *     username  String
 *     photo_url String?
 *     createdAt DateTime @default(now())
 *     updatedAt DateTime @updatedAt
 *     Book      Book[]
 *   }
 */

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { writeFile } from 'fs/promises';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/user');
const ONE_MB = 1024 * 1024; // 1MB in bytes

// save photo
async function savePhoto(file: File): Promise<string> {
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
async function deleteFile(filePath: string): Promise<void> {
  try {
    // Verify file exists
    await fs.promises.access(filePath, fs.constants.F_OK);
    console.log('Deleting file at:', filePath);
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error('Failed to delete file:', error);
  }
}

/**
 * GET /api/user/:id
 * Fetch user details by ID.
 */
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
      const newPhotoUrl = await savePhoto(newPhotoFile);
      updateData.photo_url = newPhotoUrl;
      // Delete old photo if exists.
      if (existingUser.photo_url) {
        const oldPhotoPath = path.join(process.cwd(), existingUser.photo_url);
        await deleteFile(oldPhotoPath);
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

// delete user
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Find the existing user.
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete the user record.
    await prisma.user.delete({ where: { id } });

    // If a photo exists, delete the photo file.
    if (existingUser.photo_url) {
      const photoPath = path.join(
        process.cwd(),
        'public',
        existingUser.photo_url
      );
      console.log('Attempting to delete photo at:', photoPath);
      await deleteFile(photoPath);
    }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 204 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
export function OPTIONS(): NextResponse {
  return NextResponse.json({ methods: ['PUT', 'DELETE'] });
}
