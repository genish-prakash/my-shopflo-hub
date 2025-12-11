import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { shopfloAuthApi, UserData } from '@/services/authApi';

interface UserContextType {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    const accessToken = shopfloAuthApi.getAuthToken();

    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userData = await shopfloAuthApi.getUserData(accessToken);
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      // If token is invalid, clear auth
      if (err instanceof Error && err.message.includes('401')) {
        shopfloAuthApi.clearAuth();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const clearUser = () => {
    setUser(null);
    setError(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, error, refreshUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
