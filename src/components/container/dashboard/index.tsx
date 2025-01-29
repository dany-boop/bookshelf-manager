'use client';
import AddBookForm from '@/components/common/Form/AddForm';
import BooksTable from '@/components/common/Table';
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

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const openForm = (book?: Book | null | undefined) => {
    setSelectedBook(book || null); // Pass the selected book to the form
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <main>
      <div className="my-8">
        <div className="grid grid-cols-3 gap-5">
          <div className="p-5 flex-col bg-zinc-50 shadow-md rounded-lg border">
            <h1 className="font-bold">Total Books</h1>
            <p className="mt-3">{totalBooks}</p>
          </div>
          <div className="p-5 flex-col bg-zinc-50 shadow-md rounded-lg border">
            <h1 className="font-bold">Finished Reading</h1>
            <p className="mt-3">{finishedBooks}</p>
          </div>
          <div className="p-5 flex-col bg-zinc-50 shadow-md rounded-lg border">
            <h1 className="font-bold">On Going</h1>
            <p className="mt-3">{readBooks}</p>
          </div>
        </div>
      </div>
      <div>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        <button
          onClick={() => openForm()} // Open the form for adding a new book
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Add New Book
        </button>

        <div className="">
          <BooksTable books={catalog} openForm={openForm} loading={loading} />
          <div>
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Next
            </button>
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
    </main>
  );
};

export default DashboardContainer;
