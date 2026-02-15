import { BrowserRouter, Route, Routes } from 'react-router';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { ChatAppPage } from '@/pages/ChatAppPage';
import { HomePage } from '@/pages/HomePage';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useAppDispatch } from './redux/hooks';
import { FetchAccountInfo } from './redux/slice/accountSlide';
import { RedirectIfAuthenticated, RequireAuth } from '@/services/routeProtection';
function App() {
  const Dispatch = useAppDispatch();

  useEffect(() => { // Khi ứng dụng khởi động, kiểm tra trạng thái đăng nhập của người dùng
    Dispatch(FetchAccountInfo({}))
  }, []);

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
