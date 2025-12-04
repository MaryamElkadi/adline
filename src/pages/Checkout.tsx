import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, MapPin, Phone, User, Home, FileText, Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/db/api';
import type { ShippingAddress, PaymentMethod, CreditCardData } from '@/types';
import { PLACEHOLDER_IMAGE_SMALL } from '@/lib/constants';
import TermsModal from '@/components/modals/TermsModal';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Credit Card validation utility
const validateCreditCard = (cardData: CreditCardData) => {
  const errors: Record<string, string> = {};

  // Card number validation (16 digits, can have spaces or dashes)
  const cleanedCardNumber = cardData.card_number.replace(/\s+/g, '').replace(/-/g, '');
  if (!/^\d{16}$/.test(cleanedCardNumber)) {
    errors.card_number = 'رقم البطاقة يجب أن يكون 16 رقمًا';
  }

  // Cardholder name validation
  if (!cardData.cardholder_name.trim()) {
    errors.cardholder_name = 'يرجى إدخال اسم حامل البطاقة';
  }

  // Expiry month validation
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  if (!cardData.expiry_month || parseInt(cardData.expiry_month) < 1 || parseInt(cardData.expiry_month) > 12) {
    errors.expiry_month = 'شهر انتهاء الصلاحية غير صحيح';
  }

  if (!cardData.expiry_year || parseInt(cardData.expiry_year) < currentYear) {
    errors.expiry_year = 'سنة انتهاء الصلاحية غير صحيحة';
  } else if (parseInt(cardData.expiry_year) === currentYear && 
             parseInt(cardData.expiry_month) < currentMonth) {
    errors.expiry_month = 'البطاقة منتهية الصلاحية';
  }

  // CVV validation (3 or 4 digits)
  if (!/^\d{3,4}$/.test(cardData.cvv)) {
    errors.cvv = 'CVV يجب أن يكون 3 أو 4 أرقام';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Format card number for display
const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];
  
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  
  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

// Get card type from number
const getCardType = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s+/g, '');
  
  // Mada cards start with 4
  if (/^4/.test(cleaned)) {
    return 'mada';
  }
  // Visa starts with 4
  if (/^4/.test(cleaned)) {
    return 'visa';
  }
  // MasterCard starts with 5
  if (/^5[1-5]/.test(cleaned)) {
    return 'mastercard';
  }
  
  return 'unknown';
};

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
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Credit card state
  const [cardData, setCardData] = useState<CreditCardData>({
    card_number: '',
    cardholder_name: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
  });

  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [isCardSaved, setIsCardSaved] = useState(false);

  // Generate years for expiry dropdown (next 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString());
  
  // Months for expiry dropdown
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCardDataChange = (field: keyof CreditCardData, value: string) => {
    let formattedValue = value;
    
    // Format card number with spaces
    if (field === 'card_number') {
      formattedValue = formatCardNumber(value);
    }
    
    // Format expiry month/year
    if (field === 'expiry_month' && value.length <= 2) {
      if (value.length === 2 && !value.includes('/')) {
        formattedValue = value;
      } else if (value.length === 1 && parseInt(value) > 1) {
        formattedValue = `0${value}`;
      }
    }
    
    if (field === 'expiry_year' && value.length > 4) {
      formattedValue = value.slice(0, 4);
    }
    
    setCardData(prev => ({
      ...prev,
      [field]: formattedValue,
    }));
    
    // Clear error for this field when user starts typing
    if (cardErrors[field]) {
      setCardErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): string | null => {
    if (!shippingAddress.full_name.trim()) {
      return 'يرجى إدخال الاسم الكامل';
    }
    if (!shippingAddress.phone.trim()) {
      return 'يرجى إدخال رقم الهاتف';
    }
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

    // Validate credit card if selected
    if (paymentMethod === 'card') {
      const validation = validateCreditCard(cardData);
      if (!validation.isValid) {
        setCardErrors(validation.errors);
        return 'يرجى التحقق من معلومات البطاقة';
      }
      setCardErrors({});
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
      setShowTermsModal(true);
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

      // Process payment if credit card is selected
      if (paymentMethod === 'card') {
        try {
          const subtotal = getTotalPrice();
          const taxRate = 0.15;
          const taxAmount = subtotal * taxRate;
          const total = subtotal + taxAmount;

          // Simulate payment processing
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

          // Mock payment processing - replace with actual payment gateway integration
          const paymentResult = {
            success: true,
            transaction_id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            authorization_code: `AUTH_${Math.random().toString(36).substr(2, 6)}`,
            amount: total,
            currency: 'SAR',
            timestamp: new Date().toISOString(),
          };

          if (!paymentResult.success) {
            toast({
              title: 'فشل الدفع',
              description: 'حدث خطأ أثناء معالجة الدفع',
              variant: 'destructive',
            });
            navigate('/order-failed');
            return;
          }

          toast({
            title: 'تم الدفع بنجاح',
            description: `تمت معالجة الدفع بمبلغ ${total.toFixed(2)} ر.س`,
          });

        } catch (paymentError) {
          console.error('Payment error:', paymentError);
          toast({
            title: 'خطأ في الدفع',
            description: 'حدث خطأ أثناء معالجة الدفع',
            variant: 'destructive',
          });
          navigate('/order-failed');
          return;
        }
      }

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

  const handleSaveCard = () => {
    if (isCardSaved) {
      setIsCardSaved(false);
      toast({
        title: 'تمت الإزالة',
        description: 'تمت إزالة معلومات البطاقة',
      });
    } else {
      const validation = validateCreditCard(cardData);
      if (!validation.isValid) {
        setCardErrors(validation.errors);
        toast({
          title: 'خطأ في معلومات البطاقة',
          description: 'يرجى التحقق من معلومات البطاقة قبل الحفظ',
          variant: 'destructive',
        });
        return;
      }

      setIsCardSaved(true);
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ معلومات البطاقة بأمان',
      });
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
  const shippingCost = 0;
  const cardType = getCardType(cardData.card_number);

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
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 space-x-reverse border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="cash" id="cash" />
                      <Banknote className="h-5 w-5 text-green-600 ml-2" />
                      <div className="flex-1">
                        <Label htmlFor="cash" className="font-medium cursor-pointer">
                          الدفع عند الاستلام (كاش)
                        </Label>
                        <p className="text-sm text-muted-foreground">ادفع نقداً عند استلام الطلب</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 space-x-reverse border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="h-5 w-5 text-blue-600 ml-2" />
                      <div className="flex-1">
                        <Label htmlFor="card" className="font-medium cursor-pointer">
                          الدفع ببطاقة ائتمانية
                        </Label>
                        <p className="text-sm text-muted-foreground">ادفع بأمان باستخدام بطاقة مدى أو Visa/Mastercard</p>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* Credit Card Form - Show only when card payment is selected */}
                  {paymentMethod === 'card' && (
                    <div className="mt-6 space-y-6">
                      <Alert className="bg-blue-50 border-blue-200">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-700 text-sm">
                          جميع معلومات الدفع مشفرة وآمنة. نحن لا نخزن أي بيانات بطاقة على خوادمنا.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="card_number">رقم البطاقة</Label>
                          <div className="relative">
                            <Input
                              id="card_number"
                              value={cardData.card_number}
                              onChange={(e) => handleCardDataChange('card_number', e.target.value)}
                              placeholder="1234 5678 9012 3456"
                              className="pr-12"
                              maxLength={19}
                            />
                            {cardType && (
                              <div className="absolute left-3 top-3">
                                {cardType === 'mada' && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">مدى</span>
                                )}
                                {cardType === 'visa' && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Visa</span>
                                )}
                                {cardType === 'mastercard' && (
                                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Mastercard</span>
                                )}
                              </div>
                            )}
                          </div>
                          {cardErrors.card_number && (
                            <p className="text-sm text-destructive">{cardErrors.card_number}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardholder_name">اسم حامل البطاقة</Label>
                          <Input
                            id="cardholder_name"
                            value={cardData.cardholder_name}
                            onChange={(e) => handleCardDataChange('cardholder_name', e.target.value)}
                            placeholder="كما هو مكتوب على البطاقة"
                          />
                          {cardErrors.cardholder_name && (
                            <p className="text-sm text-destructive">{cardErrors.cardholder_name}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry_month">انتهاء الصلاحية</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Select
                                value={cardData.expiry_month}
                                onValueChange={(value) => handleCardDataChange('expiry_month', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="الشهر" />
                                </SelectTrigger>
                                <SelectContent>
                                  {months.map((month) => (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select
                                value={cardData.expiry_year}
                                onValueChange={(value) => handleCardDataChange('expiry_year', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="السنة" />
                                </SelectTrigger>
                                <SelectContent>
                                  {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {(cardErrors.expiry_month || cardErrors.expiry_year) && (
                              <p className="text-sm text-destructive">
                                {cardErrors.expiry_month || cardErrors.expiry_year}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cvv">رمز الأمان (CVV)</Label>
                            <div className="relative">
                              <Input
                                id="cvv"
                                type="password"
                                value={cardData.cvv}
                                onChange={(e) => handleCardDataChange('cvv', e.target.value)}
                                placeholder="123"
                                maxLength={4}
                                className="pr-10"
                              />
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                            {cardErrors.cvv && (
                              <p className="text-sm text-destructive">{cardErrors.cvv}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                              id="save_card"
                              checked={isCardSaved}
                              onCheckedChange={handleSaveCard}
                            />
                            <Label htmlFor="save_card" className="text-sm cursor-pointer">
                              حفظ هذه البطاقة للمرة القادمة
                            </Label>
                          </div>
                          {isCardSaved && (
                            <Badge variant="secondary" className="text-xs">
                              محفوظة ✓
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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

                  <div className="pt-4">
                    <div className="flex items-center space-x-2 space-x-reverse mb-4">
                      <Checkbox
                        id="terms"
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor="terms" className="text-sm cursor-pointer">
                          أوافق على{' '}
                          <button
                            type="button"
                            onClick={() => setShowTermsModal(true)}
                            className="text-primary hover:underline focus:outline-none"
                          >
                            الشروط والأحكام وسياسة الخصوصية
                          </button>
                        </Label>
                      </div>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={processing}
                      className="w-full py-6 text-lg"
                      size="lg"
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          جاري معالجة الطلب...
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5 ml-2" />
                          {paymentMethod === 'card' ? 'ادفع الآن' : 'تأكيد الطلب'}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-3">
                      <Shield className="h-3 w-3 inline ml-1" />
                      جميع معاملاتك مشفرة وآمنة
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <TermsModal
        open={showTermsModal}
        onOpenChange={setShowTermsModal}
        onAccept={() => {
          setAcceptedTerms(true);
          setShowTermsModal(false);
        }}
      />
    </>
  );
}