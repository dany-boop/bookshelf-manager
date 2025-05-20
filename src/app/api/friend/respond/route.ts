import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { requestId, action } = body;

  if (!requestId || !['accepted', 'rejected'].includes(action)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    const existingRequest = await prisma.friendship.findUnique({
      where: { id: requestId },
    });

    if (!existingRequest || existingRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Friend request not found or already handled' },
        { status: 400 }
      );
    }

    if (action === 'rejected') {
      // Optional: Delete rejected requests instead of updating
      await prisma.friendship.delete({
        where: { id: requestId },
      });

      return NextResponse.json({
        message: 'Friend request rejected and deleted',
      });
    }

    // Accept request → update the status to 'accepted'
    const updated = await prisma.friendship.update({
      where: { id: requestId },
      data: { status: 'accepted' },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            photo_url: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            photo_url: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Friend request accepted',
      newFriend: {
        id: updated.sender.id,
        username: updated.sender.username,
        photo_url: updated.sender.photo_url,
      },
    });
  } catch (err) {
    console.error('[FRIEND_REQUEST_UPDATE_ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to update friend request' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing or invalid userId' },
      { status: 400 }
    );
  }

  try {
    const pendingRequests = await prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: 'pending',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            photo_url: true,
          },
        },
      },
    });

    return NextResponse.json(pendingRequests);
  } catch (err) {
    console.error('[FRIEND_REQUEST_FETCH_ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to fetch friend requests' },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json({ methods: ['GET', 'POST'] });
}
