'use client';
import SearchBooks from '@/components/common/DebounceSearch';
import { Button } from '@/components/ui/button';
import CustomPagination from '@/components/ui/customPagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { categories, languages, status_options } from '@/lib/data';
import { fetchBooksData, setFilters } from '@/store/reducers/bookSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Book, BookStatus } from '@prisma/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type Props = {};

const CatalogContainer = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { catalog, loading, error, pagination } = useSelector(
    (state: RootState) => state.books
  );
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { filters } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    if (userId) {
      dispatch(
        fetchBooksData({
          page: pagination.currentPage,
          userId,
          filters: {
            status: filters.status,
            language: filters.language,
          },
        })
      );
    }
  }, [dispatch, filters, userId, pagination.currentPage]);

  const filteredBooks = catalog.filter((book: any) => {
    if (filters.category.length === 0) return true; // No category filter applied
    const bookCategories = book.category
      ?.split(',')
      .map((c: any) => c.trim().toLowerCase());
    return filters.category.some((selected: any) =>
      bookCategories?.includes(selected.toLowerCase())
    );
  });

  return (
    <main>
      <div className="">
        <div className="md:flex-1 flex-col gap-3 md:justify-between">
          <SearchBooks userId={userId} className="w-80 mb-10" />
          <div className="flex gap-8">
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
          </div>
        </div>
        <Tabs
          value={filters.status || 'none'}
          onValueChange={(status) =>
            dispatch(setFilters({ status: status === 'none' ? '' : status }))
          }
        >
          <TabsList className="flex w-full overflow-x-auto">
            {status_options.map(({ label, value }) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={filters.status || 'none'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-16">
              {filteredBooks.map((book: any) => (
                <div
                  key={book.id}
                  className="border p-2 bg-gradient-to-tr from-zinc-50 to-stone-50 from-80% to-100% dark:from-gray-800 dark:to-slate-800 dark:border-0 dark:shadow-md shadow-sm rounded-2xl overflow-hidden"
                >
                  <div className="flex gap-5">
                    <div className="relative md:min-w-40">
                      <Image
                        src={book.coverImage || '/default-image.jpg'}
                        alt={book.title}
                        width={200}
                        height={200}
                        className="w-40 h-60 bg-cover mb-2 rounded-xl"
                        placeholder="blur"
                        blurDataURL="/default-image.jpg"
                        loading="lazy"
                      />
                      <Dialog>
                        <DialogTrigger className="flex bg-white/10 border-white/20 backdrop-blur-sm border-1 overflow-hidden p-1 absolute rounded-xl bottom-0.5 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 font-semibold">
                          show detail
                        </DialogTrigger>
                        <DialogContent className="w-full ">
                          <DialogHeader>
                            <DialogTitle>Book Details</DialogTitle>
                            <div className="flex gap-10">
                              <Image
                                src={book.coverImage || '/default-image.jpg'}
                                alt={book.title}
                                width={200}
                                height={200}
                                className="w-40 h-60 bg-cover mb-2 rounded-xl"
                                placeholder="blur"
                                blurDataURL="/default-image.jpg"
                                loading="lazy"
                              />
                              <div className="md:max-w-full max-w-md">
                                <p className="flex gap-2 text-md font-bold">
                                  <span>Title: </span>
                                  <span>{book.title}</span>
                                </p>
                                <p className="flex gap-2 text-md font-bold">
                                  <span>Author: </span>
                                  <span>{book.author}</span>
                                </p>
                                <p className="flex gap-2 text-md font-bold">
                                  <span>ISBN: </span>
                                  <span>{book.isbn}</span>
                                </p>
                                <p className="flex gap-2 text-md font-bold">
                                  <span>Publisher: </span>
                                  <span>{book.publisher}</span>
                                </p>
                                <p className="flex gap-2 text-md font-bold">
                                  <span>Publication Place: </span>
                                  <span>{book.publication_place}</span>
                                </p>
                                <p className="flex gap-2 text-md font-bold">
                                  <span>Categories: </span>
                                  <span>{book.category}</span>
                                </p>
                                <p className="flex gap-2 text-md font-bold">
                                  <span>Language: </span>
                                  <span>{book.language}</span>
                                </p>
                                <p className="flex gap-2 text-md font-bold">
                                  <span>Pages: </span>
                                  <span>{book.pages}</span>
                                </p>
                                <p className="flex gap-2 text-md font-bold">
                                  <span>Status: </span>
                                  <span>{book.status}</span>
                                </p>
                              </div>
                            </div>
                            <DialogDescription>
                              {book.description}
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="max-w-[10em] md:max-w-xl px-4  ">
                      <div>
                        <p className="flex-justify-center overflow-hidden rounded-full bg-blue-500/30 text-blue-500 p-1 px-2 shadow-md">
                          {book.category}
                        </p>
                      </div>
                      <div className="mt-3">
                        <h2 className="text-md font-bold">{book.title}</h2>
                        <p className="text-gray-500">by {book.author}</p>
                        <p className="text-sm text-gray-700">
                          {book.description?.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <CustomPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
      </div>
    </main>
  );
};

export default CatalogContainer;
