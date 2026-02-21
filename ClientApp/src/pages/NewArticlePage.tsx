import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { getArticleCategories, createArticle, type CreateArticleRequest } from '../services/api';

export default function NewArticlePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateArticleRequest>({ title: '', content: '', categoryId: '' });
  const [error, setError] = useState<string | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['articlecategories'],
    queryFn: getArticleCategories,
  });

  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      navigate(`/blog/${data.id}`);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create article'),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!form.content.trim()) {
      setError('Content is required');
      return;
    }
    createMutation.mutate({
      title: form.title.trim(),
      content: form.content.trim(),
      categoryId: form.categoryId || undefined,
    });
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button onClick={() => navigate('/blog')} sx={{ mb: 2 }}>Back</Button>
      <Typography variant="h5" gutterBottom>New article</Typography>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>
      )}
      <Paper sx={{ p: 2, maxWidth: 640 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            required
            fullWidth
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={form.categoryId ?? ''}
              label="Category"
              onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
            >
              <MenuItem value="">None</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Content"
            required
            multiline
            rows={12}
            fullWidth
            value={form.content}
            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button type="button" onClick={() => navigate('/blog')}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createMutation.isPending}>Create</Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
