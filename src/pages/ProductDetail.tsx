import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  
  // Form state
  const [size, setSize] = useState('');
  const [paperType, setPaperType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [side, setSide] = useState('');
  const [material, setMaterial] = useState('');
  const [designOption, setDesignOption] = useState('');
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [productionTime, setProductionTime] = useState('');
  const [wantSample, setWantSample] = useState('');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'نوع ملف غير صحيح',
          description: 'يرجى رفع صورة (JPG, PNG) أو ملف PDF',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'حجم الملف كبير جداً',
          description: 'الحد الأقصى لحجم الملف هو 10 ميجابايت',
          variant: 'destructive',
        });
        return;
      }
      setDesignFile(file);
    }
  };

  const validateForm = () => {
    if (!size) {
      toast({
        title: 'حقل مطلوب',
        description: 'يرجى اختيار المقاس',
        variant: 'destructive',
      });
      return false;
    }
    if (!paperType) {
      toast({
        title: 'حقل مطلوب',
        description: 'يرجى اختيار نوع الورق',
        variant: 'destructive',
      });
      return false;
    }
    if (!quantity) {
      toast({
        title: 'حقل مطلوب',
        description: 'يرجى اختيار الكمية',
        variant: 'destructive',
      });
      return false;
    }
    if (!side) {
      toast({
        title: 'حقل مطلوب',
        description: 'يرجى اختيار الجانب',
        variant: 'destructive',
      });
      return false;
    }
    if (!material) {
      toast({
        title: 'حقل مطلوب',
        description: 'يرجى اختيار المادة',
        variant: 'destructive',
      });
      return false;
    }
    if (!designOption) {
      toast({
        title: 'حقل مطلوب',
        description: 'يرجى اختيار خدمة التصميم',
        variant: 'destructive',
      });
      return false;
    }
    if (designOption === 'upload' && !designFile) {
      toast({
        title: 'ملف مطلوب',
        description: 'يرجى رفع ملف التصميم',
        variant: 'destructive',
      });
      return false;
    }
    if (!productionTime) {
      toast({
        title: 'حقل مطلوب',
        description: 'يرجى اختيار مدة التنفيذ',
        variant: 'destructive',
      });
      return false;
    }
    if (!wantSample) {
      toast({
        title: 'حقل مطلوب',
        description: 'يرجى تحديد إذا كنت تريد عينة',
        variant: 'destructive',
      });
      return false;
    }
    return true;
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

    if (!validateForm()) return;

    setAddingToCart(true);
    try {
      const customOptions = {
        size,
        paperType,
        side,
        material,
        designOption,
        designFileName: designFile?.name || '',
        productionTime,
        wantSample,
      };

      await addItem(product.id, parseInt(quantity), customOptions, '');
      
      // Reset form
      setSize('');
      setPaperType('');
      setQuantity('');
      setSide('');
      setMaterial('');
      setDesignOption('');
      setDesignFile(null);
      setProductionTime('');
      setWantSample('');
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
          {/* Product Image */}
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

          {/* Product Options Form */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-2">{product.name_ar}</h1>
                  {product.category && (
                    <p className="text-muted-foreground text-sm">
                      {product.category.name_ar}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">رقم الموديل:</span>
                    <span className="font-medium">{product.id.slice(0, 8)}</span>
                  </div>
                </div>

                <Tabs defaultValue="options" className="mb-6">
                  <TabsList className="w-full">
                    <TabsTrigger value="options" className="flex-1">خيارات المنتج</TabsTrigger>
                    <TabsTrigger value="description" className="flex-1">تفاصيل المنتج</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="options" className="space-y-4 mt-6">
                    {/* Size Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="size" className="text-base">
                        اختر المقاس <span className="text-destructive">*</span>
                      </Label>
                      <Select value={size} onValueChange={setSize}>
                        <SelectTrigger id="size">
                          <SelectValue placeholder="اختر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="33x48">33x48</SelectItem>
                          <SelectItem value="50x70">50x70</SelectItem>
                          <SelectItem value="a4">A4</SelectItem>
                          <SelectItem value="a5">A5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Paper Type Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="paperType" className="text-base">
                        اختر نوع الورق <span className="text-destructive">*</span>
                      </Label>
                      <Select value={paperType} onValueChange={setPaperType}>
                        <SelectTrigger id="paperType">
                          <SelectValue placeholder="اختر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="glossy-92">ورق تغليف 92 gm ثلجي</SelectItem>
                          <SelectItem value="matte-120">ورق مطفي 120 gm</SelectItem>
                          <SelectItem value="cardboard-300">كرتون 300 gm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quantity Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-base">
                        الكمية <span className="text-destructive">*</span>
                      </Label>
                      <Select value={quantity} onValueChange={setQuantity}>
                        <SelectTrigger id="quantity">
                          <SelectValue placeholder="اختر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="250">250</SelectItem>
                          <SelectItem value="500">500</SelectItem>
                          <SelectItem value="1000">1000</SelectItem>
                          <SelectItem value="2000">2000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Side Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="side" className="text-base">
                        الجانب <span className="text-destructive">*</span>
                      </Label>
                      <Select value={side} onValueChange={setSide}>
                        <SelectTrigger id="side">
                          <SelectValue placeholder="اختر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-side">وجه واحد</SelectItem>
                          <SelectItem value="two-sides">وجهين</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Material Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="material" className="text-base">
                        المادة <span className="text-destructive">*</span>
                      </Label>
                      <Select value={material} onValueChange={setMaterial}>
                        <SelectTrigger id="material">
                          <SelectValue placeholder="اختر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paper">ورق</SelectItem>
                          <SelectItem value="cardboard">كرتون</SelectItem>
                          <SelectItem value="vinyl">فينيل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Design Service */}
                    <div className="space-y-2">
                      <Label htmlFor="designOption" className="text-base">
                        خدمة التصميم <span className="text-destructive">*</span>
                      </Label>
                      <Select value={designOption} onValueChange={setDesignOption}>
                        <SelectTrigger id="designOption">
                          <SelectValue placeholder="اختر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upload">رفع التصميم الخاص بي</SelectItem>
                          <SelectItem value="modify">تعديل على تصميم موجود</SelectItem>
                          <SelectItem value="new">طلب تصميم جديد</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* File Upload */}
                    {designOption === 'upload' && (
                      <div className="space-y-2">
                        <Label htmlFor="designFile" className="text-base">
                          رفع ملف التصميم (صورة أو PDF) <span className="text-destructive">*</span>
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="designFile"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('designFile')?.click()}
                            className="w-full"
                          >
                            <Upload className="ml-2 h-4 w-4" />
                            {designFile ? designFile.name : 'اختر ملف'}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          الحد الأقصى: 10 ميجابايت (JPG, PNG, PDF)
                        </p>
                      </div>
                    )}

                    {/* Production Time */}
                    <div className="space-y-2">
                      <Label htmlFor="productionTime" className="text-base">
                        مدة التنفيذ للمنتج <span className="text-destructive">*</span>
                      </Label>
                      <Select value={productionTime} onValueChange={setProductionTime}>
                        <SelectTrigger id="productionTime">
                          <SelectValue placeholder="اختر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">عادي (5-7 أيام)</SelectItem>
                          <SelectItem value="express">سريع (2-3 أيام)</SelectItem>
                          <SelectItem value="urgent">عاجل (24 ساعة)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sample Request */}
                    <div className="space-y-2">
                      <Label className="text-base">
                        هل تريد عينة قبل التنفيذ؟ <span className="text-destructive">*</span>
                      </Label>
                      <RadioGroup value={wantSample} onValueChange={setWantSample}>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="yes" id="sample-yes" />
                            <Label htmlFor="sample-yes" className="cursor-pointer">نعم</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="no" id="sample-no" />
                            <Label htmlFor="sample-no" className="cursor-pointer">لا</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Price Display */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold">السعر الإجمالي:</span>
                        <span className="text-2xl font-bold text-primary">
                          {product.base_price.toFixed(2)} ر.س
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">
                        السعر شامل الضريبة
                      </p>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="w-full h-12 text-lg"
                      size="lg"
                    >
                      <ShoppingCart className="ml-2 h-5 w-5" />
                      {addingToCart ? 'جاري الإضافة...' : 'إضافة للسلة'}
                    </Button>
                  </TabsContent>

                  <TabsContent value="description" className="mt-6">
                    <div className="space-y-4">
                      {product.description_ar && (
                        <div>
                          <h3 className="font-semibold mb-2">الوصف</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {product.description_ar}
                          </p>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold mb-2">المواصفات</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• الحد الأدنى للطلب: {product.min_quantity} قطعة</li>
                          <li>• مدة التنفيذ: {product.production_time_days} أيام</li>
                          <li>• متوفر للطلب</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

