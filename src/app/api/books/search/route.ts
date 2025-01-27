import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch book details' },
      { status: 500 }
    );
  }
}
