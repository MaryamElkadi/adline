import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/db/api';
import type { Service } from '@/types';

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await api.getActiveServices();
      setServices(data.slice(0, 6)); // Max 6 services
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && services.length === 0) return null;

  return (
    <section className="py-16 bg-background" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 xl:px-6">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              خدماتنا المميزة
            </h2>
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نقدم مجموعة متنوعة من الخدمات الاحترافية لتلبية جميع احتياجاتك
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full bg-muted" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3 bg-muted" />
                  <Skeleton className="h-4 w-full mb-2 bg-muted" />
                  <Skeleton className="h-4 w-5/6 bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card
                  key={service.id}
                  className="group overflow-hidden hover:shadow-elegant transition-all duration-500 animate-slide-up border hover:border-primary/50"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Service Image */}
                  {service.image_url && (
                    <div className="relative overflow-hidden h-48 bg-gradient-to-br from-primary/10 to-secondary/10">
                      <img
                        src={service.image_url}
                        alt={service.name_ar}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  )}

                  <CardContent className="p-6">
                    {/* Service Name */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">
                      {service.name_ar}
                    </h3>

                    {/* Service Description */}
                    <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                      {service.description_ar}
                    </p>

                    {/* Details Preview */}
                    {service.details && (
                      <div className="text-xs text-muted-foreground/80 mb-4 line-clamp-2 bg-muted/30 p-3 rounded-lg">
                        {service.details}
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    >
                      <Link to="/contact">
                        استفسر الآن
                        <ArrowLeft className="mr-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View All Services Button */}
            {services.length >= 6 && (
              <div className="text-center mt-10 animate-fade-in">
                <Button asChild size="lg" variant="default" className="shadow-elegant">
                  <Link to="/services">
                    عرض جميع الخدمات
                    <ArrowLeft className="mr-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
