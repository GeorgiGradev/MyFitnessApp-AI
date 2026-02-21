export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  hasProfile: boolean;
  isAdmin: boolean;
}

export interface AuthState {
  token: string | null;
  userId: string | null;
  email: string | null;
  hasProfile: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}
