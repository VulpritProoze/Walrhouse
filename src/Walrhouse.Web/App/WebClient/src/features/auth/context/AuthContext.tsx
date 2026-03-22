import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from '../hooks/use-auth';
import { type IUser } from '../types/user';
import { getAuthenticatedUserInfo, logout as apiLogout } from '../api/auth.service';
import { logger } from '@/lib/utils/logger';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: try to rehydrate the session by asking the server who we are.
  // If the HttpOnly cookie is still valid, the server returns 200 + user info.
  // If expired/missing, it returns 401 — we just stay logged out silently.
  useEffect(() => {
    const rehydrate = async () => {
      try {
        const { data } = await getAuthenticatedUserInfo();
        setUser({
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          roles: data.roles,
        });
      } catch {
        // 401 = no valid session — not an error, just stay logged out
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    rehydrate();
  }, []);

  // Called after a successful login — the server already set the cookie,
  // we just store the user info in React state for the UI.
  const login = (newUser: IUser) => {
    setUser(newUser);
  };

  // Called on logout — clears both server-side cookie and local state.
  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      // Even if the server call fails, we must clear local state to prevent a locked UI
      logger.error('Server-side logout failed during session clearance:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
