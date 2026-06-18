export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  isActive: boolean;
  merchantId: string;
  createdAt?: Date;
  updatedAt?: Date;
}