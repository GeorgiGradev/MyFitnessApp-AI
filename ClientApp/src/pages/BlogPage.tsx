import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { getArticles, getArticleCategories, type ArticleListItemDto } from '../services/api';

export default function BlogPage() {
  const [categoryId, setCategoryId] = useState<string>('');

  const { data: categories = [] } = useQuery({
    queryKey: ['articlecategories'],
    queryFn: getArticleCategories,
  });

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles', categoryId || undefined],
    queryFn: () => getArticles(categoryId || undefined, undefined),
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Typography variant="h5">Blog</Typography>
        <Button component={Link} to="/blog/new" variant="contained">
          New article
        </Button>
      </Box>
      <FormControl size="small" sx={{ minWidth: 200, mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={categoryId}
          label="Category"
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Paper>
        {isLoading ? (
          <Box sx={{ p: 2 }}>Loading…</Box>
        ) : articles.length === 0 ? (
          <Box sx={{ p: 2 }}>No articles found.</Box>
        ) : (
          <List>
            {articles.map((a: ArticleListItemDto) => (
              <ListItem key={a.id} component={Link} to={`/blog/${a.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemText
                  primary={a.title}
                  secondary={`${a.categoryName ?? 'Uncategorized'} · ${a.authorDisplayName ?? 'Unknown'} · ${new Date(a.createdAtUtc).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
