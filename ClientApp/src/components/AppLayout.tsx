import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';

export default function AppLayout() {
  const { email, isAdmin, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header email={email} isAdmin={isAdmin} onLogout={logout} />
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
