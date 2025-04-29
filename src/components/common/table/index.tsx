'use client';
import React, { FC, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Book as PrismaBook } from '@prisma/client';
import SearchBooks from '../debounce-search';
import { useDispatch } from 'react-redux';
import { deleteBook } from '@/redux/reducers/bookSlice';
import { AppDispatch } from '@/redux/store';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Categories = {
  id: number;
  name: string;
};
type ExtendedBook = PrismaBook & {
  readingProgress?: number;
  categories?: Categories[];
};

type Props = {
  books: ExtendedBook[];
  loading?: boolean;
  title?: string;
  openForm: (book?: ExtendedBook | null | undefined) => void;
  userId: string | undefined;
  limit: number;
};

const BooksTable: FC<Props> = ({
  books,
  loading,
  title,
  openForm,
  userId,
  limit,
}) => {
  const tableRef = useRef(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ExtendedBook;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<ExtendedBook | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Open delete confirmation dialog
  const confirmDelete = (book: ExtendedBook) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedBook) {
      dispatch(deleteBook(selectedBook.id));
      toast.success(`Book "${selectedBook.title}" has been removed.`);
    }
    setIsDialogOpen(false);
    setSelectedBook(null);
  };

  const handleSort = (key: keyof ExtendedBook) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }

    setSortConfig({ key, direction });
  };

  const sortedBooks = React.useMemo(() => {
    let sortableBooks = [...books];
    if (sortConfig) {
      sortableBooks.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof ExtendedBook] ?? '';
        const bValue = b[sortConfig.key as keyof ExtendedBook] ?? '';
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;
        // Compare defined values
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableBooks;
  }, [books, sortConfig]);

  const filteredBooks = sortedBooks.filter((book) =>
    Object.values(book).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="rounded-2xl my-10 border bg-gradient-to-tr from-zinc-50 to-stone-50 dark:from-gray-800 dark:to-slate-800 dark:border-0 shadow-md py-10 px-5"
    >
      {/* delet confirmation dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-stone-100/30 dark:bg-gray-800/30 backdrop-filter backdrop-blur-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete "{selectedBook?.title}"?</p>
          <DialogFooter>
            <Button className="bg-red-500/30" onClick={handleDelete}>
              <Icon
                icon="solar:trash-bin-trash-bold-duotone"
                width={50}
                className=" text-red-500 w-20 "
              />
              <span className=" text-zinc-900 dark:text-zinc-50  ">Delete</span>
            </Button>
            <Button className=" bg-gray-900 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 shadow-md hover:shadow-xl dark:text-slate-900 text-slate-50">
              <span>Cancel</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* table started */}
      <div className="flex justify-between my-5">
        <h1 className="mx-5 text-lg font-semibold">Book Table</h1>
        <div className="flex gap-3 ">
          <button
            onClick={() => openForm()} // Open the form for adding a new book
            className=" "
          >
            <Icon
              icon="solar:add-circle-bold-duotone"
              width={40}
              className=" text-green-600 hover:text-green-500"
            />
          </button>
          <SearchBooks userId={userId} limit={limit} />
        </div>
      </div>
      <Table ref={tableRef} className="overflow-x-scroll ">
        <TableHeader className="border-b-2 dark:border-zinc-600 ">
          <TableRow>
            <TableCell
              onClick={() => handleSort('title')}
              className="cursor-pointer font-bold "
            >
              <span className="flex gap-3 justify-start">
                Title
                {sortConfig?.key === 'title' ? (
                  sortConfig.direction === 'asc' ? (
                    <Icon icon="solar:alt-arrow-up-bold-duotone" width={20} />
                  ) : (
                    <Icon icon="solar:alt-arrow-down-bold-duotone" width={20} />
                  )
                ) : (
                  ''
                )}
              </span>
            </TableCell>
            <TableCell
              onClick={() => handleSort('author')}
              className="cursor-pointer font-bold"
            >
              <span className="flex gap-3 justify-start">
                Author{' '}
                {sortConfig?.key === 'author' ? (
                  sortConfig.direction === 'asc' ? (
                    <Icon icon="solar:alt-arrow-up-bold-duotone" width={20} />
                  ) : (
                    <Icon icon="solar:alt-arrow-down-bold-duotone" width={20} />
                  )
                ) : (
                  ''
                )}
              </span>
            </TableCell>
            <TableCell
              onClick={() => handleSort('categories')}
              className="cursor-pointer font-bold"
            >
              <span className="flex gap-3 justify-center">
                Category{' '}
                {sortConfig?.key === 'categories' ? (
                  sortConfig.direction === 'asc' ? (
                    <Icon icon="solar:alt-arrow-up-bold-duotone" width={20} />
                  ) : (
                    <Icon icon="solar:alt-arrow-down-bold-duotone" width={20} />
                  )
                ) : (
                  ''
                )}
              </span>
            </TableCell>

            <TableCell
              onClick={() => handleSort('readingProgress')}
              className="cursor-pointer font-bold"
            >
              <span className="flex gap-3 justify-center">
                Progress
                {sortConfig?.key === 'readingProgress' ? (
                  sortConfig.direction === 'asc' ? (
                    <Icon icon="solar:alt-arrow-up-bold-duotone" width={20} />
                  ) : (
                    <Icon icon="solar:alt-arrow-down-bold-duotone" width={20} />
                  )
                ) : (
                  ''
                )}
              </span>
            </TableCell>
            <TableCell
              onClick={() => handleSort('status')}
              className="cursor-pointer font-bold"
            >
              <span className="flex gap-3 justify-center">
                Status{' '}
                {sortConfig?.key === 'status' ? (
                  sortConfig.direction === 'asc' ? (
                    <Icon icon="solar:alt-arrow-up-bold-duotone" width={20} />
                  ) : (
                    <Icon icon="solar:alt-arrow-down-bold-duotone" width={20} />
                  )
                ) : (
                  ''
                )}
              </span>
            </TableCell>
            <TableCell className="cursor-pointer font-bold">Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, index) => (
              <TableRow key={index} className="animate-pulse">
                <TableCell colSpan={5} className="py-5 text-center">
                  <div className="h-4 bg-gray-300 rounded dark:bg-gray-700 w-3/4 mx-auto"></div>
                </TableCell>
              </TableRow>
            ))
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <motion.tr
                key={book.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="border-b border-dashed dark:border-zinc-600"
              >
                <>
                  <TableCell>
                    <span className="flex justify-start">{book.title}</span>
                  </TableCell>
                  <TableCell>
                    <span className="flex justify-start">{book.author}</span>
                  </TableCell>
                  <TableCell className="">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {book.categories?.slice(0, 2).map((category) => (
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
                              {book.categories?.slice(2).map((category) => (
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
                  </TableCell>
                  <TableCell className="text-center">
                    {book?.readingProgress !== undefined ? (
                      <div className="flex flex-col items-center gap-1">
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
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <p
                      className={`${getStatusClass(
                        book.status
                      )} flex align-middle rounded-full text-md p-1 px-2 shadow-md my-auto`}
                    >
                      {book.status}
                    </p>
                  </TableCell>

                  <TableCell className="">
                    <Popover>
                      <PopoverTrigger className="hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full p-1">
                        <Icon
                          icon="pepicons-pencil:dots-y"
                          width={30}
                          className="text-foreground"
                        />
                      </PopoverTrigger>
                      <PopoverContent className="flex-col gap-2 w-fit bg-zinc-50/50 dark:bg-zinc-800/40 backdrop-filter backdrop-blur-sm">
                        <Button
                          onClick={() => openForm(book)} // Open the form with the book to edit
                          className="flex justify-start px-2 py-2 w-full"
                        >
                          <Icon
                            icon="solar:pen-new-round-linear"
                            width={50}
                            className="text-yellow-500 w-20 "
                          />
                          <span className=" text-zinc-900 dark:text-zinc-50  ">
                            Edit
                          </span>
                        </Button>
                        <Button
                          className="flex justify-start px-2 py-2 w-full"
                          onClick={() => confirmDelete(book)}
                        >
                          <Icon
                            icon="solar:trash-bin-trash-bold-duotone"
                            width={50}
                            className=" text-red-500 w-20 "
                          />
                          <span className=" text-zinc-900 dark:text-zinc-50  ">
                            Delete
                          </span>
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </>
              </motion.tr>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center w-full mt-5">
                You don't have any book
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default BooksTable;
