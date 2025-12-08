import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, X, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/db/api';
import type { Product, Category, ProductOptionTemplate, ProductOptionValue } from '@/types';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [optionTemplates, setOptionTemplates] = useState<ProductOptionTemplate[]>([]);
  const [optionValues, setOptionValues] = useState<ProductOptionValue[]>([]);
  const [expandedOptions, setExpandedOptions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name_ar: '',
    slug: '',
    description_ar: '',
    category_id: '',
    base_price: 0,
    image_url: '',
    images: [] as string[],
    is_active: true,
    featured: false,
    min_quantity: 1,
    production_time_days: 3,
    selected_option_ids: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData, templatesData, valuesData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getProductOptionTemplates(),
        api.getProductOptionValues(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setOptionTemplates(templatesData);
      setOptionValues(valuesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate slug from Arabic text
  const generateSlug = (text: string): string => {
    // Use timestamp-based slug for Arabic text since Arabic characters can't be used in URLs
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return `product-${timestamp}-${randomNum}`;
  };

  const handleGenerateSlug = () => {
    if (formData.name_ar) {
      const slug = generateSlug(formData.name_ar);
      setFormData({ ...formData, slug });
    }
  };

  const handleOpenDialog = async (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      
      // Load assigned options for this product
      const assignments = await api.getProductOptionAssignments();
      const productAssignments = assignments.filter(a => a.product_id === product.id);
      const assignedOptionIds = productAssignments.map(a => a.template_id);
      
      setFormData({
        name_ar: product.name_ar,
        slug: product.slug,
        description_ar: product.description_ar || '',
        category_id: product.category_id || '',
        base_price: product.base_price,
        image_url: product.image_url || '',
        images: product.images || [],
        is_active: product.is_active,
        featured: product.featured,
        min_quantity: product.min_quantity,
        production_time_days: product.production_time_days,
        selected_option_ids: assignedOptionIds,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name_ar: '',
        slug: '',
        description_ar: '',
        category_id: '',
        base_price: 0,
        image_url: '',
        images: [],
        is_active: true,
        featured: false,
        min_quantity: 1,
        production_time_days: 3,
        selected_option_ids: [],
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name_ar.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال اسم المنتج',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.slug.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال الرابط المختصر (Slug)',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.category_id) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار الفئة',
        variant: 'destructive',
      });
      return;
    }

    try {
      let productId: string;
      
      // Prepare product data (exclude selected_option_ids which is not part of Product type)
      const { selected_option_ids, ...productData } = formData;
      
      // Convert empty string category_id to null (but validation should prevent this)
      if (productData.category_id === '') {
        console.warn('category_id is empty string, converting to null');
        productData.category_id = null;
      }
      
      // Ensure images is an array (not undefined)
      if (!productData.images) {
        productData.images = [];
      }
      
      // Ensure all required fields are present
      if (!productData.name_ar || !productData.slug) {
        throw new Error('اسم المنتج والرابط المختصر مطلوبان');
      }
      
      // Ensure numeric fields are numbers
      productData.base_price = Number(productData.base_price) || 0;
      productData.min_quantity = Number(productData.min_quantity) || 1;
      productData.production_time_days = Number(productData.production_time_days) || 3;
      
      console.log('Saving product with data:', JSON.stringify(productData, null, 2));
      
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
        productId = editingProduct.id;
        toast({
          title: 'نجح',
          description: 'تم تحديث المنتج بنجاح',
        });
      } else {
        const newProduct = await api.createProduct(productData);
        productId = newProduct.id;
        toast({
          title: 'نجح',
          description: 'تم إضافة المنتج بنجاح',
        });
      }
      
      // Update option assignments
      const currentAssignments = await api.getProductOptionAssignments();
      const productAssignments = currentAssignments.filter(a => a.product_id === productId);
      const currentOptionIds = productAssignments.map(a => a.template_id);
      
      // Remove unselected options
      for (const assignment of productAssignments) {
        if (!formData.selected_option_ids.includes(assignment.template_id)) {
          await api.deleteProductOptionAssignment(assignment.id);
        }
      }
      
      // Add newly selected options
      for (const templateId of formData.selected_option_ids) {
        if (!currentOptionIds.includes(templateId)) {
          await api.assignOptionToProduct(productId, templateId);
        }
      }
      
      setDialogOpen(false);
      loadData();
    } catch (error: any) {
      console.error('Error saving product:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        formData: formData
      });
      
      let errorMessage = 'فشل حفظ المنتج';
      
      // Check for specific errors
      if (error?.message?.includes('duplicate') || error?.message?.includes('unique') || error?.code === '23505') {
        errorMessage = 'الرابط المختصر (Slug) مستخدم بالفعل. يرجى استخدام رابط مختلف';
      } else if (error?.message?.includes('foreign key') || error?.message?.includes('category') || error?.code === '23503') {
        errorMessage = 'الفئة المحددة غير صالحة';
      } else if (error?.message?.includes('null value') || error?.code === '23502') {
        errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
      } else if (error?.message) {
        // Show the actual error message for debugging
        errorMessage = `فشل حفظ المنتج: ${error.message}`;
      }
      
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      await api.deleteProduct(deletingProduct.id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      setDeleteDialogOpen(false);
      setDeletingProduct(null);
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name_ar.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={() => navigate('/admin/products/new')}>
          <Plus className="ml-2 h-4 w-4" />
          Add Product (Enhanced)
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                          {product.image_url && (
                            <img
                              src={product.image_url}
                              alt={product.name_ar}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name_ar}</p>
                          {product.featured && (
                            <Badge variant="secondary" className="mt-1">Featured</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {categories.find(c => c.id === product.category_id)?.name_ar || '-'}
                      </TableCell>
                      <TableCell>{product.base_price.toFixed(2)} SAR</TableCell>
                      <TableCell>
                        <Badge variant={product.is_active ? 'default' : 'secondary'}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Navigating to options for product:', product.id);
                              navigate(`/admin/products/${product.id}/options`);
                            }}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Options
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                            title="Edit Product (Enhanced Form)"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingProduct(product);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'تحديث معلومات المنتج' : 'إنشاء منتج جديد'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name_ar">اسم المنتج (بالعربية) *</Label>
                <Input
                  id="name_ar"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  placeholder="أدخل اسم المنتج"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">الرابط المختصر (Slug) *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateSlug}
                    disabled={!formData.name_ar}
                  >
                    توليد تلقائي
                  </Button>
                </div>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="product-slug"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">
                  الرابط المختصر يجب أن يكون فريداً ويستخدم في عنوان URL
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_ar">الوصف (بالعربية)</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                placeholder="أدخل وصف المنتج"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">الفئة *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name_ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="base_price">السعر الأساسي (ريال) *</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_quantity">الحد الأدنى للكمية *</Label>
                <Input
                  id="min_quantity"
                  type="number"
                  value={formData.min_quantity}
                  onChange={(e) => setFormData({ ...formData, min_quantity: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="production_time_days">مدة الإنتاج (أيام) *</Label>
                <Input
                  id="production_time_days"
                  type="number"
                  value={formData.production_time_days}
                  onChange={(e) => setFormData({ ...formData, production_time_days: parseInt(e.target.value) || 3 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">صورة المنتج</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                onRemove={() => setFormData({ ...formData, image_url: '' })}
              />
            </div>

            <div className="space-y-2">
              <Label>خيارات المنتج</Label>
              <p className="text-sm text-muted-foreground mb-2">
                اختر الخيارات التي يمكن للعملاء الاختيار منها لهذا المنتج
              </p>
              <div className="border rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
                {optionTemplates.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    لا توجد خيارات متاحة. قم بإنشاء الخيارات في صفحة خيارات المنتج أولاً.
                  </p>
                ) : (
                  optionTemplates.map((template) => {
                    const templateValues = optionValues.filter(v => v.template_id === template.id);
                    const isExpanded = expandedOptions.has(template.id);
                    const isChecked = formData.selected_option_ids.includes(template.id);
                    
                    return (
                      <div key={template.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="checkbox"
                              id={`option-${template.id}`}
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    selected_option_ids: [...formData.selected_option_ids, template.id],
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    selected_option_ids: formData.selected_option_ids.filter(id => id !== template.id),
                                  });
                                }
                              }}
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`option-${template.id}`} className="cursor-pointer font-medium">
                              {template.option_name_en} ({template.option_name_ar})
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={template.is_required ? 'default' : 'secondary'} className="text-xs">
                              {template.is_required ? 'Required' : 'Optional'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.option_type}
                            </Badge>
                            {templateValues.length > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newExpanded = new Set(expandedOptions);
                                  if (isExpanded) {
                                    newExpanded.delete(template.id);
                                  } else {
                                    newExpanded.add(template.id);
                                  }
                                  setExpandedOptions(newExpanded);
                                }}
                                className="h-6 w-6 p-0"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {isExpanded && templateValues.length > 0 && (
                          <div className="ml-6 mt-2 space-y-1 bg-muted/50 rounded p-2">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Available Values:</p>
                            {templateValues.map((value) => (
                              <div key={value.id} className="flex items-center justify-between text-sm py-1">
                                <span className="text-foreground">
                                  {value.value_en} ({value.value_ar})
                                </span>
                                <span className={`font-medium ${value.price_modifier > 0 ? 'text-green-600' : value.price_modifier < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                                  {value.price_modifier > 0 ? '+' : ''}{value.price_modifier} SAR
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {templateValues.length === 0 && (
                          <p className="ml-6 text-xs text-muted-foreground italic">
                            No values defined for this option
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              {formData.selected_option_ids.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {formData.selected_option_ids.length} option(s) selected
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              {editingProduct ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{deletingProduct?.name_ar}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}