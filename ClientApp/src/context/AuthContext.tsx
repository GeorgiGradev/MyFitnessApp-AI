import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthResponse } from '../types/auth';
import {
  clearAuthFromStorage,
  getMe,
  saveAuthToStorage,
} from '../services/api';

const AUTH_STORAGE_KEY = 'myfitnessapp_auth';

interface StoredAuth {
  token: string;
  userId: string;
  email: string;
  hasProfile: boolean;
  isAdmin: boolean;
}

interface AuthContextValue {
  token: string | null;
  userId: string | null;
  email: string | null;
  hasProfile: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (auth: AuthResponse) => void;
  logout: () => void;
  setHasProfile: (value: boolean) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStored(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [hasProfile, setHasProfileState] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshAuth = useCallback(async () => {
    const stored = loadStored();
    if (!stored?.token) {
      setToken(null);
      setUserId(null);
      setEmail(null);
      setHasProfileState(false);
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }
    try {
      const me = await getMe();
      setToken(me.token);
      setUserId(me.userId);
      setEmail(me.email);
      setHasProfileState(me.hasProfile);
      setIsAdmin(me.isAdmin);
      saveAuthToStorage(me);
    } catch {
      clearAuthFromStorage();
      setToken(null);
      setUserId(null);
      setEmail(null);
      setHasProfileState(false);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    const stored = loadStored();
    if (!stored?.token) {
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }
    setToken(stored.token);
    setUserId(stored.userId);
    setEmail(stored.email);
    setHasProfileState(stored.hasProfile);
    setIsAdmin(stored.isAdmin ?? false);
    getMe()
      .then((me) => {
        setToken(me.token);
        setUserId(me.userId);
        setEmail(me.email);
        setHasProfileState(me.hasProfile);
        setIsAdmin(me.isAdmin);
        saveAuthToStorage(me);
      })
      .catch(() => {
        clearAuthFromStorage();
        setToken(null);
        setUserId(null);
        setEmail(null);
        setHasProfileState(false);
        setIsAdmin(false);
      })
      .finally(() => {
        setIsLoading(false);
        setIsInitialized(true);
      });
  }, []);

  const login = useCallback((auth: AuthResponse) => {
    saveAuthToStorage(auth);
    setToken(auth.token);
    setUserId(auth.userId);
    setEmail(auth.email);
    setHasProfileState(auth.hasProfile);
    setIsAdmin(auth.isAdmin);
  }, []);

  const logout = useCallback(() => {
    clearAuthFromStorage();
    setToken(null);
    setUserId(null);
    setEmail(null);
    setHasProfileState(false);
    setIsAdmin(false);
  }, []);

  const setHasProfile = useCallback((value: boolean) => {
    setHasProfileState(value);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      userId,
      email,
      hasProfile,
      isAdmin,
      isLoading,
      isInitialized,
      login,
      logout,
      setHasProfile,
      refreshAuth,
    }),
    [
      token,
      userId,
      email,
      hasProfile,
      isAdmin,
      isLoading,
      isInitialized,
      login,
      logout,
      setHasProfile,
      refreshAuth,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
