import { supabase } from './supabase';
import type {
  Profile,
  Category,
  Product,
  ProductOption,
  CartItem,
  CartItemWithProduct,
  Order,
  BlogPost,
  ContactMessage,
  ProductWithOptions,
  PortfolioItem,
} from '@/types';

export const api = {
  // Profile APIs
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update profile');
    return data;
  },

  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  // Category APIs
  async getCategories(includeInactive = false): Promise<Category[]> {
    let query = supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create category');
    return data;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update category');
    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Product APIs
  async getProducts(categoryId?: string, includeInactive = false): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(8);
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getProductBySlug(slug: string): Promise<ProductWithOptions | null> {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (productError) throw productError;
    if (!product) return null;

    const { data: options, error: optionsError } = await supabase
      .from('product_options')
      .select('*')
      .eq('product_id', product.id)
      .eq('is_available', true)
      .order('display_order', { ascending: true });
    
    if (optionsError) throw optionsError;

    const { data: category } = await supabase
      .from('categories')
      .select('*')
      .eq('id', product.category_id)
      .maybeSingle();

    return {
      ...product,
      options: Array.isArray(options) ? options : [],
      category: category || undefined,
    };
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create product');
    return data;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update product');
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Product Options APIs
  async getProductOptions(productId: string): Promise<ProductOption[]> {
    const { data, error } = await supabase
      .from('product_options')
      .select('*')
      .eq('product_id', productId)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createProductOption(option: Omit<ProductOption, 'id'>): Promise<ProductOption> {
    const { data, error } = await supabase
      .from('product_options')
      .insert(option)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create product option');
    return data;
  },

  async updateProductOption(id: string, updates: Partial<ProductOption>): Promise<ProductOption> {
    const { data, error } = await supabase
      .from('product_options')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update product option');
    return data;
  },

  async deleteProductOption(id: string): Promise<void> {
    const { error } = await supabase
      .from('product_options')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Cart APIs
  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async addToCart(item: Omit<CartItem, 'id' | 'created_at'>): Promise<CartItem> {
    const { data, error } = await supabase
      .from('cart_items')
      .insert(item)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to add to cart');
    return data;
  },

  async updateCartItem(id: string, updates: Partial<CartItem>): Promise<CartItem> {
    const { data, error } = await supabase
      .from('cart_items')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update cart item');
    return data;
  },

  async removeFromCart(id: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  },

  // Order APIs
  async getOrders(userId?: string): Promise<Order[]> {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async createOrder(order: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create order');
    return data;
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update order');
    return data;
  },

  // Blog APIs
  async getBlogPosts(includeUnpublished = false): Promise<BlogPost[]> {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (!includeUnpublished) {
      query = query.eq('is_published', true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create blog post');
    return data;
  },

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update blog post');
    return data;
  },

  async deleteBlogPost(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Contact Messages APIs
  async getContactMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createContactMessage(message: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(message)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to send message');
    return data;
  },

  async markMessageAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteContactMessage(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Order Status Update
  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) throw error;
  },

  // Portfolio APIs
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getPortfolioItemsByCategory(category: string): Promise<PortfolioItem[]> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('category', category)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(6);
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at'>): Promise<PortfolioItem> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert(item)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create portfolio item');
    return data;
  },

  async updatePortfolioItem(id: string, updates: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update portfolio item');
    return data;
  },

  async deletePortfolioItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
