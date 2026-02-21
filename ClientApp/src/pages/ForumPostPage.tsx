import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import {
  getForumPost,
  updateForumPost,
  deleteForumPost,
  addComment,
  deleteComment,
  type ForumPostDto,
  type UpdateForumPostRequest,
  type CreateCommentRequest,
} from '../services/api';

export default function ForumPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateForumPostRequest>({ title: '', content: '' });
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery({
    queryKey: ['forumpost', id],
    queryFn: () => getForumPost(id!),
    enabled: !!id,
  });

  const updatePostMutation = useMutation({
    mutationFn: (body: UpdateForumPostRequest) => updateForumPost(id!, body),
    onSuccess: (updated) => {
      queryClient.setQueryData(['forumpost', id], updated);
      setEditOpen(false);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to update'),
  });

  const deletePostMutation = useMutation({
    mutationFn: () => deleteForumPost(id!),
    onSuccess: () => navigate('/forum'),
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to delete'),
  });

  const addCommentMutation = useMutation({
    mutationFn: (body: CreateCommentRequest) => addComment(id!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumpost', id] });
      setCommentText('');
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to add comment'),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(id!, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forumpost', id] });
      setDeleteCommentId(null);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to delete comment'),
  });

  const isAuthor = post && userId && post.userId === userId;

  function openEdit() {
    if (post) {
      setEditForm({ title: post.title, content: post.content });
      setEditOpen(true);
    }
  }

  if (!id) {
    navigate('/forum');
    return null;
  }
  if (isLoading || !post) {
    return (
      <Box sx={{ p: 3 }}>
        <Button onClick={() => navigate('/forum')} sx={{ mb: 2 }}>Back</Button>
        {isLoading ? <Typography>Loading…</Typography> : <Typography color="error">Post not found.</Typography>}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/forum')} sx={{ mb: 2 }}>
        Back
      </Button>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="h6">{post.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {post.authorDisplayName ?? 'User'} · {new Date(post.createdAtUtc).toLocaleString()}
              {post.updatedAtUtc && ` (edited ${new Date(post.updatedAtUtc).toLocaleString()})`}
            </Typography>
          </Box>
          {isAuthor && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" onClick={openEdit}>
                Edit
              </Button>
              <Button size="small" color="error" onClick={() => deletePostMutation.mutate()} disabled={deletePostMutation.isPending}>
                Delete
              </Button>
            </Box>
          )}
        </Box>
        <Typography sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>{post.content}</Typography>
      </Paper>

      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
        Comments
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Write a comment…"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          fullWidth
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (commentText.trim()) addCommentMutation.mutate({ content: commentText.trim() });
            }
          }}
        />
        <Button
          variant="contained"
          onClick={() => commentText.trim() && addCommentMutation.mutate({ content: commentText.trim() })}
          disabled={!commentText.trim() || addCommentMutation.isPending}
        >
          Add
        </Button>
      </Box>
      {post.comments && post.comments.length > 0 ? (
        post.comments.map((c) => (
          <Paper key={c.id} sx={{ p: 1.5, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {c.authorDisplayName ?? 'User'} · {new Date(c.createdAtUtc).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {c.content}
              </Typography>
            </Box>
            {userId === c.userId && (
              <Button
                size="small"
                color="error"
                onClick={() => setDeleteCommentId(c.id)}
                disabled={deleteCommentMutation.isPending}
              >
                Delete
              </Button>
            )}
          </Paper>
        ))
      ) : (
        <Typography color="text.secondary">No comments yet.</Typography>
      )}

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editForm.title.trim() && editForm.content.trim()) updatePostMutation.mutate(editForm);
          }}
        >
          <DialogTitle>Edit post</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              required
              value={editForm.title}
              onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Content"
              required
              multiline
              rows={4}
              value={editForm.content}
              onChange={(e) => setEditForm((p) => ({ ...p, content: e.target.value }))}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={updatePostMutation.isPending}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={!!deleteCommentId} onClose={() => setDeleteCommentId(null)}>
        <DialogTitle>Delete comment?</DialogTitle>
        <DialogContent>This cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCommentId(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteCommentId && deleteCommentMutation.mutate(deleteCommentId)}
            disabled={deleteCommentMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
