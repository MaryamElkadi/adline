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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/db/api';
import type { ProductWithOptions, ProductOptionTemplateWithValues } from '@/types';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<ProductWithOptions | null>(null);
  const [productOptions, setProductOptions] = useState<ProductOptionTemplateWithValues[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state - store selected value IDs
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [designFile, setDesignFile] = useState<File | null>(null);
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
        
        // Load product options
        const options = await api.getProductOptionsByProductId(data.id);
        setProductOptions(options);
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

  const handleOptionChange = (optionType: string, valueId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionType]: valueId,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'نوع ملف غير صالح',
        description: 'يرجى رفع صورة (JPG, PNG) أو ملف PDF فقط',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'حجم الملف كبير جداً',
        description: 'الحد الأقصى لحجم الملف هو 10 ميجابايت',
        variant: 'destructive',
      });
      return;
    }

    setDesignFile(file);
  };

  const calculateTotalPrice = (): number => {
    if (!product) return 0;

    let total = product.base_price;

    // Add price modifiers from selected options
    productOptions.forEach(template => {
      const selectedValueId = selectedOptions[template.option_type];
      if (selectedValueId) {
        const selectedValue = template.values.find(v => v.id === selectedValueId);
        if (selectedValue) {
          total += selectedValue.price_modifier;
        }
      }
    });

    return total;
  };

  const getPriceModifiers = (): Record<string, number> => {
    const modifiers: Record<string, number> = {};

    productOptions.forEach(template => {
      const selectedValueId = selectedOptions[template.option_type];
      if (selectedValueId) {
        const selectedValue = template.values.find(v => v.id === selectedValueId);
        if (selectedValue && selectedValue.price_modifier !== 0) {
          modifiers[template.option_type] = selectedValue.price_modifier;
        }
      }
    });

    return modifiers;
  };

  const validateForm = (): string | null => {
    // Check all required options
    for (const template of productOptions) {
      if (template.is_required && !selectedOptions[template.option_type]) {
        return `يرجى اختيار ${template.option_name_ar}`;
      }
    }

    // Check if design file is required
    const designServiceOption = productOptions.find(t => t.option_type === 'design_service');
    if (designServiceOption) {
      const selectedValueId = selectedOptions['design_service'];
      const selectedValue = designServiceOption.values.find(v => v.id === selectedValueId);
      
      if (selectedValue && selectedValue.value_ar.includes('رفع تصميمي') && !designFile) {
        return 'يرجى رفع ملف التصميم';
      }
    }

    // Check sample request
    if (!wantSample) {
      return 'يرجى اختيار ما إذا كنت تريد عينة';
    }

    return null;
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: 'يرجى إكمال جميع الحقول',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setAddingToCart(true);
    try {
      // Build custom options object with selected values
      const customOptions: Record<string, any> = {
        priceModifiers: getPriceModifiers(),
        wantSample,
      };

      productOptions.forEach(template => {
        const selectedValueId = selectedOptions[template.option_type];
        if (selectedValueId) {
          const selectedValue = template.values.find(v => v.id === selectedValueId);
          if (selectedValue) {
            customOptions[template.option_type] = {
              valueId: selectedValue.id,
              value: selectedValue.value_ar,
              priceModifier: selectedValue.price_modifier,
            };
          }
        }
      });

      if (designFile) {
        customOptions.designFileName = designFile.name;
      }

      await addItem(product.id, 1, customOptions);

      toast({
        title: 'تمت الإضافة إلى السلة',
        description: 'تم إضافة المنتج إلى سلة التسوق بنجاح',
      });

      // Reset form
      setSelectedOptions({});
      setDesignFile(null);
      setWantSample('');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'خطأ',
        description: 'فشل إضافة المنتج إلى السلة',
        variant: 'destructive',
      });
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
                    {/* Dynamic Options from Database */}
                    {productOptions.map((template) => (
                      <div key={template.id} className="space-y-2">
                        <Label htmlFor={template.option_type} className="text-base">
                          {template.option_name_ar} {template.is_required && <span className="text-destructive">*</span>}
                        </Label>
                        <Select
                          value={selectedOptions[template.option_type] || ''}
                          onValueChange={(value) => handleOptionChange(template.option_type, value)}
                        >
                          <SelectTrigger id={template.option_type}>
                            <SelectValue placeholder="اختر" />
                          </SelectTrigger>
                          <SelectContent>
                            {template.values.map((value) => (
                              <SelectItem key={value.id} value={value.id}>
                                <div className="flex items-center justify-between w-full gap-4">
                                  <span>{value.value_ar}</span>
                                  {value.price_modifier !== 0 && (
                                    <span className="text-xs text-primary font-medium">
                                      {value.price_modifier > 0 ? '+' : ''}
                                      {value.price_modifier.toFixed(2)} ر.س
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}

                    {/* File Upload - Show if design service is "upload" */}
                    {(() => {
                      const designServiceOption = productOptions.find(t => t.option_type === 'design_service');
                      if (!designServiceOption) return null;
                      
                      const selectedValueId = selectedOptions['design_service'];
                      const selectedValue = designServiceOption.values.find(v => v.id === selectedValueId);
                      
                      if (selectedValue && selectedValue.value_ar.includes('رفع تصميمي')) {
                        return (
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
                        );
                      }
                      return null;
                    })()}

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

                    {/* Price Display with Breakdown */}
                    <div className="pt-4 border-t space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">السعر الأساسي:</span>
                        <span className="font-medium">{product.base_price.toFixed(2)} ر.س</span>
                      </div>
                      
                      {/* Show price modifiers */}
                      {Object.entries(getPriceModifiers()).map(([optionType, modifier]) => {
                        const template = productOptions.find(t => t.option_type === optionType);
                        return (
                          <div key={optionType} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{template?.option_name_ar}:</span>
                            <span className="font-medium text-primary">
                              {modifier > 0 ? '+' : ''}{modifier.toFixed(2)} ر.س
                            </span>
                          </div>
                        );
                      })}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-lg font-semibold">السعر الإجمالي:</span>
                        <span className="text-2xl font-bold text-primary">
                          {calculateTotalPrice().toFixed(2)} ر.س
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
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
