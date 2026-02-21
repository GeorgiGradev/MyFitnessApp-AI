import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/api';

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { hasProfile, setHasProfile, refreshAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasProfile) {
      setLoading(false);
      return;
    }
    getProfile()
      .then((p) => {
        if (p) {
          setDisplayName(p.displayName ?? '');
          setGender(p.gender ?? '');
          setDateOfBirth(p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '');
          setHeightCm(p.heightCm != null ? String(p.heightCm) : '');
          setWeightKg(p.weightKg != null ? String(p.weightKg) : '');
        }
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [hasProfile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const name = displayName.trim();
    if (!name) {
      setError('Display name is required');
      return;
    }
    setSubmitting(true);
    try {
      await updateProfile({
        displayName: name,
        gender: gender.trim() || null,
        dateOfBirth: dateOfBirth ? `${dateOfBirth}T00:00:00Z` : null,
        heightCm: heightCm ? Number(heightCm) : null,
        weightKg: weightKg ? Number(weightKg) : null,
      });
      setHasProfile(true);
      await refreshAuth();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 4, p: 2 }}>
      <Button component={Link} to="/" sx={{ mb: 2 }}>
        Back
      </Button>
      <Typography variant="h5" gutterBottom>
        Complete your profile
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Set a display name and optional details to continue.
      </Typography>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Gender"
          select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          fullWidth
        >
          <MenuItem value="">—</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <TextField
          label="Date of birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Height (cm)"
          type="number"
          value={heightCm}
          onChange={(e) => setHeightCm(e.target.value)}
          inputProps={{ min: 0, step: 0.1 }}
          fullWidth
        />
        <TextField
          label="Weight (kg)"
          type="number"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
          inputProps={{ min: 0, step: 0.1 }}
          fullWidth
        />
        <Button type="submit" variant="contained" disabled={submitting} fullWidth>
          {submitting ? 'Saving…' : 'Save and continue'}
        </Button>
      </Paper>
    </Box>
  );
}
