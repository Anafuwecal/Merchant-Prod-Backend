export interface IMerchant {
  _id?: string;
  name: string;
  email: string;
  password: string;
  storeName: string;
  createdAt?: Date;
  updatedAt?: Date;
}