import { apiClient } from "~/lib/http/api-client";
import { API_ENDPOINTS } from "~/lib/http/endpoints";
import type { PaginatedResponse } from "./user.service";

export interface Order {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  productId: string;
  amount: number;
}

export interface UpdateOrderData {
  status?: "pending" | "completed" | "cancelled";
}

export const orderService = {
  async list(page = 1, limit = 10): Promise<PaginatedResponse<Order>> {
    return apiClient.get<PaginatedResponse<Order>>(
      `${API_ENDPOINTS.ORDERS.LIST}?page=${page}&limit=${limit}`
    );
  },

  async getById(id: string): Promise<{ data: Order }> {
    return apiClient.get<{ data: Order }>(API_ENDPOINTS.ORDERS.GET(id));
  },

  async create(data: CreateOrderData): Promise<{ data: Order }> {
    return apiClient.post<{ data: Order }>(API_ENDPOINTS.ORDERS.CREATE, data);
  },

  async update(id: string, data: UpdateOrderData): Promise<{ data: Order }> {
    return apiClient.put<{ data: Order }>(
      API_ENDPOINTS.ORDERS.UPDATE(id),
      data
    );
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.ORDERS.DELETE(id));
  },
};
