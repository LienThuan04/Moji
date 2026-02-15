import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface IThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (dark: boolean) => void;
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        isDark: false,
    },
    reducers: {
        toggleTheme: (state) => {
            state.isDark = !state.isDark;
        },
        setTheme: (state, action: PayloadAction<boolean>) => {
            state.isDark = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;