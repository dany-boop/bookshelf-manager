import { PrismaClient } from '@prisma/client';
import path from 'path';
import { writeFile } from 'fs/promises';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import sharp from 'sharp';
import { supabase } from '@/lib/supabase';

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
const ONE_MB = 1024 * 1024; // 1MB in bytes

// ------------- IMAGE HANDLING HELPERS ------------- //

/**
 * Saves an image file either by uploading to Supabase or saving locally.
 * @param file - The File object.
 * @returns The public URL to the saved image or null on failure.
 */
async function saveImage(file: File): Promise<string | null> {
  const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  return isSupabaseConfigured ? uploadToSupabase(file) : saveLocally(file);
}

/**
 * Uploads an image file to Supabase Storage.
 */
async function uploadToSupabase(file: File): Promise<string | null> {
  try {
    const fileExt = path.extname(file.name);
    const fileName = `${nanoid()}${fileExt}`;
    const filePath = `book/${fileName}`;
    const imageBuffer = Buffer.from(await file.arrayBuffer());

    // Optimize image if larger than 1MB.
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

    const publicUrl = supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
      .getPublicUrl(filePath).data.publicUrl;
    return publicUrl;
  } catch (err) {
    console.error('Supabase upload failed:', err);
    return null;
  }
}

/**
 * Saves an image file locally.
 */
async function saveLocally(file: File): Promise<string> {
  const extension = path.extname(file.name);
  const fileName = `${nanoid()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  const imageBuffer = Buffer.from(await file.arrayBuffer());

  if (file.size > ONE_MB) {
    await sharp(imageBuffer)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toFile(filePath);
  } else {
    await writeFile(filePath, imageBuffer);
  }
  return `/uploads/${fileName}`;
}

/**
 * Deletes a local image file.
 */
async function deleteImageLocally(imagePath: string): Promise<void> {
  try {
    await fs.promises.access(imagePath, fs.constants.F_OK);
    console.log('Deleting local image at:', imagePath);
    await fs.promises.unlink(imagePath);
  } catch (error) {
    console.error('Failed to delete local image:', error);
  }
}

/**
 * Deletes an image from Supabase Storage.
 */
async function deleteImageFromSupabase(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
      .remove([filePath]);
    if (error) {
      console.error('Failed to delete image from Supabase:', error);
      throw new Error('Failed to delete image from Supabase');
    }
    console.log('Image deleted from Supabase:', filePath);
  } catch (err) {
    console.error('Error deleting image from Supabase:', err);
  }
}

// ------------- API HANDLERS ------------- //

/**
 * PUT /api/books/:id
 * Updates an existing book record.
 */
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Invalid book ID' }, { status: 400 });
    }

    const formData = await req.formData();
    // Destructure update fields from the formData.
    const {
      title,
      category,
      description,
      author,
      pages,
      isbn,
      publisher,
      publication_place,
      language,
      status,
      coverImage: newCoverImageFile,
    } = Object.fromEntries(formData);

    // Retrieve existing book record.
    const existingBook = await prisma.book.findUnique({
      where: { id: Number(id) },
    });
    if (!existingBook) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    // Prepare update data.
    const updateData: any = {
      title,
      category,
      description,
      author,
      isbn,
      publisher,
      publication_place,
      pages: parseInt(pages as string, 10),
      language,
      status,
    };

    // Handle cover image update.
    if (newCoverImageFile instanceof File) {
      const newCoverImage = await saveImage(newCoverImageFile);
      updateData.coverImage = newCoverImage;

      // Delete old image if it exists.
      if (existingBook.coverImage) {
        if (existingBook.coverImage.startsWith('/uploads')) {
          const oldImagePath = path.join(
            process.cwd(),
            'public',
            existingBook.coverImage
          );
          await deleteImageLocally(oldImagePath);
        } else {
          const imageName = existingBook.coverImage.split('/').pop();
          if (imageName) {
            await deleteImageFromSupabase(`book/${imageName}`);
          }
        }
      }
    }

    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/books/:id
 * Deletes an existing book record and its cover image.
 */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split('/').pop();

    if (!id || Array.isArray(id)) {
      return NextResponse.json({ error: 'Invalid book ID' }, { status: 400 });
    }

    // Retrieve the existing book.
    const existingBook = await prisma.book.findUnique({
      where: { id: Number(id) },
    });
    if (!existingBook) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    // Delete the book record.
    await prisma.book.delete({
      where: { id: Number(id) },
    });

    // Delete the cover image if it exists.
    if (existingBook.coverImage) {
      if (existingBook.coverImage.startsWith('/uploads')) {
        const localPath = path.join(
          process.cwd(),
          'public',
          existingBook.coverImage
        );
        await deleteImageLocally(localPath);
      } else {
        const imageName = existingBook.coverImage.split('/').pop();
        if (imageName) {
          await deleteImageFromSupabase(`book/${imageName}`);
        }
      }
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/books
 * Returns allowed HTTP methods.
 */
export function OPTIONS() {
  return NextResponse.json({ methods: ['GET', 'PUT', 'DELETE'] });
}
