'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooksData } from '@/redux/reducers/bookSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { cn } from '@/lib/utils';
import { Icon } from '@iconify/react';

interface SearchBooksProps {
  userId: string | undefined;
  className?: React.ReactNode;
  limit: number;
}
const SearchBooks: React.FC<SearchBooksProps> = ({
  userId,
  className,
  limit,
  ...props
}) => {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.books);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setPage(1);
  };

  useEffect(() => {
    const validUserId = userId || '';
    if ((validUserId && query.length >= 3) || query === '') {
      dispatch(fetchBooksData({ page, query, userId: validUserId, limit }));
    }
  }, [query, page, userId, dispatch]);

  return (
    <div className="relative my-auto w-40 md:w-60">
      <Icon
        icon="ic:round-search"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        width={20}
      />
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder="Search by title "
        className={cn(
          'bg-gray-100 dark:bg-gray-900 border p-2 pl-9 rounded-xl focus:outline-0 w-full focus:border-green-500',
          className
        )}
      />
    </div>
  );
};

export default SearchBooks;
