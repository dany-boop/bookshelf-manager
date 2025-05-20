import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId)
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  try {
    const pendingRequests = await prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: 'pending',
      },
      include: {
        sender: {
          select: { id: true, username: true, photo_url: true },
        },
      },
    });

    // res.status(200).json(pendingRequests);
    return NextResponse.json(pendingRequests, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch friends Request' },
      { status: 500 }
    );
  }
}
