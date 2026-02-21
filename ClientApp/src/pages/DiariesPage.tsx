import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
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
import {
  getEatingPlanByDate,
  createEatingPlan,
  deleteEatingPlan,
  addEatingPlanEntry,
  deleteEatingPlanEntry,
  getWorkoutPlanByDate,
  createWorkoutPlan,
  deleteWorkoutPlan,
  addWorkoutPlanEntry,
  deleteWorkoutPlanEntry,
  getFoods,
  getExercises,
  type CreateEatingPlanEntryRequest,
  type CreateWorkoutPlanEntryRequest,
} from '../services/api';

function toDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function DiariesPage() {
  const [tab, setTab] = useState(0);
  const [date, setDate] = useState(() => toDateOnly(new Date()));
  const [addEatingOpen, setAddEatingOpen] = useState(false);
  const [addWorkoutOpen, setAddWorkoutOpen] = useState(false);
  const [eatingEntryForm, setEatingEntryForm] = useState<CreateEatingPlanEntryRequest>({ foodId: '', quantityGrams: 100 });
  const [workoutEntryForm, setWorkoutEntryForm] = useState<CreateWorkoutPlanEntryRequest>({ exerciseId: '', sets: undefined, reps: undefined, durationMinutes: undefined });
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const dateIso = useMemo(() => `${date}T00:00:00.000Z`, [date]);

  const eatingQuery = useQuery({
    queryKey: ['eatingplan', date],
    queryFn: async () => {
      try {
        return await getEatingPlanByDate(dateIso);
      } catch {
        return null;
      }
    },
  });
  const eatingPlanData = eatingQuery.data === undefined ? undefined : eatingQuery.data;

  const workoutQuery = useQuery({
    queryKey: ['workoutplan', date],
    queryFn: async () => {
      try {
        return await getWorkoutPlanByDate(dateIso);
      } catch {
        return null;
      }
    },
  });
  const workoutPlanData = workoutQuery.data === undefined ? undefined : workoutQuery.data;

  const { data: foods = [] } = useQuery({ queryKey: ['foods'], queryFn: () => getFoods() });
  const { data: exercises = [] } = useQuery({ queryKey: ['exercises'], queryFn: () => getExercises() });

  const createEatingMutation = useMutation({
    mutationFn: () => createEatingPlan({ planDate: dateIso }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eatingplan', date] });
      setError(null);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create plan'),
  });

  const createWorkoutMutation = useMutation({
    mutationFn: () => createWorkoutPlan({ planDate: dateIso }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutplan', date] });
      setError(null);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create plan'),
  });

  const addEatingEntryMutation = useMutation({
    mutationFn: (body: CreateEatingPlanEntryRequest) => addEatingPlanEntry(eatingPlanData!.id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eatingplan', date] });
      setAddEatingOpen(false);
      setEatingEntryForm({ foodId: '', quantityGrams: 100 });
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to add entry'),
  });

  const addWorkoutEntryMutation = useMutation({
    mutationFn: (body: CreateWorkoutPlanEntryRequest) => addWorkoutPlanEntry(workoutPlanData!.id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutplan', date] });
      setAddWorkoutOpen(false);
      setWorkoutEntryForm({ exerciseId: '', sets: undefined, reps: undefined, durationMinutes: undefined });
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to add entry'),
  });

  const deleteEatingEntryMutation = useMutation({
    mutationFn: ({ planId, entryId }: { planId: string; entryId: string }) => deleteEatingPlanEntry(planId, entryId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['eatingplan', date] }),
  });

  const deleteWorkoutEntryMutation = useMutation({
    mutationFn: ({ planId, entryId }: { planId: string; entryId: string }) => deleteWorkoutPlanEntry(planId, entryId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workoutplan', date] }),
  });

  const deleteEatingPlanMutation = useMutation({
    mutationFn: deleteEatingPlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['eatingplan', date] }),
  });

  const deleteWorkoutPlanMutation = useMutation({
    mutationFn: deleteWorkoutPlan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workoutplan', date] }),
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Diaries
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          type="date"
          size="small"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mr: 2 }}
        />
      </Box>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Eating" />
        <Tab label="Workout" />
      </Tabs>

      {tab === 0 && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Eating plan</Typography>
            {eatingQuery.isLoading && <Typography color="text.secondary">Loading…</Typography>}
            {!eatingQuery.isLoading && !eatingPlanData && (
              <Button variant="contained" onClick={() => createEatingMutation.mutate()} disabled={createEatingMutation.isPending}>
                Create plan for this date
              </Button>
            )}
            {eatingPlanData && (
              <Button variant="outlined" onClick={() => setAddEatingOpen(true)}>
                Add entry
              </Button>
            )}
          </Box>
          {eatingPlanData && (
            <>
              {eatingPlanData.entries.length === 0 ? (
                <Typography color="text.secondary">No entries. Add a food entry.</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Food</TableCell>
                        <TableCell align="right">Quantity (g)</TableCell>
                        <TableCell width={60} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {eatingPlanData.entries.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell>{e.foodName ?? e.foodId}</TableCell>
                          <TableCell align="right">{e.quantityGrams}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => deleteEatingEntryMutation.mutate({ planId: eatingPlanData.id, entryId: e.id })}
                              disabled={deleteEatingEntryMutation.isPending}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <Button
                size="small"
                color="error"
                sx={{ mt: 2 }}
                onClick={() => deleteEatingPlanMutation.mutate(eatingPlanData.id)}
                disabled={deleteEatingPlanMutation.isPending}
              >
                Delete entire plan
              </Button>
            </>
          )}
        </Paper>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Workout plan</Typography>
            {workoutQuery.isLoading && <Typography color="text.secondary">Loading…</Typography>}
            {!workoutQuery.isLoading && !workoutPlanData && (
              <Button variant="contained" onClick={() => createWorkoutMutation.mutate()} disabled={createWorkoutMutation.isPending}>
                Create plan for this date
              </Button>
            )}
            {workoutPlanData && (
              <Button variant="outlined" onClick={() => setAddWorkoutOpen(true)}>
                Add entry
              </Button>
            )}
          </Box>
          {workoutPlanData && (
            <>
              {workoutPlanData.entries.length === 0 ? (
                <Typography color="text.secondary">No entries. Add an exercise entry.</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Exercise</TableCell>
                        <TableCell align="right">Sets</TableCell>
                        <TableCell align="right">Reps</TableCell>
                        <TableCell align="right">Duration (min)</TableCell>
                        <TableCell width={60} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {workoutPlanData.entries.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell>{e.exerciseName ?? e.exerciseId}</TableCell>
                          <TableCell align="right">{e.sets ?? '—'}</TableCell>
                          <TableCell align="right">{e.reps ?? '—'}</TableCell>
                          <TableCell align="right">{e.durationMinutes ?? '—'}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => deleteWorkoutEntryMutation.mutate({ planId: workoutPlanData.id, entryId: e.id })}
                              disabled={deleteWorkoutEntryMutation.isPending}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <Button
                size="small"
                color="error"
                sx={{ mt: 2 }}
                onClick={() => deleteWorkoutPlanMutation.mutate(workoutPlanData.id)}
                disabled={deleteWorkoutPlanMutation.isPending}
              >
                Delete entire plan
              </Button>
            </>
          )}
        </Paper>
      )}

      <Dialog open={addEatingOpen} onClose={() => setAddEatingOpen(false)} maxWidth="xs" fullWidth>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!eatingEntryForm.foodId || eatingEntryForm.quantityGrams <= 0) return;
            addEatingEntryMutation.mutate({ ...eatingEntryForm, foodId: eatingEntryForm.foodId, quantityGrams: eatingEntryForm.quantityGrams });
          }}
        >
          <DialogTitle>Add food entry</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              select
              SelectProps={{ native: true }}
              label="Food"
              value={eatingEntryForm.foodId}
              onChange={(e) => setEatingEntryForm((p) => ({ ...p, foodId: e.target.value }))}
              required
              fullWidth
            >
              <option value="">Select food</option>
              {foods.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </TextField>
            <TextField
              type="number"
              label="Quantity (g)"
              value={eatingEntryForm.quantityGrams || ''}
              onChange={(e) => setEatingEntryForm((p) => ({ ...p, quantityGrams: Number(e.target.value) || 0 }))}
              inputProps={{ min: 0.01, step: 1 }}
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddEatingOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={addEatingEntryMutation.isPending || !eatingEntryForm.foodId}>Add</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={addWorkoutOpen} onClose={() => setAddWorkoutOpen(false)} maxWidth="xs" fullWidth>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!workoutEntryForm.exerciseId) return;
            addWorkoutEntryMutation.mutate({
              exerciseId: workoutEntryForm.exerciseId,
              sets: workoutEntryForm.sets ?? undefined,
              reps: workoutEntryForm.reps ?? undefined,
              durationMinutes: workoutEntryForm.durationMinutes ?? undefined,
            });
          }}
        >
          <DialogTitle>Add exercise entry</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              select
              SelectProps={{ native: true }}
              label="Exercise"
              value={workoutEntryForm.exerciseId}
              onChange={(e) => setWorkoutEntryForm((p) => ({ ...p, exerciseId: e.target.value }))}
              required
              fullWidth
            >
              <option value="">Select exercise</option>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </TextField>
            <TextField
              type="number"
              label="Sets"
              value={workoutEntryForm.sets ?? ''}
              onChange={(e) => setWorkoutEntryForm((p) => ({ ...p, sets: e.target.value === '' ? undefined : Number(e.target.value) }))}
              inputProps={{ min: 0 }}
              fullWidth
            />
            <TextField
              type="number"
              label="Reps"
              value={workoutEntryForm.reps ?? ''}
              onChange={(e) => setWorkoutEntryForm((p) => ({ ...p, reps: e.target.value === '' ? undefined : Number(e.target.value) }))}
              inputProps={{ min: 0 }}
              fullWidth
            />
            <TextField
              type="number"
              label="Duration (minutes)"
              value={workoutEntryForm.durationMinutes ?? ''}
              onChange={(e) => setWorkoutEntryForm((p) => ({ ...p, durationMinutes: e.target.value === '' ? undefined : Number(e.target.value) }))}
              inputProps={{ min: 0 }}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddWorkoutOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={addWorkoutEntryMutation.isPending || !workoutEntryForm.exerciseId}>Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
