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
    return err.message ?? err.detail ?? err.title ?? fallback;
  } catch {
    return res.status === 500 ? 'Server error. Check that the API and database are running and JWT secret is set.' : fallback;
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
