import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Typography, CircularProgress, Alert, Paper, Button, Link as MuiLink } from '@mui/material';
import { getHello } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { email, logout } = useAuth();
  const { data, isLoading, error } = useQuery({
    queryKey: ['hello'],
    queryFn: getHello,
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Typography variant="h4">MyFitnessApp</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
          <Button size="small" variant="outlined" onClick={() => logout()}>
            Log out
          </Button>
        </Box>
      </Box>
      <Box sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/foods" sx={{ mr: 2 }}>
          Foods
        </MuiLink>
        <MuiLink component={Link} to="/exercises">
          Exercises
        </MuiLink>
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
