import axiosClient from "../axiosClient";

export const login = async (credentials: Record<string, string>) => {
  return axiosClient.post("/auth/login", credentials);
};
