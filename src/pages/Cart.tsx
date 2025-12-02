import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Cart() {
  const { items, updateItem, removeItem, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 xl:px-6">
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">يرجى تسجيل الدخول</h2>
              <p className="text-muted-foreground mb-6">
                يجب تسجيل الدخول لعرض سلة التسوق
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 xl:px-6">
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">السلة فارغة</h2>
              <p className="text-muted-foreground mb-6">
                لم تقم بإضافة أي منتجات إلى السلة بعد
              </p>
              <Button asChild>
                <Link to="/products">
                  تصفح المنتجات
                  <ArrowLeft className="mr-2 h-4 w-4" />
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
        
        Object.values(customOpts).forEach((value: any) => {
          if (value && typeof value === 'object' && 'price_modifier' in value) {
            price += value.price_modifier || 0;
          }
        });
      } catch (e) {
        console.error('Error parsing custom_options:', e);
      }
    }
    
    return price * item.quantity;
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4 xl:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">سلة التسوق</h1>
          <p className="text-muted-foreground">
            لديك {totalItems} {totalItems === 1 ? 'منتج' : 'منتجات'} في السلة
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={item.product?.image_url || 'https://via.placeholder.com/200'}
                        alt={item.product?.name_ar || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link
                            to={`/products/${item.product?.slug}`}
                            className="font-semibold text-lg hover:text-primary transition-smooth"
                          >
                            {item.product?.name_ar || 'Product'}
                          </Link>
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

                      {item.selected_options && Object.keys(item.selected_options).length > 0 && item.product?.options && (
                        <div className="mb-3 space-y-1">
                          <p className="text-sm text-muted-foreground mb-2">الخيارات المحددة:</p>
                          {Object.entries(item.selected_options).map(([type, optionId]) => {
                            const option = item.product?.options?.find(opt => opt.id === optionId);
                            return option ? (
                              <div key={type} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{option.option_name_ar}</span>
                                {option.price_modifier !== 0 && (
                                  <span className="text-primary font-medium">
                                    {option.price_modifier > 0 ? '+' : ''}{option.price_modifier.toFixed(2)} ر.س
                                  </span>
                                )}
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}

                      {item.custom_options && (() => {
                        try {
                          const customOpts = typeof item.custom_options === 'string' 
                            ? JSON.parse(item.custom_options) 
                            : item.custom_options;
                          
                          const entries = Object.entries(customOpts);
                          if (entries.length === 0) return null;
                          
                          return (
                            <div className="mb-3 space-y-1">
                              <p className="text-sm text-muted-foreground mb-2">خيارات إضافية:</p>
                              {entries.map(([key, value]: [string, any]) => {
                                if (!value || typeof value !== 'object') return null;
                                return (
                                  <div key={key} className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{value.label_ar || key}</span>
                                    {value.price_modifier !== 0 && (
                                      <span className="text-primary font-medium">
                                        {value.price_modifier > 0 ? '+' : ''}{value.price_modifier.toFixed(2)} ر.س
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        } catch (e) {
                          console.error('Error parsing custom_options:', e);
                          return null;
                        }
                      })()}

                      {item.notes && (
                        <p className="text-sm text-muted-foreground mb-3">
                          ملاحظات: {item.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-left">
                          <span className="text-xl font-bold text-primary">
                            {calculateItemPrice(item).toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground mr-1">ر.س</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-medium">{totalPrice.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الشحن</span>
                  <span className="font-medium">يحسب عند الدفع</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold text-lg">الإجمالي</span>
                  <div className="text-left">
                    <span className="text-2xl font-bold text-primary">
                      {totalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground mr-1">ر.س</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                  إتمام الطلب
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/products">متابعة التسوق</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
