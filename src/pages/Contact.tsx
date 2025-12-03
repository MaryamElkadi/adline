import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/db/api';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: 'خطأ في البيانات',
        description: 'الاسم والبريد الإلكتروني والرسالة حقول مطلوبة',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Sending contact message:', { name, email, phone, subject, message });
      
      await api.createContactMessage({
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      });

      toast({
        title: 'تم إرسال الرسالة بنجاح',
        description: 'سنتواصل معك في أقرب وقت ممكن',
      });

      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Contact form error details:', error);
      
      let errorMessage = 'حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى';
      
      if (error instanceof Error) {
        errorMessage = `حدث خطأ: ${error.message}`;
      }
      
      toast({
        title: 'خطأ في إرسال الرسالة',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle email click - multiple options
  const handleEmailClick = () => {
    const emailAddress = 'sales@adlineksa.com';
    const subject = 'استفسار عن خدمات خط الإعلان';
    const body = 'السلام عليكم،\n\nأود الاستفسار عن خدماتكم.\n\nشكراً';
    
    // Option 1: Standard mailto link
    const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open email client
    window.location.href = mailtoUrl;
    
    // Fallback: Copy to clipboard
    setTimeout(() => {
      // Check if email client opened (on mobile it will leave the page)
      // If still on page after 500ms, assume mailto didn't work
      copyToClipboard(emailAddress, 'email');
    }, 500);
  };

  // Copy email to clipboard
  const copyEmailToClipboard = () => {
    copyToClipboard('sales@adlineksa.com', 'email');
  };

  // Copy phone to clipboard
  const copyPhoneToClipboard = () => {
    copyToClipboard('+966562699286', 'phone');
  };

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'email') {
        setCopiedEmail(true);
        toast({
          title: 'تم النسخ',
          description: 'تم نسخ البريد الإلكتروني إلى الحافظة',
        });
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPhone(true);
        toast({
          title: 'تم النسخ',
          description: 'تم نسخ رقم الهاتف إلى الحافظة',
        });
        setTimeout(() => setCopiedPhone(false), 2000);
      }
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast({
        title: 'خطأ في النسخ',
        description: 'تعذر نسخ النص إلى الحافظة',
        variant: 'destructive',
      });
    });
  };

  // Handle phone click
  const handlePhoneClick = () => {
    const phoneNumber = '+966562699286';
    
    // Try to open phone dialer
    window.location.href = `tel:${phoneNumber}`;
    
    // Fallback for desktop
    setTimeout(() => {
      copyToClipboard(phoneNumber, 'phone');
    }, 500);
  };

  // WhatsApp function
  const handleWhatsAppClick = () => {
    const phoneNumber = '966562699286';
    const message = encodeURIComponent('مرحباً، أريد الاستفسار عن خدماتكم');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Alternative email solutions
  const openGmail = () => {
    const email = 'sales@adlineksa.com';
    const subject = 'استفسار عن خدمات خط الإعلان';
    const body = 'السلام عليكم،\n\nأود الاستفسار عن خدماتكم.\n\nشكراً';
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  const openOutlook = () => {
    const email = 'sales@adlineksa.com';
    const subject = 'استفسار عن خدمات خط الإعلان';
    const body = 'السلام عليكم،\n\nأود الاستفسار عن خدماتكم.\n\nشكراً';
    
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(outlookUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 xl:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">اتصل بنا</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نحن هنا للإجابة على أسئلتكم ومساعدتكم في تحقيق مشاريعكم
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>أرسل لنا رسالة</CardTitle>
                <CardDescription>املأ النموذج وسنتواصل معك في أقرب وقت</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="أدخل اسمك"
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
                  </div>

                  <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+966 56 269 9286"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">الموضوع</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="موضوع الرسالة"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">الرسالة *</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات التواصل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Section */}
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">البريد الإلكتروني</p>
                      <div className="flex items-center justify-between mt-1">
                        <button
                          onClick={handleEmailClick}
                          className="text-muted-foreground hover:text-primary transition-colors text-left"
                        >
                          sales@adlineksa.com
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyEmailToClipboard}
                          className="h-8 w-8 p-0"
                        >
                          {copiedEmail ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      اختر طريقة المراسلة:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEmailClick}
                        className="text-xs"
                      >
                        📧 بريد الجهاز
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openGmail}
                        className="text-xs"
                      >
                        📧 Gmail
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openOutlook}
                        className="text-xs"
                      >
                        📧 Outlook
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Phone Section */}
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">الهاتف / واتساب</p>
                      <div className="flex items-center justify-between mt-1">
                        <button
                          onClick={handlePhoneClick}
                          className="text-muted-foreground hover:text-primary transition-colors text-left"
                        >
                          +966 56 269 9286
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyPhoneToClipboard}
                          className="h-8 w-8 p-0"
                        >
                          {copiedPhone ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <Button
                      onClick={handleWhatsAppClick}
                      className="w-full bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                    >
                      💬 تواصل عبر واتساب
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      انقر للاتصال أو استخدم واتساب للرسائل النصية
                    </p>
                  </div>
                </div>

                {/* Address Section */}
                <div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">العنوان</p>
                      <p className="text-muted-foreground mt-1">
                        المملكة العربية السعودية
                      </p>
                      <a
                        href="https://maps.google.com/?q=المملكة العربية السعودية"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-2 inline-block"
                      >
                        📍 عرض على خرائط جوجل
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Card */}
            <Card>
              <CardHeader>
                <CardTitle>تابعنا</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
                    title="فيسبوك"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
                    title="انستغرام"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
                    title="تويتر (X)"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="https://wa.me/966562699286"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 hover:text-green-800 transition-smooth"
                    title="واتساب"
                  >
                    <span className="text-lg">💬</span>
                  </a>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  تواصل معنا عبر وسائل التواصل الاجتماعي
                </p>
              </CardContent>
            </Card>

            {/* Working Hours Card */}
            <Card>
              <CardHeader>
                <CardTitle>ساعات العمل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">السبت - الخميس</span>
                  <span className="font-medium">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الجمعة</span>
                  <span className="font-medium">مغلق</span>
                </div>
                <div className="pt-2 text-xs text-muted-foreground">
                  ⏰ يمكنك التواصل خارج أوقات العمل عبر الواتساب
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}