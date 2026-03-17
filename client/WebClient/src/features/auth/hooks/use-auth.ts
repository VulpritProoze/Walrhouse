import { useContext, createContext } from 'react';
import type { Roles } from '../types/roles';

export interface User {
  id: string;
  username: string;
  email?: string;
  role: (typeof Roles)[keyof typeof Roles];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
