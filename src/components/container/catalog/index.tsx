'use client';
import SearchBooks from '@/components/common/DebounceSearch';
import CustomPagination from '@/components/ui/customPagination';
import {
  MultiSelectCombobox,
  SingleSelectCombobox,
} from '@/components/ui/MultiSelect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { categories, languages } from '@/lib/data';
import { fetchBooksData, setFilters } from '@/store/reducers/bookSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Book, BookStatus } from '@prisma/client';
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
  const { filters } = useSelector((state: RootState) => state.books);

  // useEffect(() => {
  //   if (userId) {
  //     dispatch(fetchBooksData({ page: pagination.currentPage, userId })); // Fetch books with pagination
  //   }
  // }, [dispatch, pagination.currentPage, userId]);

  useEffect(() => {
    if (userId) {
      dispatch(
        fetchBooksData({
          page: pagination.currentPage,
          userId,
          filters: {
            // category: filters.category,
            status: filters.status,
            language: filters.language,
          },
        })
      );
    }
  }, [dispatch, filters, userId, pagination.currentPage]);

  const filteredBooks = catalog.filter((book) => {
    if (filters.category.length === 0) return true; // No category filter applied
    const bookCategories = book.category
      ?.split(',')
      .map((c) => c.trim().toLowerCase());
    return filters.category.some((selected) =>
      bookCategories?.includes(selected.toLowerCase())
    );
  });

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
        <div className="">
          <SearchBooks userId={userId} className="w-80 mb-10" />
          <div className="">
            <MultiSelectCombobox
              options={categories}
              value={filters.category}
              onChange={(selected) =>
                dispatch(setFilters({ category: selected }))
              }
              placeholder="Select Categories"
            />

            <SingleSelectCombobox
              options={languages}
              value={filters.language}
              onChange={(selected) => {
                dispatch(setFilters({ language: selected }));
              }}
              placeholder="Select a Language"
            />

            <Select
              value={filters.status || 'none'}
              onValueChange={(status) =>
                dispatch(
                  setFilters({ status: status === 'none' ? '' : status })
                )
              }
            >
              <SelectTrigger className="w-40">
                {filters.status ? filters.status : 'Select Status'}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {Object.values(BookStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
          {filteredBooks.map((book: any) => (
            <div
              key={book.id}
              className="border bg-gradient-to-tr from-zinc-50 to-stone-50  dark:from-zinc-800 dark:to-stone-800 dark:border-0 dark:shadow-md shadow-sm rounded-lg overflow-hidden "
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
