'use client';
import AddBookForm from '@/components/common/forms/add-form';
import BooksTable from '@/components/common/table';
import CustomPagination from '@/components/ui/customPagination';
import { fetchBooksData } from '@/redux/reducers/bookSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Book } from '@prisma/client';
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

type Props = {};

const DashboardContainer: FC = (props: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { readBooks, totalBooks, finishedBooks, catalog, loading, pagination } =
    useSelector((state: RootState) => state.books);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (userId) {
      dispatch(
        fetchBooksData({
          page: pagination.currentPage,
          limit: pagination.limit,
          userId,
        })
      ); // Pass userId along with page
    } else {
    }
  }, [dispatch, pagination.limit, pagination.currentPage, userId]);

  const openForm = (book?: Book | null | undefined) => {
    setSelectedBook(book || null); // Pass the selected book to the form
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <motion.div
            className="p-5 flex gap-5 bg-gradient-to-r from-green-500/40 via-stone-100 to-zinc-50 dark:from-green-500/40 dark:via-gray-800 dark:to-slate-800 shadow-sm dark:shadow-md rounded-lg border dark:border-0"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <Image
              src="/assets/books-open-assets-3.webp"
              alt="Background"
              width={1500}
              height={1500}
              quality={100}
              loading="lazy"
              className="w-28 h-auto"
            />
            <span>
              <h1 className="font-bold">Total Books</h1>
              <p className="mt-3 text-3xl font-bold">{totalBooks}</p>
            </span>
          </motion.div>
          <motion.div
            className="p-5 flex gap-2 bg-gradient-to-r from-green-500/40 via-stone-100 to-zinc-50 dark:from-green-500/40 dark:via-gray-800 dark:to-slate-800 shadow-sm dark:shadow-md rounded-lg border dark:border-0"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            {' '}
            <Image
              src="/assets/books-open-assets-2.webp"
              alt="Background"
              width={1500}
              height={1500}
              quality={100}
              loading="lazy"
              className="w-36 h-auto"
            />
            <span>
              <h1 className="font-bold">Finished Reading</h1>
              <p className="mt-3 text-3xl font-bold">{finishedBooks}</p>
            </span>
          </motion.div>
          <motion.div
            className="p-5 flex gap-5 bg-gradient-to-r from-green-500/40 via-stone-100 to-zinc-50 dark:from-green-500/40 dark:via-gray-800 dark:to-slate-800 shadow-sm dark:shadow-md rounded-lg border dark:border-0"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <Image
              src="/assets/books-open-assets-4.webp"
              alt="Background"
              width={1500}
              height={1500}
              quality={100}
              loading="lazy"
              className="w-28 h-auto"
            />
            <span>
              <h1 className="font-bold">On Going</h1>
              <p className="mt-3 text-3xl font-bold">{readBooks}</p>
            </span>
          </motion.div>
        </div>
        <div>
          <div>
            <BooksTable
              books={catalog}
              openForm={openForm}
              loading={loading}
              userId={userId}
              limit={pagination.limit}
            />
            <div>
              <CustomPagination
                limit={pagination.limit}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
              />
            </div>
          </div>

          {isFormOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <AddBookForm book={selectedBook} onClose={closeForm} />
            </div>
          )}
        </div>
      </div>
    </motion.main>
  );
};

export default DashboardContainer;
