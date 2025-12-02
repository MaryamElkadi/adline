import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/db/api';
import type { Order } from '@/types';

export default function OrderSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;

    try {
      const data = await api.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 xl:px-6">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold mb-4">تم تأكيد طلبك بنجاح!</h1>
            
            <p className="text-muted-foreground mb-8">
              شكراً لك على طلبك. سنبدأ في معالجته فوراً.
            </p>

            {order && (
              <div className="bg-muted/50 rounded-lg p-6 mb-8 text-right">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">رقم الطلب:</span>
                    <span className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المبلغ الإجمالي:</span>
                    <span className="font-bold text-primary">{order.total_amount.toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">طريقة الدفع:</span>
                    <span className="font-medium">
                      {order.payment_method === 'cash' ? 'الدفع عند الاستلام' : 'بطاقة ائتمان'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">حالة الطلب:</span>
                    <span className="font-medium text-yellow-600">قيد المعالجة</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 text-right">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">تأكيد الطلب</h3>
                  <p className="text-sm text-muted-foreground">
                    سنرسل لك رسالة تأكيد عبر الواتساب أو الرسائل النصية
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-right">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">التحضير والطباعة</h3>
                  <p className="text-sm text-muted-foreground">
                    سنبدأ في تحضير وطباعة طلبك حسب المواصفات المطلوبة
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-right">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">الشحن والتوصيل</h3>
                  <p className="text-sm text-muted-foreground">
                    سيتم شحن طلبك وتوصيله إلى العنوان المحدد
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col @md:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/orders')} size="lg">
                <Package className="ml-2 h-5 w-5" />
                عرض طلباتي
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" size="lg">
                <Home className="ml-2 h-5 w-5" />
                العودة للرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
