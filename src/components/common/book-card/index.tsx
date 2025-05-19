import React, { FC } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import OptimizedImage from '../image-loading';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  filteredBook?: any;
};

const BookCard: FC<Props> = ({ filteredBook }) => {
  const bookVariant = {
    hidden: { opacity: 0, x: -50 }, // Start each book off-screen to the left
    show: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 200, damping: 25 },
    },
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'finished':
        return 'bg-green-500/30 text-green-500';
      case 'unread':
        return 'bg-yellow-500/30 text-yellow-500';
      case 'reading':
        return 'bg-blue-500/30 text-blue-500';
      default:
        return 'bg-gray-500/30 text-yellow-500';
    }
  };

  return (
    <>
      {filteredBook.map((book: any) => (
        <motion.div
          key={book.id}
          variants={bookVariant}
          className="border p-2 bg-gradient-to-tr from-zinc-50 to-stone-50 from-80% to-100% dark:from-gray-800 dark:to-slate-800 dark:border-0 dark:shadow-md shadow-sm rounded-2xl overflow-y-auto md:overflow-hidden max-h-80 md:max-h-auto "
        >
          <div className="flex gap-5">
            <div className="relative md:min-w-40">
              <Image
                src={book.coverImage || '/assets/default-image.png'}
                alt={book.title}
                width={200}
                height={200}
                className="min-w-40 w-40 h-60 bg-cover mb-2 rounded-xl"
                loading="lazy"
              />
              <Dialog>
                <DialogTrigger className=" dark:bg-slate-800/50 stone-50/50 border-white/20 backdrop-blur-sm border-1  p-1 absolute text-white rounded-xl bottom-0.5 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 font-semibold ">
                  <span className="text-center">Show Detail</span>
                </DialogTrigger>
                <DialogContent className="w-full bg-stone-100/30 dark:bg-gray-800/30 backdrop-filter backdrop-blur-sm rounded-3xl overflow-y-auto overflow-x-hidden md:overflow-y-hidden max-h-80 md:max-h-fit">
                  <DialogHeader>
                    <DialogTitle className="text-lg md:text-2xl text-center">
                      {/* Book Details */}
                      {book.title}
                    </DialogTitle>
                    <div className="md:flex gap-10 ">
                      <OptimizedImage
                        src={book.coverImage || '/assets/default-image.png'}
                        alt={book.title}
                        width={200}
                        height={200}
                        className="w-40 md:w-56 bg-cover mb-2 rounded-xl mx-auto"
                        loading="lazy"
                      />

                      <div className="md:max-w-lg max-w-md space-y-3 px-4">
                        {/* <p className="flex gap-2 text-md font-bold">
                          <span>Title: </span>
                          <span className="font-medium text-black dark:text-zinc-200">{book.title}</span>
                        </p> */}
                        <p className="flex gap-2 text-md text-zinc-900 dark:text-zinc-400">
                          <span>Author: </span>
                          <span className="font-medium text-black dark:text-zinc-200">
                            {book.author}
                          </span>
                        </p>
                        <p className="flex gap-2 text-md text-zinc-900 dark:text-zinc-400">
                          <span>ISBN: </span>
                          <span className="font-medium text-black dark:text-zinc-200">
                            {book.isbn}
                          </span>
                        </p>
                        <p className="flex gap-2 text-md text-zinc-900 dark:text-zinc-400">
                          <span>Publisher: </span>
                          <span className="font-medium text-black dark:text-zinc-200">
                            {book.publisher}
                          </span>
                        </p>
                        <p className="flex gap-2 text-md text-zinc-900 dark:text-zinc-400">
                          <span>Publication Place: </span>
                          <span className="font-medium text-black dark:text-zinc-200">
                            {book.publication_place}
                          </span>
                        </p>
                        <div className="flex gap-2 text-md text-zinc-900 dark:text-zinc-400 ">
                          <span>Categories: </span>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {book.categories
                              ?.slice(0, 2)
                              .map((category: any) => (
                                <p
                                  key={category.id}
                                  className="rounded-full bg-blue-500/30 text-blue-500 p-1 text-sm px-2 shadow-md"
                                >
                                  {category.name}
                                </p>
                              ))}
                            {(book.categories?.length ?? 0) > 2 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <p className="rounded-full bg-blue-500/30 text-blue-500 p-1 px-2 shadow-md text-sm cursor-help">
                                    +{(book.categories?.length ?? 0) - 2}
                                  </p>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px]">
                                  <div className="flex flex-wrap gap-2 p-1">
                                    {book.categories
                                      ?.slice(2)
                                      .map((category: any) => (
                                        <span
                                          key={category.id}
                                          className="rounded-full bg-blue-500/30 text-blue-500 p-1 px-2 text-xs"
                                        >
                                          {category.name}
                                        </span>
                                      ))}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                        <p className="flex gap-2 text-md text-zinc-900 dark:text-zinc-400">
                          <span>Language: </span>
                          <span className="font-medium text-black dark:text-zinc-200">
                            {book.language}
                          </span>
                        </p>
                        <p className="flex gap-2 text-md text-zinc-900 dark:text-zinc-400">
                          <span>Pages: </span>
                          <span className="font-medium text-black dark:text-zinc-200">
                            {book.pages}
                          </span>
                        </p>
                        <div className="flex gap-2 text-md text-zinc-900 dark:text-zinc-400">
                          <span>Progress: </span>
                          <div className="font-medium text-black dark:text-zinc-200 items">
                            {book?.readingProgress !== undefined ? (
                              <div className="flex  items-center gap-1">
                                <div className="w-24 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full">
                                  <div
                                    className="h-full bg-green-500 rounded-full transition-all"
                                    style={{
                                      width: `${Math.min(
                                        book?.readingProgress,
                                        100
                                      ).toFixed(1)}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {book?.readingProgress.toFixed(1)}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                -
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="flex gap-2 text-md text-zinc-900 dark:text-zinc-400 ">
                          <span>Status: </span>
                          <span
                            className={`${getStatusClass(
                              book.status
                            )} rounded-full text-md  px-2 shadow-md`}
                          >
                            {book.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    <DialogDescription className="text-zinc-800 dark:text-zinc-500">
                      {book.description}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="max-w-[10em] md:max-w-[23em] px-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {book.categories?.slice(0, 2).map((category: any) => (
                  <p
                    key={category.id}
                    className="rounded-full bg-blue-500/30 text-blue-500 p-1 px-2 shadow-md"
                  >
                    {category.name}
                  </p>
                ))}
                {(book.categories?.length ?? 0) > 2 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="rounded-full bg-blue-500/30 text-blue-500 p-1 px-2 shadow-md text-sm cursor-help">
                        +{(book.categories?.length ?? 0) - 2}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px]">
                      <div className="flex flex-wrap gap-2 p-1">
                        {book.categories?.slice(2).map((category: any) => (
                          <span
                            key={category.id}
                            className="rounded-full bg-blue-500/30 text-blue-500 p-1 px-2 text-xs"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="mt-3">
                <h2 className="text-md font-bold">{book.title}</h2>
                <p className="text-gray-500">by {book.author}</p>

                <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-500 hidden md:block">
                  {book.description?.substring(0, 100)}...
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default BookCard;
