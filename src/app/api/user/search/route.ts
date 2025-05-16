import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing  userId' },
      { status: 400 }
    );
  }

  try {
    // Step 1: Get all users that match the query (except self)
    const matchedUsers = await prisma.user.findMany({
      where: {
        id: { not: userId },
        username: { contains: query, mode: 'insensitive' },
      },
      select: {
        id: true,
        username: true,
        email: true,
        photo_url: true,
      },
    });

    // Step 2: Get all related friendships
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    });

    // Step 3: Annotate each user
    const annotated = matchedUsers.map((user) => {
      const friendship = friendships.find(
        (f) =>
          (f.senderId === userId && f.receiverId === user.id) ||
          (f.receiverId === userId && f.senderId === user.id)
      );

      const isFriend = friendship?.status === 'accepted';
      const isRequested =
        friendship?.status === 'pending' && friendship?.senderId === userId;

      return {
        ...user,
        isFriend,
        isRequested,
      };
    });

    // Step 4: Sort by friends first
    const sorted = annotated.sort((a, b) => {
      if (a.isFriend && !b.isFriend) return -1;
      if (!a.isFriend && b.isFriend) return 1;
      return 0;
    });

    return NextResponse.json(sorted);
  } catch (error) {
    console.error('[USER_SEARCH_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
