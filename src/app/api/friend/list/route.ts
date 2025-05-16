// import { PrismaClient } from '@prisma/client';
// import { NextRequest, NextResponse } from 'next/server';

// const prisma = new PrismaClient();

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const query = searchParams.get('query') || '';
//   const userId = searchParams.get('userId');

//   if (!userId) {
//     return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
//   }

//   try {
//     // Get all friendships for the user (for both cases)
//     const friendships = await prisma.friendship.findMany({
//       where: {
//         OR: [{ senderId: userId }, { receiverId: userId }],
//       },
//     });

//     // Case 1: No search query - return just friends list
//     if (!query) {
//       const acceptedFriendships = friendships.filter(
//         (f) => f.status === 'accepted'
//       );

//       const friendIds = acceptedFriendships.map((f) =>
//         f.senderId === userId ? f.receiverId : f.senderId
//       );

//       const friends = await prisma.user.findMany({
//         where: {
//           id: { in: friendIds },
//         },
//         select: {
//           id: true,
//           username: true,
//           email: true,
//           photo_url: true,
//         },
//       });

//       // Add friend status (all will be true in this case)
//       const annotatedFriends = friends.map((friend) => ({
//         ...friend,
//         isFriend: true,
//         isRequested: false,
//       }));

//       return NextResponse.json(annotatedFriends);
//     }

//     // Case 2: Search query exists - return matching users with friend status
//     const matchedUsers = await prisma.user.findMany({
//       where: {
//         id: { not: userId },
//         username: { contains: query, mode: 'insensitive' },
//       },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         photo_url: true,
//       },
//     });

//     // Annotate each user with friendship status
//     const annotated = matchedUsers.map((user) => {
//       const friendship = friendships.find(
//         (f) =>
//           (f.senderId === userId && f.receiverId === user.id) ||
//           (f.receiverId === userId && f.senderId === user.id)
//       );

//       const isFriend = friendship?.status === 'accepted';
//       const isRequested =
//         friendship?.status === 'pending' && friendship?.senderId === userId;

//       return {
//         ...user,
//         isFriend,
//         isRequested,
//       };
//     });

//     // Sort by friends first, then by username
//     const sorted = annotated.sort((a, b) => {
//       if (a.isFriend && !b.isFriend) return -1;
//       if (!a.isFriend && b.isFriend) return 1;
//       return a.username.localeCompare(b.username);
//     });

//     return NextResponse.json(sorted);
//   } catch (error) {
//     console.error('[FRIENDS_API_ERROR]', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }


import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const friends = await prisma.friendship.findMany({
      where: {
        status: 'accepted',
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, username: true, photo_url: true } },
        receiver: { select: { id: true, username: true, photo_url: true } },
      },
    });

    const friendList = friends.map((f) =>
      f.senderId === userId ? f.receiver : f.sender
    );

    return NextResponse.json(friendList, { status: 200 });
  } catch (err) {
    console.error('[FRIEND_LIST_ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to fetch friends' },
      { status: 500 }
    );
  }
}
