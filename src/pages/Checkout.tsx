import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, MapPin, Phone, User, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/db/api';
import type { ShippingAddress, PaymentMethod } from '@/types';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    region: '',
    postal_code: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const validateForm = (): string | null => {
    if (!shippingAddress.full_name.trim()) {
      return 'يرجى إدخال الاسم الكامل';
    }
    if (!shippingAddress.phone.trim()) {
      return 'يرجى إدخال رقم الهاتف';
    }
    if (!/^(05|5)\d{8}$/.test(shippingAddress.phone.replace(/\s/g, ''))) {
      return 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 05 ويتكون من 10 أرقام)';
    }
    if (!shippingAddress.address_line1.trim()) {
      return 'يرجى إدخال العنوان';
    }
    if (!shippingAddress.city.trim()) {
      return 'يرجى إدخال المدينة';
    }
    if (!shippingAddress.region.trim()) {
      return 'يرجى إدخال المنطقة';
    }
    return null;
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast({
        title: 'السلة فارغة',
        description: 'يرجى إضافة منتجات إلى السلة أولاً',
        variant: 'destructive',
      });
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: 'يرجى إكمال جميع الحقول',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    try {
      const checkoutData = {
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        notes: notes.trim() || undefined,
      };

      const order = await api.createOrder(checkoutData, items, user?.id);

      // Clear cart
      await clearCart();

      // Navigate to success page
      navigate(`/order-success/${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      navigate('/order-failed');
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 xl:px-6">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">السلة فارغة</h2>
              <p className="text-muted-foreground mb-6">
                لا توجد منتجات في سلة التسوق
              </p>
              <Button onClick={() => navigate('/products')}>
                تصفح المنتجات
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4 xl:px-6">
        <h1 className="text-3xl font-bold mb-8">إتمام الطلب</h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="xl:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  عنوان التوصيل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">
                      الاسم الكامل <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="full_name"
                        value={shippingAddress.full_name}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="أدخل الاسم الكامل"
                        className="pr-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      رقم الهاتف <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="05xxxxxxxx"
                        className="pr-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_line1">
                    العنوان <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Home className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address_line1"
                      value={shippingAddress.address_line1}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, address_line1: e.target.value }))}
                      placeholder="الشارع، رقم المبنى"
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_line2">
                    تفاصيل إضافية (اختياري)
                  </Label>
                  <Input
                    id="address_line2"
                    value={shippingAddress.address_line2}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, address_line2: e.target.value }))}
                    placeholder="رقم الشقة، الدور، إلخ"
                  />
                </div>

                <div className="grid grid-cols-1 @md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      المدينة <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="المدينة"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">
                      المنطقة <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="region"
                      value={shippingAddress.region}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, region: e.target.value }))}
                      placeholder="المنطقة"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">
                      الرمز البريدي (اختياري)
                    </Label>
                    <Input
                      id="postal_code"
                      value={shippingAddress.postal_code}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, postal_code: e.target.value }))}
                      placeholder="12345"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  طريقة الدفع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-smooth">
                      <RadioGroupItem value="cash" id="payment-cash" />
                      <Label htmlFor="payment-cash" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Banknote className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">الدفع عند الاستلام</p>
                          <p className="text-sm text-muted-foreground">ادفع نقداً عند استلام الطلب</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-smooth">
                      <RadioGroupItem value="card" id="payment-card" />
                      <Label htmlFor="payment-card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">الدفع ببطاقة الائتمان</p>
                          <p className="text-sm text-muted-foreground">ادفع بأمان باستخدام بطاقتك</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>ملاحظات الطلب (اختياري)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أضف أي ملاحظات أو تعليمات خاصة بالطلب..."
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => {
                    let itemPrice = item.product.base_price;
                    
                    if (item.custom_options) {
                      const options = typeof item.custom_options === 'string' 
                        ? JSON.parse(item.custom_options) 
                        : item.custom_options;
                      
                      if (options.priceModifiers) {
                        const modifiersTotal = Object.values(options.priceModifiers as Record<string, number>)
                          .reduce((sum, mod) => sum + mod, 0);
                        itemPrice += modifiersTotal;
                      }
                    }

                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.image_url || 'https://via.placeholder.com/64'}
                            alt={item.product.name_ar}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.product.name_ar}</p>
                          <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                          <p className="text-sm font-medium text-primary">
                            {(itemPrice * item.quantity).toFixed(2)} ر.س
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المجموع الفرعي:</span>
                    <span className="font-medium">{getTotalPrice().toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الشحن:</span>
                    <span className="font-medium">مجاني</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الضريبة (15%):</span>
                    <span className="font-medium">{(getTotalPrice() * 0.15).toFixed(2)} ر.س</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">الإجمالي:</span>
                  <span className="text-2xl font-bold text-primary">
                    {(getTotalPrice() * 1.15).toFixed(2)} ر.س
                  </span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {processing ? 'جاري معالجة الطلب...' : 'تأكيد الطلب'}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  بالنقر على "تأكيد الطلب"، أنت توافق على شروط وأحكام الخدمة
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
