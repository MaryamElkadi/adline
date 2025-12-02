import { useEffect, useState } from 'react';
import { Mail, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/db/api';
import type { Service } from '@/types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [inquiryForm, setInquiryForm] = useState({
    customer_name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await api.getServices();
      // Only show active services to users
      setServices(data.filter(s => s.is_active));
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الخدمات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInquire = (service: Service) => {
    setSelectedService(service);
    setInquiryDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setInquiryDialogOpen(false);
    setSelectedService(null);
    setInquiryForm({
      customer_name: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  const handleSubmitInquiry = async () => {
    if (!selectedService) return;

    if (!inquiryForm.customer_name || !inquiryForm.email || !inquiryForm.message) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inquiryForm.email)) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال بريد إلكتروني صحيح',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      await api.createServiceInquiry({
        service_id: selectedService.id,
        ...inquiryForm,
      });

      toast({
        title: 'نجح',
        description: 'تم إرسال استفسارك بنجاح. سنتواصل معك قريباً!',
      });

      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: 'خطأ',
        description: 'فشل إرسال الاستفسار. يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">خدماتنا</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نقدم مجموعة متنوعة من الخدمات المتخصصة لتلبية احتياجاتك
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">جاري تحميل الخدمات...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">لا توجد خدمات متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {service.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.name_ar}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{service.name_ar}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description_ar}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {service.details && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {service.details}
                    </p>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => handleInquire(service)}
                  >
                    <Send className="ml-2 h-4 w-4" />
                    استفسر عن الخدمة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Inquiry Dialog */}
      <Dialog open={inquiryDialogOpen} onOpenChange={setInquiryDialogOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>استفسار عن الخدمة</DialogTitle>
            <DialogDescription>
              {selectedService?.name_ar}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">الاسم *</Label>
              <Input
                id="customer_name"
                value={inquiryForm.customer_name}
                onChange={(e) => setInquiryForm({ ...inquiryForm, customer_name: e.target.value })}
                placeholder="أدخل اسمك الكامل"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                value={inquiryForm.email}
                onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                type="tel"
                value={inquiryForm.phone}
                onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                placeholder="+966 5X XXX XXXX"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">رسالتك *</Label>
              <Textarea
                id="message"
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                placeholder="اكتب استفسارك أو متطلباتك هنا..."
                rows={5}
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                className="flex-1"
                disabled={submitting}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSubmitInquiry}
                className="flex-1"
                disabled={submitting}
              >
                {submitting ? (
                  <>جاري الإرسال...</>
                ) : (
                  <>
                    <Send className="ml-2 h-4 w-4" />
                    إرسال الاستفسار
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
