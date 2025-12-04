import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, X, ArrowRight, Save, Upload, ArrowLeft, ArrowRight as ArrowRightIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/db/api';
import type { Product, Category } from '@/types';
import { cn } from '@/lib/utils';

const TAX_RATE = 0.15; // 15% VAT

interface QuantityTier {
  quantity: string;
  price: string;
  total: number;
}

interface OptionRow {
  name: string;
  priceAddition: string;
}

// Multiple Image Upload Component
interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  className?: string;
}

function MultiImageUpload({
  value = [],
  onChange,
  max = 10,
  className,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed max
    if (value.length + files.length > max) {
      alert(`Maximum ${max} images allowed`);
      return;
    }

    setUploading(true);
    
    const uploadedUrls: string[] = [];
    
    // Simulate multiple file uploads
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Simulate upload delay (replace with actual upload)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      uploadedUrls.push(objectUrl);
    }
    
    if (uploadedUrls.length > 0) {
      // Add new images to existing ones
      onChange([...value, ...uploadedUrls]);
    }
    
    setUploading(false);
    // Clear the input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...value];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Current Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {value.map((url, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden border-2 border-muted bg-muted">
              <img
                src={url}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 z-10"
            >
              <X className="h-3 w-3" />
            </button>
            
            {/* Move buttons */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index - 1)}
                  className="bg-background/80 backdrop-blur-sm rounded-full p-1 hover:bg-background border"
                  title="Move left"
                >
                  <ArrowLeft className="h-3 w-3" />
                </button>
              )}
              {index < value.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index + 1)}
                  className="bg-background/80 backdrop-blur-sm rounded-full p-1 hover:bg-background border"
                  title="Move right"
                >
                  <ArrowRightIcon className="h-3 w-3" />
                </button>
              )}
            </div>
            
            {/* Image number indicator */}
            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center border">
              {index + 1}
            </div>
          </div>
        ))}
        
        {/* Upload button */}
        {value.length < max && (
          <label className="cursor-pointer">
            <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 flex flex-col items-center justify-center transition-all hover:bg-muted/30">
              {uploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-2"></div>
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Add Images</span>
                  <span className="text-xs text-muted-foreground mt-1">Click or drag</span>
                </>
              )}
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
          </label>
        )}
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {value.length} of {max} images uploaded
        </span>
        {value.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange([])}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove All
          </Button>
        )}
      </div>
    </div>
  );
}

export default function EnhancedProductForm() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Basic product info - now includes multiple images
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image_url: '', // Main image (single)
    images: [] as string[], // Additional images (multiple)
  });

  // Quantity tiers
  const [quantities, setQuantities] = useState<QuantityTier[]>([
    { quantity: '', price: '', total: 0 },
  ]);

  // Size options
  const [sizeOptions, setSizeOptions] = useState<OptionRow[]>([
    { name: '', priceAddition: '0' },
  ]);

  // Material options
  const [materialOptions, setMaterialOptions] = useState<OptionRow[]>([
    { name: '', priceAddition: '0' },
  ]);

  // Side options
  const [sideOptions, setSideOptions] = useState<OptionRow[]>([
    { name: '', priceAddition: '0' },
  ]);

  useEffect(() => {
    loadCategories();
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الفئات',
        variant: 'destructive',
      });
    }
  };

  const loadProduct = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      const product = await api.getProductById(productId);
      if (product) {
        // Load product data including multiple images
        setFormData({
          title: product.name_ar,
          description: product.description_ar || '',
          price: product.base_price.toString(),
          category: product.category_id || '',
          image_url: product.image_url || '',
          images: product.images || [], // Load multiple images array
        });

        // Load quantity tiers
        const tiers = await api.getProductQuantityTiers(productId);
        if (tiers.length > 0) {
          setQuantities(tiers.map(t => ({
            quantity: t.quantity.toString(),
            price: t.price.toString(),
            total: t.price,
          })));
        }

        // Load size options
        const sizes = await api.getProductSizeOptions(productId);
        if (sizes.length > 0) {
          setSizeOptions(sizes.map(s => ({
            name: s.name_ar,
            priceAddition: s.price_addition.toString(),
          })));
        }

        // Load material options
        const materials = await api.getProductMaterialOptions(productId);
        if (materials.length > 0) {
          setMaterialOptions(materials.map(m => ({
            name: m.name_ar,
            priceAddition: m.price_addition.toString(),
          })));
        }

        // Load side options
        const sides = await api.getProductSideOptions(productId);
        if (sides.length > 0) {
          setSideOptions(sides.map(s => ({
            name: s.name_ar,
            priceAddition: s.price_addition.toString(),
          })));
        }
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل بيانات المنتج',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultipleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const calculatePrice = (subtotal: number) => {
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const calculatedPrice = formData.price
    ? calculatePrice(parseFloat(formData.price) || 0)
    : { subtotal: 0, tax: 0, total: 0 };

  // Quantity tier handlers
  const handleQuantityChange = (index: number, field: 'quantity' | 'price', value: string) => {
    const newQuantities = [...quantities];
    newQuantities[index][field] = value;
    
    // Calculate total with tax
    if (field === 'price' && value) {
      const price = parseFloat(value) || 0;
      newQuantities[index].total = price * (1 + TAX_RATE);
    }
    
    setQuantities(newQuantities);
  };

  const addQuantityRow = () => {
    setQuantities([...quantities, { quantity: '', price: '', total: 0 }]);
  };

  const removeQuantityRow = (index: number) => {
    if (quantities.length > 1) {
      setQuantities(quantities.filter((_, i) => i !== index));
    }
  };

  // Option handlers
  const handleOptionChange = (
    type: 'size' | 'material' | 'side',
    index: number,
    field: 'name' | 'priceAddition',
    value: string
  ) => {
    const setter = type === 'size' ? setSizeOptions : type === 'material' ? setMaterialOptions : setSideOptions;
    const options = type === 'size' ? sizeOptions : type === 'material' ? materialOptions : sideOptions;
    
    const newOptions = [...options];
    newOptions[index][field] = value;
    setter(newOptions);
  };

  const addOption = (type: 'size' | 'material' | 'side') => {
    const setter = type === 'size' ? setSizeOptions : type === 'material' ? setMaterialOptions : setSideOptions;
    const options = type === 'size' ? sizeOptions : type === 'material' ? materialOptions : sideOptions;
    setter([...options, { name: '', priceAddition: '0' }]);
  };

  const removeOption = (type: 'size' | 'material' | 'side', index: number) => {
    const setter = type === 'size' ? setSizeOptions : type === 'material' ? setMaterialOptions : setSideOptions;
    const options = type === 'size' ? sizeOptions : type === 'material' ? materialOptions : sideOptions;
    
    if (options.length > 1) {
      setter(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    // Validate quantity tiers
    const validQuantities = quantities.filter(q => q.quantity && q.price);
    if (validQuantities.length === 0) {
      toast({
        title: 'خطأ',
        description: 'يرجى إضافة خيار كمية واحد على الأقل',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      // Prepare all images (main + additional)
      const allImages = [formData.image_url, ...formData.images].filter(img => img);

      // Create or update product
      const productData = {
        name_ar: formData.title,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
        description_ar: formData.description,
        category_id: formData.category,
        base_price: parseFloat(formData.price),
        image_url: formData.image_url || (allImages.length > 0 ? allImages[0] : ''),
        images: allImages, // Send all images array
        is_active: true,
        featured: false,
        min_quantity: 1,
        production_time_days: 3,
      };

      let savedProductId = productId;

      if (productId) {
        await api.updateProduct(productId, productData);
      } else {
        const newProduct = await api.createProduct(productData);
        savedProductId = newProduct?.id;
      }

      if (!savedProductId) {
        throw new Error('Failed to get product ID');
      }

      // Save quantity tiers
      await api.deleteAllProductQuantityTiers(savedProductId);
      for (const qty of validQuantities) {
        await api.createProductQuantityTier({
          product_id: savedProductId,
          quantity: parseInt(qty.quantity),
          price: parseFloat(qty.price),
        });
      }

      // Save size options
      const validSizes = sizeOptions.filter(s => s.name);
      await api.deleteAllProductSizeOptions(savedProductId);
      for (const size of validSizes) {
        await api.createProductSizeOption({
          product_id: savedProductId,
          name_ar: size.name,
          price_addition: parseFloat(size.priceAddition) || 0,
        });
      }

      // Save material options
      const validMaterials = materialOptions.filter(m => m.name);
      await api.deleteAllProductMaterialOptions(savedProductId);
      for (const material of validMaterials) {
        await api.createProductMaterialOption({
          product_id: savedProductId,
          name_ar: material.name,
          price_addition: parseFloat(material.priceAddition) || 0,
        });
      }

      // Save side options
      const validSides = sideOptions.filter(s => s.name);
      await api.deleteAllProductSideOptions(savedProductId);
      for (const side of validSides) {
        await api.createProductSideOption({
          product_id: savedProductId,
          name_ar: side.name,
          price_addition: parseFloat(side.priceAddition) || 0,
        });
      }

      toast({
        title: 'نجح',
        description: productId ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح',
      });

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حفظ المنتج',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const availableCategories = categories.filter(c => c.is_active);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto" dir="rtl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل بيانات المنتج...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {productId ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {productId ? 'تحديث معلومات المنتج وخياراته' : 'إنشاء منتج جديد مع جميع الخيارات'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/products')}>
          <ArrowRight className="ml-2 h-4 w-4" />
          رجوع
        </Button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات المنتج الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">اسم المنتج *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="مثال: باقة تصميم الشعار الاحترافية"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">وصف المنتج *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="اكتب وصفاً مفصلاً للمنتج أو الخدمة..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">السعر الأساسي (ر.س) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="1500"
                  
                />
              </div>
              <div>
                <Label htmlFor="category">الفئة *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  required
                >
                  <option value="">اختر الفئة</option>
                  {availableCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_ar}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  {availableCategories.length > 0
                    ? `متوفر ${availableCategories.length} فئة`
                    : 'جاري تحميل الفئات...'}
                </p>
              </div>
            </div>

            {/* Main Image Upload */}
            <div>
              <Label>الصورة الرئيسية للمنتج</Label>
              <div className="mt-2">
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => handleInputChange('image_url', url)}
                  onRemove={() => handleInputChange('image_url', '')}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                هذه الصورة ستظهر كصورة رئيسية للمنتج في القوائم والصفحات الرئيسية
              </p>
            </div>

            {/* Additional Images Upload */}
            <div>
              <Label>صور إضافية للمنتج</Label>
              <div className="mt-2">
                <MultiImageUpload
                  value={formData.images}
                  onChange={handleMultipleImagesChange}
                  max={10}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                يمكنك إضافة صور إضافية للمنتج لعرض زوايا مختلفة أو تفاصيل إضافية
              </p>
            </div>

            {/* Tax and Total Price Display */}
            {calculatedPrice.subtotal > 0 && (
              <div className="bg-gray-100 p-4 rounded-lg text-black">
                <h4 className="font-semibold text-sm mb-2">حساب السعر الأساسي</h4>
                <div className="flex justify-between text-sm">
                  <p>السعر الأساسي:</p>
                  <p className="font-medium">{calculatedPrice.subtotal.toFixed(2)} ر.س</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>ضريبة القيمة المضافة (15%):</p>
                  <p className="font-medium">{calculatedPrice.tax.toFixed(2)} ر.س</p>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-300">
                  <p>الإجمالي:</p>
                  <p>{calculatedPrice.total.toFixed(2)} ر.س</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quantity Options Section */}
        <Card>
          <CardHeader>
            <CardTitle>خيارات الكمية والأسعار</CardTitle>
            <p className="text-sm text-muted-foreground">
              أضف خيارات كمية مختلفة مع أسعارها (مثال: 100 نسخة بسعر 1500 ريال، 500 نسخة بسعر 6000 ريال)
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-black">
              {quantities.map((q, index) => (
                <div key={index} className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <Label htmlFor={`quantity-${index}`}>الكمية *</Label>
                    <Input
                      className="border-black"
                      id={`quantity-${index}`}
                      type="number"
                      placeholder="مثال: 100"
                      value={q.quantity}
                      onChange={(e) => handleQuantityChange(index, 'quantity', e.target.value)}
                      
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`price-${index}`}>السعر (ر.س) *</Label>
                    <Input
                      className="border-black"
                      id={`price-${index}`}
                      type="number"
                      placeholder="مثال: 1500"
                      value={q.price}
                      onChange={(e) => handleQuantityChange(index, 'price', e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-32 text-center">
                    <Label>الإجمالي شامل الضريبة</Label>
                    <div className="font-bold text-lg text-brand-yellow mt-1">
                      {q.total > 0 ? `${q.total.toFixed(2)} ر.س` : '--'}
                    </div>
                  </div>
                  {quantities.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeQuantityRow(index)}
                      className="mt-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={addQuantityRow}
              >
                <Plus className="h-4 w-4" />
                إضافة خيار كمية آخر
              </Button>

              <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                💡 <strong>ملاحظة:</strong> هذه الخيارات ستظهر للعميل ليختار الكمية المناسبة مع السعر المحدد لكل كمية.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Size Options */}
        <Card>
          <CardHeader>
            <CardTitle>خيارات المقاس مع الأسعار الإضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>المقاسات المتاحة والسعر الإضافي</Label>
              <div className="mt-2 space-y-2">
                {sizeOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      value={opt.name}
                      placeholder={`اسم المقاس ${i + 1}`}
                      onChange={(e) => handleOptionChange('size', i, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={opt.priceAddition}
                      placeholder="السعر الإضافي"
                      onChange={(e) => handleOptionChange('size', i, 'priceAddition', e.target.value)}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">ر.س</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeOption('size', i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addOption('size')}
                >
                  + إضافة مقاس آخر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Material Options */}
        <Card>
          <CardHeader>
            <CardTitle>خيارات المادة مع الأسعار الإضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>المواد المتاحة والسعر الإضافي</Label>
              <div className="mt-2 space-y-2">
                {materialOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      value={opt.name}
                      placeholder={`اسم المادة ${i + 1}`}
                      onChange={(e) => handleOptionChange('material', i, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={opt.priceAddition}
                      placeholder="السعر الإضافي"
                      onChange={(e) => handleOptionChange('material', i, 'priceAddition', e.target.value)}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">ر.س</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeOption('material', i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addOption('material')}
                >
                  + إضافة مادة أخرى
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Side Options */}
        <Card>
          <CardHeader>
            <CardTitle>خيارات الجانب (الطباعة) مع الأسعار الإضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>خيارات الجانب المتاحة والسعر الإضافي</Label>
              <div className="mt-2 space-y-2">
                {sideOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input
                      value={opt.name}
                      placeholder={`خيار الجانب ${i + 1}`}
                      onChange={(e) => handleOptionChange('side', i, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={opt.priceAddition}
                      placeholder="السعر الإضافي"
                      onChange={(e) => handleOptionChange('side', i, 'priceAddition', e.target.value)}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">ر.س</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeOption('side', i)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addOption('side')}
                >
                  + إضافة خيار جانب آخر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/admin/products')}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="ml-2 h-4 w-4" />
                {productId ? 'تحديث المنتج' : 'إضافة المنتج'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}