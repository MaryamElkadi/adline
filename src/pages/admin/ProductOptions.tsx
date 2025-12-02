import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/db/api';
import type { ProductOptionTemplate, ProductOptionValue, Product } from '@/types';

export default function ProductOptions() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<ProductOptionTemplate[]>([]);
  const [values, setValues] = useState<ProductOptionValue[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Template form state
  const [templateForm, setTemplateForm] = useState({
    id: '',
    option_type: '',
    option_name_ar: '',
    option_name_en: '',
    is_required: false,
    display_order: 0,
  });

  // Value form state
  const [valueForm, setValueForm] = useState({
    id: '',
    template_id: '',
    value_ar: '',
    value_en: '',
    price_modifier: 0,
    is_available: true,
    display_order: 0,
  });

  // Assignment state
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [valueDialogOpen, setValueDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [templatesData, valuesData, productsData] = await Promise.all([
        api.getProductOptionTemplates(),
        api.getProductOptionValues(),
        api.getProducts(),
      ]);
      setTemplates(templatesData);
      setValues(valuesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل البيانات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      if (templateForm.id) {
        await api.updateProductOptionTemplate(templateForm.id, {
          option_type: templateForm.option_type,
          option_name_ar: templateForm.option_name_ar,
          option_name_en: templateForm.option_name_en,
          is_required: templateForm.is_required,
          display_order: templateForm.display_order,
        });
        toast({ title: 'تم التحديث', description: 'تم تحديث القالب بنجاح' });
      } else {
        await api.createProductOptionTemplate({
          option_type: templateForm.option_type,
          option_name_ar: templateForm.option_name_ar,
          option_name_en: templateForm.option_name_en,
          is_required: templateForm.is_required,
          display_order: templateForm.display_order,
        });
        toast({ title: 'تم الإنشاء', description: 'تم إنشاء القالب بنجاح' });
      }
      setTemplateDialogOpen(false);
      resetTemplateForm();
      loadData();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حفظ القالب',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القالب؟')) return;

    try {
      await api.deleteProductOptionTemplate(id);
      toast({ title: 'تم الحذف', description: 'تم حذف القالب بنجاح' });
      loadData();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حذف القالب',
        variant: 'destructive',
      });
    }
  };

  const handleSaveValue = async () => {
    try {
      if (valueForm.id) {
        await api.updateProductOptionValue(valueForm.id, {
          template_id: valueForm.template_id,
          value_ar: valueForm.value_ar,
          value_en: valueForm.value_en,
          price_modifier: valueForm.price_modifier,
          is_available: valueForm.is_available,
          display_order: valueForm.display_order,
        });
        toast({ title: 'تم التحديث', description: 'تم تحديث القيمة بنجاح' });
      } else {
        await api.createProductOptionValue({
          template_id: valueForm.template_id,
          value_ar: valueForm.value_ar,
          value_en: valueForm.value_en,
          price_modifier: valueForm.price_modifier,
          is_available: valueForm.is_available,
          display_order: valueForm.display_order,
        });
        toast({ title: 'تم الإنشاء', description: 'تم إنشاء القيمة بنجاح' });
      }
      setValueDialogOpen(false);
      resetValueForm();
      loadData();
    } catch (error) {
      console.error('Error saving value:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حفظ القيمة',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteValue = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه القيمة؟')) return;

    try {
      await api.deleteProductOptionValue(id);
      toast({ title: 'تم الحذف', description: 'تم حذف القيمة بنجاح' });
      loadData();
    } catch (error) {
      console.error('Error deleting value:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حذف القيمة',
        variant: 'destructive',
      });
    }
  };

  const handleAssignOption = async () => {
    if (!selectedProduct || !selectedTemplate) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار المنتج والخيار',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.assignOptionToProduct(selectedProduct, selectedTemplate);
      toast({ title: 'تم الربط', description: 'تم ربط الخيار بالمنتج بنجاح' });
      setSelectedProduct('');
      setSelectedTemplate('');
    } catch (error) {
      console.error('Error assigning option:', error);
      toast({
        title: 'خطأ',
        description: 'فشل ربط الخيار بالمنتج',
        variant: 'destructive',
      });
    }
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      id: '',
      option_type: '',
      option_name_ar: '',
      option_name_en: '',
      is_required: false,
      display_order: 0,
    });
  };

  const resetValueForm = () => {
    setValueForm({
      id: '',
      template_id: '',
      value_ar: '',
      value_en: '',
      price_modifier: 0,
      is_available: true,
      display_order: 0,
    });
  };

  const editTemplate = (template: ProductOptionTemplate) => {
    setTemplateForm({
      id: template.id,
      option_type: template.option_type,
      option_name_ar: template.option_name_ar,
      option_name_en: template.option_name_en || '',
      is_required: template.is_required,
      display_order: template.display_order,
    });
    setTemplateDialogOpen(true);
  };

  const editValue = (value: ProductOptionValue) => {
    setValueForm({
      id: value.id,
      template_id: value.template_id,
      value_ar: value.value_ar,
      value_en: value.value_en || '',
      price_modifier: value.price_modifier,
      is_available: value.is_available,
      display_order: value.display_order,
    });
    setValueDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة خيارات المنتجات</h1>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">قوالب الخيارات</TabsTrigger>
          <TabsTrigger value="values">قيم الخيارات</TabsTrigger>
          <TabsTrigger value="assign">ربط الخيارات بالمنتجات</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>قوالب الخيارات</CardTitle>
              <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetTemplateForm}>
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة قالب جديد
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {templateForm.id ? 'تعديل القالب' : 'إضافة قالب جديد'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="option_type">نوع الخيار</Label>
                      <Input
                        id="option_type"
                        value={templateForm.option_type}
                        onChange={(e) => setTemplateForm({ ...templateForm, option_type: e.target.value })}
                        placeholder="مثال: size, paper_type"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="option_name_ar">اسم الخيار (عربي)</Label>
                      <Input
                        id="option_name_ar"
                        value={templateForm.option_name_ar}
                        onChange={(e) => setTemplateForm({ ...templateForm, option_name_ar: e.target.value })}
                        placeholder="مثال: الحجم"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="option_name_en">اسم الخيار (إنجليزي)</Label>
                      <Input
                        id="option_name_en"
                        value={templateForm.option_name_en}
                        onChange={(e) => setTemplateForm({ ...templateForm, option_name_en: e.target.value })}
                        placeholder="Example: Size"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="display_order">ترتيب العرض</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={templateForm.display_order}
                        onChange={(e) => setTemplateForm({ ...templateForm, display_order: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_required"
                        checked={templateForm.is_required}
                        onCheckedChange={(checked) => setTemplateForm({ ...templateForm, is_required: checked })}
                      />
                      <Label htmlFor="is_required">خيار إلزامي</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveTemplate} className="flex-1">
                        <Save className="ml-2 h-4 w-4" />
                        حفظ
                      </Button>
                      <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
                        <X className="ml-2 h-4 w-4" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>نوع الخيار</TableHead>
                    <TableHead>الاسم (عربي)</TableHead>
                    <TableHead>الاسم (إنجليزي)</TableHead>
                    <TableHead>إلزامي</TableHead>
                    <TableHead>الترتيب</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-mono">{template.option_type}</TableCell>
                      <TableCell>{template.option_name_ar}</TableCell>
                      <TableCell>{template.option_name_en}</TableCell>
                      <TableCell>{template.is_required ? 'نعم' : 'لا'}</TableCell>
                      <TableCell>{template.display_order}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => editTemplate(template)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteTemplate(template.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Values Tab */}
        <TabsContent value="values">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>قيم الخيارات</CardTitle>
              <Dialog open={valueDialogOpen} onOpenChange={setValueDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetValueForm}>
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة قيمة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {valueForm.id ? 'تعديل القيمة' : 'إضافة قيمة جديدة'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="template_id">القالب</Label>
                      <Select
                        value={valueForm.template_id}
                        onValueChange={(value) => setValueForm({ ...valueForm, template_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر القالب" />
                        </SelectTrigger>
                        <SelectContent>
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.option_name_ar}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="value_ar">القيمة (عربي)</Label>
                      <Input
                        id="value_ar"
                        value={valueForm.value_ar}
                        onChange={(e) => setValueForm({ ...valueForm, value_ar: e.target.value })}
                        placeholder="مثال: كبير"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="value_en">القيمة (إنجليزي)</Label>
                      <Input
                        id="value_en"
                        value={valueForm.value_en}
                        onChange={(e) => setValueForm({ ...valueForm, value_en: e.target.value })}
                        placeholder="Example: Large"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price_modifier">تعديل السعر (ر.س)</Label>
                      <Input
                        id="price_modifier"
                        type="number"
                        step="0.01"
                        value={valueForm.price_modifier}
                        onChange={(e) => setValueForm({ ...valueForm, price_modifier: parseFloat(e.target.value) })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="value_display_order">ترتيب العرض</Label>
                      <Input
                        id="value_display_order"
                        type="number"
                        value={valueForm.display_order}
                        onChange={(e) => setValueForm({ ...valueForm, display_order: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_available"
                        checked={valueForm.is_available}
                        onCheckedChange={(checked) => setValueForm({ ...valueForm, is_available: checked })}
                      />
                      <Label htmlFor="is_available">متاح</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveValue} className="flex-1">
                        <Save className="ml-2 h-4 w-4" />
                        حفظ
                      </Button>
                      <Button variant="outline" onClick={() => setValueDialogOpen(false)}>
                        <X className="ml-2 h-4 w-4" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>القالب</TableHead>
                    <TableHead>القيمة (عربي)</TableHead>
                    <TableHead>القيمة (إنجليزي)</TableHead>
                    <TableHead>تعديل السعر</TableHead>
                    <TableHead>متاح</TableHead>
                    <TableHead>الترتيب</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {values.map((value) => {
                    const template = templates.find(t => t.id === value.template_id);
                    return (
                      <TableRow key={value.id}>
                        <TableCell>{template?.option_name_ar}</TableCell>
                        <TableCell>{value.value_ar}</TableCell>
                        <TableCell>{value.value_en}</TableCell>
                        <TableCell className={value.price_modifier > 0 ? 'text-green-600' : value.price_modifier < 0 ? 'text-red-600' : ''}>
                          {value.price_modifier > 0 ? '+' : ''}{value.price_modifier.toFixed(2)} ر.س
                        </TableCell>
                        <TableCell>{value.is_available ? 'نعم' : 'لا'}</TableCell>
                        <TableCell>{value.display_order}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => editValue(value)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteValue(value.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assign Tab */}
        <TabsContent value="assign">
          <Card>
            <CardHeader>
              <CardTitle>ربط الخيارات بالمنتجات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product">المنتج</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المنتج" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template">الخيار</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الخيار" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.option_name_ar}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAssignOption}>
                ربط الخيار بالمنتج
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
