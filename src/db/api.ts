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
  ProductOptionTemplate,
  ProductOptionValue,
  ProductOptionTemplateWithValues,
  ProductOptionAssignment,
  CheckoutData,
  ShippingAddress,
  QuantityPricingTier,
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

  async getOrder(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
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

  // Product Option Template APIs
  async getProductOptionTemplates(): Promise<ProductOptionTemplate[]> {
    const { data, error } = await supabase
      .from('product_option_templates')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getProductOptionValues(): Promise<ProductOptionValue[]> {
    const { data, error } = await supabase
      .from('product_option_values')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getProductOptionTemplatesWithValues(): Promise<ProductOptionTemplateWithValues[]> {
    const { data: templates, error: templatesError } = await supabase
      .from('product_option_templates')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (templatesError) throw templatesError;
    
    const templatesWithValues = await Promise.all(
      (templates || []).map(async (template) => {
        const { data: values, error: valuesError } = await supabase
          .from('product_option_values')
          .select('*')
          .eq('template_id', template.id)
          .order('display_order', { ascending: true });
        
        if (valuesError) throw valuesError;
        
        return {
          ...template,
          values: Array.isArray(values) ? values : [],
        };
      })
    );
    
    return templatesWithValues;
  },

  async getProductOptionsByProductId(productId: string): Promise<ProductOptionTemplateWithValues[]> {
    const { data: assignments, error: assignmentsError } = await supabase
      .from('product_option_assignments')
      .select('template_id')
      .eq('product_id', productId);
    
    if (assignmentsError) throw assignmentsError;
    
    if (!assignments || assignments.length === 0) {
      return [];
    }
    
    const templateIds = assignments.map(a => a.template_id);
    
    const { data: templates, error: templatesError } = await supabase
      .from('product_option_templates')
      .select('*')
      .in('id', templateIds)
      .order('display_order', { ascending: true });
    
    if (templatesError) throw templatesError;
    
    const templatesWithValues = await Promise.all(
      (templates || []).map(async (template) => {
        const { data: values, error: valuesError } = await supabase
          .from('product_option_values')
          .select('*')
          .eq('template_id', template.id)
          .order('display_order', { ascending: true });
        
        if (valuesError) throw valuesError;
        
        return {
          ...template,
          values: Array.isArray(values) ? values : [],
        };
      })
    );
    
    return templatesWithValues;
  },

  async createProductOptionTemplate(template: Omit<ProductOptionTemplate, 'id' | 'created_at'>): Promise<ProductOptionTemplate> {
    const { data, error } = await supabase
      .from('product_option_templates')
      .insert(template)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create option template');
    return data;
  },

  async updateProductOptionTemplate(id: string, updates: Partial<ProductOptionTemplate>): Promise<ProductOptionTemplate> {
    const { data, error } = await supabase
      .from('product_option_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update option template');
    return data;
  },

  async deleteProductOptionTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('product_option_templates')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Product Option Value APIs
  async createProductOptionValue(value: Omit<ProductOptionValue, 'id' | 'created_at'>): Promise<ProductOptionValue> {
    const { data, error } = await supabase
      .from('product_option_values')
      .insert(value)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create option value');
    return data;
  },

  async updateProductOptionValue(id: string, updates: Partial<ProductOptionValue>): Promise<ProductOptionValue> {
    const { data, error } = await supabase
      .from('product_option_values')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update option value');
    return data;
  },

  async deleteProductOptionValue(id: string): Promise<void> {
    const { error } = await supabase
      .from('product_option_values')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Product Option Assignment APIs
  async assignOptionToProduct(productId: string, templateId: string): Promise<ProductOptionAssignment> {
    const { data, error } = await supabase
      .from('product_option_assignments')
      .insert({ product_id: productId, template_id: templateId })
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to assign option to product');
    return data;
  },

  async unassignOptionFromProduct(productId: string, templateId: string): Promise<void> {
    const { error } = await supabase
      .from('product_option_assignments')
      .delete()
      .eq('product_id', productId)
      .eq('template_id', templateId);
    
    if (error) throw error;
  },

  async getProductOptionAssignments(): Promise<ProductOptionAssignment[]> {
    const { data, error } = await supabase
      .from('product_option_assignments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async deleteProductOptionAssignment(id: string): Promise<void> {
    const { error } = await supabase
      .from('product_option_assignments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Checkout APIs
  async createOrder(checkoutData: CheckoutData, cartItems: CartItemWithProduct[], userId?: string): Promise<Order> {
    const totalAmount = cartItems.reduce((sum, item) => {
      let itemTotal = item.product.base_price * item.quantity;
      
      if (item.custom_options) {
        const options = typeof item.custom_options === 'string' 
          ? JSON.parse(item.custom_options) 
          : item.custom_options;
        
        if (options.priceModifiers) {
          const modifiersTotal = Object.values(options.priceModifiers as Record<string, number>)
            .reduce((sum, mod) => sum + mod, 0);
          itemTotal += modifiersTotal * item.quantity;
        }
      }
      
      return sum + itemTotal;
    }, 0);

    const orderData = {
      user_id: userId || null,
      status: 'pending' as const,
      total_amount: totalAmount,
      shipping_address: checkoutData.shipping_address,
      payment_method: checkoutData.payment_method,
      notes: checkoutData.notes || null,
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order) throw new Error('Failed to create order');

    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.product.base_price,
      custom_options: item.custom_options,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    if (userId) {
      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (clearCartError) console.error('Failed to clear cart:', clearCartError);
    }

    return order;
  },

  // Quantity Pricing Tier APIs
  async getQuantityPricingTiers(): Promise<QuantityPricingTier[]> {
    const { data, error } = await supabase
      .from('quantity_pricing_tiers')
      .select('*')
      .order('option_value_id', { ascending: true })
      .order('min_quantity', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getQuantityPricingTiersByValueId(valueId: string): Promise<QuantityPricingTier[]> {
    const { data, error } = await supabase
      .from('quantity_pricing_tiers')
      .select('*')
      .eq('option_value_id', valueId)
      .order('min_quantity', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createQuantityPricingTier(tier: Omit<QuantityPricingTier, 'id' | 'created_at'>): Promise<QuantityPricingTier> {
    const { data, error } = await supabase
      .from('quantity_pricing_tiers')
      .insert(tier)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create quantity pricing tier');
    return data;
  },

  async updateQuantityPricingTier(id: string, updates: Partial<QuantityPricingTier>): Promise<QuantityPricingTier> {
    const { data, error } = await supabase
      .from('quantity_pricing_tiers')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update quantity pricing tier');
    return data;
  },

  async deleteQuantityPricingTier(id: string): Promise<void> {
    const { error } = await supabase
      .from('quantity_pricing_tiers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getPriceForQuantity(valueId: string, quantity: number): Promise<number> {
    const { data, error } = await supabase
      .from('quantity_pricing_tiers')
      .select('price_modifier')
      .eq('option_value_id', valueId)
      .lte('min_quantity', quantity)
      .or(`max_quantity.gte.${quantity},max_quantity.is.null`)
      .order('min_quantity', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    
    // If no tier found, return the base price_modifier from the value
    if (!data) {
      const { data: valueData, error: valueError } = await supabase
        .from('product_option_values')
        .select('price_modifier')
        .eq('id', valueId)
        .maybeSingle();
      
      if (valueError) throw valueError;
      return valueData?.price_modifier || 0;
    }
    
    return data.price_modifier;
  },
};
