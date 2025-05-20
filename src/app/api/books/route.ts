import { NextRequest, NextResponse } from 'next/server';
import { BookStatus, PrismaClient } from '@prisma/client';
import path from 'path';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

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
  const categories = searchParams.get('categories');
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

  if (categories) {
    where.categories = {
      some: {
        name: {
          in: categories.split(',').map((name) => name.trim()),
        },
      },
    };
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
      include: {
        progress: {
          select: { currentPage: true, userId: true, notes: true },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalBooks = await prisma.book.count({ where });
    const finishedBooks = await prisma.book.count({
      where: { status: 'finished', userId },
    });
    const readBooks = await prisma.book.count({
      where: { status: 'reading', userId },
    });

    const booksWithProgress = books.map((book) => {
      const totalPages = book.pages ?? 0; // Default to 0 if null
      const currentPage = book.progress?.currentPage ?? 0; // Default to 0 if null
      const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

      return {
        ...book,
        readingProgress: Math.min(progress, 100),
        categories: book.categories || [],
      };
    });

    return NextResponse.json({
      books: booksWithProgress ?? [],
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
async function saveImage(file: File): Promise<string | null> {
  const isSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL; // Check if Supabase is configured

  if (isSupabase) {
    // Upload to Supabase Storage
    return uploadToSupabase(file);
  } else {
    // Save locally in public/uploads for SQLite
    return saveLocally(file);
  }
}

async function uploadToSupabase(file: File): Promise<string | null> {
  try {
    if (!file.name) {
      console.error('Error: File does not have a name.');
      return null;
    }

    const fileExt = path.extname(file.name);
    const fileName = `${nanoid()}${fileExt}`;
    const filePath = `book/${fileName}`;

    const imageBuffer = Buffer.from(await file.arrayBuffer());
    // Optimize if > 1MB
    let optimizedBuffer = imageBuffer;
    if (file.size > ONE_MB) {
      optimizedBuffer = await sharp(imageBuffer)
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    const { error } = await supabase.storage
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

async function saveLocally(file: File): Promise<string | null> {
  try {
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
      await sharp(imageBuffer).toFile(filePath);
    }

    return `/uploads/${fileName}`;
  } catch (err) {
    console.error('Local file save failed:', err);
    return null;
  }
}

// post method
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();

    // Extract fields from formData
    const userId = formData.get('userId')?.toString();
    const title = formData.get('title')?.toString();
    const categoryNames =
      formData.get('categories')?.toString().split(',') || [];
    const isbn = formData.get('isbn')?.toString();
    const publisher = formData.get('publisher')?.toString();
    const publication_place = formData.get('publication_place')?.toString();
    const description = formData.get('description')?.toString();
    const author = formData.get('author')?.toString();
    const pages = parseInt(formData.get('pages')?.toString() || '0', 10);
    const language = formData.get('language')?.toString();
    const currentPage = parseInt(
      formData.get('currentPage')?.toString() || '0',
      10
    );
    const status = formData.get('status') as BookStatus;
    const coverImageFile = formData.get('coverImage') as File | null;

    // Input validation
    if (!title || !author || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user id fields' },
        { status: 400 }
      );
    }

    const missingFields = [];
    if (!userId) missingFields.push('userId');
    if (!title) missingFields.push('title');
    if (!author) missingFields.push('author');
    if (!status) missingFields.push('status');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Handle image processing
    let coverImageUrl: string | null = null;
    if (coverImageFile) {
      coverImageUrl = await saveImage(coverImageFile);
      if (!coverImageUrl) {
        return NextResponse.json(
          { error: 'Image upload failed' },
          { status: 500 }
        );
      }
    }

    // Process categories - trim whitespace and filter empty strings
    const processedCategories = categoryNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    // Create the book record in the database
    try {
      const newBook = await prisma.book.create({
        data: {
          userId,
          title,
          description,
          author,
          pages,
          language,
          isbn,
          publisher,
          publication_place,
          status,
          coverImage: coverImageUrl,
          categories: {
            connect: processedCategories.map((name) => ({ name })),
          },

          progress: {
            create: {
              userId,
              currentPage,
            },
          },
        },
        include: {
          progress: true,
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const progressPercentage = pages > 0 ? (currentPage / pages) * 100 : 0;

      return NextResponse.json(
        {
          ...newBook,
          readingProgress: Math.min(Number(progressPercentage.toFixed(2)), 100),
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database insertion failed:', dbError);
      return NextResponse.json(
        { error: 'Database error: Unable to create book' },
        { status: 500 }
      );
    }

    // return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json({ methods: ['GET', 'POST'] });
}
