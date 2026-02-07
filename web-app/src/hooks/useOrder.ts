import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, CreateOrderPayload } from '../services/orderService';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderPayload) =>
      orderService.createOrder(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};