import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import booksReducer from './reducers/bookSlice';
import userReducer from './reducers/userSlice';
import categoryReducer from './reducers/categorySlice';
import storageSession from 'redux-persist/lib/storage/session';
import { persistReducer, persistStore } from 'redux-persist';

const authPersistConfig = {
  key: 'auth',
  storage: storageSession,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer), // Only persist authSlice
  books: booksReducer, // Normal reducer
  user: userReducer,
  categories: categoryReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
