'use client';
import SearchBooks from '@/components/common/DebounceSearch';
import CustomPagination from '@/components/ui/customPagination';
import { fetchBooksData } from '@/store/reducers/bookSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Book } from '@prisma/client';
import Image from 'next/image';
import React, { Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type Props = {};

const CatalogContainer = (props: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [expandedBookId, setExpandedBookId] = useState<number | null>(null); // Track expanded book by ID
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
      dispatch(fetchBooksData({ page: pagination.currentPage, userId })); // Fetch books with pagination
    }
  }, [dispatch, pagination.currentPage, userId]);

  const toggleCardDetails = (bookId: number) => {
    setExpandedBookId((prevId) => (prevId === bookId ? null : bookId)); // Toggle book details
  };

  const openForm = (book?: Book | null | undefined) => {
    setSelectedBook(book || null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <main>
      <div className="">
        <SearchBooks userId={userId} className="w-80 mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
          {catalog.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md rounded-lg overflow-hidden border"
            >
              <div className="flex justify-center">
                <Image
                  src={book.coverImage || '/default-image.jpg'}
                  alt={book.title}
                  width={200} // Width for the default image size
                  height={200} // Height for the default image size
                  className="w-60 h-80 bg-cover mb-2 "
                  placeholder="blur"
                  blurDataURL="/default-image.jpg"
                  loading="lazy"
                />
              </div>

              {/* Show brief description and expand button */}
              <div className="px-4 py-10 ">
                <h2 className="text-xl font-bold">{book.title}</h2>
                <p className="text-gray-500">by {book.author}</p>
                <p className="text-sm text-gray-700">
                  {book.description?.substring(0, 100)}...
                </p>
                <button
                  onClick={() => toggleCardDetails(book.id)}
                  className="text-blue-500 mt-2 text-sm"
                >
                  {expandedBookId === book.id ? 'Show Less' : 'Show More'}
                </button>
              </div>

              {/* Show expanded details if the card is selected */}
              {expandedBookId === book.id && (
                <div className="bg-gray-100 p-4">
                  <h3 className="font-semibold text-lg">Details</h3>
                  <p>
                    <strong>Category:</strong> {book.category}
                  </p>
                  <p>
                    <strong>Language:</strong> {book.language}
                  </p>
                  <p>
                    <strong>Pages:</strong> {book.pages}
                  </p>
                  <p>
                    <strong>Status:</strong> {book.status}
                  </p>
                  <p>
                    <strong>Published At:</strong>{' '}
                    {new Date(book.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <CustomPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      </div>
    </main>
  );
};

export default CatalogContainer;
