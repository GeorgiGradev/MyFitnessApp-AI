import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  getFollowUsers,
  getFollowing,
  getFollowers,
  followUser,
  unfollowUser,
  type UserListItemDto,
  type FollowerDto,
} from '../services/api';

export default function SocialPage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['follows', 'users', search],
    queryFn: () => getFollowUsers(search || undefined),
  });

  const { data: following = [], isLoading: followingLoading } = useQuery({
    queryKey: ['follows', 'following'],
    queryFn: getFollowing,
  });

  const { data: followers = [], isLoading: followersLoading } = useQuery({
    queryKey: ['follows', 'followers'],
    queryFn: getFollowers,
  });

  const followMutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows'] });
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed'),
  });

  const unfollowMutation = useMutation({
    mutationFn: unfollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows'] });
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed'),
  });

  return (
    <Box sx={{ p: 3 }}>
      <Button component={Link} to="/" sx={{ mb: 2 }}>Back</Button>
      <Typography variant="h5" gutterBottom>
        Social
      </Typography>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Discover" />
        <Tab label="Following" />
        <Tab label="Followers" />
      </Tabs>

      {tab === 0 && (
        <Paper sx={{ p: 2 }}>
          <TextField
            size="small"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2, minWidth: 280 }}
          />
          {usersLoading ? (
            <Typography color="text.secondary">Loading…</Typography>
          ) : users.length === 0 ? (
            <Typography color="text.secondary">No users found.</Typography>
          ) : (
            <List>
              {users.map((u: UserListItemDto) => (
                <ListItem
                  key={u.id}
                  secondaryAction={
                    u.isFollowing ? (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => unfollowMutation.mutate(u.id)}
                        disabled={unfollowMutation.isPending}
                      >
                        Unfollow
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => followMutation.mutate(u.id)}
                        disabled={followMutation.isPending}
                      >
                        Follow
                      </Button>
                    )
                  }
                >
                  <ListItemText primary={u.displayName} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 2 }}>
          {followingLoading ? (
            <Typography color="text.secondary">Loading…</Typography>
          ) : following.length === 0 ? (
            <Typography color="text.secondary">You are not following anyone yet. Use Discover to find users.</Typography>
          ) : (
            <List>
              {following.map((f: FollowerDto) => (
                <ListItem
                  key={f.userId}
                  secondaryAction={
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => unfollowMutation.mutate(f.userId)}
                      disabled={unfollowMutation.isPending}
                    >
                      Unfollow
                    </Button>
                  }
                >
                  <ListItemText primary={f.displayName} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}

      {tab === 2 && (
        <Paper sx={{ p: 2 }}>
          {followersLoading ? (
            <Typography color="text.secondary">Loading…</Typography>
          ) : followers.length === 0 ? (
            <Typography color="text.secondary">No followers yet.</Typography>
          ) : (
            <List>
              {followers.map((f: FollowerDto) => (
                <ListItem key={f.userId}>
                  <ListItemText primary={f.displayName} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
}
