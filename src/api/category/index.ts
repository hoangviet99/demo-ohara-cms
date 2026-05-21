import axiosClient from '../axiosClient';
import type { Category } from '../../types/category';
import type { PaginatedData, ApiResponse } from '../../types/common';

export const categoryApi = {
  getCategories(params?: { page?: number; limit?: number; keyword?: string; is_active?: boolean }): Promise<ApiResponse<PaginatedData<Category>>> {
    return axiosClient.get('/categories', { params });
  },
  getCategory(id: number): Promise<ApiResponse<Category>> {
    return axiosClient.get(`/categories/${id}`);
  },
  createCategory(data: Partial<Category>): Promise<ApiResponse<Category>> {
    return axiosClient.post('/categories', data);
  },
  updateCategory(id: number, data: Partial<Category>): Promise<ApiResponse<Category>> {
    return axiosClient.put(`/categories/${id}`, data);
  },
  deleteCategory(id: number): Promise<ApiResponse<null>> {
    return axiosClient.delete(`/categories/${id}`);
  },
  updateStatus(id: number, isActive: boolean): Promise<ApiResponse<Category>> {
    return axiosClient.patch(`/categories/${id}/status`, { is_active: isActive });
  },
  getListCommon(params?: { is_active?: boolean }): Promise<ApiResponse<Category[]>> {
    return axiosClient.get('/categories/list-common', { params });
  }
};
