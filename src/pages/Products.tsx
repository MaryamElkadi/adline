import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { api } from '@/db/api';
import type { Product, Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Products() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadData();
  }, [categorySlug]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allProducts, allCategories] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);

      setCategories(allCategories);

      if (categorySlug) {
        const category = allCategories.find(c => c.slug === categorySlug);
        setSelectedCategory(category || null);
        const filteredProducts = allProducts.filter(p => p.category_id === category?.id);
        setProducts(filteredProducts);
      } else {
        setSelectedCategory(null);
        setProducts(allProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 xl:px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {selectedCategory ? selectedCategory.name_ar : 'جميع المنتجات'}
          </h1>
          <p className="text-muted-foreground">
            {selectedCategory ? selectedCategory.description_ar : 'تصفح مجموعتنا الكاملة من خدمات الطباعة'}
          </p>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList>
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="categories">الفئات</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
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
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">لا توجد منتجات متاحة في هذه الفئة</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
