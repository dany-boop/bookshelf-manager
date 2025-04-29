import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all friendships for a user
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const friendships = await prisma.friendship.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    });

    return NextResponse.json(friendships, { status: 200 });
  } catch (error) {
    console.error('Error fetching friendships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch friendships' },
      { status: 500 }
    );
  }
}

// POST: Create a new friendship (send a friend request)
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { error: 'Sender ID and Receiver ID are required' },
        { status: 400 }
      );
    }

    const friendship = await prisma.friendship.create({
      data: { senderId, receiverId, status: 'pending' },
    });

    return NextResponse.json(friendship, { status: 201 });
  } catch (error) {
    console.error('Error creating friendship:', error);
    return NextResponse.json(
      { error: 'Failed to create friendship' },
      { status: 500 }
    );
  }
}

// PUT: Update friendship status (accept/reject)
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Friendship ID and status are required' },
        { status: 400 }
      );
    }

    const updatedFriendship = await prisma.friendship.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedFriendship, { status: 200 });
  } catch (error) {
    console.error('Error updating friendship:', error);
    return NextResponse.json(
      { error: 'Failed to update friendship' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a friendship
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Friendship ID is required' },
        { status: 400 }
      );
    }

    await prisma.friendship.delete({ where: { id } });
    return NextResponse.json(
      { message: 'Friendship deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting friendship:', error);
    return NextResponse.json(
      { error: 'Failed to delete friendship' },
      { status: 500 }
    );
  }
}
