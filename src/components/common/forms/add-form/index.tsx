import React, { FC, useEffect, useMemo, useState } from 'react';
import { NormalInput } from '@/components/ui/input';
import {
  addBook,
  editBook,
  resetAddBookState,
  resetEditBookState,
} from '@/redux/reducers/bookSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { BookStatus } from '@prisma/client';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { SingleSelectCombobox } from '@/components/ui/MultiSelect';
import { languages } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { fetchCategories } from '@/redux/reducers/categorySlice';
import { CustomMultiSelect } from '@/components/ui/customMultiSlect';
import { BookFromValues, bookSchema } from '@/schemas/book-form';
import { ExtendedBook } from '@/types/extended-types';

interface BookFormProps {
  book?: ExtendedBook | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddBookForm: FC<BookFormProps> = ({ book, onClose, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { addBookState, editBookState } = useSelector(
    (state: RootState) => state.books
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const [previewImage, setPreviewImage] = useState<string | null>(
    book?.coverImage ? book.coverImage : null
  );

  const defaultValues = useMemo(
    () => ({
      title: book?.title || '',
      author: book?.author || '',
      categories: book?.categories?.map((c) => c.name) || [],
      status: book?.status || BookStatus.unread,
      description: book?.description || '',
      publisher: book?.publisher || '',
      publication_place: book?.publication_place || '',
      isbn: book?.isbn || '',
      pages: book?.pages?.toString() || '',
      language: book?.language || '',
      currentPage: book?.progress?.currentPage?.toString() || '',
      coverImage: undefined,
    }),
    [book]
  );

  const form = useForm<BookFromValues>({
    resolver: zodResolver(bookSchema),
    defaultValues,
  });

  const handleImageChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };
  const buildFormData = (values: BookFromValues, userId?: string): FormData => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (
        key === 'coverImage' &&
        value instanceof FileList &&
        value.length > 0
      ) {
        formData.append(key, value[0]);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    if (userId) {
      formData.append('userId', userId);
    }

    return formData;
  };

  const onSubmit = (values: BookFromValues) => {
    const formData = buildFormData(values, user?.id);

    const action = book
      ? dispatch(editBook({ id: book.id, formData }))
      : dispatch(addBook(formData));

    action
      .then(() => {
        onClose();
        onSuccess?.();
      })
      .finally(() => {
        dispatch(resetAddBookState());
        dispatch(resetEditBookState());
      });
  };

  useEffect(() => {
    dispatch(fetchCategories());
    return () => {
      dispatch(resetAddBookState());
      dispatch(resetEditBookState());
    };
  }, [dispatch]);

  return (
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
          <div className=" max-h-96 overflow-y-scroll">
            <div className="space-y-3 px-3">
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
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CustomMultiSelect
                        value={field.value} // the currently selected categories
                        onChange={field.onChange} // function to update form state
                        placeholder="Select or Add Categories" // placeholder text
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
              <div className=" gap-5">
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
              </div>

              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="currentPage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NormalInput {...field} placeholder="Current Page" />
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
                    <FormMessage />
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
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div
                        onDrop={(e) => {
                          e.preventDefault();
                          const files = e.dataTransfer.files;
                          field.onChange(files);
                          handleImageChange(files);
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        className="w-full border-dashed border-2 border-gray-300 rounded-md p-4 text-center cursor-pointer"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            handleImageChange(e.target.files);
                          }}
                          className="hidden"
                          id="coverImageInput"
                        />
                        <label
                          htmlFor="coverImageInput"
                          className="block cursor-pointer"
                        >
                          Drag & Drop or Click to Upload
                        </label>
                        {previewImage && (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="mt-2 h-40 object-contain mx-auto"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center  mt-5">
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
  );
};

export default AddBookForm;
