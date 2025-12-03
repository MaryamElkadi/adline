import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Upload, Plus, Minus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { api } from '@/db/api';
import type { ProductWithOptions } from '@/types';

// --- Interfaces for Product Options ---
interface ProductOptionType {
  id: string;
  name_ar: string;
  price_addition: number;
  type: 'size' | 'material' | 'side' | 'custom';
  product_id: string;
  description_ar?: string;
}

interface QuantityTier {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
}

// --- Reusable Option Group Component ---
interface Option {
  id: string;
  name_ar: string;
  price_addition: number;
}

interface OptionGroupListProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  tooltipContent: string;
}

function OptionGroupList({ label, options, selectedValue, onSelect, tooltipContent }: OptionGroupListProps) {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label className="text-base flex items-center gap-2">
        {label}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipContent}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Option to select none/default - only for optional fields */}
        {label !== 'الكمية' && (
          <Button
            type="button"
            variant={!selectedValue ? "default" : "outline"}
            onClick={() => onSelect('')}
            className="justify-center"
          >
            بدون تحديد
          </Button>
        )}
        {/* List of available options */}
        {options.map((option) => (
          <Button
            key={option.id}
            type="button"
            variant={selectedValue === option.id ? "default" : "outline"}
            onClick={() => onSelect(option.id)}
            className="h-auto py-3 justify-between"
          >
            <span>{option.name_ar}</span>
            {option.price_addition !== 0 && (
              <span className={`text-sm px-2 py-1 rounded ${option.price_addition > 0 ? 'bg-primary/20' : 'bg-green-100 text-green-800'}`}>
                {option.price_addition > 0 ? '+' : ''}{option.price_addition.toFixed(2)} ر.س
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
// --- End Reusable Option Group Component ---

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [product, setProduct] = useState<ProductWithOptions | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Dynamic product options from different tables
  const [sizeOptions, setSizeOptions] = useState<ProductOptionType[]>([]);
  const [materialOptions, setMaterialOptions] = useState<ProductOptionType[]>([]);
  const [sideOptions, setSideOptions] = useState<ProductOptionType[]>([]);
  const [customOptions, setCustomOptions] = useState<ProductOptionType[]>([]);
  const [quantityTiers, setQuantityTiers] = useState<QuantityTier[]>([]);
  
  // Form state
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedSide, setSelectedSide] = useState<string>('');
  const [selectedCustomOptions, setSelectedCustomOptions] = useState<Record<string, boolean>>({});
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [selectedQuantityId, setSelectedQuantityId] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState(0);
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [customText, setCustomText] = useState('');

  // Load product and options
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await api.getProductBySlug(slug!);
        setProduct(productData);
        setUnitPrice(productData.base_price);
        setSelectedQuantity(productData.min_quantity || 1);

        // Load all options in parallel
        await Promise.all([
          loadSizeOptions(productData.id),
          loadMaterialOptions(productData.id),
          loadSideOptions(productData.id),
          loadQuantityTiers(productData.id),
        ]);
      } catch (error) {
        console.error('Error loading product:', error);
        toast({
          title: 'خطأ',
          description: 'فشل تحميل المنتج',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProduct();
    }
  }, [slug, toast]);

  // Create quantity options for OptionGroupList
  const quantityOptions = useMemo(() => {
    if (!product) return [];

    const minQty = product.min_quantity || 1;
    const options: Option[] = [];

    // Add minimum quantity as base option
    options.push({
      id: `qty_${minQty}`,
      name_ar: `${minQty} قطعة`,
      price_addition: 0,
    });

    // Add quantity tiers if available
    quantityTiers.forEach(tier => {
      const priceDifference = tier.price - product.base_price;
      options.push({
        id: tier.id,
        name_ar: `${tier.quantity} قطعة`,
        price_addition: priceDifference,
      });
    });

    return options;
  }, [product, quantityTiers]);

  // Set initial selected quantity ID
  useEffect(() => {
    if (product && quantityOptions.length > 0) {
      const minQty = product.min_quantity || 1;
      setSelectedQuantityId(`qty_${minQty}`);
    }
  }, [product, quantityOptions]);

  // Calculate unit price based on selected quantity
  useEffect(() => {
    if (!product) return;

    let price = product.base_price;
    
    // Check if selected quantity qualifies for a tier
    if (selectedQuantity > (product.min_quantity || 1)) {
      const tier = quantityTiers
        .sort((a, b) => b.quantity - a.quantity)
        .find(t => selectedQuantity >= t.quantity);
      
      if (tier) {
        price = tier.price;
      }
    }

    setUnitPrice(price);
  }, [selectedQuantity, product, quantityTiers]);

  // Load options functions
  const loadSizeOptions = async (productId: string) => {
    try {
      const options = await api.getProductSizeOptions(productId);
      setSizeOptions(options.map(opt => ({
        id: opt.id,
        name_ar: opt.name_ar,
        price_addition: opt.price_addition,
        type: 'size' as const,
        product_id: productId
      })));
    } catch (error) {
      console.error('Error loading size options:', error);
    }
  };

  const loadMaterialOptions = async (productId: string) => {
    try {
      const options = await api.getProductMaterialOptions(productId);
      setMaterialOptions(options.map(opt => ({
        id: opt.id,
        name_ar: opt.name_ar,
        price_addition: opt.price_addition,
        type: 'material' as const,
        product_id: productId
      })));
    } catch (error) {
      console.error('Error loading material options:', error);
    }
  };

  const loadSideOptions = async (productId: string) => {
    try {
      const options = await api.getProductSideOptions(productId);
      setSideOptions(options.map(opt => ({
        id: opt.id,
        name_ar: opt.name_ar,
        price_addition: opt.price_addition,
        type: 'side' as const,
        product_id: productId
      })));
    } catch (error) {
      console.error('Error loading side options:', error);
    }
  };

  const loadQuantityTiers = async (productId: string) => {
    try {
      const tiers = await api.getProductQuantityTiers(productId);
      setQuantityTiers(tiers);
    } catch (error) {
      console.error('Error loading quantity tiers:', error);
    }
  };

  // Handle quantity selection
  const handleQuantitySelect = useCallback((value: string) => {
    if (!value) return;

    // Handle base quantity (qty_XX format)
    if (value.startsWith('qty_')) {
      const qty = parseInt(value.replace('qty_', ''));
      setSelectedQuantity(qty);
      setSelectedQuantityId(value);
      return;
    }

    // Handle tier quantity
    const tier = quantityTiers.find(t => t.id === value);
    if (tier) {
      setSelectedQuantity(tier.quantity);
      setSelectedQuantityId(value);
    }
  }, [quantityTiers]);

  // Calculate total price
  const { totalPrice, finalUnitPrice, priceBreakdown } = useMemo(() => {
    if (!product) {
      return { totalPrice: 0, finalUnitPrice: 0, priceBreakdown: [] };
    }

    let price = unitPrice;
    const breakdown = [];

    // Add base price to breakdown
    breakdown.push({
      label: 'السعر الأساسي',
      value: product.base_price,
      isTotal: false
    });

    // Check quantity tier pricing
    if (selectedQuantity > (product.min_quantity || 1)) {
      const tier = quantityTiers
        .sort((a, b) => b.quantity - a.quantity)
        .find(t => selectedQuantity >= t.quantity);
      
      if (tier && tier.price !== product.base_price) {
        breakdown.push({
          label: `خصم الكمية (${tier.quantity}+)`,
          value: tier.price - product.base_price,
          isTotal: false,
          isDiscount: true
        });
        price = tier.price;
      }
    }

    // Add size option price if selected
    if (selectedSize) {
      const size = sizeOptions.find(s => s.id === selectedSize);
      if (size && size.price_addition !== 0) {
        price += size.price_addition;
        breakdown.push({
          label: `الحجم: ${size.name_ar}`,
          value: size.price_addition,
          isTotal: false
        });
      }
    }

    // Add material option price if selected
    if (selectedMaterial) {
      const material = materialOptions.find(m => m.id === selectedMaterial);
      if (material && material.price_addition !== 0) {
        price += material.price_addition;
        breakdown.push({
          label: `المادة: ${material.name_ar}`,
          value: material.price_addition,
          isTotal: false
        });
      }
    }

    // Add side option price if selected
    if (selectedSide) {
      const side = sideOptions.find(s => s.id === selectedSide);
      if (side && side.price_addition !== 0) {
        price += side.price_addition;
        breakdown.push({
          label: `الوجه: ${side.name_ar}`,
          value: side.price_addition,
          isTotal: false
        });
      }
    }

    const finalUnitPrice = price;
    const totalPrice = finalUnitPrice * selectedQuantity;

    return { totalPrice, finalUnitPrice, priceBreakdown: breakdown };
  }, [
    product, 
    unitPrice, 
    selectedQuantity, 
    quantityTiers, 
    selectedSize, 
    selectedMaterial, 
    selectedSide, 
    sizeOptions, 
    materialOptions, 
    sideOptions
  ]);

  // Handle custom option toggle
  const handleCustomOptionToggle = useCallback((optionId: string) => {
    setSelectedCustomOptions(prev => ({
      ...prev,
      [optionId]: !prev[optionId]
    }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'نوع ملف غير صالح',
        description: 'الرجاء رفع صورة (JPG, PNG) أو ملف PDF فقط',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'الملف كبير جداً',
        description: 'الحد الأقصى لحجم الملف هو 10 ميجابايت',
        variant: 'destructive',
      });
      return;
    }

    setDesignFile(file);
  }, [toast]);

  const handleAddToCart = async () => {
    if (!product) return;

    // Basic validation
    const minQuantity = product.min_quantity || 1;
    if (selectedQuantity < minQuantity) {
      toast({
        title: 'خطأ في الكمية',
        description: `الحد الأدنى للطلب هو ${minQuantity} قطعة`,
        variant: 'destructive',
      });
      return;
    }

    setAddingToCart(true);
    try {
      // Build custom options object
      const customOptionsObj: Record<string, any> = {
        base_price: unitPrice,
        final_unit_price: finalUnitPrice,
      };

      // Check if quantity tier was applied
      if (quantityTiers.length > 0) {
        const tier = quantityTiers
          .sort((a, b) => b.quantity - a.quantity)
          .find(t => selectedQuantity >= t.quantity);
        if (tier && tier.price !== unitPrice) {
          customOptionsObj.quantity_tier_applied = true;
          customOptionsObj.tier_price = tier.price;
          customOptionsObj.tier_quantity = tier.quantity;
        }
      }

      // Add selected options with their details
      if (selectedSize) {
        const size = sizeOptions.find(s => s.id === selectedSize);
        if (size) {
          customOptionsObj.size = {
            id: size.id,
            name: size.name_ar,
            price_addition: size.price_addition
          };
        }
      }

      if (selectedMaterial) {
        const material = materialOptions.find(m => m.id === selectedMaterial);
        if (material) {
          customOptionsObj.material = {
            id: material.id,
            name: material.name_ar,
            price_addition: material.price_addition
          };
        }
      }

      if (selectedSide) {
        const side = sideOptions.find(s => s.id === selectedSide);
        if (side) {
          customOptionsObj.side = {
            id: side.id,
            name: side.name_ar,
            price_addition: side.price_addition
          };
        }
      }

      // Add custom text if provided
      if (customText.trim()) {
        customOptionsObj.custom_text = customText.trim();
      }

      // Add design file info
      if (designFile) {
        customOptionsObj.design_file = {
          name: designFile.name,
          size: designFile.size,
          type: designFile.type
        };
      }

      await addItem(product.id, selectedQuantity, customOptionsObj, notes.trim() || undefined);

      toast({
        title: 'تمت الإضافة إلى السلة',
        description: 'تمت إضافة المنتج إلى سلة التسوق بنجاح',
      });

      // Reset form
      const minQty = product.min_quantity || 1;
      setSelectedQuantity(minQty);
      setSelectedQuantityId(`qty_${minQty}`);
      setDesignFile(null);
      setCustomText('');
      setNotes('');

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'خطأ',
        description: error instanceof Error ? error.message : 'فشل إضافة المنتج إلى السلة',
        variant: 'destructive',
      });
    } finally {
      setAddingToCart(false);
    }
  };

  // Clear all selections
  const clearAllSelections = useCallback(() => {
    setSelectedSize('');
    setSelectedMaterial('');
    setSelectedSide('');
    setSelectedCustomOptions({});
    setCustomText('');
    setNotes('');
    setDesignFile(null);
    
    if (product) {
      const minQty = product.min_quantity || 1;
      setSelectedQuantity(minQty);
      setSelectedQuantityId(`qty_${minQty}`);
    }
    
    toast({
      title: 'تم إعادة التعيين',
      description: 'تم مسح جميع الاختيارات',
    });
  }, [product, toast]);

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
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 xl:px-6 text-center">
          <h1 className="text-2xl font-bold text-destructive">المنتج غير موجود</h1>
          <Button onClick={() => navigate('/products')} className="mt-4">
            تصفح المنتجات
          </Button>
        </div>
      </div>
    );
  }

  const minQuantity = product.min_quantity || 1;
  const hasAnyOptions = sizeOptions.length > 0 || materialOptions.length > 0 || sideOptions.length > 0 || customOptions.length > 0;

  return (
    <div className="min-h-screen bg-background py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 xl:px-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
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
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600';
                  }}
                />
              </div>
            </Card>
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
                  <p className="text-lg font-semibold text-primary mt-2">
                    السعر الأساسي: {product.base_price.toFixed(2)} ر.س
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    جميع الخيارات أدناه اختيارية - يمكنك إضافة المنتج بالسعر الأساسي
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Quantity Options - Now using OptionGroupList */}
                  <OptionGroupList
                    label="الكمية"
                    options={quantityOptions}
                    selectedValue={selectedQuantityId}
                    onSelect={handleQuantitySelect}
                    tooltipContent="اختر كمية الطباعة المناسبة للحصول على سعر مخفّض"
                  />

                  {/* Show selected quantity info */}
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm font-medium">
                      الكمية المحددة: <span className="text-primary font-bold">{selectedQuantity} قطعة</span>
                    </p>
                    {selectedQuantity > minQuantity && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ تحصل على سعر مخفّض للكميات الكبيرة
                      </p>
                    )}
                  </div>

                  {/* Optional Options Header */}
                  {hasAnyOptions && (
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">خيارات إضافية (اختيارية)</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllSelections}
                          className="text-xs"
                        >
                          مسح الكل
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Size Options */}
                  <OptionGroupList
                    label="الحجم"
                    options={sizeOptions}
                    selectedValue={selectedSize}
                    onSelect={setSelectedSize}
                    tooltipContent="اختيار الحجم المناسب للمنتج"
                  />

                  {/* Material Options */}
                  <OptionGroupList
                    label="المادة"
                    options={materialOptions}
                    selectedValue={selectedMaterial}
                    onSelect={setSelectedMaterial}
                    tooltipContent="اختيار نوع المادة المستخدمة"
                  />

                  {/* Side Options */}
                  <OptionGroupList
                    label="الوجه"
                    options={sideOptions}
                    selectedValue={selectedSide}
                    onSelect={setSelectedSide}
                    tooltipContent="عدد الوجوه المطلوبة للمنتج"
                  />

                  {/* Custom Text Input - Optional */}
                  <div className="space-y-2">
                    <Label htmlFor="customText" className="text-base">
                      نص مخصص (اختياري)
                    </Label>
                    <Input
                      id="customText"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="أدخل النص المطلوب طباعته..."
                    />
                  </div>

                  {/* File Upload - Optional */}
                  <div className="space-y-2">
                    <Label htmlFor="designFile" className="text-base">
                      رفع تصميم (اختياري)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="designFile"
                        type="file"
                        accept="image/*,.pdf,.ai,.eps,.cdr"
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
                      {designFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setDesignFile(null)}
                          className="text-destructive"
                        >
                          إزالة
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      الحجم الأقصى: 10 ميجابايت (صور، PDF، AI، EPS، CDR)
                    </p>
                  </div>

                  {/* Notes - Optional */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-base">
                      ملاحظات إضافية (اختياري)
                    </Label>
                    <Input
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="أي متطلبات أو تفاصيل إضافية..."
                    />
                  </div>

                  {/* Price Display */}
                  <Card className="bg-muted/50">
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">تفاصيل السعر</h3>
                        
                        {priceBreakdown.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.label}
                              {item.isDiscount && ' 🔻'}
                            </span>
                            <span className={`font-medium ${item.isDiscount ? 'text-green-600' : item.value < 0 ? 'text-green-600' : 'text-foreground'}`}>
                              {item.value > 0 && !item.isDiscount ? '+' : ''}
                              {item.value.toFixed(2)} ر.س
                              {item.isDiscount && ' (خصم)'}
                            </span>
                          </div>
                        ))}

                        {priceBreakdown.length === 1 && (
                          <div className="text-center py-2 text-muted-foreground text-sm">
                            لم يتم اختيار أي خيارات إضافية
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm pt-2 border-t">
                          <span className="text-muted-foreground">سعر القطعة الواحدة:</span>
                          <span className="font-bold text-primary">
                            {finalUnitPrice.toFixed(2)} ر.س
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">الكمية:</span>
                          <span className="font-medium">×{selectedQuantity}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-lg font-semibold">السعر الإجمالي:</span>
                          <span className="text-2xl font-bold text-primary">
                            {totalPrice.toFixed(2)} ر.س
                          </span>
                        </div>
                      </div>
                      
                      {quantityTiers.length > 0 && (
                        <div className="mt-3 p-3 bg-primary/5 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-2">
                            💡 خصومات الكمية المتاحة:
                          </p>
                          <div className="space-y-1">
                            {quantityTiers
                              .sort((a, b) => a.quantity - b.quantity)
                              .map((tier, index) => (
                                <div key={index} className="flex justify-between text-xs">
                                  <span>{tier.quantity}+ قطع</span>
                                  <span className="font-medium text-green-600">
                                    {tier.price.toFixed(2)} ر.س للقطعة
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="w-full h-12 text-lg"
                  >
                    <ShoppingCart className="ml-2 h-5 w-5" />
                    {addingToCart ? 'جاري الإضافة...' : `أضف ${selectedQuantity} إلى السلة`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}