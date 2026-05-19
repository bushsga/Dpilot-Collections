// =============================================
// DPiLOT COLLECTION - TypeScript Interfaces
// =============================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color_name: string;
  color_hex: string;
  images: string[];
  quantity: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_slug: string | null;
  sizes: number[];
  images: string[];
  in_stock: boolean;
  featured: boolean;
  quantity: number;
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  variant_id?: string;
  color_name?: string;
  size: number | null;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paystack_reference: string | null;
  tracking_number: string | null;
  created_at: string;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant | null;
  size: number | null;
  quantity: number;
}