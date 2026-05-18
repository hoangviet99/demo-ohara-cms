export interface UserInfoByToken {
  id: number;
  username: string;
  email: string;
  full_name: string;
  roles: string[];
}

export interface AuthContextType {
  user: UserInfoByToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: UserInfoByToken) => void;
  logout: () => void;
}
