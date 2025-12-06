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
  SimpleProductOption,
  SimpleProductOptionWithTiers,
  QuoteRequest,
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

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
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
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert(message)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Supabase error creating contact message:', error);
        throw new Error(`فشل إرسال الرسالة: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('لم يتم إرجاع بيانات بعد إرسال الرسالة');
      }
      
      return data;
    } catch (error) {
      console.error('Error in createContactMessage:', error);
      throw error;
    }
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
      let basePrice = item.product.base_price;
      let optionsPrice = 0;
      
      // Add price modifiers from selected options (as a whole, not per item)
      if (item.selected_options && item.product?.options) {
        Object.entries(item.selected_options).forEach(([optionId, _selectedValue]) => {
          const option = item.product.options.find(opt => opt.id === optionId);
          if (option && option.price_modifier) {
            optionsPrice += option.price_modifier;
          }
        });
      }
      
      return sum + basePrice + optionsPrice;
    }, 0);

    // Prepare order items first (required for NOT NULL constraint)
    const orderItems = cartItems.map(item => ({
      product_id: item.product_id,
      product_name: item.product.name_ar,
      quantity: item.quantity,
      unit_price: item.product.base_price,
      selected_options: item.selected_options,
      custom_design_url: item.custom_design_url,
      notes: item.notes,
    }));

    // Include items in the initial insert (items column is NOT NULL)
    const orderData = {
      user_id: userId || null,
      status: 'pending' as const,
      total_amount: totalAmount,
      shipping_address: checkoutData.shipping_address,
      payment_method: checkoutData.payment_method,
      customer_notes: checkoutData.notes || null,
      items: orderItems,
    };

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .maybeSingle();

    if (orderError) {
      console.error('Supabase order error:', orderError);
      throw orderError;
    }
    if (!order) throw new Error('Failed to create order');

    // Clear cart if user is logged in
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

  // Simple Product Options APIs (New Simplified System)
  async getSimpleProductOptions(productId: string): Promise<SimpleProductOption[]> {
    const { data, error } = await supabase
      .from('simple_product_options')
      .select('*')
      .eq('product_id', productId)
      .order('display_order', { ascending: true })
      .order('option_name_en', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getSimpleProductOptionsWithTiers(productId: string): Promise<SimpleProductOptionWithTiers[]> {
    const options = await api.getSimpleProductOptions(productId);
    
    const optionsWithTiers = await Promise.all(
      options.map(async (option) => {
        const { data: tiers, error } = await supabase
          .from('quantity_pricing_tiers')
          .select('*')
          .eq('simple_option_id', option.id)
          .order('min_quantity', { ascending: true });
        
        if (error) throw error;
        
        return {
          ...option,
          quantity_tiers: Array.isArray(tiers) ? tiers : [],
        };
      })
    );
    
    return optionsWithTiers;
  },

  async createSimpleProductOption(option: Omit<SimpleProductOption, 'id' | 'created_at'>): Promise<SimpleProductOption> {
    const { data, error } = await supabase
      .from('simple_product_options')
      .insert(option)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create product option');
    return data;
  },

  async updateSimpleProductOption(id: string, updates: Partial<SimpleProductOption>): Promise<SimpleProductOption> {
    const { data, error } = await supabase
      .from('simple_product_options')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update product option');
    return data;
  },

  async deleteSimpleProductOption(id: string): Promise<void> {
    const { error } = await supabase
      .from('simple_product_options')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getQuantityTiersForSimpleOption(optionId: string): Promise<QuantityPricingTier[]> {
    const { data, error } = await supabase
      .from('quantity_pricing_tiers')
      .select('*')
      .eq('simple_option_id', optionId)
      .order('min_quantity', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createQuantityTierForSimpleOption(tier: Omit<QuantityPricingTier, 'id' | 'created_at' | 'option_value_id'> & { simple_option_id: string }): Promise<QuantityPricingTier> {
    const { data, error } = await supabase
      .from('quantity_pricing_tiers')
      .insert({
        ...tier,
        option_value_id: null, // Not using old system
      })
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create quantity tier');
    return data;
  },

  async getPriceForSimpleOption(optionId: string, quantity: number): Promise<number> {
    const { data, error } = await supabase
      .from('quantity_pricing_tiers')
      .select('price_modifier')
      .eq('simple_option_id', optionId)
      .lte('min_quantity', quantity)
      .or(`max_quantity.gte.${quantity},max_quantity.is.null`)
      .order('min_quantity', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    
    // If no tier found, return the base price_modifier from the option
    if (!data) {
      const { data: optionData, error: optionError } = await supabase
        .from('simple_product_options')
        .select('price_modifier')
        .eq('id', optionId)
        .maybeSingle();
      
      if (optionError) throw optionError;
      return optionData?.price_modifier || 0;
    }
    
    return data.price_modifier;
  },

  // ==================== Product Quantity Tiers ====================
  async getProductQuantityTiers(productId: string) {
    const { data, error } = await supabase
      .from('product_quantity_tiers')
      .select('*')
      .eq('product_id', productId)
      .order('quantity', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createProductQuantityTier(tier: { product_id: string; quantity: number; price: number }) {
    const { data, error } = await supabase
      .from('product_quantity_tiers')
      .insert(tier)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async updateProductQuantityTier(id: string, updates: { quantity?: number; price?: number }) {
    const { data, error } = await supabase
      .from('product_quantity_tiers')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async deleteProductQuantityTier(id: string) {
    const { error } = await supabase
      .from('product_quantity_tiers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteAllProductQuantityTiers(productId: string) {
    const { error } = await supabase
      .from('product_quantity_tiers')
      .delete()
      .eq('product_id', productId);
    
    if (error) throw error;
  },

  // ==================== Product Size Options ====================
  async getProductSizeOptions(productId: string) {
    const { data, error } = await supabase
      .from('product_size_options')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createProductSizeOption(option: { product_id: string; name_ar: string; price_addition: number }) {
    const { data, error } = await supabase
      .from('product_size_options')
      .insert(option)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async updateProductSizeOption(id: string, updates: { name_ar?: string; price_addition?: number }) {
    const { data, error } = await supabase
      .from('product_size_options')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async deleteProductSizeOption(id: string) {
    const { error } = await supabase
      .from('product_size_options')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteAllProductSizeOptions(productId: string) {
    const { error } = await supabase
      .from('product_size_options')
      .delete()
      .eq('product_id', productId);
    
    if (error) throw error;
  },

  // ==================== Product Material Options ====================
  async getProductMaterialOptions(productId: string) {
    const { data, error } = await supabase
      .from('product_material_options')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createProductMaterialOption(option: { product_id: string; name_ar: string; price_addition: number }) {
    const { data, error } = await supabase
      .from('product_material_options')
      .insert(option)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async updateProductMaterialOption(id: string, updates: { name_ar?: string; price_addition?: number }) {
    const { data, error } = await supabase
      .from('product_material_options')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async deleteProductMaterialOption(id: string) {
    const { error } = await supabase
      .from('product_material_options')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteAllProductMaterialOptions(productId: string) {
    const { error } = await supabase
      .from('product_material_options')
      .delete()
      .eq('product_id', productId);
    
    if (error) throw error;
  },

  // ==================== Product Side Options ====================
  async getProductSideOptions(productId: string) {
    const { data, error } = await supabase
      .from('product_side_options')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createProductSideOption(option: { product_id: string; name_ar: string; price_addition: number }) {
    const { data, error } = await supabase
      .from('product_side_options')
      .insert(option)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async updateProductSideOption(id: string, updates: { name_ar?: string; price_addition?: number }) {
    const { data, error } = await supabase
      .from('product_side_options')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async deleteProductSideOption(id: string) {
    const { error } = await supabase
      .from('product_side_options')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async deleteAllProductSideOptions(productId: string) {
    const { error } = await supabase
      .from('product_side_options')
      .delete()
      .eq('product_id', productId);
    
    if (error) throw error;
  },

  // ==================== Services ====================
  async getServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getActiveServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getServiceById(id: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async createService(service: { name_ar: string; description_ar: string; details?: string; image_url?: string; is_active?: boolean }) {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async updateService(id: string, updates: { name_ar?: string; description_ar?: string; details?: string; image_url?: string; is_active?: boolean }) {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async deleteService(id: string) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // ==================== Service Inquiries ====================
  async getServiceInquiries() {
    const { data, error } = await supabase
      .from('service_inquiries')
      .select(`
        *,
        service:services(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getServiceInquiriesByService(serviceId: string) {
    const { data, error } = await supabase
      .from('service_inquiries')
      .select('*')
      .eq('service_id', serviceId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async createServiceInquiry(inquiry: { service_id: string; customer_name: string; email: string; phone?: string; message: string }) {
    const { data, error } = await supabase
      .from('service_inquiries')
      .insert(inquiry)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async updateServiceInquiry(id: string, updates: { status?: 'pending' | 'contacted' | 'resolved'; admin_notes?: string }) {
    const { data, error } = await supabase
      .from('service_inquiries')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async deleteServiceInquiry(id: string) {
    const { error } = await supabase
      .from('service_inquiries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // عروض موسمية (Seasonal Offers)
  async getSeasonalOffers() {
    const { data, error } = await supabase
      .from('seasonal_offers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getActiveSeasonalOffers() {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('seasonal_offers')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', now)
      .gte('end_date', now)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getSeasonalOfferById(id: string) {
    const { data, error } = await supabase
      .from('seasonal_offers')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async createSeasonalOffer(offer: {
    title_ar: string;
    description_ar: string;
    discount_percentage?: number;
    start_date: string;
    end_date: string;
    image_url?: string;
    is_active?: boolean;
  }) {
    // تحويل التواريخ إلى صيغة ISO مع الوقت - Convert dates to ISO format with time
    const startDate = offer.start_date.includes('T') 
      ? offer.start_date 
      : `${offer.start_date}T00:00:00`;
    const endDate = offer.end_date.includes('T') 
      ? offer.end_date 
      : `${offer.end_date}T23:59:59`;

    const { data, error } = await supabase
      .from('seasonal_offers')
      .insert([{
        title_ar: offer.title_ar,
        description_ar: offer.description_ar,
        discount_percentage: offer.discount_percentage || null,
        start_date: startDate,
        end_date: endDate,
        image_url: offer.image_url || null,
        is_active: offer.is_active !== undefined ? offer.is_active : true,
      }])
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async updateSeasonalOffer(id: string, updates: Partial<{
    title_ar: string;
    description_ar: string;
    discount_percentage: number | null;
    start_date: string;
    end_date: string;
    image_url: string | null;
    is_active: boolean;
  }>) {
    // تحويل التواريخ إلى صيغة ISO إذا كانت موجودة - Convert dates to ISO format if present
    const processedUpdates = { ...updates };
    if (updates.start_date && !updates.start_date.includes('T')) {
      processedUpdates.start_date = `${updates.start_date}T00:00:00`;
    }
    if (updates.end_date && !updates.end_date.includes('T')) {
      processedUpdates.end_date = `${updates.end_date}T23:59:59`;
    }

    const { data, error } = await supabase
      .from('seasonal_offers')
      .update(processedUpdates)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async deleteSeasonalOffer(id: string) {
    const { error } = await supabase
      .from('seasonal_offers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // طلبات التسعير (Quote Requests)
  async createQuoteRequest(quoteRequest: Omit<QuoteRequest, 'id' | 'created_at' | 'updated_at' | 'status' | 'admin_notes'>) {
    const { data, error } = await supabase
      .from('quote_requests')
      .insert([quoteRequest])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getQuoteRequests() {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  async getQuoteRequestById(id: string) {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async updateQuoteRequest(id: string, updates: Partial<QuoteRequest>) {
    const { data, error } = await supabase
      .from('quote_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteQuoteRequest(id: string) {
    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getQuoteRequestsByStatus(status: string) {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },

  // Payment Processing APIs
  async processPayment(
    orderId: string,
    amount: number,
    currency: string,
    cardData: {
      card_number: string;
      cardholder_name: string;
      expiry_month: string;
      expiry_year: string;
      cvv: string;
    }
  ): Promise<{
    success: boolean;
    transaction_id?: string;
    gateway_transaction_id?: string;
    error_message?: string;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: JSON.stringify({
          order_id: orderId,
          amount,
          currency,
          card_data: cardData,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('Edge function error in process-payment:', errorMsg);
        throw new Error(errorMsg || 'فشل في معالجة الدفع');
      }

      return data;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  },

  async getPaymentTransaction(transactionId: string) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async getPaymentTransactionsByOrderId(orderId: string) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  },
};
