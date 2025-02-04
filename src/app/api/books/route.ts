import { NextRequest, NextResponse } from 'next/server';
import { BookStatus, PrismaClient } from '@prisma/client';
import path from 'path';
import { nanoid } from 'nanoid';
import sharp from 'sharp';

const prisma = new PrismaClient();

// Define the upload directory and the 1MB threshold in bytes.
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
const ONE_MB = 1024 * 1024;

// get method

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);

  // Parse pagination parameters using base 10.
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '15', 10);

  // Extract filtering parameters.
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const isbn = searchParams.get('isbn');
  const publication_place = searchParams.get('publication_place');
  const publisher = searchParams.get('publisher');
  const title = searchParams.get('title');
  const language = searchParams.get('language');
  const userId = searchParams.get('userId');
  const query = searchParams.get('query');

  // Validate required parameter.
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  // Build the Prisma "where" filter.
  const where: any = { userId };

  // if (category) {
  //   where.OR = category.split(',').map((cat) => ({
  //     category: { contains: cat.trim(), mode: 'insensitive' },
  //   }));
  // }
  if (category) {
    where.OR = category.split(',').map((cat) => ({
      category: { has: cat.trim() },
    }));
  }

  // Additional filters.
  if (isbn) where.isbn = { contains: isbn, mode: 'insensitive' };
  if (publisher) where.publisher = { contains: publisher, mode: 'insensitive' };
  if (publication_place) {
    where.publication_place = {
      contains: publication_place,
      mode: 'insensitive',
    };
  }
  if (status) where.status = status;
  if (title) where.title = { contains: title, mode: 'insensitive' };
  if (language) where.language = { contains: language, mode: 'insensitive' };
  if (query) {
    // Merge query-based filtering conditions.
    where.OR = [
      { title: { contains: query.toLowerCase() } },
      { author: { contains: query.toLowerCase() } },
      { isbn: { contains: query.toLowerCase() } },
    ];
  }

  try {
    const books = await prisma.book.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { title: 'desc' },
    });

    const totalBooks = await prisma.book.count({ where });
    const finishedBooks = await prisma.book.count({
      where: { status: 'finished', userId },
    });
    const readBooks = await prisma.book.count({
      where: { status: 'reading', userId },
    });

    return NextResponse.json({
      books: books ?? [],
      totalBooks,
      readBooks,
      finishedBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// saveImage
async function saveImage(file: File): Promise<string> {
  const extension = path.extname(file.name);
  const fileName = `${nanoid()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  // Convert the file into a Buffer.
  const imageBuffer = Buffer.from(await file.arrayBuffer());

  // Check the file size. Optimize only if > 1MB.
  if (file.size > ONE_MB) {
    await sharp(imageBuffer)
      .resize({ width: 800 }) // Resize width to 800px.
      .jpeg({ quality: 80 }) // Compress JPEG images at 80% quality.
      .toFile(filePath);
  } else {
    // For small files, write the buffer directly without optimization.
    await sharp(imageBuffer).toFile(filePath);
  }

  return `/uploads/${fileName}`;
}

// post method
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();

    // Extract fields from formData
    const userId = formData.get('userId')?.toString();
    const title = formData.get('title')?.toString();
    const category = formData.get('category')?.toString();
    const isbn = formData.get('isbn')?.toString();
    const publisher = formData.get('publisher')?.toString();
    const publication_place = formData.get('publication_place')?.toString();
    const description = formData.get('description')?.toString();
    const author = formData.get('author')?.toString();
    const pages = parseInt(formData.get('pages')?.toString() || '0', 15);
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
        isbn,
        publisher,
        publication_place,
        status, // Ensure enum compliance
        coverImage,
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/books
 *
 * Returns the allowed HTTP methods for this endpoint.
 *
 * @returns {NextResponse} The response containing allowed methods.
 */
export function OPTIONS() {
  return NextResponse.json({ methods: ['GET', 'POST'] });
}
