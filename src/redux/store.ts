import { configureStore } from '@reduxjs/toolkit'
import { accountSlice } from '@/redux/slice/accountSlide';
export const store = configureStore({
  reducer: {
    account: accountSlice.reducer, // Thêm slice account vào store với key 'account' mà được khai báo trong accountSlice
  }
})

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']
