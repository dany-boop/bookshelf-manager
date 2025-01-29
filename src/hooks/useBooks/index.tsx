import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooksData, setCurrentPage } from '@/store/reducers/bookSlice';
import { AppDispatch, RootState } from '@/store/store';

interface FetchBooksParams {
  userId?: string;
  query?: string;
  page?: number;
  category?: string;
  status?: string;
  language?: string;
}

const useSearchBooks = ({ userId, query = '', page = 1 }: FetchBooksParams) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    readBooks,
    totalBooks,
    finishedBooks,
    catalog,
    loading,
    error,
    pagination = { currentPage: 1, totalPages: 1 },
  } = useSelector((state: RootState) => state.books);

  const fetchBooks = useCallback(() => {
    if (userId) {
      dispatch(
        fetchBooksData({
          userId,
          query,
          page,
        })
      );
    }
  }, [dispatch, userId, query, page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    readBooks,
    totalBooks,
    finishedBooks,
    loading,
    error,
    catalog,
    pagination,
  };
};

export default useSearchBooks;
