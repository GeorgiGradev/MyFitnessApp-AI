import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import {
  getArticle,
  updateArticle,
  deleteArticle,
  getArticleCategories,
  type UpdateArticleRequest,
} from '../services/api';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateArticleRequest>({ title: '', content: '', categoryId: '' });
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticle(id!),
    enabled: !!id && id !== 'new',
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['articlecategories'],
    queryFn: getArticleCategories,
  });

  const updateMutation = useMutation({
    mutationFn: (body: UpdateArticleRequest) => updateArticle(id!, body),
    onSuccess: (updated) => {
      queryClient.setQueryData(['article', id], updated);
      setEditOpen(false);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteArticle(id!),
    onSuccess: () => navigate('/blog'),
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to delete'),
  });

  const isAuthor = article && userId && article.authorUserId === userId;

  function openEdit() {
    if (article) {
      setEditForm({
        title: article.title,
        content: article.content,
        categoryId: article.categoryId ?? '',
      });
      setEditOpen(true);
    }
  }

  if (!id) {
    navigate('/blog');
    return null;
  }
  if (id === 'new') {
    navigate('/blog/new');
    return null;
  }
  if (isLoading || !article) {
    return (
      <Box sx={{ p: 3 }}>
        <Button onClick={() => navigate('/blog')} sx={{ mb: 2 }}>Back</Button>
        {isLoading ? <Typography>Loading…</Typography> : <Typography color="error">Article not found.</Typography>}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button onClick={() => navigate('/blog')} sx={{ mb: 2 }}>Back</Button>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>
      )}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="h5">{article.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {article.categoryName ?? 'Uncategorized'} · {article.authorDisplayName ?? 'Unknown'} · {new Date(article.createdAtUtc).toLocaleString()}
              {article.updatedAtUtc && ` (edited ${new Date(article.updatedAtUtc).toLocaleString()})`}
            </Typography>
          </Box>
          {isAuthor && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" onClick={openEdit}>Edit</Button>
              <Button size="small" color="error" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>Delete</Button>
            </Box>
          )}
        </Box>
        <Typography sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>{article.content}</Typography>
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editForm.title.trim() && editForm.content.trim()) {
              updateMutation.mutate({
                ...editForm,
                categoryId: editForm.categoryId || undefined,
              });
            }
          }}
        >
          <DialogTitle>Edit article</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              required
              value={editForm.title}
              onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={editForm.categoryId}
                label="Category"
                onChange={(e) => setEditForm((p) => ({ ...p, categoryId: e.target.value }))}
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
              rows={8}
              value={editForm.content}
              onChange={(e) => setEditForm((p) => ({ ...p, content: e.target.value }))}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={updateMutation.isPending}>Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
