export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  hasProfile: boolean;
}

export interface AuthState {
  token: string | null;
  userId: string | null;
  email: string | null;
  hasProfile: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}
