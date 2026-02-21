import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireProfile = true, requireAdmin = false }: ProtectedRouteProps) {
  const { token, hasProfile, isLoading, isInitialized, isAdmin } = useAuth();
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  if (!isInitialized || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireProfile && !hasProfile && !isProfilePage) {
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
