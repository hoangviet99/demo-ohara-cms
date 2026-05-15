import axiosClient from "../axiosClient";
import type { User } from "../../types/auth";

interface MeResponse {
  message: string;
  data: {
    user_id: number;
    username: string;
    email: string;
    full_name: string;
    roles: string[];
  };
}

export const getMe = async (): Promise<User> => {
  const response = await axiosClient.get<any, MeResponse>("/me");
  const data = response.data;
  return {
    id: data.user_id,
    username: data.username,
    email: data.email,
    full_name: data.full_name,
    roles: data.roles,
  };
};
