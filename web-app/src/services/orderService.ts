import { apiService } from '../api/apiService';
import { ApiResponse } from '../types/api';

export interface CreateOrderPayload {
  order: {
    status: string;
    payment_status: string;
    tax: number;
    shipping_fee: number;
  };
  items: {
    product_id: number | string;
    quantity: number;
  }[];
}

export const orderService = {
  createOrder: (data: CreateOrderPayload) =>
    apiService.post<ApiResponse<any>>('/orders', data),

  getMyOrders: () =>
    apiService.get<ApiResponse<any[]>>('/orders'),
};