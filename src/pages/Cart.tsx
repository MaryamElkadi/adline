import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Cart() {
  const { items, updateItem, removeItem, totalPrice, totalItems, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-12" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 xl:px-6">
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">يرجى تسجيل الدخول</h2>
              <p className="text-muted-foreground mb-6">
                تحتاج إلى تسجيل الدخول لعرض سلة التسوق الخاصة بك
              </p>
              <Button asChild>
                <Link to="/login">تسجيل الدخول</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 xl:px-6">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 xl:px-6">
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">سلة التسوق فارغة</h2>
              <p className="text-muted-foreground mb-6">
                لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
              </p>
              <Button asChild>
                <Link to="/products">
                  <ArrowRight className="ml-2 h-4 w-4" />
                  تصفح المنتجات
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const calculateItemPrice = (item: typeof items[0]) => {
    let price = item.product?.base_price || 0;
    
    // Add selected options price modifiers
    if (item.selected_options && item.product?.options) {
      Object.values(item.selected_options).forEach((optionId) => {
        const option = item.product.options?.find((opt) => opt.id === optionId);
        if (option) {
          price += option.price_modifier;
        }
      });
    }
    
    // Add custom options price modifiers
    if (item.custom_options) {
      try {
        const customOpts = typeof item.custom_options === 'string' 
          ? JSON.parse(item.custom_options) 
          : item.custom_options;
        
        if (customOpts && typeof customOpts === 'object') {
          Object.values(customOpts).forEach((value: any) => {
            if (value && typeof value === 'object' && 'price_modifier' in value) {
              price += value.price_modifier || 0;
            }
          });
        }
      } catch (e) {
        console.error('Error parsing custom_options:', e);
      }
    }
    
    return price * item.quantity;
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateItem(itemId, newQuantity);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background py-12" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 xl:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">سلة التسوق</h1>
          <p className="text-muted-foreground">
            لديك {totalItems} {totalItems === 1 ? 'منتج' : 'منتجات'} في سلة التسوق
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={item.product?.image_url || 'https://via.placeholder.com/200'}
                        alt={item.product?.name_ar || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link
                            to={`/products/${item.product?.slug}`}
                            className="font-semibold text-lg hover:text-primary transition-smooth"
                          >
                            {item.product?.name_ar || 'Product'}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            السعر الأساسي: {item.product?.base_price?.toFixed(2)} ريال
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Selected Options */}
                      {item.selected_options && Object.keys(item.selected_options).length > 0 && item.product?.options && (
                        <div className="mb-3 space-y-1">
                          <p className="text-sm font-medium mb-2">الخيارات المحددة:</p>
                          {Object.entries(item.selected_options).map(([type, optionId]) => {
                            const option = item.product?.options?.find(opt => opt.id === optionId);
                            return option ? (
                              <div key={type} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{option.option_name_ar}</span>
                                {option.price_modifier !== 0 && (
                                  <Badge variant="outline" className={option.price_modifier > 0 ? 'text-green-600' : 'text-red-600'}>
                                    {option.price_modifier > 0 ? '+' : ''}{option.price_modifier.toFixed(2)} ريال
                                  </Badge>
                                )}
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}

                      {/* Custom Options */}
                      {item.custom_options && (() => {
                        try {
                          const customOpts = typeof item.custom_options === 'string' 
                            ? JSON.parse(item.custom_options) 
                            : item.custom_options;
                          
                          if (customOpts && typeof customOpts === 'object' && Object.keys(customOpts).length > 0) {
                            return (
                              <div className="mb-3 space-y-1">
                                <p className="text-sm font-medium mb-2">خيارات مخصصة:</p>
                                {Object.entries(customOpts).map(([key, value]: [string, any]) => {
                                  if (value && typeof value === 'object') {
                                    return (
                                      <div key={key} className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                          {value.label || key}: {value.value || value.value_en || 'محدد'}
                                        </span>
                                        {value.price_modifier && value.price_modifier !== 0 && (
                                          <Badge variant="outline" className={value.price_modifier > 0 ? 'text-green-600' : 'text-red-600'}>
                                            {value.price_modifier > 0 ? '+' : ''}{value.price_modifier.toFixed(2)} ريال
                                          </Badge>
                                        )}
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            );
                          }
                        } catch (e) {
                          console.error('Error rendering custom options:', e);
                        }
                        return null;
                      })()}

                      {/* Notes */}
                      {item.notes && (
                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">ملاحظات:</p>
                          <p className="text-sm text-muted-foreground">{item.notes}</p>
                        </div>
                      )}

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-bold text-primary">
                            {calculateItemPrice(item).toFixed(2)} ريال
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(calculateItemPrice(item) / item.quantity).toFixed(2)} ريال للقطعة
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المجموع الفرعي ({totalItems} منتجات)</span>
                    <span className="font-medium">{totalPrice.toFixed(2)} ريال</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الشحن</span>
                    <span className="font-medium">يحسب عند الدفع</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold">الإجمالي</span>
                  <span className="text-2xl font-bold text-primary">{totalPrice.toFixed(2)} ريال</span>
                </div>

                <Button 
                  className="w-full mb-3" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  متابعة إلى الدفع
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <Link to="/products">متابعة التسوق</Link>
                </Button>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>ملاحظة:</strong> سيتم حساب السعر النهائي عند الدفع بما في ذلك الشحن وأي ضرائب قابلة للتطبيق.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
