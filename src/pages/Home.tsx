import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Package, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { api } from '@/db/api';
import type { Product, Category } from '@/types';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [products, cats] = await Promise.all([
        api.getFeaturedProducts(),
        api.getCategories(),
      ]);
      setFeaturedProducts(products);
      setCategories(cats.slice(0, 8));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-primary py-20 xl:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 xl:px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl xl:text-6xl font-bold text-primary-foreground mb-6">
              خدمات الطباعة الاحترافية
            </h1>
            <p className="text-xl xl:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              نقدم لكم أفضل خدمات الطباعة بجودة عالية وأسعار تنافسية. من بطاقات الأعمال إلى التغليف المخصص
            </p>
            <div className="flex flex-col xl:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link to="/products">
                  تصفح المنتجات
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link to="/contact">اتصل بنا</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Printer className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">جودة عالية</h3>
                <p className="text-muted-foreground text-sm">
                  نستخدم أحدث تقنيات الطباعة لضمان أفضل النتائج
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">تسليم سريع</h3>
                <p className="text-muted-foreground text-sm">
                  نلتزم بمواعيد التسليم المحددة لجميع الطلبات
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">تصميم مخصص</h3>
                <p className="text-muted-foreground text-sm">
                  فريق تصميم محترف لمساعدتك في إنشاء تصاميم فريدة
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">تنوع المنتجات</h3>
                <p className="text-muted-foreground text-sm">
                  مجموعة واسعة من المنتجات لتلبية جميع احتياجاتك
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">فئات المنتجات</h2>
              <p className="text-muted-foreground">اختر من بين مجموعة واسعة من خدمات الطباعة</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/products">
                عرض الكل
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">لا توجد فئات متاحة حالياً</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">المنتجات المميزة</h2>
              <p className="text-muted-foreground">أفضل منتجاتنا وأكثرها طلباً</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/products">
                عرض الكل
                <ArrowLeft className="mr-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded mb-3" />
                    <div className="h-8 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">لا توجد منتجات مميزة حالياً</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="max-w-4xl mx-auto px-4 xl:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">هل لديك مشروع خاص؟</h2>
          <p className="text-xl mb-8 text-secondary-foreground/90">
            تواصل معنا اليوم للحصول على استشارة مجانية وعرض أسعار مخصص لمشروعك
          </p>
          <Button asChild size="lg" variant="default">
            <Link to="/contact">
              ابدأ مشروعك الآن
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
