import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import {
  getExercises,
  createExercise,
  deleteExercise,
  type ExerciseDto,
  type CreateExerciseRequest,
} from '../services/api';

export default function ExercisesPage() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateExerciseRequest>({ name: '', description: '', category: '' });
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ['exercises', search],
    queryFn: () => getExercises(search || undefined),
  });

  const createMutation = useMutation({
    mutationFn: createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      setOpen(false);
      setForm({ name: '', description: '', category: '' });
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExercise,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['exercises'] }),
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to delete'),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    createMutation.mutate({
      name: form.name.trim(),
      description: form.description?.trim() || null,
      category: form.category?.trim() || null,
    });
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button component={Link} to="/" sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant="h5" gutterBottom>
        Exercises
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add exercise
        </Button>
      </Box>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              {isAdmin && <TableCell align="right" width={60} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? (
                <TableRow><TableCell colSpan={isAdmin ? 4 : 3}>Loading…</TableCell></TableRow>
              )
              : exercises.map((e: ExerciseDto) => (
                <TableRow key={e.id}>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.category ?? '—'}</TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>{e.description ?? '—'}</TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="error"
                        onClick={() => deleteMutation.mutate(e.id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add exercise</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Category"
              placeholder="e.g. Cardio, Strength"
              value={form.category ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              value={form.description ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createMutation.isPending}>
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
