'use client';
import BookCard from '@/components/common/book-card';
import OptimizedImage from '@/components/common/image-loading';
import SkeletonLoader from '@/components/common/skeleton/card-skeleton';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { fetchBooksData, resetBooksData } from '@/redux/reducers/bookSlice';
import { fetchUser } from '@/redux/reducers/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Book } from '@prisma/client';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type ExtendedBook = Book & {
  progress?: {
    currentPage: number;
  };
  categories?: { id: string; name: string }[];
  readingProgress?: number;
};

const ContainerFriendPage = () => {
  const params = useParams();
  const friendId = params?.id as string;
  const dispatch = useDispatch<AppDispatch>();

  const { catalog, loading } = useSelector((state: RootState) => state.books);
  const { username, photo_url } = useSelector((state: RootState) => state.user);

  console.log(friendId);
  useEffect(() => {
    if (friendId) {
      dispatch(resetBooksData());
      dispatch(
        fetchBooksData({
          page: 1,
          limit: 5,
          userId: friendId,
        })
      );
      dispatch(fetchUser(friendId));
    }
  }, [dispatch, friendId]);

  const extendedCatalog: ExtendedBook[] = catalog.map((book) => {
    return {
      ...book,
    };
  });

  const currentlyReading = extendedCatalog.find(
    (book) => book.status === 'reading'
  );

  const progressCatalog = extendedCatalog
    .filter((book) => (book.readingProgress ?? 0) >= 40)
    .slice(0, 4);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Friend's Profile</h2>

      <div className="relative  shadow-md pb-14 rounded-xl overflow-hidden ">
        <div className=" w-full bg-cover h-64 shadow-inner overflow-hidden">
          <OptimizedImage
            src="/assets/login-background.jpg"
            alt="username page background"
            fill
            quality={100}
            loading="lazy"
            className="object-cover object-center"
          />
        </div>

        <div className="absolute flex top-48 left-10">
          <Avatar className=" h-28 w-28 shadow-md ">
            <AvatarImage src={photo_url} alt="User Picture" />
          </Avatar>
          <h1 className="text-2xl font-bold my-auto ms-5 text-white  ">
            {username}
          </h1>
          <p></p>
        </div>
      </div>

      <section className="mb-6">
        <h3 className="text-lg font-medium my-5">Currently Reading</h3>
        {loading ? (
          <SkeletonLoader />
        ) : currentlyReading ? (
          <motion.div
            className="grid grid-cols-1  md:grid-cols-2 gap-16"
            // variants={bookItemVariants}
            initial="hidden"
            animate="show"
          >
            <BookCard filteredBook={[currentlyReading]} />
          </motion.div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No book currently being read.
          </p>
        )}
      </section>

      <section>
        <h3 className="text-lg font-medium mb-2">Deep into it </h3>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        ) : progressCatalog.length > 0 ? (
          <motion.div
            className="grid grid-cols-1  md:grid-cols-2 gap-16"
            // variants={bookItemVariants}
            initial="hidden"
            animate="show"
          >
            <BookCard filteredBook={progressCatalog} />
          </motion.div>
        ) : (
          <p className="text-sm text-muted-foreground">No books.</p>
        )}
      </section>
    </div>
  );
};

export default ContainerFriendPage;
