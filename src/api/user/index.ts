import axiosClient from '../axiosClient';
import type { User, PaginatedData, ApiResponse } from '../../types/user';

export const userApi = {
  getUsers(params?: { page?: number; limit?: number; keyword?: string; role?: string; status?: string }): Promise<ApiResponse<PaginatedData<User>>> {
    return axiosClient.get('/users', { params });
  },
  getUser(id: number): Promise<ApiResponse<User>> {
    return axiosClient.get(`/users/${id}`);
  },
  createUser(data: Partial<User>): Promise<ApiResponse<User>> {
    return axiosClient.post('/users', data);
  },
  updateUser(id: number, data: Partial<User>): Promise<ApiResponse<User>> {
    return axiosClient.put(`/users/${id}`, data);
  },
  deleteUser(id: number): Promise<ApiResponse<null>> {
    return axiosClient.delete(`/users/${id}`);
  },
  updateStatus(id: number, isActive: boolean): Promise<ApiResponse<User>> {
    return axiosClient.patch(`/users/${id}/status`, { is_active: isActive });
  }
};
