import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Package, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import SeasonalOffersSection from '@/components/SeasonalOffersSection';
import ServicesSection from '@/components/ServicesSection';
import { api } from '@/db/api';
import type { Product, Category } from '@/types';
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Tag, IdCard, Box, ShoppingBag, FileText, 
  Monitor, Flag, Layout, Layers 
} from 'lucide-react';import heroBg from '@/assets/tokyo.png';

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax and Fade effects
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(10px)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -80]);

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('ملصق')) return <Tag className="h-8 w-8" />;
  if (n.includes('بطاق')) return <IdCard className="h-8 w-8" />;
  if (n.includes('صندوق') || n.includes('علب')) return <Box className="h-8 w-8" />;
  if (n.includes('كيس') || n.includes('أكياس')) return <ShoppingBag className="h-8 w-8" />;
  if (n.includes('ورق') || n.includes('بروشور')) return <FileText className="h-8 w-8" />;
  if (n.includes('استاند') || n.includes('ستاند')) return <Layers className="h-8 w-8" />;
  if (n.includes('اعلام') || n.includes('إعلام')) return <Flag className="h-8 w-8" />;
  if (n.includes('ديجيتال') || n.includes('رقمية')) return <Monitor className="h-8 w-8" />;
  if (n.includes('لوحات')) return <Layout className="h-8 w-8" />;
  
  return <Printer className="h-8 w-8" />; // أيقونة افتراضية
};
  // Data for the Infinite Scroller in Hero
  const tickerTags = ["طباعة رقمية", "لوحات إعلانية", "هدايا مخصصة", "بروشورات", "بطاقات عمل", "تغليف فاخر", "ملصقات"];
  const scrollItems = [...tickerTags, ...tickerTags]; // Double the items for seamless loop

  useEffect(() => {
    loadData();
  }, []);

const loadData = async () => {
  try {
    setLoading(true);
    let products = await api.getFeaturedProducts();

    // إذا كانت المصفوفة فارغة (لم يجد منتجات مميزة)، اجلب المنتجات العادية
    if (products.length === 0) {
      console.log("No featured products found, fetching regular products...");
      const allProducts = await api.getProducts();
      products = allProducts;
    }

    // عرض 6 كروت فقط كحد أقصى
    setFeaturedProducts(products.slice(0, 6));

    const cats = await api.getCategories();
    setCategories(cats.slice(0, 8));
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Parallax Background */}
        <motion.div
          style={{ scale, filter: blur }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={heroBg} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
          />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/40 z-1" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10 z-2" />

        {/* Hero Content */}
      <motion.div
  style={{ opacity, y }}
  className="relative z-10 max-w-7xl mx-auto px-4 xl:px-6 text-center text-white"
>
  {/* H1 with a Gradient Effect */}
  <h1 className="text-4xl xl:text-7xl font-bold mb-6 drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-white to-blue-400 leading-tight">
    خدمات الطباعة الاحترافية واللوحات الإعلانية
  </h1>

  {/* Headline/Paragraph with a soft Blue-White tint */}
  <p className="text-xl xl:text-2xl mb-12 max-w-3xl mx-auto text-blue-50/90 leading-relaxed">
    نقدم لكم أفضل خدمات الطباعة بجودة عالية وأسعار تنافسية من بطاقات الأعمال إلى التغليف المخصص.
  </p>

  {/* --- INFINITE SCROLLER (Alternating Yellow & Blue) --- */}
  <div className="scroller scroller-mask relative mb-12 overflow-hidden border-y border-white/20 py-6">
    <div 
      className="scroller-inner font-bold text-2xl xl:text-4xl whitespace-nowrap"
      style={{ '--animation-duration': '25s' } as React.CSSProperties}
    >
      {scrollItems.map((tag, i) => (
        <span 
          key={i} 
          className={`mx-12 flex items-center ${
            i % 2 === 0 ? 'text-yellow-400' : 'text-blue-400'
          }`}
        >
          {tag} 
          <span className="mx-6 text-white/20">•</span>
        </span>
      ))}
    </div>
  </div>

  {/* Buttons */}
  <div className="flex flex-col xl:flex-row gap-4 justify-center items-center">
    <Button asChild size="lg" className="text-lg px-8 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black border-none">
      <Link to="/products">
        تصفح المنتجات
        <ArrowLeft className="mr-2 h-5 w-5" />
      </Link>
    </Button>

    <Button
      asChild
      size="lg"
      variant="outline"
      className="text-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-400/50 px-8 h-14 rounded-full"
    >
      <Link to="/contact">اتصل بنا</Link>
    </Button>
  </div>
</motion.div>
        
        {/* Bottom Fade Gradient to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* Main Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold mb-4">الأقسام الرئيسية</h2>
            <p className="text-muted-foreground text-lg">تصفح جميع الأقسام للعثور على ما تحتاجه</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4" />
                    <div className="h-4 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
  {categories.slice(0, 6).map((category) => (
    <Link key={category.id} to={`/products?category=${category.id}`} className="group relative">
      <Card className="border-none bg-transparent shadow-none cursor-pointer">
        <CardContent className="p-6 text-center">
          
          {/* حاوية الأيقونة مع تأثير الـ Tooltip */}
          <div className="category-icon-wrapper w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 text-primary transition-all duration-300">
            
            {/* التعديل هنا: عرض اسم القسم داخل الـ Tooltip عند الهوفر */}
            <span className="category-tooltip">
              {category.name_ar}
            </span>
            
            {/* الأيقونة الذكية */}
            {getCategoryIcon(category.name_ar)}
          </div>

          {/* اسم القسم تحت الأيقونة (اختياري إذا كنت تريد بقاءه) */}
          <h3 className="font-bold text-sm group-hover:text-yellow-500 transition-colors">
            {category.name_ar}
          </h3>
        </CardContent>
      </Card>
    </Link>
  ))}
</div>
          )}
        </div>
      </section>

      {/* Seasonal Offers Section */}
      <SeasonalOffersSection />

      {/* Services Section */}
      <ServicesSection />
    <section className="py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">مناسباتك الخاصة</h2>
            <p className="text-muted-foreground">طباعة مخصصة لجميع المناسبات والاحتفالات</p>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-scroll-rtl hover:pause-animation">
              {[
                {
                  title: 'حفلات الزفاف',
                  icon: '💍',
                  description: 'دعوات وبطاقات شكر وهدايا',
                  color: 'from-pink-500/20 to-rose-500/20',
                },
                {
                  title: 'أعياد الميلاد',
                  icon: '🎂',
                  description: 'بطاقات وملصقات وصناديق هدايا',
                  color: 'from-purple-500/20 to-pink-500/20',
                },
                {
                  title: 'التخرج',
                  icon: '🎓',
                  description: 'شهادات تقدير وبطاقات تهنئة',
                  color: 'from-blue-500/20 to-cyan-500/20',
                },
                {
                  title: 'المناسبات الدينية',
                  icon: '🌙',
                  description: 'بطاقات معايدة وهدايا رمضانية',
                  color: 'from-green-500/20 to-emerald-500/20',
                },
                {
                  title: 'حفلات الأطفال',
                  icon: '🎈',
                  description: 'ديكورات وملصقات وصناديق حلوى',
                  color: 'from-yellow-500/20 to-orange-500/20',
                },
                {
                  title: 'المناسبات الرسمية',
                  icon: '🏆',
                  description: 'شهادات وجوائز وهدايا تذكارية',
                  color: 'from-indigo-500/20 to-purple-500/20',
                },
              ].concat([
                {
                  title: 'حفلات الزفاف',
                  icon: '💍',
                  description: 'دعوات وبطاقات شكر وهدايا',
                  color: 'from-pink-500/20 to-rose-500/20',
                },
                {
                  title: 'أعياد الميلاد',
                  icon: '🎂',
                  description: 'بطاقات وملصقات وصناديق هدايا',
                  color: 'from-purple-500/20 to-pink-500/20',
                },
                {
                  title: 'التخرج',
                  icon: '🎓',
                  description: 'شهادات تقدير وبطاقات تهنئة',
                  color: 'from-blue-500/20 to-cyan-500/20',
                },
                {
                  title: 'المناسبات الدينية',
                  icon: '🌙',
                  description: 'بطاقات معايدة وهدايا رمضانية',
                  color: 'from-green-500/20 to-emerald-500/20',
                },
                {
                  title: 'حفلات الأطفال',
                  icon: '🎈',
                  description: 'ديكورات وملصقات وصناديق حلوى',
                  color: 'from-yellow-500/20 to-orange-500/20',
                },
                {
                  title: 'المناسبات الرسمية',
                  icon: '🏆',
                  description: 'شهادات وجوائز وهدايا تذكارية',
                  color: 'from-indigo-500/20 to-purple-500/20',
                },
              ]).map((celebration, index) => (
                <Link
                  key={index}
                  to={`/portfolio?category=${encodeURIComponent(celebration.title)}`}
                >
                  <Card
                    className={`flex-shrink-0 w-72 bg-gradient-to-br ${celebration.color} border-none shadow-hover hover:shadow-elegant transition-smooth cursor-pointer`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-5xl mb-4">{celebration.icon}</div>
                      <h3 className="font-bold text-xl mb-2">{celebration.title}</h3>
                      <p className="text-sm text-muted-foreground">{celebration.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Featured Products */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 border-t">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <BadgeCard icon={<Printer className="h-6 w-6 text-primary" />} title="جودة عالية" desc="نستخدم أحدث تقنيات الطباعة" />
            <BadgeCard icon={<Clock className="h-6 w-6 text-primary" />} title="تسليم سريع" desc="نلتزم بمواعيد التسليم المحددة" />
            <BadgeCard icon={<Sparkles className="h-6 w-6 text-primary" />} title="تصميم مخصص" desc="فريق تصميم محترف لمساعدتك" />
            <BadgeCard icon={<Package className="h-6 w-6 text-primary" />} title="تنوع المنتجات" desc="مجموعة واسعة لتلبية احتياجاتك" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="max-w-4xl mx-auto px-4 xl:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">هل لديك مشروع خاص؟</h2>
          <p className="text-xl mb-8 opacity-90">
            تواصل معنا اليوم للحصول على استشارة مجانية وعرض أسعار مخصص لمشروعك
          </p>
          <Button asChild size="lg" variant="default" className="rounded-full">
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

// Reusable Small Component for Trust Badges
function BadgeCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{desc}</p>
      </CardContent>
    </Card>
  );
}