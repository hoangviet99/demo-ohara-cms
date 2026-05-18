export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    id: number;
    username: string;
    email: string;
    full_name: string;
    roles: string[];
    access_token: string;
  };
}

export interface UserInfoByTokenResponse {
  message: string;
  data: UserInfoByToken;
}
