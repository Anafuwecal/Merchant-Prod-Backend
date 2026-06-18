export interface IOrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  priceAtPurchase: number; 
}

export interface IOrder {
  _id?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}