import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FoodsPage from './pages/FoodsPage';
import ExercisesPage from './pages/ExercisesPage';
import DiariesPage from './pages/DiariesPage';
import ForumPage from './pages/ForumPage';
import ForumPostPage from './pages/ForumPostPage';
import BlogPage from './pages/BlogPage';
import ArticlePage from './pages/ArticlePage';
import NewArticlePage from './pages/NewArticlePage';
import SocialPage from './pages/SocialPage';
import AdminPage from './pages/AdminPage';

const queryClient = new QueryClient();
const theme = createTheme();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route index element={<HomePage />} />
                <Route path="profile" element={<ProtectedRoute requireProfile={false}><ProfilePage /></ProtectedRoute>} />
                <Route path="foods" element={<FoodsPage />} />
                <Route path="exercises" element={<ExercisesPage />} />
                <Route path="diaries" element={<DiariesPage />} />
                <Route path="forum" element={<ForumPage />} />
                <Route path="forum/:id" element={<ForumPostPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/new" element={<NewArticlePage />} />
                <Route path="blog/:id" element={<ArticlePage />} />
                <Route path="social" element={<SocialPage />} />
                <Route path="admin" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
