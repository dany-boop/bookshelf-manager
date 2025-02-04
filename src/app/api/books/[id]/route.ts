/**
 * @fileoverview Books API endpoints for updating and deleting a book.
 * This module provides:
 * - PUT: To update a book (with image upload support).
 * - DELETE: To delete a book (and its associated cover image).
 *
 * Key Features:
 * - Robust error handling with proper HTTP status responses.
 * - Image optimization (using Sharp) only for files larger than 1MB.
 * - Clean and modular code with detailed documentation.
 *
 * Performance:
 * - Uses asynchronous file operations.
 * - Only optimizes large image files.
 */
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { writeFile } from 'fs/promises';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import sharp from 'sharp';

const prisma = new PrismaClient();

// Directory for uploaded images.
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
const ONE_MB = 1024 * 1024; // 1MB in bytes

// image save
async function saveImage(file: File): Promise<string> {
  const extension = path.extname(file.name);
  const fileName = `${nanoid()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  // Convert file to a Buffer.
  const imageBuffer = Buffer.from(await file.arrayBuffer());

  // Check file size and optimize only if > 1MB.
  if (file.size > ONE_MB) {
    await sharp(imageBuffer)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toFile(filePath);
  } else {
    // Otherwise, write the file directly.
    await writeFile(filePath, imageBuffer);
  }

  return `/uploads/${fileName}`;
}

/**
 * deleteImage
 * Deletes an image file from the server.
 *
 * @param {string} imagePath - The absolute path to the image file.
 * @returns {Promise<void>}
 */
async function deleteImage(imagePath: string): Promise<void> {
  try {
    // Check if the file exists.
    await fs.promises.access(imagePath, fs.constants.F_OK);
    console.log('Deleting image at:', imagePath);
    await fs.promises.unlink(imagePath);
  } catch (error: any) {
    console.error('Failed to delete image:', error);
  }
}

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

    // Prepare the update data
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

      // Delete the old image if exists.
      if (existingBook.coverImage) {
        const oldImagePath = path.join(process.cwd(), existingBook.coverImage);
        await deleteImage(oldImagePath);
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

// DELETE method to delete a book
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

    // Delete the book record from the database.
    await prisma.book.delete({
      where: { id: Number(id) },
    });

    // Delete the cover image file if it exists.
    if (existingBook.coverImage) {
      const oldImagePath = path.join(
        process.cwd(),
        'public',
        existingBook.coverImage
      );
      console.log('Attempting to delete image at:', oldImagePath);
      await deleteImage(oldImagePath);
    }

    // Return a 204 No Content status.
    return NextResponse.json(
      { message: 'Book deleted successfully' },
      { status: 204 }
    );
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}

// OPTIONS method to specify allowed methods
export function OPTIONS() {
  return NextResponse.json({ methods: ['GET', 'PUT', 'DELETE'] });
}
