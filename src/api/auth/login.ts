import axiosClient from "../axiosClient";

export const login = async (credentials: any) => {
  return axiosClient.post("/auth/login", credentials);
};
