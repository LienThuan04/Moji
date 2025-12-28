import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';
import type { IUser } from '@/types/backend';

// Thunk action cho đăng nhập
export const SignInAction = createAsyncThunk<
    unknown, // return type on success
    { username: string; password: string }, // argument type(payload)
    { rejectValue: string } // thunkAPI reject value type when failed
>('auth/signin', //name of the action
    async (payload: { username: string; password: string }, thunkAPI) => { //func to perform the async task
    try {
        const data = await authService.signIn(payload.username, payload.password);
        return data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error?.message ?? 'Login failed') //thunkAPI.rejectWithValue để trả về lỗi
    }
});

interface IState {
    isAuthenticated: boolean;
    isLoading: boolean;
    isRefreshToken: boolean;
    accessToken: string | null;
    user: IUser;
};

const initialState: IState = {
    isAuthenticated: false,
    isLoading: false,
    isRefreshToken: false,
    accessToken: null,
    user: {
        _id: '',
        username: '',
        email: '',
        displayName: '',
        avatarUrl: '',
        avatarId: '',
        phone: '',
        bio: '',
    },
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<IState['user']>) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
        clearUser(state) {
            state.user = initialState.user;
            state.isAuthenticated = false;
            state.isLoading = false;
        },
        setAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
        },
        clearAccessToken(state) {
            state.accessToken = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(SignInAction.pending, (state) => { // Đang trong quá trình đăng nhập
            state.isLoading = true;
            state.isAuthenticated = false;
        });
        builder.addCase(SignInAction.fulfilled, (state, action: PayloadAction<any>) => { // Đăng nhập thành công
            if (!action.payload || !action.payload.user) {
                state.isLoading = false;
                state.isAuthenticated = false;
                return;
            }
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        });
        builder.addCase(SignInAction.rejected, (state, action) => { // Lỗi đăng nhập
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = action.payload as unknown as IState['user'];
        });
    }
});

export const { setUser, clearUser, setAccessToken } = accountSlice.actions;
export default accountSlice.reducer;