export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export type UserRole = 'user' | 'admin';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'ready' | 'shipped' | 'delivered' | 'cancelled';

export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name_ar: string;
  slug: string;
  description_ar: string | null;
  icon: string | null;
  image_url: string | null;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name_ar: string;
  slug: string;
  description_ar: string | null;
  base_price: number;
  image_url: string | null;
  images: string[];
  is_active: boolean;
  featured: boolean;
  min_quantity: number;
  production_time_days: number;
  created_at: string;
  updated_at: string;
}

export interface ProductOption {
  id: string;
  product_id: string;
  option_type: string;
  option_name_ar: string;
  price_modifier: number;
  is_available: boolean;
  display_order: number;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  selected_options: Record<string, string>;
  custom_options?: Record<string, any> | string | null;
  custom_design_url: string | null;
  notes: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  order_number: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  payment_method: string | null;
  shipping_address: ShippingAddress | null;
  customer_notes: string | null;
  admin_notes: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  selected_options: Record<string, string>;
  custom_design_url?: string;
  notes?: string;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  region: string;
  postal_code?: string;
}

export interface BlogPost {
  id: string;
  author_id: string | null;
  title_ar: string;
  slug: string;
  content_ar: string | null;
  excerpt_ar: string | null;
  featured_image: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CartItemWithProduct extends CartItem {
  product: ProductWithOptions;
}

export interface ProductWithOptions extends Product {
  options: ProductOption[];
  category?: Category;
}

export interface PortfolioItem {
  id: string;
  title_ar: string;
  description_ar: string | null;
  category: string | null;
  image_url: string | null;
  images: string[];
  client_name: string | null;
  completion_date: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface ProductOptionTemplate {
  id: string;
  option_type: string;
  option_name_ar: string;
  option_name_en: string | null;
  is_required: boolean;
  display_order: number;
  created_at: string;
}

export interface ProductOptionValue {
  id: string;
  template_id: string;
  value_ar: string;
  value_en: string | null;
  price_modifier: number;
  is_available: boolean;
  display_order: number;
  created_at: string;
}

export interface QuantityPricingTier {
  id: string;
  option_value_id: string;
  min_quantity: number;
  max_quantity: number | null;
  price_modifier: number;
  created_at: string;
}

export interface ProductOptionValueWithTiers extends ProductOptionValue {
  quantity_tiers: QuantityPricingTier[];
}

export interface SimpleProductOption {
  id: string;
  product_id: string;
  option_name_ar: string;
  option_name_en: string | null;
  option_value_ar: string;
  option_value_en: string | null;
  price_modifier: number;
  is_available: boolean;
  display_order: number;
  created_at: string;
}

export interface SimpleProductOptionWithTiers extends SimpleProductOption {
  quantity_tiers: QuantityPricingTier[];
}

export interface ProductOptionAssignment {
  id: string;
  product_id: string;
  template_id: string;
  created_at: string;
}

export interface ProductOptionTemplateWithValues extends ProductOptionTemplate {
  values: ProductOptionValue[];
}

export type PaymentMethod = 'card' | 'cash';

export interface CheckoutData {
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  notes?: string;
}

// Enhanced Product Options Types
export interface ProductQuantityTier {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface ProductSizeOption {
  id: string;
  product_id: string;
  name_ar: string;
  price_addition: number;
  created_at: string;
}

export interface ProductMaterialOption {
  id: string;
  product_id: string;
  name_ar: string;
  price_addition: number;
  created_at: string;
}

export interface ProductSideOption {
  id: string;
  product_id: string;
  name_ar: string;
  price_addition: number;
  created_at: string;
}

// Services Types
export interface Service {
  id: string;
  name_ar: string;
  description_ar: string;
  details: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceInquiry {
  id: string;
  service_id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'pending' | 'contacted' | 'resolved';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceInquiryWithService extends ServiceInquiry {
  service: Service;
}

// عروض موسمية (Seasonal Offers)
export interface SeasonalOffer {
  id: string;
  title_ar: string;
  description_ar: string;
  discount_percentage: number | null;
  start_date: string;
  end_date: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

