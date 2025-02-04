import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateUserSuccess } from './authSlice';

interface UserFormState {
  loading: boolean;
  success: boolean;
  error: string | null;
}
export interface UserState {
  id: string;
  email: string;
  username: string;
  password: string;
  photo_url?: string;
  loading: boolean;
  error?: string;
  editUserState: UserFormState;
}

const initialState: UserState = {
  id: '',
  email: '',
  username: '',
  photo_url: '',
  password: '',
  loading: false,
  error: undefined,
  editUserState: {
    loading: false,
    success: false,
    error: null,
  },
};

// Fetch user by ID
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (id?: string) => {
    const response = await fetch(`/api/user/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return response.json();
  }
);

export const updateUser = createAsyncThunk<
  UserState,
  { userId?: string; data: FormData }
>('user/updateUser', async ({ userId, data }, { dispatch }) => {
  try {
    const response = await fetch(`/api/user/${userId}`, {
      method: 'PUT',
      body: data,
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Failed to update user');
    }
    const updatedUser = await response.json();
    if (updatedUser && updatedUser.username) {
      dispatch(updateUserSuccess(updatedUser));
    }

    return updatedUser;
  } catch (error) {
    return 'Failed to update user';
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetEditUserState: (state) => {
      state.editUserState = { loading: false, success: false, error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.username = action.payload.username;
        state.password = action.payload.password;
        state.photo_url = action.payload.photo_url;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.editUserState.loading = true;
        state.editUserState.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.editUserState.loading = false;
        state.editUserState.success = true;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.photo_url = action.payload.photo_url;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.editUserState.loading = false;
        state.editUserState.error = action.payload as string;
      });
  },
});

export const { resetEditUserState } = userSlice.actions;
export default userSlice.reducer;
