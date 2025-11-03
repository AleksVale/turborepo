import { apiClient } from "~/lib/http/api-client";
import { API_ENDPOINTS } from "~/lib/http/endpoints";
import type { PaginatedResponse } from "./user.service";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  status?: string;
}

export const productService = {
  async list(page = 1, limit = 10): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>(
      `${API_ENDPOINTS.PRODUCTS.LIST}?page=${page}&limit=${limit}`
    );
  },

  async getById(id: string): Promise<{ data: Product }> {
    return apiClient.get<{ data: Product }>(API_ENDPOINTS.PRODUCTS.GET(id));
  },

  async create(data: CreateProductData): Promise<{ data: Product }> {
    return apiClient.post<{ data: Product }>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      data
    );
  },

  async update(
    id: string,
    data: UpdateProductData
  ): Promise<{ data: Product }> {
    return apiClient.put<{ data: Product }>(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      data
    );
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
  },
};
