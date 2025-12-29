import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/services/authService';
import type { IUser } from '@/types/backend';

// Thunk action cho đăng nhập
export const FetchAccountInfo = createAsyncThunk<
    IUser, // return type on success
    {}, // argument type(payload)
    { rejectValue: string } // thunkAPI reject value type when failed
>('auth/fetchAccountInfo', //name of the action
    async ({ }, thunkAPI) => { //func to perform the async task
        try {
            const res = await authService.fetchAccountInfo();
            return res?.data ?? null; // Trả về dữ liệu user khi thành công
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error?.message ?? 'Fetch account info failed') //thunkAPI.rejectWithValue để trả về lỗi
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
        clearState(state) {
            state.user = initialState.user;
            state.isAuthenticated = initialState.isAuthenticated;
            state.isLoading = initialState.isLoading;
            state.isRefreshToken = initialState.isRefreshToken;
            state.accessToken = initialState.accessToken;
        },
        setAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
        },
        clearAccessToken(state) {
            state.accessToken = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(FetchAccountInfo.pending, (state, action) => { // Đang trong quá trình fetch account info
            if (action.payload) {
                state.isLoading = true;
                state.isAuthenticated = false;
            }
        });
        builder.addCase(FetchAccountInfo.fulfilled, (state, action: PayloadAction<IUser>) => { // Fetch account info thành công
            if (action.payload) {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            }
        });
        builder.addCase(FetchAccountInfo.rejected, (state, action: PayloadAction<any>) => { // Lỗi fetch account info
            if (action.payload) {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = initialState.user;
                state.accessToken = null;
            }
        });
    }
});

export const { setUser, clearState, setAccessToken, clearAccessToken } = accountSlice.actions;
export default accountSlice.reducer;