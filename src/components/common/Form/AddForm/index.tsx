import React, { FC, useEffect, useState } from 'react';
import { NormalInput } from '@/components/ui/input';
import {
  addBook,
  editBook,
  resetAddBookState,
  resetEditBookState,
} from '@/redux/reducers/bookSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { Book, BookStatus } from '@prisma/client';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  MultiSelectCombobox,
  SingleSelectCombobox,
} from '@/components/ui/MultiSelect';
import { categories, languages } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

interface BookFormProps {
  book?: Book | null;
  onClose: () => void;
}

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.array(z.string()).min(1, 'Category is required'),
  status: z.nativeEnum(BookStatus, {
    errorMap: () => ({ message: 'Status is required' }),
  }),
  description: z.string().optional(),
  publisher: z.string({ message: 'Publisher is required' }),
  publication_place: z.string().optional(),
  isbn: z.string().optional(),
  pages: z.string().optional(),
  language: z.string().optional(),
  coverImage: z.any().optional(),
});

const AddBookForm: FC<BookFormProps> = ({ book, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { addBookState, editBookState } = useSelector(
    (state: RootState) => state.books
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title || '',
      author: book?.author || '',
      category: book?.category ? book.category.split(',') : [],
      status: book?.status || BookStatus.unread,
      description: book?.description || '',
      publisher: book?.publisher || '',
      publication_place: book?.publication_place || '',
      isbn: book?.isbn || '',
      pages: book?.pages?.toString(),
      language: book?.language || '',
      coverImage: null,
    },
  });

  const onSubmit = (values: z.infer<typeof bookSchema>) => {
    const formBody = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formBody.append(key, value as string);
    });

    if (user) formBody.append('userId', user.id);

    if (book) {
      dispatch(editBook({ id: book.id, formData: formBody })).then(() =>
        dispatch(resetEditBookState())
      );
    } else {
      dispatch(addBook(formBody)).then(() => dispatch(resetAddBookState()));
    }
    onClose();
  };

  useEffect(() => {
    return () => {
      dispatch(resetAddBookState());
      dispatch(resetEditBookState());
    };
  }, [dispatch]);

  return (
    <div className="bg-stone-100/30 dark:bg-gray-800/30 backdrop-filter backdrop-blur-md p-6 rounded-lg max-w-2xl mx-auto shadow-md ">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <h2 className="text-xl mb-5 text-center font-bold">
              {book ? 'Edit Book' : 'Add New Book'}
            </h2>

            {/* Error Message */}
            {(addBookState.error || editBookState.error) && (
              <div className="text-red-500">
                {addBookState.error || editBookState.error}
              </div>
            )}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <NormalInput {...field} placeholder="Title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="category"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectCombobox
                        options={categories}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Categories"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Description"
                        className="w-full p-2 border rounded-md focus:border-green-500 focus:outline-none"
                        rows={2}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="language"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SingleSelectCombobox
                        options={languages}
                        value={field.value as string}
                        onChange={field.onChange}
                        placeholder="Select a Language"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NormalInput {...field} placeholder="Author" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pages"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NormalInput {...field} placeholder="Pages" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <NormalInput {...field} placeholder="ISBN" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="publisher"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NormalInput {...field} placeholder="Publisher" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publication_place"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NormalInput
                          {...field}
                          placeholder="Publication Place"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full p-2 border rounded-md focus:border-green-500"
                      >
                        <option value="">Select Status</option>
                        <option value="reading">Reading</option>
                        <option value="finished">Finished</option>
                        <option value="unread">To Read</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <FormControl>
                      <NormalInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-end space-x-4 mt-5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <Button
                type="submit"
                className="w-full mt-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 shadow-md hover:shadow-xl dark:text-slate-900 text-slate-50"
              >
                {addBookState.loading || editBookState.loading ? (
                  <span className="animate-spin text-center ">
                    <Icon icon="mingcute:loading-fill" />
                  </span>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddBookForm;
