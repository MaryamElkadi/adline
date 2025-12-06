import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Percent, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { api } from '@/db/api';
import type { SeasonalOffer } from '@/types';

export default function SeasonalOffers() {
  const [offers, setOffers] = useState<SeasonalOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SeasonalOffer | null>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      title_ar: '',
      description_ar: '',
      discount_percentage: 0,
      start_date: '',
      end_date: '',
      image_url: '',
      is_active: true,
    },
  });

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const data = await api.getSeasonalOffers();
      setOffers(data);
    } catch (error: any) {
      console.error('خطأ في تحميل العروض:', error);
      const errorMessage = error?.message?.includes('schema cache') 
        ? 'جاري تحديث قاعدة البيانات. يرجى الانتظار 30 ثانية ثم إعادة المحاولة.'
        : error?.message || 'فشل تحميل العروض الموسمية. يرجى إعادة تحميل الصفحة.';
      
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      if (editingOffer) {
        await api.updateSeasonalOffer(editingOffer.id, values);
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث العرض بنجاح',
        });
      } else {
        await api.createSeasonalOffer(values);
        toast({
          title: 'تم الإضافة',
          description: 'تم إضافة العرض بنجاح',
        });
      }
      setDialogOpen(false);
      form.reset();
      setEditingOffer(null);
      loadOffers();
    } catch (error: any) {
      console.error('خطأ في حفظ العرض:', error);
      
      let errorMessage = 'فشل حفظ العرض. يرجى التحقق من البيانات المدخلة.';
      
      if (error?.message?.includes('schema cache')) {
        errorMessage = 'جاري تحديث قاعدة البيانات. يرجى الانتظار 30 ثانية ثم إعادة المحاولة.';
      } else if (error?.message?.includes('date')) {
        errorMessage = 'يرجى التحقق من التواريخ. يجب أن يكون تاريخ النهاية بعد تاريخ البداية.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'خطأ',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (offer: SeasonalOffer) => {
    setEditingOffer(offer);
    form.reset({
      title_ar: offer.title_ar,
      description_ar: offer.description_ar,
      discount_percentage: offer.discount_percentage || 0,
      start_date: offer.start_date.split('T')[0],
      end_date: offer.end_date.split('T')[0],
      image_url: offer.image_url || '',
      is_active: offer.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return;

    try {
      await api.deleteSeasonalOffer(id);
      toast({
        title: 'تم الحذف',
        description: 'تم حذف العرض بنجاح',
      });
      loadOffers();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل حذف العرض',
        variant: 'destructive',
      });
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingOffer(null);
    form.reset();
  };

  const isOfferActive = (offer: SeasonalOffer) => {
    if (!offer.is_active) return false;
    const now = new Date();
    const start = new Date(offer.start_date);
    const end = new Date(offer.end_date);
    return now >= start && now <= end;
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">العروض الموسمية</h1>
          <p className="text-muted-foreground mt-1">إدارة العروض والخصومات الموسمية</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingOffer(null)}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة عرض جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>
                {editingOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title_ar"
                  rules={{ required: 'العنوان مطلوب' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عنوان العرض</FormLabel>
                      <FormControl>
                        <Input placeholder="مثال: عرض رمضان الخاص" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description_ar"
                  rules={{ required: 'الوصف مطلوب' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وصف العرض</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="وصف تفصيلي للعرض..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discount_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نسبة الخصم (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رابط الصورة</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    rules={{ required: 'تاريخ البداية مطلوب' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تاريخ البداية</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    rules={{ 
                      required: 'تاريخ النهاية مطلوب',
                      validate: (value) => {
                        const startDate = form.getValues('start_date');
                        if (startDate && value && value <= startDate) {
                          return 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
                        }
                        return true;
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تاريخ النهاية</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">تفعيل العرض</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          يمكن للمستخدمين رؤية العرض عند تفعيله
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    إلغاء
                  </Button>
                  <Button type="submit">
                    {editingOffer ? 'تحديث' : 'إضافة'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      ) : offers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">لا توجد عروض موسمية حالياً</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{offer.title_ar}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {isOfferActive(offer) ? (
                        <Badge className="bg-green-500">نشط</Badge>
                      ) : offer.is_active ? (
                        <Badge variant="secondary">معلق</Badge>
                      ) : (
                        <Badge variant="outline">غير نشط</Badge>
                      )}
                      {offer.discount_percentage && (
                        <Badge variant="outline" className="gap-1">
                          <Percent className="h-3 w-3" />
                          {offer.discount_percentage}% خصم
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(offer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(offer.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {offer.image_url && (
                  <div className="mb-4 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={offer.image_url}
                      alt={offer.title_ar}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {offer.description_ar}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>من: {new Date(offer.start_date).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>إلى: {new Date(offer.end_date).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}