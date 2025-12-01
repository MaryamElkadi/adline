import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '@/db/api';
import { useAuth } from './AuthContext';
import type { CartItemWithProduct } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItemWithProduct[];
  loading: boolean;
  addItem: (productId: string, quantity: number, selectedOptions: Record<string, string>, notes?: string) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
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
        title: 'خطأ',
        description: 'فشل تحميل سلة التسوق',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (
    productId: string,
    quantity: number,
    selectedOptions: Record<string, string>,
    notes?: string
  ) => {
    if (!user) {
      toast({
        title: 'تسجيل الدخول مطلوب',
        description: 'يرجى تسجيل الدخول لإضافة منتجات إلى السلة',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.addToCart({
        user_id: user.id,
        product_id: productId,
        quantity,
        selected_options: selectedOptions,
        notes: notes || null,
        custom_design_url: null,
      });
      
      await loadCart();
      
      toast({
        title: 'تمت الإضافة',
        description: 'تم إضافة المنتج إلى سلة التسوق',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'خطأ',
        description: 'فشل إضافة المنتج إلى السلة',
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
        title: 'خطأ',
        description: 'فشل تحديث المنتج',
        variant: 'destructive',
      });
    }
  };

  const removeItem = async (id: string) => {
    try {
      await api.removeFromCart(id);
      await loadCart();
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المنتج من السلة',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حذف المنتج',
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
        title: 'خطأ',
        description: 'فشل تفريغ السلة',
        variant: 'destructive',
      });
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce((sum, item) => {
    const basePrice = item.product?.base_price || 0;
    return sum + (basePrice * item.quantity);
  }, 0);

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
