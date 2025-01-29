'use client';
import AddBookForm from '@/components/common/Form/AddForm';
import BooksTable from '@/components/common/Table';
import CustomPagination from '@/components/ui/customPagination';
import { fetchBooksData, setCurrentPage } from '@/store/reducers/bookSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Book } from '@prisma/client';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type Props = {};

const DashboardContainer: FC = (props: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const {
    readBooks,
    totalBooks,
    finishedBooks,
    catalog,
    loading,
    error,
    pagination,
  } = useSelector((state: RootState) => state.books);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (userId) {
      dispatch(fetchBooksData({ page: pagination.currentPage, userId })); // Pass userId along with page
    }
  }, [dispatch, pagination.currentPage, userId]);

  const openForm = (book?: Book | null | undefined) => {
    setSelectedBook(book || null); // Pass the selected book to the form
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <main>
      <div className="mb-10">
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 flex-col bg-zinc-100 dark:bg-stone-800 shadow-md rounded-lg border dark:border-0">
              <h1 className="font-bold">Total Books</h1>
              <p className="mt-3">{totalBooks}</p>
            </div>
            <div className="p-5 flex-col bg-zinc-100 dark:bg-stone-800 shadow-md rounded-lg border dark:border-0">
              <h1 className="font-bold">Finished Reading</h1>
              <p className="mt-3">{finishedBooks}</p>
            </div>
            <div className="p-5 flex-col bg-zinc-100 dark:bg-stone-800 shadow-md rounded-lg border dark:border-0">
              <h1 className="font-bold">On Going</h1>
              <p className="mt-3">{readBooks}</p>
            </div>
          </div>
        </div>
        <div>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}

          <div>
            <BooksTable
              books={catalog}
              openForm={openForm}
              loading={loading}
              userId={userId}
            />
            <div>
              <CustomPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
              />
            </div>
          </div>

          {isFormOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <AddBookForm book={selectedBook} onClose={closeForm} />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DashboardContainer;
