import { BrowserRouter, Route, Routes } from 'react-router';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { ChatAppPage } from '@/pages/ChatAppPage';
import { Toaster } from 'sonner';
function App() {

  return <>
    <Toaster position="top-right" /> {/* Thông báo */}
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* protected Routes */}
        <Route path="/chat" element={<ChatAppPage />} />

      </Routes>
    </BrowserRouter>
  </>
}

export default App
