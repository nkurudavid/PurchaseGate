import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiRequest } from '../config/api';
import { API_ENDPOINTS } from '../config/endpoints';
import { useToast } from './ToastContext';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  is_active?: boolean;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get toast functions
  const toast = useToast();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await apiRequest<User>(API_ENDPOINTS.user);
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, role: string) => {
    const response = await apiRequest<{
      message: string;
      token: string;
    }>(API_ENDPOINTS.login, {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
      skipAuth: true,
    });

    try {
      localStorage.setItem('token', response.token);
    } catch (e) {
      // Ignore
    }

    await fetchUser();
  };

  const logout = async () => {
    try {
      await apiRequest(API_ENDPOINTS.logout, { method: 'POST' });
      toast.info('Logged out successfully.');
    } catch (error) {
      // Ignore
    }

    try {
      localStorage.removeItem('token');
    } catch (e) {
      // Ignore
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}