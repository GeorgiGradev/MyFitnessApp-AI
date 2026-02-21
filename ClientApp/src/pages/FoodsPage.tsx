import { useState } from 'react';
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
  getFoods,
  createFood,
  deleteFood,
  type FoodDto,
  type CreateFoodRequest,
} from '../services/api';

export default function FoodsPage() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateFoodRequest>({
    name: '',
    caloriesPer100g: 0,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const { data: foods = [], isLoading } = useQuery({
    queryKey: ['foods', search],
    queryFn: () => getFoods(search || undefined),
  });

  const createMutation = useMutation({
    mutationFn: createFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      setOpen(false);
      setForm({ name: '', caloriesPer100g: 0, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0 });
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFood,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['foods'] }),
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to delete'),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    createMutation.mutate(form);
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Foods
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
          Add food
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
              <TableCell align="right">Cal/100g</TableCell>
              <TableCell align="right">Protein</TableCell>
              <TableCell align="right">Carbs</TableCell>
              <TableCell align="right">Fat</TableCell>
              {isAdmin && <TableCell align="right" width={80} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? (
                <TableRow><TableCell colSpan={isAdmin ? 6 : 5}>Loading…</TableCell></TableRow>
              )
              : foods.map((f: FoodDto) => (
                <TableRow key={f.id}>
                  <TableCell>{f.name}</TableCell>
                  <TableCell align="right">{f.caloriesPer100g}</TableCell>
                  <TableCell align="right">{f.proteinPer100g}</TableCell>
                  <TableCell align="right">{f.carbsPer100g}</TableCell>
                  <TableCell align="right">{f.fatPer100g}</TableCell>
                  {isAdmin && (
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="error"
                        onClick={() => deleteMutation.mutate(f.id)}
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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add food</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              fullWidth
            />
            <TextField
              type="number"
              label="Calories per 100g"
              value={form.caloriesPer100g || ''}
              onChange={(e) => setForm((p) => ({ ...p, caloriesPer100g: Number(e.target.value) || 0 }))}
              inputProps={{ min: 0, step: 0.1 }}
              fullWidth
            />
            <TextField
              type="number"
              label="Protein per 100g (g)"
              value={form.proteinPer100g || ''}
              onChange={(e) => setForm((p) => ({ ...p, proteinPer100g: Number(e.target.value) || 0 }))}
              inputProps={{ min: 0, step: 0.1 }}
              fullWidth
            />
            <TextField
              type="number"
              label="Carbs per 100g (g)"
              value={form.carbsPer100g || ''}
              onChange={(e) => setForm((p) => ({ ...p, carbsPer100g: Number(e.target.value) || 0 }))}
              inputProps={{ min: 0, step: 0.1 }}
              fullWidth
            />
            <TextField
              type="number"
              label="Fat per 100g (g)"
              value={form.fatPer100g || ''}
              onChange={(e) => setForm((p) => ({ ...p, fatPer100g: Number(e.target.value) || 0 }))}
              inputProps={{ min: 0, step: 0.1 }}
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
