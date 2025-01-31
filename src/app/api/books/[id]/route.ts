import { PrismaClient } from '@prisma/client';
import path from 'path';
import { writeFile, unlink } from 'fs/promises';
import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

// Function to save an image
async function saveImage(file: File): Promise<string> {
  const extension = path.extname(file.name);
  const fileName = `${nanoid()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  // Ensure directory exists
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/${fileName}`; // Return public path for the image
}

// Function to delete an image

async function deleteImage(oldImagePath: string) {
  try {
    // Construct the absolute path to the file using the provided filePath (which starts with /uploads/)

    if (fs.existsSync(oldImagePath)) {
      console.log('Deleting image at:', oldImagePath);
      await fs.promises.unlink(oldImagePath); // Delete the image file
    } else {
      console.log('File does not exist:', oldImagePath);
    }
  } catch (error) {
    console.error('Failed to delete image:', error);
  }
}

export async function GET(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop();

  if (!id || Array.isArray(id)) {
    return NextResponse.json({ error: 'Invalid book ID' }, { status: 400 });
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
    });

    if (!book) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// PUT method to edit data
export async function PUT(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop();
  console.log(id);
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

  try {
    // Fetch the existing book to get the current cover image
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

    // Handle cover image update
    if (newCoverImageFile instanceof File) {
      // Save the new image
      const newCoverImage = await saveImage(newCoverImageFile);
      updateData.coverImage = newCoverImage;

      // Delete the old image if it exists
      if (existingBook.coverImage) {
        const oldImagePath = path.join(process.cwd(), existingBook.coverImage);
        await deleteImage(oldImagePath);
      }
    }

    // Update the book record in the database
    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE method to delete a book
export async function DELETE(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop();

  if (!id || Array.isArray(id)) {
    return NextResponse.json({ error: 'Invalid book ID' }, { status: 400 });
  }

  try {
    const existingBook = await prisma.book.findUnique({
      where: { id: Number(id) },
    });

    if (!existingBook) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    await prisma.book.delete({
      where: { id: Number(id) },
    });

    if (existingBook.coverImage) {
      const oldImagePath = path.join(
        process.cwd(),
        '/public',
        existingBook.coverImage
      );
      console.log('Attempting to delete image at:', oldImagePath); // Add logging
      await deleteImage(oldImagePath);
    }

    return NextResponse.json(
      { message: 'Book deleted successfully' },
      { status: 204 }
    );
  } catch (error) {
    console.error(error);
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
