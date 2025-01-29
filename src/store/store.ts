import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import booksReducer from './reducers/bookSlice';
import storageSession from 'redux-persist/lib/storage/session';
import { persistReducer, persistStore } from 'redux-persist';

const authPersistConfig = {
  key: 'auth',
  storage: storageSession,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer), // Only persist authSlice
  books: booksReducer, // Normal reducer
});

const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

// import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
// import authReducer, { AuthState } from './reducers/authSlice';
// import booksReducer from './reducers/bookSlice';
// import storage from 'redux-persist/lib/storage';
// import { persistReducer, persistStore } from 'redux-persist';
// import { createTransform } from 'redux-persist';
// import { PersistPartial } from 'redux-persist/es/persistReducer';

// const transform = createTransform<AuthState, Omit<AuthState, 'token'>>(
//   (inboundState) => {
//     const { token, ...rest } = inboundState;
//     return rest;
//   },
//   (outboundState) => {
//     return { ...outboundState, token: null }; // Provide a default value for token
//   },
//   { whitelist: ['auth'] }
// );

// const persistConfig = {
//   key: 'root',
//   storage,
//   transforms: [transform], // Apply the transform
// };

// const rootReducer = combineReducers({
//   auth: authReducer,
//   books: booksReducer,
// });

// export type RootState = ReturnType<typeof rootReducer> & PersistPartial;

// const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);
// const store = configureStore({
//   reducer: persistedReducer,
// });

// export const persistor = persistStore(store);
// export type AppDispatch = typeof store.dispatch;
// // export type RootState = ReturnType<typeof store.getState>;

// export default store;
