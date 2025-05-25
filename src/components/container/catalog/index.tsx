'use client';
import SearchBooks from '@/components/common/debounce-search';
import CustomPagination from '@/components/ui/customPagination';
import {
  MultiSelectCombobox,
  SingleSelectCombobox,
} from '@/components/ui/MultiSelect';
import { AnimatePresence, motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { languages, status_options } from '@/lib/data';
import {
  fetchBooksData,
  setFilters,
  setSortBy,
} from '@/redux/reducers/bookSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import BookCard from '@/components/common/book-card';
import SkeletonLoader from '@/components/common/skeleton/card-skeleton';
import {
  fetchCategories,
  selectCategories,
} from '@/redux/reducers/categorySlice';
import { Icon } from '@iconify/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { bookVariant, filterVariants } from '@/components/ui/animate-variants';

const CatalogContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { catalog, loading, error, pagination } = useSelector(
    (state: RootState) => state.books
  );
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const categories =
    (useSelector(selectCategories) as { name: string }[]) ?? [];
  const [filter, setFilter] = useState(false);
  const { filters, sortBy } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    dispatch(fetchCategories());
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

  const sortedBooks = [...filteredBooks].sort((a: any, b: any) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'progress') {
      return (b.currentPage || 0) - (a.currentPage || 0);
    }
    return 0;
  });

  const FilterButton = () => (
    <button
      className="items-center flex py-2 px-4 border rounded-xl gap-2"
      onClick={() => setFilter((prev) => !prev)}
    >
      <Icon icon="solar:filter-bold-duotone" />
      <span>Filters</span>
    </button>
  );

  const SortDropdown = () => (
    <Popover>
      <PopoverTrigger asChild>
        <button className="items-center flex py-2 px-4 border rounded-xl gap-2">
          <Icon icon="mynaui:filter-solid" />
          <span>Sort</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-40 bg-zinc-50/50 dark:bg-zinc-800/40 backdrop-filter backdrop-blur-sm">
        <div className="flex flex-col gap-2">
          <button
            className="text-left hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1 rounded"
            onClick={() => dispatch(setSortBy('title'))}
          >
            By Title
          </button>
          <button
            className="text-left hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1 rounded"
            onClick={() => dispatch(setSortBy('progress'))}
          >
            By Progress
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <main>
      <Tabs
        value={filters.status || 'none'}
        onValueChange={(status) =>
          dispatch(setFilters({ status: status === 'none' ? '' : status }))
        }
        className="mb-5"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full">
          <div className="flex  items-center gap-3 w-full md:w-auto">
            <SearchBooks
              userId={userId}
              className="flex-1 min-w-[150px] sm:min-w-[200px] sm:w-60"
              limit={pagination.limit}
            />

            <div className="flex gap-3 md:hidden">
              <FilterButton />
              <SortDropdown />
            </div>
          </div>

          <div className="w-full md:flex-1 md:justify-center md:flex">
            <TabsList className="flex w-full md:w-fit  justify-center ">
              {status_options.map(({ label, value }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="dark:data-[state=active]:bg-slate-800 hover:scale-110 data-[state=active]:bg-stone-50 data-[state=active]:border dark:border-none rounded-xl px-5 py-3"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <FilterButton />
            <SortDropdown />
          </div>
        </div>

        <AnimatePresence>
          {filter && (
            <motion.div
              className="flex flex-col md:flex-row gap-4 md:gap-8 my-3 md:my-8 justify-evenly"
              variants={filterVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <MultiSelectCombobox
                options={
                  Array.isArray(categories) ? categories.map((c) => c.name) : []
                }
                value={filters.category}
                onChange={(selected) =>
                  dispatch(setFilters({ category: selected }))
                }
                placeholder="Select Categories"
              />
              <SingleSelectCombobox
                options={languages}
                value={filters.language}
                onChange={(selected) =>
                  dispatch(setFilters({ language: selected }))
                }
                placeholder="Select a Language"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <TabsContent value={filters.status || 'none'}>
          {loading ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-16"
              variants={bookVariant}
              initial="hidden"
              animate="show"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLoader key={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1  md:grid-cols-2 gap-16 mt-10"
              variants={bookVariant}
              initial="hidden"
              animate="show"
            >
              {sortedBooks.length > 0 ? (
                <BookCard filteredBook={sortedBooks} />
              ) : (
                <div className="w-full flex justify-center font-semibold text-2xl col-span-2 my-52">
                  <p>You don't have any book</p>
                </div>
              )}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      <div className="my-10">
        <CustomPagination
          limit={pagination.limit}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      </div>
    </main>
  );
};

export default CatalogContainer;
