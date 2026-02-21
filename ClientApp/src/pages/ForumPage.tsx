import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  getForumPosts,
  createForumPost,
  type ForumPostListItemDto,
  type CreateForumPostRequest,
} from '../services/api';

export default function ForumPage() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateForumPostRequest>({ title: '', content: '' });
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['forumposts', search],
    queryFn: () => getForumPosts(search || undefined),
  });

  const createMutation = useMutation({
    mutationFn: createForumPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['forumposts'] });
      setOpen(false);
      setForm({ title: '', content: '' });
      navigate(`/forum/${data.id}`);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to create post'),
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
    createMutation.mutate(form);
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Forum</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search posts"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <Button variant="contained" onClick={() => setOpen(true)}>New post</Button>
      </Box>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>{error}</Alert>
      )}
      <Paper>
        {isLoading ? (
          <Box sx={{ p: 2 }}>Loading…</Box>
        ) : posts.length === 0 ? (
          <Box sx={{ p: 2 }}>No posts found.</Box>
        ) : (
          <List>
            {posts.map((p: ForumPostListItemDto) => (
              <ListItem key={p.id} component={Link} to={`/forum/${p.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemText
                  primary={p.title}
                  secondary={`${p.authorDisplayName ?? 'User'} · ${new Date(p.createdAtUtc).toLocaleString()} · ${p.commentCount} comment(s)`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New post</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              required
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Content"
              required
              multiline
              rows={4}
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createMutation.isPending}>Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
