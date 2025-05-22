import { PrismaClient } from '@prisma/client';
import path from 'path';
import { writeFile } from 'fs/promises';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import sharp from 'sharp';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
const ONE_MB = 1024 * 1024; // 1MB in bytes

async function saveImage(file: File): Promise<string | null> {
  const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  return isSupabaseConfigured ? uploadToSupabase(file) : saveLocally(file);
}

//  Uploads an image file to Supabase Storage.
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

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Invalid book ID' }, { status: 400 });
    }

    const formData = await req.formData();
    const {
      title,
      categories: categoriesInput,
      description,
      author,
      pages,
      isbn,
      publisher,
      publication_place,
      language,
      status,
      currentPage,
      coverImage: newCoverImageFile,
    } = Object.fromEntries(formData);

    // Process categories - split comma-separated string and trim whitespace
    const categoryNames =
      typeof categoriesInput === 'string'
        ? categoriesInput
            .split(',')
            .map((name) => name.trim())
            .filter((name) => name.length > 0)
        : [];

    const existingBook = await prisma.book.findUnique({
      where: { id: Number(id) },
      include: {
        progress: true,
        categories: true,
      },
    });

    if (!existingBook) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    const updateData: any = {
      title,
      description,
      author,
      isbn,
      publisher,
      publication_place,
      pages: pages ? parseInt(pages as string, 10) : null,
      language,
      status,
    };

    // Handle cover image update
    if (newCoverImageFile instanceof File) {
      const newCoverImage = await saveImage(newCoverImageFile);
      updateData.coverImage = newCoverImage;

      // Delete old image if it exists
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

    if (categoryNames.length > 0) {
      const categoryOperations = await Promise.all(
        categoryNames.map(async (name) => {
          return {
            where: { name },
            create: { name },
          };
        })
      );

      await prisma.book.update({
        where: { id: Number(id) },
        data: {
          categories: {
            set: [], // Disconnect all
          },
        },
      });

      updateData.categories = {
        connectOrCreate: categoryOperations,
      };
    } else {
      updateData.categories = {
        set: [],
      };
    }

    // Update the book
    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        categories: true,
      },
    });

    if (typeof currentPage === 'string' && currentPage.trim() !== '') {
      const currentPageInt = parseInt(currentPage, 10);
      if (!isNaN(currentPageInt)) {
        if (existingBook.progress) {
          await prisma.readingProgress.update({
            where: { bookId: Number(id) },
            data: {
              currentPage: currentPageInt,
              lastUpdated: new Date(),
            },
          });
        } else {
          await prisma.readingProgress.create({
            data: {
              bookId: Number(id),
              userId: existingBook.userId,
              currentPage: currentPageInt,
            },
          });
        }
      }
    }

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE /api/books/:id

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split('/').pop();

    if (!id || Array.isArray(id)) {
      return NextResponse.json({ error: 'Invalid book ID' }, { status: 400 });
    }

    const bookId = Number(id);

    const existingBook = await prisma.book.findUnique({
      where: { id: bookId },
      include: { progress: true, categories: true },
    });

    if (!existingBook) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    if (existingBook.progress) {
      await prisma.readingProgress.delete({
        where: { bookId },
      });
    }

    await prisma.book.update({
      where: { id: bookId },
      data: {
        categories: {
          set: [],
        },
      },
    });

    // Delete the book
    await prisma.book.delete({
      where: { id: bookId },
    });

    // Delete the cover image if it exists
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

export function OPTIONS() {
  return NextResponse.json({ methods: ['GET', 'PUT', 'DELETE'] });
}
