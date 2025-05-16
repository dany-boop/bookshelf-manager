'use client';
import SearchBooks from '@/components/common/debounce-search';
import CustomPagination from '@/components/ui/customPagination';
import {
  MultiSelectCombobox,
  SingleSelectCombobox,
} from '@/components/ui/MultiSelect';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { languages, status_options } from '@/lib/data';
import { fetchBooksData, setFilters } from '@/redux/reducers/bookSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import BookCard from '@/components/common/book-card';
import SkeletonLoader from '@/components/common/skeleton/card-skeleton';
import {
  fetchCategories,
  selectCategories,
} from '@/redux/reducers/categorySlice';

const CatalogContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { catalog, loading, error, pagination } = useSelector(
    (state: RootState) => state.books
  );
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const categories =
    (useSelector(selectCategories) as { name: string }[]) ?? [];

  const { filters } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    dispatch(fetchCategories() as any);
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(
        fetchBooksData({
          page: pagination.currentPage,
          limit: pagination.limit,
          userId,
          filters: {
            status: filters.status,
            language: filters.language,
          },
        })
      );
    }
  }, [dispatch, filters, userId, pagination.currentPage, pagination.limit]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);

  const filteredBooks = catalog.filter((book: any) => {
    if (filters.category.length === 0) return true;

    const bookCategoryNames = book.categories?.map((cat: any) =>
      cat.name.toLowerCase()
    );

    return filters.category.some((selected: any) =>
      bookCategoryNames?.includes(selected.toLowerCase())
    );
  });

  const bookItemVariants = {
    hidden: { opacity: 0, x: -100 }, // Start off-screen to the left
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <main>
      <div className="md:flex gap-3 md:justify-between">
        <SearchBooks
          userId={userId}
          className="w-80 mb-10"
          limit={pagination.limit}
        />
        <div className="flex gap-8 my-3 md:my-0">
          <MultiSelectCombobox
            options={categories?.map((c) => c.name) ?? []}
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
        </div>
      </div>
      <Tabs
        value={filters.status || 'none'}
        onValueChange={(status) =>
          dispatch(setFilters({ status: status === 'none' ? '' : status }))
        }
        className="mb-5"
      >
        <TabsList className="flex w-full overflow-x-auto">
          {status_options.map(({ label, value }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={filters.status || 'none'}>
          {loading ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-16"
              variants={bookItemVariants}
              initial="hidden"
              animate="show"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLoader key={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1  md:grid-cols-2 gap-16"
              variants={bookItemVariants}
              initial="hidden"
              animate="show"
            >
              {filteredBooks.length > 0 ? (
                <BookCard filteredBook={filteredBooks} />
              ) : (
                <div className="w-full flex justify-center font-semibold text-2xl col-span-2 my-52">
                  <p>You don't have any book</p>
                </div>
              )}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      <CustomPagination
        limit={pagination.limit}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
    </main>
  );
};

export default CatalogContainer;
