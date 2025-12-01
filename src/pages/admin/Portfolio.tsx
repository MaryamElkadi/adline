import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Star } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/db/api';
import type { PortfolioItem } from '@/types';

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<PortfolioItem | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title_ar: '',
    description_ar: '',
    category: '',
    image_url: '',
    client_name: '',
    completion_date: '',
    is_featured: false,
    display_order: 0,
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getPortfolioItems();
      setItems(data);
    } catch (error) {
      console.error('خطأ في تحميل الأعمال:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الأعمال',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title_ar: '',
      description_ar: '',
      category: '',
      image_url: '',
      client_name: '',
      completion_date: '',
      is_featured: false,
      display_order: 0,
    });
    setDialogOpen(true);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title_ar: item.title_ar,
      description_ar: item.description_ar || '',
      category: item.category || '',
      image_url: item.image_url || '',
      client_name: item.client_name || '',
      completion_date: item.completion_date || '',
      is_featured: item.is_featured,
      display_order: item.display_order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title_ar.trim()) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال عنوان العمل',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingItem) {
        await api.updatePortfolioItem(editingItem.id, {
          ...formData,
          images: [],
        });
        toast({
          title: 'نجح',
          description: 'تم تحديث العمل بنجاح',
        });
      } else {
        await api.createPortfolioItem({
          ...formData,
          images: [],
        });
        toast({
          title: 'نجح',
          description: 'تم إضافة العمل بنجاح',
        });
      }
      setDialogOpen(false);
      loadItems();
    } catch (error) {
      console.error('خطأ في حفظ العمل:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حفظ العمل',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    try {
      await api.deletePortfolioItem(deletingItem.id);
      toast({
        title: 'نجح',
        description: 'تم حذف العمل بنجاح',
      });
      setDeleteDialogOpen(false);
      setDeletingItem(null);
      loadItems();
    } catch (error) {
      console.error('خطأ في حذف العمل:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حذف العمل',
        variant: 'destructive',
      });
    }
  };

  const filteredItems = items.filter((item) =>
    item.title_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">معرض الأعمال</h1>
          <p className="text-muted-foreground">إدارة أعمالنا ومشاريعنا المنجزة</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة عمل جديد
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في الأعمال..."
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
                  <TableHead>الصورة</TableHead>
                  <TableHead>العنوان</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>تاريخ الإنجاز</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الترتيب</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      لا توجد أعمال
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title_ar}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                            لا توجد صورة
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.title_ar}</TableCell>
                      <TableCell>
                        {item.category ? (
                          <Badge variant="outline">{item.category}</Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{item.client_name || '-'}</TableCell>
                      <TableCell>
                        {item.completion_date
                          ? new Date(item.completion_date).toLocaleDateString('ar-SA')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {item.is_featured && (
                          <Badge className="gap-1">
                            <Star className="h-3 w-3" />
                            مميز
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.display_order}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingItem(item);
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
            <DialogTitle>{editingItem ? 'تعديل العمل' : 'إضافة عمل جديد'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'تحديث معلومات العمل' : 'إضافة عمل جديد إلى معرض الأعمال'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title_ar">عنوان العمل *</Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                placeholder="مثال: دعوات زفاف فاخرة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_ar">الوصف</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                placeholder="وصف تفصيلي للعمل..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">الفئة</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="مثال: حفلات الزفاف"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_name">اسم العميل</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="اختياري"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="completion_date">تاريخ الإنجاز</Label>
                <Input
                  id="completion_date"
                  type="date"
                  value={formData.completion_date}
                  onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">ترتيب العرض</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">صورة العمل</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                onRemove={() => setFormData({ ...formData, image_url: '' })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured">عمل مميز</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              {editingItem ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف العمل "{deletingItem?.title_ar}" نهائياً. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
