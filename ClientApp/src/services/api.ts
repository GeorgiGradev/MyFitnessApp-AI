import type { AuthResponse } from '../types/auth';

const API_BASE = '/api';

const AUTH_STORAGE_KEY = 'myfitnessapp_auth';

function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { token?: string };
    return data?.token ?? null;
  } catch {
    return null;
  }
}

export function getAuthHeader(): string | null {
  const token = getStoredToken();
  return token ? `Bearer ${token}` : null;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${API_BASE}${path}`, { ...options, headers });
}

export interface HelloResponse {
  message: string;
  timestamp: string;
}

export async function getHello(): Promise<HelloResponse> {
  const res = await fetch(`${API_BASE}/hello`);
  if (!res.ok) throw new Error('Failed to fetch hello');
  return res.json();
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

async function parseErrorResponse(res: Response, fallback: string): Promise<string> {
  const text = await res.text();
  try {
    const err = JSON.parse(text) as { message?: string; detail?: string; title?: string };
    const msg = err.message ?? err.detail ?? err.title ?? fallback;
    // Use first line of detail for 500s if message is generic
    if (res.status === 500 && msg === fallback && err.detail && typeof err.detail === 'string') {
      const firstLine = err.detail.split('\n')[0]?.trim();
      if (firstLine) return firstLine;
    }
    return msg;
  } catch {
    return res.status === 500
      ? 'Server error (500). Check that the API and database are running, JWT secret is set, and migrations are applied. Open DevTools → Network to see the response.'
      : fallback;
  }
}

export async function login(body: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const message = await parseErrorResponse(res, 'Login failed');
    throw new Error(message);
  }
  return res.json();
}

export async function register(body: RegisterRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const message = await parseErrorResponse(res, 'Registration failed');
    throw new Error(message);
  }
  return res.json();
}

export async function getMe(): Promise<AuthResponse> {
  const res = await apiFetch('/auth/me');
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export interface ProfileDto {
  id: string;
  userId: string;
  displayName: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  heightCm: number | null;
  weightKg: number | null;
}

export interface UpdateProfileRequest {
  displayName?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  heightCm?: number | null;
  weightKg?: number | null;
}

export async function getProfile(): Promise<ProfileDto | null> {
  const res = await apiFetch('/me/profile');
  if (!res.ok) throw new Error('Failed to load profile');
  const data = await res.json();
  return data === null ? null : data;
}

export async function updateProfile(body: UpdateProfileRequest): Promise<ProfileDto> {
  const res = await apiFetch('/me/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export function saveAuthToStorage(auth: AuthResponse): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    token: auth.token,
    userId: auth.userId,
    email: auth.email,
    hasProfile: auth.hasProfile,
    isAdmin: auth.isAdmin,
  }));
}

export interface FoodDto {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export interface CreateFoodRequest {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export async function getFoods(search?: string): Promise<FoodDto[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await apiFetch(`/foods${q}`);
  if (!res.ok) throw new Error('Failed to load foods');
  return res.json();
}

export async function getFood(id: string): Promise<FoodDto> {
  const res = await apiFetch(`/foods/${id}`);
  if (!res.ok) throw new Error('Failed to load food');
  return res.json();
}

export async function createFood(body: CreateFoodRequest): Promise<FoodDto> {
  const res = await apiFetch('/foods', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to create food');
  return res.json();
}

export async function updateFood(id: string, body: CreateFoodRequest): Promise<FoodDto> {
  const res = await apiFetch(`/foods/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to update food');
  return res.json();
}

export async function deleteFood(id: string): Promise<void> {
  const res = await apiFetch(`/foods/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(res.status === 403 ? 'Admin only' : 'Failed to delete food');
}

export interface ExerciseDto {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
}

export interface CreateExerciseRequest {
  name: string;
  description?: string | null;
  category?: string | null;
}

export async function getExercises(search?: string): Promise<ExerciseDto[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await apiFetch(`/exercises${q}`);
  if (!res.ok) throw new Error('Failed to load exercises');
  return res.json();
}

export async function getExercise(id: string): Promise<ExerciseDto> {
  const res = await apiFetch(`/exercises/${id}`);
  if (!res.ok) throw new Error('Failed to load exercise');
  return res.json();
}

export async function createExercise(body: CreateExerciseRequest): Promise<ExerciseDto> {
  const res = await apiFetch('/exercises', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to create exercise');
  return res.json();
}

export async function updateExercise(id: string, body: CreateExerciseRequest): Promise<ExerciseDto> {
  const res = await apiFetch(`/exercises/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to update exercise');
  return res.json();
}

export async function deleteExercise(id: string): Promise<void> {
  const res = await apiFetch(`/exercises/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(res.status === 403 ? 'Admin only' : 'Failed to delete exercise');
}

export function clearAuthFromStorage(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// --- Eating plans ---
export interface EatingPlanDto {
  id: string;
  planDate: string;
  createdAtUtc: string;
  entries: EatingPlanEntryDto[];
}
export interface EatingPlanEntryDto {
  id: string;
  foodId: string;
  foodName?: string;
  quantityGrams: number;
}
export interface CreateEatingPlanRequest {
  planDate: string;
}
export interface CreateEatingPlanEntryRequest {
  foodId: string;
  quantityGrams: number;
}
export interface UpdateEatingPlanEntryRequest {
  quantityGrams: number;
}

export async function getEatingPlans(from?: string, to?: string): Promise<EatingPlanDto[]> {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const q = params.toString() ? `?${params}` : '';
  const res = await apiFetch(`/eatingplans${q}`);
  if (!res.ok) throw new Error('Failed to load eating plans');
  return res.json();
}
export async function getEatingPlanByDate(date: string): Promise<EatingPlanDto> {
  const res = await apiFetch(`/eatingplans/by-date/${encodeURIComponent(date)}`);
  if (!res.ok) throw new Error('Failed to load eating plan');
  return res.json();
}
export async function getEatingPlan(id: string): Promise<EatingPlanDto> {
  const res = await apiFetch(`/eatingplans/${id}`);
  if (!res.ok) throw new Error('Failed to load eating plan');
  return res.json();
}
export async function createEatingPlan(body: CreateEatingPlanRequest): Promise<EatingPlanDto> {
  const res = await apiFetch('/eatingplans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res, 'Failed to create eating plan'));
  return res.json();
}
export async function updateEatingPlan(id: string, body: CreateEatingPlanRequest): Promise<EatingPlanDto> {
  const res = await apiFetch(`/eatingplans/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res, 'Failed to update eating plan'));
  return res.json();
}
export async function deleteEatingPlan(id: string): Promise<void> {
  const res = await apiFetch(`/eatingplans/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete eating plan');
}
export async function addEatingPlanEntry(planId: string, body: CreateEatingPlanEntryRequest): Promise<EatingPlanEntryDto> {
  const res = await apiFetch(`/eatingplans/${planId}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res, 'Failed to add entry'));
  return res.json();
}
export async function updateEatingPlanEntry(planId: string, entryId: string, body: UpdateEatingPlanEntryRequest): Promise<EatingPlanEntryDto> {
  const res = await apiFetch(`/eatingplans/${planId}/entries/${entryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to update entry');
  return res.json();
}
export async function deleteEatingPlanEntry(planId: string, entryId: string): Promise<void> {
  const res = await apiFetch(`/eatingplans/${planId}/entries/${entryId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete entry');
}

// --- Workout plans ---
export interface WorkoutPlanDto {
  id: string;
  planDate: string;
  createdAtUtc: string;
  entries: WorkoutPlanEntryDto[];
}
export interface WorkoutPlanEntryDto {
  id: string;
  exerciseId: string;
  exerciseName?: string;
  durationMinutes?: number;
  sets?: number;
  reps?: number;
}
export interface CreateWorkoutPlanRequest {
  planDate: string;
}
export interface CreateWorkoutPlanEntryRequest {
  exerciseId: string;
  durationMinutes?: number;
  sets?: number;
  reps?: number;
}
export interface UpdateWorkoutPlanEntryRequest {
  durationMinutes?: number;
  sets?: number;
  reps?: number;
}

export async function getWorkoutPlans(from?: string, to?: string): Promise<WorkoutPlanDto[]> {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const q = params.toString() ? `?${params}` : '';
  const res = await apiFetch(`/workoutplans${q}`);
  if (!res.ok) throw new Error('Failed to load workout plans');
  return res.json();
}
export async function getWorkoutPlanByDate(date: string): Promise<WorkoutPlanDto> {
  const res = await apiFetch(`/workoutplans/by-date/${encodeURIComponent(date)}`);
  if (!res.ok) throw new Error('Failed to load workout plan');
  return res.json();
}
export async function getWorkoutPlan(id: string): Promise<WorkoutPlanDto> {
  const res = await apiFetch(`/workoutplans/${id}`);
  if (!res.ok) throw new Error('Failed to load workout plan');
  return res.json();
}
export async function createWorkoutPlan(body: CreateWorkoutPlanRequest): Promise<WorkoutPlanDto> {
  const res = await apiFetch('/workoutplans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res, 'Failed to create workout plan'));
  return res.json();
}
export async function updateWorkoutPlan(id: string, body: CreateWorkoutPlanRequest): Promise<WorkoutPlanDto> {
  const res = await apiFetch(`/workoutplans/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res, 'Failed to update workout plan'));
  return res.json();
}
export async function deleteWorkoutPlan(id: string): Promise<void> {
  const res = await apiFetch(`/workoutplans/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete workout plan');
}
export async function addWorkoutPlanEntry(planId: string, body: CreateWorkoutPlanEntryRequest): Promise<WorkoutPlanEntryDto> {
  const res = await apiFetch(`/workoutplans/${planId}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res, 'Failed to add entry'));
  return res.json();
}
export async function updateWorkoutPlanEntry(planId: string, entryId: string, body: UpdateWorkoutPlanEntryRequest): Promise<WorkoutPlanEntryDto> {
  const res = await apiFetch(`/workoutplans/${planId}/entries/${entryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to update entry');
  return res.json();
}
export async function deleteWorkoutPlanEntry(planId: string, entryId: string): Promise<void> {
  const res = await apiFetch(`/workoutplans/${planId}/entries/${entryId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete entry');
}

// --- Forum ---
export interface ForumPostDto {
  id: string;
  title: string;
  content: string;
  userId: string;
  authorDisplayName?: string;
  createdAtUtc: string;
  updatedAtUtc?: string;
  comments: CommentDto[];
}
export interface ForumPostListItemDto {
  id: string;
  title: string;
  userId: string;
  authorDisplayName?: string;
  createdAtUtc: string;
  commentCount: number;
}
export interface CommentDto {
  id: string;
  postId: string;
  userId: string;
  authorDisplayName?: string;
  content: string;
  createdAtUtc: string;
}
export interface CreateForumPostRequest {
  title: string;
  content: string;
}
export interface UpdateForumPostRequest {
  title: string;
  content: string;
}
export interface CreateCommentRequest {
  content: string;
}

export async function getForumPosts(search?: string): Promise<ForumPostListItemDto[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await apiFetch(`/forumposts${q}`);
  if (!res.ok) throw new Error('Failed to load forum posts');
  return res.json();
}
export async function getForumPost(id: string): Promise<ForumPostDto> {
  const res = await apiFetch(`/forumposts/${id}`);
  if (!res.ok) throw new Error('Failed to load post');
  return res.json();
}
export async function createForumPost(body: CreateForumPostRequest): Promise<ForumPostDto> {
  const res = await apiFetch('/forumposts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res, 'Failed to create post'));
  return res.json();
}
export async function updateForumPost(id: string, body: UpdateForumPostRequest): Promise<ForumPostDto> {
  const res = await apiFetch(`/forumposts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res, 'Failed to update post'));
  return res.json();
}
export async function deleteForumPost(id: string): Promise<void> {
  const res = await apiFetch(`/forumposts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete post');
}
export async function addComment(postId: string, body: CreateCommentRequest): Promise<CommentDto> {
  const res = await apiFetch(`/forumposts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res, 'Failed to add comment'));
  return res.json();
}
export async function deleteComment(postId: string, commentId: string): Promise<void> {
  const res = await apiFetch(`/forumposts/${postId}/comments/${commentId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(res.status === 403 ? 'You can only delete your own comments' : 'Failed to delete comment');
}

// --- Blog (article categories & articles) ---
export interface ArticleCategoryDto {
  id: string;
  name: string;
}
export interface ArticleDto {
  id: string;
  title: string;
  content: string;
  categoryId?: string;
  categoryName?: string;
  authorUserId?: string;
  authorDisplayName?: string;
  createdAtUtc: string;
  updatedAtUtc?: string;
}
export interface ArticleListItemDto {
  id: string;
  title: string;
  categoryId?: string;
  categoryName?: string;
  authorDisplayName?: string;
  createdAtUtc: string;
}
export interface CreateArticleCategoryRequest {
  name: string;
}
export interface CreateArticleRequest {
  title: string;
  content: string;
  categoryId?: string;
}
export interface UpdateArticleRequest {
  title: string;
  content: string;
  categoryId?: string;
}

export async function getArticleCategories(): Promise<ArticleCategoryDto[]> {
  const res = await apiFetch('/articlecategories');
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}
export async function getArticleCategory(id: string): Promise<ArticleCategoryDto> {
  const res = await apiFetch(`/articlecategories/${id}`);
  if (!res.ok) throw new Error('Failed to load category');
  return res.json();
}
export async function createArticleCategory(body: CreateArticleCategoryRequest): Promise<ArticleCategoryDto> {
  const res = await apiFetch('/articlecategories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res, 'Failed to create category'));
  return res.json();
}
export async function updateArticleCategory(id: string, body: CreateArticleCategoryRequest): Promise<ArticleCategoryDto> {
  const res = await apiFetch(`/articlecategories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res, 'Failed to update category'));
  return res.json();
}
export async function deleteArticleCategory(id: string): Promise<void> {
  const res = await apiFetch(`/articlecategories/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete category');
}
export async function getArticles(categoryId?: string, authorUserId?: string): Promise<ArticleListItemDto[]> {
  const params = new URLSearchParams();
  if (categoryId) params.set('categoryId', categoryId);
  if (authorUserId) params.set('authorUserId', authorUserId);
  const q = params.toString() ? `?${params}` : '';
  const res = await apiFetch(`/articles${q}`);
  if (!res.ok) throw new Error('Failed to load articles');
  return res.json();
}
export async function getArticle(id: string): Promise<ArticleDto> {
  const res = await apiFetch(`/articles/${id}`);
  if (!res.ok) throw new Error('Failed to load article');
  return res.json();
}
export async function createArticle(body: CreateArticleRequest): Promise<ArticleDto> {
  const res = await apiFetch('/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res, 'Failed to create article'));
  return res.json();
}
export async function updateArticle(id: string, body: UpdateArticleRequest): Promise<ArticleDto> {
  const res = await apiFetch(`/articles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await parseErrorResponse(res, 'Failed to update article'));
  return res.json();
}
export async function deleteArticle(id: string): Promise<void> {
  const res = await apiFetch(`/articles/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(res.status === 403 ? 'You can only delete your own articles' : 'Failed to delete article');
}
