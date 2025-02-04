'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooksData } from '@/redux/reducers/bookSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { cn } from '@/lib/utils';

interface SearchBooksProps {
  userId: string | undefined;
  className?: React.ReactNode;
}
const SearchBooks: React.FC<SearchBooksProps> = ({
  userId,
  className,
  ...props
}) => {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch type here
  const { error } = useSelector((state: RootState) => state.books);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setPage(1);
  };

  useEffect(() => {
    const validUserId = userId || '';
    if ((validUserId && query.length >= 3) || query === '') {
      dispatch(fetchBooksData({ page, query, userId: validUserId }));
    }
  }, [query, page, userId, dispatch]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder="Search books..."
        className={cn(
          'bg-gray-100 dark:bg-gray-900 border p-2 rounded-xl focus:outline-0 w-40 md:w-60 focus:border-green-500',
          className
        )}
      />
    </div>
  );
};

export default SearchBooks;
