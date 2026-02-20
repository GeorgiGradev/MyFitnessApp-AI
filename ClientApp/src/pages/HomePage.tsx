import { useQuery } from '@tanstack/react-query';
import { Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import { getHello } from '../services/api';

export default function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['hello'],
    queryFn: getHello,
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        MyFitnessApp
      </Typography>
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
