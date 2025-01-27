'use client';
import AddBookForm from '@/components/common/Form/AddForm';
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
  const { totalBooks, finishedBooks, catalog, loading, error, pagination } =
    useSelector((state: RootState) => state.books);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    if (userId) {
      dispatch(fetchBooksData({ page: pagination.currentPage, userId })); // Pass userId along with page
    }
  }, [dispatch, pagination.currentPage, userId]);

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const openForm = (book?: Book) => {
    setSelectedBook(book || null); // Pass the selected book to the form
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <main>
      <div>
        <h1>Book Dashboard</h1>
        <h2>Total Books: {totalBooks}</h2>
        <h2>Finished Reading: {finishedBooks}</h2>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        <ul>
          {catalog.map((book) => (
            <li key={book.id} className="flex justify-between items-center">
              <div>
                {book.title} by {book.author}
              </div>
              <button
                onClick={() => openForm(book)} // Open the form with the book to edit
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
            </li>
          ))}
        </ul>

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

        <button
          onClick={() => openForm()} // Open the form for adding a new book
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Add New Book
        </button>

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
