import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    username: string;
    id: string;
    photo_url: string;
  } | null;
  token: string | null;
  error: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
  loading: false,
};

export const loginUser = createAsyncThunk<
  {
    user: { email: string; username: string; id: string; photo_url: string };
    token: string;
  },
  { email: string; password: string },
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const err = await res.json();
      return rejectWithValue(err.message || 'Login failed');
    }

    return await res.json(); // { user, token }
  } catch (err) {
    return rejectWithValue('Network error. Please try again.');
  }
});

export const registerUser = createAsyncThunk<
  void,
  { username: string; email: string; password: string },
  { rejectValue: string }
>('auth/registerUser', async (data, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      return rejectWithValue(err.message || 'Registration failed');
    }
  } catch (error) {
    return rejectWithValue('Network error. Please try again.');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    updateUserSuccess(state, action: PayloadAction<AuthState['user']>) {
      if (state.user) {
        state.user = action.payload;
        sessionStorage.setItem(
          'auth',
          JSON.stringify({ ...state, user: action.payload })
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Registration failed';
      });
  },
});

export const { logout, updateUserSuccess } = authSlice.actions;
export default authSlice.reducer;
