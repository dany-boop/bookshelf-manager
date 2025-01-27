import React, { FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  addBook,
  editBook,
  resetAddBookState,
  resetEditBookState,
} from '@/store/reducers/bookSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Book, BookStatus } from '@prisma/client';
import { useDispatch, useSelector } from 'react-redux';

interface BookFormProps {
  book?: Book | null;
  onClose: () => void;
}

const AddBookForm: FC<BookFormProps> = ({ book, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { addBookState, editBookState } = useSelector(
    (state: RootState) => state.books
  );
  const user = useSelector((state: RootState) => state.auth.user);

  console.log(user);
  const [formData, setFormData] = useState({
    userId: user?.id,
    title: book?.title || '',
    author: book?.author || '',
    category: book?.category || '',
    description: book?.description || '',
    pages: book?.pages || '',
    language: book?.language || '',
    status: book?.status || BookStatus.NOT_STARTED,
    coverImage: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      const files = e.target.files;
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : null, // Assign the first file or null
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formBody = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File || typeof value === 'string') {
        formBody.append(key, value); // Append files or strings
      } else {
        formBody.append(key, String(value)); // Convert other types to strings
      }
    });

    if (user) {
      formBody.append('userId', user.id); // Assuming user.id is the userId
    }

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
    <div className="max-w-lg mx-auto p-4 shadow-md">
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>

          {(addBookState.error || editBookState.error) && (
            <div className="text-red-500">
              {addBookState.error || editBookState.error}
            </div>
          )}
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
          <Input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded-md"
            rows={4}
          />
          <Input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author"
            required
          />
          <Input
            type="text"
            name="pages"
            value={formData.pages}
            onChange={handleChange}
            placeholder="Pages"
            required
          />

          <Input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="Language"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Status</option>
            <option value="READING">Reading</option>
            <option value="FINISHED">Finished</option>
            <option value="NOT_STARTED">To Read</option>
          </select>
          <div>
            <label className="block text-sm font-medium">Cover Image</label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {addBookState.loading || editBookState.loading
                ? 'Saving...'
                : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookForm;
