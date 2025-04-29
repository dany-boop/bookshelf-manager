import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all recommendations for a user
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const recommendations = await prisma.recommendation.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    });

    return NextResponse.json(recommendations, { status: 200 });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    );
  }
}

// POST: Create a new recommendation
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { bookId, senderId, receiverId, message } = await req.json();

    if (!bookId || !senderId || !receiverId) {
      return NextResponse.json(
        { error: 'Book ID, Sender ID, and Receiver ID are required' },
        { status: 400 }
      );
    }

    const recommendation = await prisma.recommendation.create({
      data: { bookId, senderId, receiverId, message },
    });

    return NextResponse.json(recommendation, { status: 201 });
  } catch (error) {
    console.error('Error creating recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to create recommendation' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a recommendation
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Recommendation ID is required' },
        { status: 400 }
      );
    }

    await prisma.recommendation.delete({ where: { id } });
    return NextResponse.json(
      { message: 'Recommendation deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to delete recommendation' },
      { status: 500 }
    );
  }
}
