import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiRequest } from '../config/api';
import { API_ENDPOINTS } from '../config/endpoints';

interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
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

  useEffect(() => {
    // Try to fetch user data on mount (cookie will be sent automatically)
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await apiRequest<User>(API_ENDPOINTS.user);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, role: string) => {
    try {
      const response = await apiRequest<{ 
        message: string;
        token: string;
      }>(API_ENDPOINTS.login, {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
        skipAuth: true,
      });

      // Store token in localStorage as backup (optional)
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
      }

      // Fetch user data after successful login
      await fetchUser();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiRequest(API_ENDPOINTS.logout, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setUser(null);
    }
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