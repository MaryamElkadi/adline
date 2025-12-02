import { useNavigate } from 'react-router-dom';
import { XCircle, Home, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function OrderFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 xl:px-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>

            <h1 className="text-3xl font-bold mb-4">فشل في إتمام الطلب</h1>
            
            <p className="text-muted-foreground mb-8">
              عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 mb-8 text-right">
              <h3 className="font-semibold mb-3">الأسباب المحتملة:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• مشكلة في الاتصال بالإنترنت</li>
                <li>• خطأ في معالجة الدفع</li>
                <li>• انتهاء صلاحية الجلسة</li>
                <li>• مشكلة مؤقتة في الخادم</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-right">
              <p className="text-sm text-blue-900">
                <strong>نصيحة:</strong> تأكد من اتصالك بالإنترنت وحاول مرة أخرى. إذا استمرت المشكلة، يرجى التواصل مع خدمة العملاء.
              </p>
            </div>

            <div className="flex flex-col @md:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/checkout')} size="lg">
                <ShoppingCart className="ml-2 h-5 w-5" />
                المحاولة مرة أخرى
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" size="lg">
                <Home className="ml-2 h-5 w-5" />
                العودة للرئيسية
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                هل تحتاج إلى مساعدة؟
              </p>
              <Button onClick={() => navigate('/contact')} variant="link">
                تواصل مع خدمة العملاء
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
