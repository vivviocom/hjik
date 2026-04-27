export type Category = "men" | "women" | "unisex";
export type Collection = "new" | "best" | "sale";

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  collections: Collection[];
  price: number;
  compareAt?: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  images: string[];
  description: string;
  details: string[];
  material: string;
  rating: number;
  reviews: Review[];
  tags: string[];
}

export interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface Order {
  id: string;
  userId: string | null;
  email: string;
  items: (CartItem & { name: string; price: number; image: string })[];
  subtotal: number;
  shipping: number;
  discount: number;
  discountCode?: string;
  total: number;
  shippingAddress: ShippingAddress;
  status: "Processing" | "Shipped" | "Delivered";
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}
