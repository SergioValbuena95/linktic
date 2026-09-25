export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  password?: string;
  created_at?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expires_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
