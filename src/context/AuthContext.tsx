import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from "react";
import type { User, AuthContextType } from "../types/auth";
import { getMe } from "../api/auth/me";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          // Verify token and fetch the latest user data
          const userData = await getMe();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to verify token on load:", error);
          // Token is likely invalid or expired
          localStorage.removeItem("access_token");
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("access_token", token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
