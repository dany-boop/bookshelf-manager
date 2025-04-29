import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Adjust import if necessary
import { BookCategory } from '@prisma/client';

const apiUrl = '/api/categories'; // Adjust the API URL for your categories

// Fetch categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data; // Return fetched categories
  }
);

// Add a new category
export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (category: { name: string }) => {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(category), // Sending both name and userId
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data; // Return newly added category
  }
);

// Remove a category
export const removeCategory = createAsyncThunk(
  'categories/removeCategory',
  async (categoryId: string) => {
    await fetch(`${apiUrl}/${categoryId}`, {
      method: 'DELETE',
    });
    return categoryId; // Return the category ID to remove from state
  }
);

interface CategoryState {
  categories: BookCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })

      // Add category
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload); // Add the new category
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add category';
      })

      // Remove category
      .addCase(removeCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (category: any) => category.id !== action.payload
        );
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove category';
      });
  },
});

export const selectCategories = (state: RootState) =>
  state.categories.categories;

export default categorySlice.reducer;
