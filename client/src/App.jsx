import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import LoadingSpinner from './components/common/LoadingSpinner';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <AuthPage />;
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={user.role === 'admin' ? <AdminPage /> : <Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;