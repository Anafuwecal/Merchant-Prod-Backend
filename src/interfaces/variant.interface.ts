export interface IVariant {
  _id?: string;
  productId: string; // References the Product
  color: string;
  size: string;
  stock: number;
  priceOverride?: number; // Optional
  createdAt?: Date;
  updatedAt?: Date;
}