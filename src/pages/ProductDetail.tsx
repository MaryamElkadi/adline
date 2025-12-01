import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Package, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/db/api';
import type { ProductWithOptions } from '@/types';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<ProductWithOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const data = await api.getProductBySlug(slug);
      if (data) {
        setProduct(data);
      } else {
        toast({
          title: 'المنتج غير موجود',
          description: 'لم يتم العثور على المنتج المطلوب',
          variant: 'destructive',
        });
        navigate('/products');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل تفاصيل المنتج',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (optionType: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionType]: optionId,
    }));
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;

    let total = product.base_price;

    Object.values(selectedOptions).forEach((optionId) => {
      const option = product.options.find((opt) => opt.id === optionId);
      if (option) {
        total += option.price_modifier;
      }
    });

    return total * quantity;
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: 'تسجيل الدخول مطلوب',
        description: 'يرجى تسجيل الدخول لإضافة منتجات إلى السلة',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    if (!product) return;

    if (quantity < product.min_quantity) {
      toast({
        title: 'كمية غير صحيحة',
        description: `الحد الأدنى للطلب هو ${product.min_quantity} قطعة`,
        variant: 'destructive',
      });
      return;
    }

    setAddingToCart(true);
    try {
      await addItem(product.id, quantity, selectedOptions, notes);
      setQuantity(1);
      setSelectedOptions({});
      setNotes('');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <Card className="animate-pulse">
              <div className="aspect-square bg-muted" />
            </Card>
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-6 bg-muted rounded w-2/3 animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const optionsByType = product.options.reduce((acc, option) => {
    if (!acc[option.option_type]) {
      acc[option.option_type] = [];
    }
    acc[option.option_type].push(option);
    return acc;
  }, {} as Record<string, typeof product.options>);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 xl:px-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة
        </Button>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div>
            <Card className="overflow-hidden">
              <div className="aspect-square bg-muted">
                <img
                  src={product.image_url || 'https://via.placeholder.com/600'}
                  alt={product.name_ar}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {product.images.map((image, index) => (
                  <Card key={index} className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-smooth">
                    <div className="aspect-square bg-muted">
                      <img
                        src={image}
                        alt={`${product.name_ar} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{product.name_ar}</h1>
                {product.featured && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    مميز
                  </Badge>
                )}
              </div>
              {product.category && (
                <p className="text-muted-foreground">
                  الفئة: {product.category.name_ar}
                </p>
              )}
            </div>

            {product.description_ar && (
              <div>
                <h3 className="font-semibold mb-2">الوصف</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description_ar}
                </p>
              </div>
            )}

            <Separator />

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Package className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">الحد الأدنى</p>
                  <p className="font-semibold">{product.min_quantity} قطعة</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">مدة التنفيذ</p>
                  <p className="font-semibold">{product.production_time_days} أيام</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">الحالة</p>
                  <p className="font-semibold text-green-600">متوفر</p>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {Object.keys(optionsByType).length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">خيارات التخصيص</h3>
                {Object.entries(optionsByType).map(([type, options]) => (
                  <div key={type} className="space-y-2">
                    <Label>{type}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {options.map((option) => (
                        <Button
                          key={option.id}
                          variant={selectedOptions[type] === option.id ? 'default' : 'outline'}
                          onClick={() => handleOptionChange(type, option.id)}
                          className="justify-between"
                        >
                          <span>{option.option_name_ar}</span>
                          {option.price_modifier !== 0 && (
                            <span className="text-xs">
                              {option.price_modifier > 0 ? '+' : ''}
                              {option.price_modifier.toFixed(2)} ر.س
                            </span>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="quantity">الكمية</Label>
              <Input
                id="quantity"
                type="number"
                min={product.min_quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(product.min_quantity, parseInt(e.target.value) || product.min_quantity))}
              />
              <p className="text-xs text-muted-foreground">
                الحد الأدنى: {product.min_quantity} قطعة
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أضف أي ملاحظات أو متطلبات خاصة..."
                rows={3}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">السعر الإجمالي:</span>
                <div className="text-left">
                  <span className="text-3xl font-bold text-primary">
                    {calculateTotalPrice().toFixed(2)}
                  </span>
                  <span className="text-lg text-muted-foreground mr-2">ر.س</span>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="ml-2 h-5 w-5" />
                {addingToCart ? 'جاري الإضافة...' : 'إضافة إلى السلة'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
