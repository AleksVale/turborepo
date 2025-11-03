import { apiClient } from "~/lib/http/api-client";
import { API_ENDPOINTS } from "~/lib/http/endpoints";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export const userService = {
  async list(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>(
      `${API_ENDPOINTS.USERS.LIST}?page=${page}&limit=${limit}`
    );
  },

  async getById(id: string): Promise<{ data: User }> {
    return apiClient.get<{ data: User }>(API_ENDPOINTS.USERS.GET(id));
  },

  async update(id: string, data: UpdateUserData): Promise<{ data: User }> {
    return apiClient.put<{ data: User }>(API_ENDPOINTS.USERS.UPDATE(id), data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  },
};
