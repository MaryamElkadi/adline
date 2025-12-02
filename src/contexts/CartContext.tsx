import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '@/db/api';
import { useAuth } from './AuthContext';
import type { CartItemWithProduct } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItemWithProduct[];
  loading: boolean;
  addItem: (productId: string, quantity: number, customOptions?: Record<string, any>, notes?: string) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  getTotalPrice: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const cartItems = await api.getCartItems(user.id);
      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shopping cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (
    productId: string,
    quantity: number,
    customOptions?: Record<string, any>,
    notes?: string
  ) => {
    if (!user) {
      toast({
        title: 'Sign In Required',
        description: 'Please sign in to add products to cart',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.addToCart({
        user_id: user.id,
        product_id: productId,
        quantity,
        selected_options: {},
        custom_options: customOptions ? JSON.stringify(customOptions) : null,
        notes: notes || null,
        custom_design_url: null,
      });
      
      await loadCart();
      
      toast({
        title: 'Added to Cart',
        description: 'Product added to shopping cart successfully',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product to cart',
        variant: 'destructive',
      });
    }
  };

  const updateItem = async (id: string, quantity: number) => {
    try {
      await api.updateCartItem(id, { quantity });
      await loadCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    }
  };

  const removeItem = async (id: string) => {
    try {
      await api.removeFromCart(id);
      await loadCart();
      toast({
        title: 'Removed',
        description: 'Product removed from cart',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove product',
        variant: 'destructive',
      });
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    try {
      await api.clearCart(user.id);
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear cart',
        variant: 'destructive',
      });
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const calculateTotalPrice = () => {
    return items.reduce((sum, item) => {
      let itemPrice = item.product?.base_price || 0;
      
      // Add price modifiers from custom options
      if (item.custom_options) {
        const options = typeof item.custom_options === 'string' 
          ? JSON.parse(item.custom_options) 
          : item.custom_options;
        
        if (options?.priceModifiers) {
          const modifiersTotal = Object.values(options.priceModifiers as Record<string, number>)
            .reduce((sum, mod) => sum + mod, 0);
          itemPrice += modifiersTotal;
        }
      }
      
      return sum + (itemPrice * item.quantity);
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
        getTotalPrice: calculateTotalPrice,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
