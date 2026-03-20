import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from '../hooks/use-auth';
import { type IUser } from '../types/user';
import { getAuthenticatedUserInfo } from '../api/auth.service';

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
        setUser({ id: data.id, email: data.email, roles: data.roles });
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

  // Called on logout — clears local state. The server endpoint should also
  // clear the HttpOnly cookie (POST api/Users/logout).
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
