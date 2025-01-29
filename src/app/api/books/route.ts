import { NextRequest, NextResponse } from 'next/server';
import { BookStatus, PrismaClient } from '@prisma/client';
import path from 'path';
import { writeFile } from 'fs/promises';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const title = searchParams.get('title');
  const language = searchParams.get('language');
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'User  ID is required' },
      { status: 400 }
    );
  }

  const where: any = { userId };
  if (category) where.category = { contains: category, mode: 'insensitive' };
  if (status) where.status = status;
  if (title) where.title = { contains: title, mode: 'insensitive' };
  if (language) where.language = { contains: language, mode: 'insensitive' };

  try {
    const books = await prisma.book.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { title: 'desc' },
    });

    const totalBooks = await prisma.book.count({ where });
    const finishedBooks = await prisma.book.count({
      where: { status: 'FINISHED' },
    });
    const readBooks = await prisma.book.count({
      where: { status: 'READING' },
    });

    return NextResponse.json({
      books,
      totalBooks,
      readBooks,
      finishedBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}
// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);

//   const page = parseInt(searchParams.get('page') || '1', 10);
//   const limit = parseInt(searchParams.get('limit') || '10', 10);
//   const category = searchParams.get('category');
//   const status = searchParams.get('status');
//   const title = searchParams.get('title');
//   const language = searchParams.get('language');

//   const where: any = {};
//   if (category) where.category = { contains: category, mode: 'insensitive' };
//   if (status) where.status = status;
//   if (title) where.title = { contains: title, mode: 'insensitive' };
//   if (language) where.language = { contains: language, mode: 'insensitive' };

//   try {
//     const books = await prisma.book.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       orderBy: { createdAt: 'desc' },
//     });

//     const totalBooks = await prisma.book.count({ where });
//     const finishedBooks = await prisma.book.count({
//       where: { status: 'FINISHED' },
//     });
//     const reading = await prisma.book.count({
//       where: { status: 'READING' },
//     });

//     return NextResponse.json({
//       books,
//       totalBooks,
//       reading,
//       finishedBooks,
//       totalPages: Math.ceil(totalBooks / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: 'Failed to fetch books' },
//       { status: 500 }
//     );
//   }
// }

async function saveImage(file: File): Promise<string> {
  const extension = path.extname(file.name);
  const fileName = `${nanoid()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  // Ensure directory exists
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/${fileName}`; // Return public path for the image
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract fields from formData
    const userId = formData.get('userId')?.toString();
    const title = formData.get('title')?.toString();
    const category = formData.get('category')?.toString();
    const description = formData.get('description')?.toString();
    const author = formData.get('author')?.toString();
    const pages = parseInt(formData.get('pages')?.toString() || '0', 10);
    const language = formData.get('language')?.toString();
    const status = formData.get('status') as BookStatus;
    const coverImageFile = formData.get('coverImage') as File | null;

    // Input validation
    if (!title || !author || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    if (!userId && !coverImageFile) {
      return NextResponse.json(
        { error: 'Missing user and image fields' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user id fields' },
        { status: 400 }
      );
    }
    if (!coverImageFile) {
      return NextResponse.json(
        { error: 'Missing coverImage fields' },
        { status: 400 }
      );
    }

    // Save image file and get public URL
    const coverImage = await saveImage(coverImageFile);

    // Create the book record in the database
    const newBook = await prisma.book.create({
      data: {
        userId,
        title,
        category,
        description,
        author,
        pages,
        language,
        status, // Ensure enum compliance
        coverImage,
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json({ methods: ['GET', 'POST'] });
}
