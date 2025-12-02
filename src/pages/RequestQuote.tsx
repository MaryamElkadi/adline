import { useState } from 'react';
import { FileText, Send, Calendar, Package, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/db/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function RequestQuote() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [projectType, setProjectType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createQuoteRequest({
        name,
        email,
        phone: phone || null,
        company: company || null,
        project_type: projectType || null,
        quantity: quantity ? parseInt(quantity) : null,
        description,
        budget_range: budgetRange || null,
        deadline: deadline || null,
      });

      toast({
        title: 'تم إرسال طلب التسعير بنجاح',
        description: 'سنتواصل معك في أقرب وقت ممكن مع عرض السعر',
      });

      // إعادة تعيين النموذج
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setProjectType('');
      setQuantity('');
      setDescription('');
      setBudgetRange('');
      setDeadline('');
    } catch (error) {
      toast({
        title: 'خطأ في إرسال الطلب',
        description: 'حدث خطأ أثناء إرسال طلب التسعير، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const projectTypes = [
    'بطاقات أعمال',
    'مطبوعات تسويقية',
    'تغليف منتجات',
    'ملصقات',
    'بروشورات ومنشورات',
    'طباعة على أكياس',
    'صناديق',
    'لافتات وبوسترات',
    'منتجات ورقية',
    'هدايا إعلانية',
    'مطبوعات مطاعم ومقاهي',
    'ملابس مطبوعة',
    'مناسبات واحتفالات',
    'أخرى',
  ];

  const budgetRanges = [
    'أقل من 500 ريال',
    '500 - 1,000 ريال',
    '1,000 - 3,000 ريال',
    '3,000 - 5,000 ريال',
    '5,000 - 10,000 ريال',
    'أكثر من 10,000 ريال',
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-5xl mx-auto px-4 xl:px-6">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
            <FileText className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">طلب تسعير</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            احصل على عرض سعر مخصص لمشروعك الطباعي. املأ النموذج وسنتواصل معك خلال 24 ساعة
          </p>
        </div>

        {/* بطاقات المميزات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-2 hover:border-primary transition-smooth">
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                <Send className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">رد سريع</h3>
              <p className="text-sm text-muted-foreground">نرد خلال 24 ساعة</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 hover:border-primary transition-smooth">
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mb-3">
                <DollarSign className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold mb-2">أسعار تنافسية</h3>
              <p className="text-sm text-muted-foreground">أفضل الأسعار في السوق</p>
            </CardContent>
          </Card>

          <Card className="text-center border-2 hover:border-primary transition-smooth">
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-3">
                <Package className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold mb-2">جودة عالية</h3>
              <p className="text-sm text-muted-foreground">منتجات بجودة احترافية</p>
            </CardContent>
          </Card>
        </div>

        {/* نموذج طلب التسعير */}
        <Card className="shadow-elegant animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">تفاصيل المشروع</CardTitle>
            <CardDescription>
              يرجى تقديم أكبر قدر ممكن من التفاصيل للحصول على عرض سعر دقيق
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* معلومات الاتصال */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm">
                    1
                  </div>
                  معلومات الاتصال
                </h3>
                
                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4 pr-8">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="example@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05xxxxxxxx"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">اسم الشركة (اختياري)</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="اسم شركتك أو مؤسستك"
                    />
                  </div>
                </div>
              </div>

              {/* تفاصيل المشروع */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm">
                    2
                  </div>
                  تفاصيل المشروع
                </h3>

                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4 pr-8">
                  <div className="space-y-2">
                    <Label htmlFor="projectType">نوع المشروع</Label>
                    <Select value={projectType} onValueChange={setProjectType}>
                      <SelectTrigger id="projectType">
                        <SelectValue placeholder="اختر نوع المشروع" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">الكمية المطلوبة</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="عدد القطع"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budgetRange">الميزانية المتوقعة</Label>
                    <Select value={budgetRange} onValueChange={setBudgetRange}>
                      <SelectTrigger id="budgetRange">
                        <SelectValue placeholder="اختر نطاق الميزانية" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">الموعد المطلوب</Label>
                    <div className="relative">
                      <Input
                        id="deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pr-8">
                  <Label htmlFor="description">وصف المشروع *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="يرجى وصف مشروعك بالتفصيل: المواصفات، الأحجام، الألوان، المواد، أي متطلبات خاصة..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    كلما كانت التفاصيل أكثر، كان عرض السعر أدق
                  </p>
                </div>
              </div>

              {/* زر الإرسال */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="min-w-[200px] text-lg"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin ml-2">⏳</span>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="ml-2 w-5 h-5" />
                      إرسال طلب التسعير
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* ملاحظة إضافية */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            بإرسال هذا النموذج، فإنك توافق على{' '}
            <a href="/privacy" className="text-primary hover:underline">
              سياسة الخصوصية
            </a>{' '}
            الخاصة بنا
          </p>
        </div>
      </div>
    </div>
  );
}
