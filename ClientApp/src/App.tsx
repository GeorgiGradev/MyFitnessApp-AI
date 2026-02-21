import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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
              <Route
                path="/profile"
                element={
                  <ProtectedRoute requireProfile={false}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/foods"
                element={
                  <ProtectedRoute>
                    <FoodsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exercises"
                element={
                  <ProtectedRoute>
                    <ExercisesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diaries"
                element={
                  <ProtectedRoute>
                    <DiariesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forum"
                element={
                  <ProtectedRoute>
                    <ForumPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forum/:id"
                element={
                  <ProtectedRoute>
                    <ForumPostPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog"
                element={
                  <ProtectedRoute>
                    <BlogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog/new"
                element={
                  <ProtectedRoute>
                    <NewArticlePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blog/:id"
                element={
                  <ProtectedRoute>
                    <ArticlePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/social"
                element={
                  <ProtectedRoute>
                    <SocialPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
