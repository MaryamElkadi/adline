import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, MapPin, Phone, User, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/db/api';
import type { ShippingAddress, PaymentMethod } from '@/types';
import { PLACEHOLDER_IMAGE_SMALL } from '@/lib/constants';
// The TermsModal import should now resolve correctly
import TermsModal from '@/components/modals/TermsModal'; 

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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false); // Modal state

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (!shippingAddress.full_name.trim()) {
      return 'يرجى إدخال الاسم الكامل';
    }
    if (!shippingAddress.phone.trim()) {
      return 'يرجى إدخال رقم الهاتف';
    }
    // Updated phone validation to allow both 05 and 5 prefixes
    if (!/^(05|5)\d{8}$/.test(shippingAddress.phone.replace(/\s/g, ''))) {
      return 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 05 أو 5 ويتكون من 10 أرقام)';
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

    if (!acceptedTerms) {
      toast({
        title: 'الشروط والأحكام',
        description: 'يرجى الموافقة على الشروط والأحكام للمتابعة',
        variant: 'destructive',
      });
      setShowTermsModal(true); // Show modal when terms not accepted
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

  const subtotal = getTotalPrice();
  const taxRate = 0.15;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  const shippingCost = 0; // Assuming free shipping

  return (
    <>
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
                  {/* Shipping Address Form Fields - FIX APPLIED HERE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        الاسم الكامل
                      </Label>
                      <Input
                        id="full_name"
                        value={shippingAddress.full_name}
                        onChange={handleAddressChange}
                        placeholder="أدخل الاسم الكامل"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        رقم الهاتف (مثال: 05xxxxxxx)
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={handleAddressChange}
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_line1" className="flex items-center gap-1">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      الشارع/اسم الحي/المبنى
                    </Label>
                    <Input
                      id="address_line1"
                      value={shippingAddress.address_line1}
                      onChange={handleAddressChange}
                      placeholder="رقم الشارع، اسم الحي، رقم المبنى"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_line2">وصف إضافي (اختياري)</Label>
                    <Input
                      id="address_line2"
                      value={shippingAddress.address_line2}
                      onChange={handleAddressChange}
                      placeholder="شقة، طابق، معلومات إضافية"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">المدينة</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        placeholder="الرياض"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">المنطقة/المقاطعة</Label>
                      <Input
                        id="region"
                        value={shippingAddress.region}
                        onChange={handleAddressChange}
                        placeholder="المنطقة الوسطى"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal_code">الرمز البريدي (اختياري)</Label>
                      <Input
                        id="postal_code"
                        value={shippingAddress.postal_code}
                        onChange={handleAddressChange}
                        placeholder="11564"
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
                  {/* Payment Method Options - FIX APPLIED HERE */}
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 space-x-reverse border p-4 rounded-lg">
                      <RadioGroupItem value="cash" id="cash" />
                      <Banknote className="h-5 w-5 text-green-600 ml-2" />
                      <Label htmlFor="cash" className="font-medium">
                        الدفع عند الاستلام (كاش)
                      </Label>
                    </div>
                    
                    {/* Placeholder for Card/Online payment */}
                    <div className="flex items-center space-x-3 space-x-reverse border p-4 rounded-lg opacity-50 cursor-not-allowed">
                      <RadioGroupItem value="card" id="card" disabled />
                      <CreditCard className="h-5 w-5 text-blue-600 ml-2" />
                      <Label htmlFor="card" className="font-medium">
                        بطاقة ائتمانية (غير متاح حالياً)
                      </Label>
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
                    placeholder="أضف أي ملاحظات أو تعليمات خاصة بالطلب (مثل: وقت التوصيل المفضل، ملاحظات للسائق)..."
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
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {items.map((item) => {
                      let basePrice = item.product.base_price;
                      let optionsPrice = 0;
                      
                      if (item.selected_options && item.product?.options) {
                        Object.entries(item.selected_options).forEach(([optionId, _selectedValue]) => {
                          const option = item.product.options.find(opt => opt.id === optionId);
                          if (option && option.price_modifier) {
                            optionsPrice += option.price_modifier;
                          }
                        });
                      }

                      // Calculate the total price for this item's quantity
                      const itemTotal = (basePrice + optionsPrice) * item.quantity;

                      return (
                        <div key={item.id} className="flex gap-3">
                          <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                            <img
                              src={item.product.image_url || PLACEHOLDER_IMAGE_SMALL}
                              alt={item.product.name_ar}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.product.name_ar}</p>
                            <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                            {/* Display single item price for context */}
                            <p className="text-sm text-muted-foreground">
                              سعر الوحدة: {(basePrice + optionsPrice).toFixed(2)} ر.س
                            </p>
                            <p className="text-sm font-bold text-primary">
                              الإجمالي: {itemTotal.toFixed(2)} ر.س
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
                      <span className="font-medium">{subtotal.toFixed(2)} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">الشحن:</span>
                      <span className="font-medium">{shippingCost === 0 ? 'مجاني' : `${shippingCost.toFixed(2)} ر.س`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">الضريبة (15%):</span>
                      <span className="font-medium">{taxAmount.toFixed(2)} ر.س</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">الإجمالي:</span>
                    <span className="text-2xl font-bold text-primary">
                      {total.toFixed(2)} ر.س
                    </span>
                  </div>

                  {/* Updated Terms and Conditions Section */}
                  <div className="flex items-start gap-3 p-4 border rounded-lg bg-muted/30">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="terms"
                        className="text-sm leading-relaxed cursor-pointer block mb-1"
                      >
                        أوافق على الشروط والأحكام وسياسة الخصوصية
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-primary hover:underline"
                          onClick={() => setShowTermsModal(true)}
                        >
                          <FileText className="h-3 w-3 ml-1" />
                          عرض الشروط والأحكام
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          (مطلوب للمتابعة)
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={processing || !acceptedTerms}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    {processing ? 'جاري معالجة الطلب...' : 'تأكيد الطلب'}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    بالنقر على "تأكيد الطلب"، سيتم إنشاء طلبك وإرساله للمعالجة
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsModal
        open={showTermsModal}
        onOpenChange={setShowTermsModal}
        onAccept={() => setAcceptedTerms(true)}
      />
    </>
  );
}