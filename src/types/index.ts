export type ProductCategory = 'all' | 'gadgets' | 'fashion' | 'accessories' | 'lifestyle';

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  isVerifiedPurchase: boolean;
  location?: string;
  helpfulCount?: number;
}

export interface Product {
  id: string;
  title: string;
  category: 'gadgets' | 'fashion' | 'accessories' | 'lifestyle';
  price: number; // Retail Price in INR ₹
  originalPrice: number; // MRP in INR ₹
  wholesalePrice: number; // Wholesale/B2B Cost in INR ₹
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
  image: string;
  description: string;
  features: string[];
  specs?: Record<string, string>;
  inStock: boolean;
  codAvailable: boolean;
  isTrending?: boolean;
  colors?: string[];
  sizes?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cod' | 'prepaid';
  status: 'confirmed' | 'dispatched' | 'out_for_delivery' | 'delivered';
  createdAt: string;
  estimatedDelivery: string;
  deliveryOtp?: string;
}

export interface WholesaleInquiry {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  monthlyOrderVolume: string;
  primaryCategories: string[];
  notes: string;
}
