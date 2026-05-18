import axiosClient from "../axiosClient";
import type { User } from "../../types/auth";
import type { UserInfoByTokenResponse } from "../../types/login";

/**
 * Fetch authenticated user information using JWT token from Authorization header
 */
export const getUserInfoByToken = async (): Promise<UserInfoByTokenResponse> => {
  const response = await axiosClient.get<any, UserInfoByTokenResponse>("/user-info-by-token");
  return response;
};
