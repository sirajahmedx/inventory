export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  status?: string;
  createdAt: Date;
  userId: string;
  categoryId: string;
  supplierId: string;
  category?: string;
  supplier?: string;
}

export interface Supplier {
  id: string;
  name: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
}
