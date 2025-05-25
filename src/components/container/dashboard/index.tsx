'use client';
import AddBookForm from '@/components/common/forms/add-form';
import BooksTable from '@/components/common/table';
import CustomPagination from '@/components/ui/customPagination';
import { fetchBooksData } from '@/redux/reducers/bookSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Book } from '@prisma/client';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/ui/stat-card';

type Props = {};

const DashboardContainer: FC = (props: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { readBooks, totalBooks, finishedBooks, catalog, loading, pagination } =
    useSelector((state: RootState) => state.books);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const refetchBooks = () => {
    if (userId) {
      dispatch(
        fetchBooksData({
          page: pagination.currentPage,
          limit: pagination.limit,
          userId,
        })
      );
    }
  };

  useEffect(() => {
    refetchBooks();
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
          <StatCard
            title="Total Books"
            value={totalBooks}
            imageSrc="/assets/books-open-assets-3.webp"
            animateBackground
          />
          <StatCard
            title="Finished Reading"
            value={finishedBooks}
            imageSrc="/assets/books-open-assets-2.webp"
            imageClassName="w-36 h-auto"
            animateBackground
          />
          <StatCard
            title="On Going"
            value={readBooks}
            imageSrc="/assets/books-open-assets-4.webp"
            animateBackground
          />
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
              <AddBookForm
                book={selectedBook}
                onClose={closeForm}
                onSuccess={() => {
                  closeForm();
                  refetchBooks();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.main>
  );
};

export default DashboardContainer;
