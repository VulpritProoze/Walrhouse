import { useContext, createContext } from 'react';
import { type IUser } from '../types/user';

export interface AuthContextType {
  user: IUser | null;
  login: (user: IUser) => void;
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
