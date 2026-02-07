import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await orderService.getMyOrders();
      if (!res.success) throw new Error(res.message);
      return res.data || [];
    },
  });
};