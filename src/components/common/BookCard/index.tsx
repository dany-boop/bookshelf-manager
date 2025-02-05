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
                src={book.coverImage || '/default-image.jpg'}
                alt={book.title}
                width={200}
                height={200}
                className="min-w-40 w-40 h-60 bg-cover mb-2 rounded-xl"
                placeholder="blur"
                blurDataURL="/default-image.jpg"
                loading="lazy"
              />
              <Dialog>
                <DialogTrigger className=" dark:bg-slate-800/50 stone-50/50 border-white/20 backdrop-blur-sm border-1  p-1 absolute text-white rounded-xl bottom-0.5 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 font-semibold ">
                  <span className="text-center">Show Detail</span>
                </DialogTrigger>
                <DialogContent className="w-full bg-stone-100/30 dark:bg-gray-800/30 backdrop-filter backdrop-blur-sm rounded-3xl overflow-y-auto overflow-x-hidden md:overflow-y-hidden max-h-80 md:max-h-fit">
                  <DialogHeader>
                    <DialogTitle className="text-lg md:text-2xl text-center">
                      Book Details
                    </DialogTitle>
                    <div className="md:flex gap-10">
                      <Image
                        src={book.coverImage || '/default-image.jpg'}
                        alt={book.title}
                        width={200}
                        height={200}
                        className="w-40 md:w-56 bg-cover mb-2 rounded-xl mx-auto"
                        placeholder="blur"
                        blurDataURL="/default-image.jpg"
                        loading="lazy"
                      />
                      <div className="md:max-w-md max-w-md space-y-3 px-4">
                        <p className="flex gap-2 text-md font-bold">
                          <span>Title: </span>
                          <span className="font-medium">{book.title}</span>
                        </p>
                        <p className="flex gap-2 text-md font-bold">
                          <span>Author: </span>
                          <span className="font-medium">{book.author}</span>
                        </p>
                        <p className="flex gap-2 text-md font-bold">
                          <span>ISBN: </span>
                          <span className="font-medium">{book.isbn}</span>
                        </p>
                        <p className="flex gap-2 text-md font-bold">
                          <span>Publisher: </span>
                          <span className="font-medium">{book.publisher}</span>
                        </p>
                        <p className="flex gap-2 text-md font-bold">
                          <span>Publication Place: </span>
                          <span className="font-medium">
                            {book.publication_place}
                          </span>
                        </p>
                        <p className="flex gap-2 text-md font-bold ">
                          <span>Categories: </span>
                          <span className="font-medium">
                            {book.category?.substring(0, 100)}...
                          </span>
                        </p>
                        <p className="flex gap-2 text-md font-bold">
                          <span>Language: </span>
                          <span className="font-medium">{book.language}</span>
                        </p>
                        <p className="flex gap-2 text-md font-bold">
                          <span>Pages: </span>
                          <span className="font-medium">{book.pages}</span>
                        </p>
                        <p className="flex gap-2 text-md font-bold ">
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
              <div>
                <p className="flex-justify-center overflow-hidden rounded-full bg-blue-500/30 text-blue-500 p-1 px-2 shadow-md">
                  {book.category?.substring(0, 100)}...
                </p>
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
