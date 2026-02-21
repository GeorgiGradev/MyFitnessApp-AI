import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Chip,
} from '@mui/material';
import { getAdminUsers, setUserBanned, type AdminUserDto } from '../services/api';

export default function AdminPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: getAdminUsers,
  });

  const banMutation = useMutation({
    mutationFn: ({ userId, isBanned }: { userId: string; isBanned: boolean }) => setUserBanned(userId, isBanned),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed'),
  });

  return (
    <Box sx={{ p: 3 }}>
      <Button component={Link} to="/" sx={{ mb: 2 }}>Back</Button>
      <Typography variant="h5" gutterBottom>
        Admin – Users
      </Typography>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Display name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>Loading…</TableCell>
                </TableRow>
              ) : (
                users.map((u: AdminUserDto) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.displayName ?? '—'}</TableCell>
                    <TableCell>
                      {u.isBanned && <Chip label="Banned" color="error" size="small" sx={{ mr: 1 }} />}
                      {u.isAdmin && <Chip label="Admin" color="primary" size="small" />}
                    </TableCell>
                    <TableCell align="right">
                      {u.isBanned ? (
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          onClick={() => banMutation.mutate({ userId: u.id, isBanned: false })}
                          disabled={banMutation.isPending}
                        >
                          Unban
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => banMutation.mutate({ userId: u.id, isBanned: true })}
                          disabled={banMutation.isPending}
                        >
                          Ban
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Foods, Exercises, Blog and Forum pages also allow admins to delete any item.
      </Typography>
    </Box>
  );
}
