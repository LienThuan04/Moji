import { configureStore } from '@reduxjs/toolkit'
import { accountSlice } from '@/redux/slice/accountSlide';
import { themeSlice } from '@/redux/slice/themeSlide';
export const store = configureStore({
  reducer: {
    account: accountSlice.reducer, // Thêm slice account vào store với key 'account' mà được khai báo trong accountSlice
    theme: themeSlice.reducer, // Thêm slice theme vào store với key 'theme' mà được khai báo trong themeSlice
  }
})

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']
