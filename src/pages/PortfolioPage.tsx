import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/db/api';
import type { PortfolioItem } from '@/types';

export default function PortfolioPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');

  const categories = [
    { value: 'all', label: 'جميع الأعمال' },
    { value: 'حفلات الزفاف', label: 'حفلات الزفاف' },
    { value: 'أعياد الميلاد', label: 'أعياد الميلاد' },
    { value: 'التخرج', label: 'التخرج' },
    { value: 'المناسبات الدينية', label: 'المناسبات الدينية' },
    { value: 'حفلات الأطفال', label: 'حفلات الأطفال' },
    { value: 'المناسبات الرسمية', label: 'المناسبات الرسمية' },
  ];

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    loadItems();
  }, [selectedCategory]);

  const loadItems = async () => {
    setLoading(true);
    try {
      let data;
      if (selectedCategory === 'all') {
        data = await api.getPortfolioItems();
      } else {
        data = await api.getPortfolioItemsByCategory(selectedCategory);
      }
      setItems(data);
    } catch (error) {
      console.error('خطأ في تحميل الأعمال:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-primary py-16 xl:py-24">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="text-center">
            <h1 className="text-4xl xl:text-5xl font-bold text-primary-foreground mb-4">
              معرض أعمالنا
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              استعرض مجموعة من أفضل أعمالنا ومشاريعنا المنجزة
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2">
              {categories.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value} className="whitespace-nowrap">
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {loading ? (
            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-3" />
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">لا توجد أعمال في هذه الفئة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-hover transition-smooth group">
                  {item.image_url && (
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={item.image_url}
                        alt={item.title_ar}
                        className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold flex-1">{item.title_ar}</h3>
                      {item.is_featured && (
                        <Badge variant="default" className="mr-2">مميز</Badge>
                      )}
                    </div>

                    {item.description_ar && (
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {item.description_ar}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      {item.category && (
                        <Badge variant="outline">{item.category}</Badge>
                      )}
                      {item.completion_date && (
                        <span className="text-muted-foreground">
                          {new Date(item.completion_date).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      )}
                    </div>

                    {item.client_name && (
                      <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                        العميل: {item.client_name}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
