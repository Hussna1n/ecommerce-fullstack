export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: number;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
