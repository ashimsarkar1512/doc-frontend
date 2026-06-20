export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type OrderDateRange = 'TODAY' | 'LAST_7_DAYS' | 'LAST_MONTH' | 'LAST_YEAR' | 'ALL';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  createdAt: string;
  transactionId: string;
  reviewedBy: {
    id: string;
    name: string;
  };
  submission: {
    id: string;
    assessmentTitle: string;
  };
}

export interface MyOrdersResponse {
  orders: Order[];
  counts: Partial<Record<OrderStatus, number>>;
}
