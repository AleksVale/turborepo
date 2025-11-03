import { useCallback } from "react";
import {
  orderService,
  type CreateOrderData,
  type UpdateOrderData,
} from "~/services/order.service";
import { useApi } from "./use-api";

export function useOrders() {
  const {
    data: ordersData,
    error,
    isLoading,
    execute: fetchOrders,
  } = useApi(orderService.list);

  const {
    execute: createOrderExecute,
    isLoading: isCreating,
    error: createError,
  } = useApi(orderService.create);

  const {
    execute: updateOrderExecute,
    isLoading: isUpdating,
    error: updateError,
  } = useApi(orderService.update);

  const {
    execute: deleteOrderExecute,
    isLoading: isDeleting,
    error: deleteError,
  } = useApi(orderService.delete);

  const createOrder = useCallback(
    async (data: CreateOrderData) => {
      return createOrderExecute(data);
    },
    [createOrderExecute]
  );

  const updateOrder = useCallback(
    async (id: string, data: UpdateOrderData) => {
      return updateOrderExecute(id, data);
    },
    [updateOrderExecute]
  );

  const deleteOrder = useCallback(
    async (id: string) => {
      return deleteOrderExecute(id);
    },
    [deleteOrderExecute]
  );

  return {
    orders: ordersData?.data,
    meta: ordersData?.meta,
    error,
    isLoading,
    fetchOrders,
    createOrder,
    isCreating,
    createError,
    updateOrder,
    isUpdating,
    updateError,
    deleteOrder,
    isDeleting,
    deleteError,
  };
}
