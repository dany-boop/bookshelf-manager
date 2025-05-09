import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        user: AuthState['user'];
        token: string;
      }>
    ) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
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
});

export const { loginSuccess, loginFailure, logout, updateUserSuccess } =
  authSlice.actions;

export default authSlice.reducer;
