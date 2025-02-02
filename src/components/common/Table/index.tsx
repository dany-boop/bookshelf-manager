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
import { Book } from '@prisma/client';
import SearchBooks from '../DebounceSearch';
import { useDispatch } from 'react-redux';
import { deleteBook } from '@/store/reducers/bookSlice';
import { AppDispatch } from '@/store/store';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
  books: Book[];
  loading?: boolean;
  title?: string;
  openForm: (book?: Book | null | undefined) => void;
  userId: string | undefined;
};

const BooksTable: FC<Props> = ({ books, loading, title, openForm, userId }) => {
  const tableRef = useRef(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Book;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = (bookId: number) => {
    dispatch(deleteBook(bookId));
  };

  const handleSort = (key: keyof Book) => {
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
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
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

  console.log(filteredBooks.length);

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
    <div className="rounded-2xl my-10 border bg-gradient-to-tr from-zinc-50 to-stone-50  dark:from-zinc-800 dark:to-stone-800 dark:border-0 shadow-md py-10 px-5">
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
          <SearchBooks userId={userId} />
        </div>
      </div>
      <Table ref={tableRef} className="overflow-x-scroll ">
        <TableHeader className="border-b-2 dark:border-zinc-600 ">
          <TableRow>
            <TableCell
              onClick={() => handleSort('title')}
              className="cursor-pointer font-bold "
            >
              <span className="flex gap-3 justify-center">
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
              <span className="flex gap-3 justify-center">
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
              onClick={() => handleSort('category')}
              className="cursor-pointer font-bold"
            >
              <span className="flex gap-3 justify-center">
                Category{' '}
                {sortConfig?.key === 'category' ? (
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
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <TableRow
                key={book.id}
                className="border-b border-dashed dark:border-zinc-600"
              >
                <>
                  <TableCell>
                    <span className="flex justify-center">{book.title}</span>
                  </TableCell>
                  <TableCell>
                    <span className="flex justify-center">{book.author}</span>
                  </TableCell>
                  <TableCell className="">
                    <p className="flex-justify-center rounded-full bg-blue-500/30 text-blue-500 p-1 px-2 shadow-md">
                      {book.category}
                    </p>
                  </TableCell>

                  <TableCell className="flex justify-center">
                    <p
                      className={`${getStatusClass(
                        book.status
                      )} rounded-full text-md p-1 px-2 shadow-md`}
                    >
                      {book.status}
                    </p>
                  </TableCell>

                  <TableCell className="">
                    <Popover>
                      <PopoverTrigger>
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
                            width={100}
                            className="text-yellow-500 text-lg "
                          />
                          <span className=" text-zinc-900 dark:text-zinc-50  ">
                            Edit
                          </span>
                        </Button>
                        <Button
                          className="flex justify-start px-2 py-2 w-full"
                          onClick={() => handleDelete(book.id)}
                        >
                          <Icon
                            icon="solar:trash-bin-trash-bold-duotone"
                            width={100}
                            className=" text-red-500 text-lg "
                          />
                          <span className=" text-zinc-900 dark:text-zinc-50  ">
                            Delete
                          </span>
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </>
              </TableRow>
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
    </div>
  );
};

export default BooksTable;
