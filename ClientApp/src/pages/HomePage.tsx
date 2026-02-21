import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, CircularProgress, Alert, Paper, Button, Link as MuiLink } from '@mui/material';
import { getHello } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LOGO_SRC = '/images/logo/logo01.jpg';
const HERO_SRC = '/images/homepage/mainimage01.jpg';

export default function HomePage() {
  const { email, logout, isAdmin } = useAuth();
  const [logoError, setLogoError] = useState(false);
  const [heroError, setHeroError] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ['hello'],
    queryFn: getHello,
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {!logoError ? (
          <Box component="img" src={LOGO_SRC} alt="MyFitnessApp logo" onError={() => setLogoError(true)} sx={{ height: 48, objectFit: 'contain' }} />
        ) : (
          <Typography variant="h4">MyFitnessApp</Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
          <Button size="small" variant="outlined" onClick={() => logout()}>
            Log out
          </Button>
        </Box>
      </Box>
      {!heroError && (
        <Box
          component="img"
          src={HERO_SRC}
          alt="Fitness and wellness"
          onError={() => setHeroError(true)}
          sx={{ width: '100%', maxWidth: 600, maxHeight: 240, objectFit: 'cover', borderRadius: 1, mb: 2, display: 'block' }}
        />
      )}
      <Box sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/foods" sx={{ mr: 2 }}>
          Foods
        </MuiLink>
        <MuiLink component={Link} to="/exercises" sx={{ mr: 2 }}>
          Exercises
        </MuiLink>
        <MuiLink component={Link} to="/diaries" sx={{ mr: 2 }}>
          Diaries
        </MuiLink>
        <MuiLink component={Link} to="/forum" sx={{ mr: 2 }}>
          Forum
        </MuiLink>
        <MuiLink component={Link} to="/blog" sx={{ mr: 2 }}>
          Blog
        </MuiLink>
        <MuiLink component={Link} to="/social" sx={{ mr: 2 }}>
          Social
        </MuiLink>
        {isAdmin && (
          <MuiLink component={Link} to="/admin">
            Admin
          </MuiLink>
        )}
      </Box>
      <Paper sx={{ p: 2, maxWidth: 400 }}>
        {isLoading && <CircularProgress size={24} />}
        {error && (
          <Alert severity="error">
            Could not reach API. Is it running on http://localhost:5185?
          </Alert>
        )}
        {data && (
          <>
            <Typography variant="body1">{data.message}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(data.timestamp).toLocaleString()}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
}
