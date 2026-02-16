import { BrowserRouter, Route, Routes } from 'react-router';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { ChatAppPage } from '@/pages/ChatAppPage';
import { HomePage } from '@/pages/HomePage';
import { toast, Toaster } from 'sonner';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { FetchAccountInfo } from './redux/slice/accountSlide';
import { setTheme } from './redux/slice/themeSlide';
import { RedirectIfAuthenticated, RequireAuth } from '@/services/routeProtection';
function App() {
  const Dispatch = useAppDispatch();
  const isDark = useAppSelector(state => state.theme.isDark)

  useEffect(() => { // Khi ứng dụng khởi động, kiểm tra trạng thái đăng nhập của người dùng
    Dispatch(FetchAccountInfo({}))

    // Initialise theme from localStorage if present
    try {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark') {
        Dispatch(setTheme(true))
      } else if (stored === 'light') {
        Dispatch(setTheme(false))
      }
    } catch (e) {
      // ignore
      toast.error('Failed to load theme preference: ' + e)
    }
  }, []);

  // Apply or remove `dark` class on <html> when theme changes and persist
  useEffect(() => {
    try {
      const root = document.documentElement
      if (isDark) {
        root.classList.add('dark') // Thêm lớp 'dark' vào phần tử <html>
        localStorage.setItem('theme', 'dark')
      } else {
        root.classList.remove('dark') // Loại bỏ lớp 'dark' khỏi phần tử <html>
        localStorage.setItem('theme', 'light')
      }
    } catch (e) {
      // ignore
      toast.error('Failed to update theme preference: ' + e)
    }
  }, [isDark]);

  return <>
    <Toaster position="bottom-right" closeButton /> {/* Thông báo */}
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={
          <RedirectIfAuthenticated>
            <SignInPage />
          </RedirectIfAuthenticated>
        } />
        <Route path="/signup" element={
          <RedirectIfAuthenticated>
            <SignUpPage />
          </RedirectIfAuthenticated>
        } />

        {/* protected Routes */}
        <Route path="/chat" element={
          <RequireAuth>
            <ChatAppPage />
          </RequireAuth>
        } />

      </Routes>
    </BrowserRouter>
  </>
}

export default App
