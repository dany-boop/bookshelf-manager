import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '@prisma/client';
import { toast } from 'sonner';

interface BookFormState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

export interface BooksState {
  totalBooks: number;
  finishedBooks: number;
  readBooks: number;
  catalog: Book[];
  loading: boolean;
  error: string | null;
  sortBy: 'title' | 'progress' | '';
  pagination: {
    currentPage: number;
    totalPages: number;
    limit: number;
  };
  filters: {
    category: string[];
    status: string;
    language: string;
  };
  addBookState: BookFormState;
  editBookState: BookFormState;
  deleteBookState: BookFormState;
}

const initialState: BooksState = {
  totalBooks: 0,
  finishedBooks: 0,
  readBooks: 0,
  catalog: [],
  loading: false,
  error: null,
  sortBy: '' as 'title' | 'progress' | '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  },
  filters: {
    category: [],
    status: '',
    language: '',
  },
  addBookState: {
    loading: false,
    success: false,
    error: null,
  },
  editBookState: {
    loading: false,
    success: false,
    error: null,
  },
  deleteBookState: {
    loading: false,
    success: false,
    error: null,
  },
};

// Define the return type of the async thunk
export const fetchBooksData = createAsyncThunk<
  {
    books: Book[];
    totalBooks: number;
    finishedBooks: number;
    readBooks: number;
    totalPages: number;
  },
  {
    page: number;
    limit: number;
    query?: string;
    filters?: { category?: string[]; status?: string; language?: string };
    userId: string;
  }
>('books/fetchBooksData', async ({ page, limit, filters, userId, query }) => {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('limit', limit.toString());
  params.set('userId', userId);

  if (query) params.set('query', query);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.language) params.set('language', filters.language);
  if (filters?.category?.length)
    params.set('category', filters.category.join(','));

  if (query) params.set('query', query);
  const response = await fetch(`/api/books?${params.toString()}`);
  // const response = await fetch(`/api/books?page=${page}`);
  if (!response.ok) {
    throw new Error('Failed to fetch books data');
  }
  return await response.json();
});

export const addBook = createAsyncThunk<Book, FormData>(
  'books/addBook',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to add book');
      }
      const book = await response.json();
      toast.success('Book added successfully!');
      return book;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add book');
      return rejectWithValue(error.message);
    }
  }
);

export const editBook = createAsyncThunk<
  Book,
  { id: number; formData: FormData }
>('books/editBook', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to edit book');
    }
    const book = await response.json();
    toast.success('Book updated successfully!');
    return book;
  } catch (error: any) {
    toast.error(error.message || 'Failed to edit book');
    return rejectWithValue(error.message);
  }
});

export const deleteBook = createAsyncThunk<{ id: number }, number>(
  'books/deleteBook',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete book');
      }
      toast.success('Book deleted successfully!');
      return { id };
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete book');
      return rejectWithValue(error.message);
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<'title' | 'progress' | ''>) => {
      state.sortBy = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<{
        category?: string[];
        status?: string;
        language?: string;
      }>
    ) => {
      if (action.payload.category !== undefined)
        state.filters.category = action.payload.category;
      if (action.payload.language !== undefined)
        state.filters.language = action.payload.language;
      if (action.payload.status !== undefined)
        state.filters.status = action.payload.status;
    },
    resetAddBookState: (state) => {
      state.addBookState = { loading: false, success: false, error: null };
    },
    resetEditBookState: (state) => {
      state.editBookState = { loading: false, success: false, error: null };
    },
    resetDeleteBookState: (state) => {
      state.deleteBookState = { loading: false, success: false, error: null };
    },
    resetBooksData: (state) => {
      state.catalog = [];
      state.totalBooks = 0;
      state.finishedBooks = 0;
      state.readBooks = 0;
      state.pagination.totalPages = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooksData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooksData.fulfilled, (state, action) => {
        state.loading = false;
        state.catalog = action.payload.books;
        state.totalBooks = action.payload.totalBooks;
        state.finishedBooks = action.payload.finishedBooks;
        state.readBooks = action.payload.readBooks;
        state.pagination.totalPages = action.payload.totalPages;
      })
      .addCase(fetchBooksData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch books';
      });

    // add book state
    builder
      .addCase(addBook.pending, (state) => {
        state.addBookState.loading = true;
        state.addBookState.error = null;
        state.addBookState.success = false;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.addBookState.loading = false;
        state.addBookState.success = true;
        state.catalog.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.addBookState.loading = false;
        state.addBookState.error = action.error.message || 'Failed to add book';
      });

    // edit book state
    builder
      .addCase(editBook.pending, (state) => {
        state.editBookState.loading = true;
        state.editBookState.error = null;
        state.editBookState.success = false;
      })
      .addCase(editBook.fulfilled, (state, action) => {
        state.editBookState.loading = false;
        state.editBookState.success = true;
        const index = state.catalog.findIndex(
          (b) => b.id === action.payload.id
        );
        if (index !== -1) {
          state.catalog[index] = action.payload;
        }
      })
      .addCase(editBook.rejected, (state, action) => {
        state.editBookState.loading = false;
        state.editBookState.error =
          action.error.message || 'Failed to edit book';
      });

    builder
      .addCase(deleteBook.pending, (state) => {
        state.deleteBookState.loading = true;
        state.deleteBookState.error = null;
        state.deleteBookState.success = false;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.deleteBookState.loading = false;
        state.deleteBookState.success = true;
        // Remove the deleted book from the catalog
        state.catalog = state.catalog.filter(
          (book) => book.id !== action.payload.id
        );
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.deleteBookState.loading = false;
        // Safely handle the error message and check its type
        state.deleteBookState.error =
          typeof action.error.message === 'string'
            ? action.error.message
            : 'Failed to delete book';
      });
  },
});

export const {
  setFilters,
  setSortBy,
  setLimit,
  setCurrentPage,
  resetBooksData,
  resetAddBookState,
  resetEditBookState,
} = booksSlice.actions;
export default booksSlice.reducer;
