import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Percent, Clock, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/db/api';
import type { SeasonalOffer } from '@/types';

export default function SeasonalOffersSection() {
  const [offers, setOffers] = useState<SeasonalOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const data = await api.getActiveSeasonalOffers();
      setOffers(data);
    } catch (error) {
      console.error('Failed to load seasonal offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  if (loading || offers.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 xl:px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            العروض الموسمية
          </h2>
          <p className="text-muted-foreground text-lg">
            استفد من عروضنا الحصرية لفترة محدودة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {offers.map((offer, index) => {
            const timeRemaining = calculateTimeRemaining(offer.end_date);
            
            return (
              <Card
                key={offer.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-500 animate-slide-up border-2 hover:border-primary/50"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* صورة العرض */}
                {offer.image_url && (
                  <div className="relative overflow-hidden h-56 bg-gradient-to-br from-primary/10 to-primary/5">
                    <img
                      src={offer.image_url}
                      alt={offer.title_ar}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {offer.discount_percentage && (
                      <div className="absolute top-4 right-4 bg-destructive text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg animate-pulse-slow">
                        <div className="flex items-center gap-1">
                          <Percent className="h-5 w-5" />
                          <span>{offer.discount_percentage}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <CardContent className="p-6">
                  {/* عنوان العرض */}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {offer.title_ar}
                  </h3>

                  {/* وصف العرض */}
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {offer.description_ar}
                  </p>

                  {/* تواريخ العرض */}
                  <div className="flex flex-col gap-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        من {new Date(offer.start_date).toLocaleDateString('ar-SA')} 
                        {' '}إلى {new Date(offer.end_date).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>

                  {/* العد التنازلي */}
                  {timeRemaining && (
                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2 text-primary font-semibold">
                        <Clock className="h-4 w-4 animate-pulse" />
                        <span>الوقت المتبقي</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-background rounded p-2">
                          <div className="text-2xl font-bold text-primary">
                            {timeRemaining.days}
                          </div>
                          <div className="text-xs text-muted-foreground">يوم</div>
                        </div>
                        <div className="bg-background rounded p-2">
                          <div className="text-2xl font-bold text-primary">
                            {timeRemaining.hours}
                          </div>
                          <div className="text-xs text-muted-foreground">ساعة</div>
                        </div>
                        <div className="bg-background rounded p-2">
                          <div className="text-2xl font-bold text-primary">
                            {timeRemaining.minutes}
                          </div>
                          <div className="text-xs text-muted-foreground">دقيقة</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* شارة العرض النشط */}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Badge className="bg-green-500 hover:bg-green-600 text-white">
                      عرض نشط الآن
                    </Badge>
                  </div>

                  {/* زر طلب العرض */}
                  <div className="mt-4">
                    <Button asChild className="w-full" size="lg">
                      <Link to="/contact">
                        اطلب العرض الآن
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}