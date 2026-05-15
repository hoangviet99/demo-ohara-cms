export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  roles: string[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}
