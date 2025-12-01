import { Award, Target, Eye, Users, Printer, Clock, Sparkles, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-primary py-16 xl:py-24">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="text-center">
            <h1 className="text-4xl xl:text-5xl font-bold text-primary-foreground mb-4">
              من نحن
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              نحن شركة رائدة في مجال خدمات الطباعة الاحترافية
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 xl:px-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">قصتنا</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  خط الإعلان هي شركة متخصصة في تقديم خدمات الطباعة الاحترافية بأعلى معايير الجودة.
                  نفخر بتقديم حلول طباعة مبتكرة تلبي احتياجات عملائنا من الأفراد والشركات.
                </p>
                <p>
                  منذ تأسيسنا، كان هدفنا هو تقديم خدمات طباعة متميزة تجمع بين الجودة العالية والأسعار التنافسية.
                  نستخدم أحدث التقنيات والمعدات لضمان حصول عملائنا على أفضل النتائج.
                </p>
                <p>
                  نؤمن بأن كل مشروع طباعة هو فرصة لإبداع شيء مميز. لذلك، نعمل عن كثب مع عملائنا
                  لفهم احتياجاتهم وتحويل أفكارهم إلى واقع ملموس.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">10+</div>
                  <p className="text-muted-foreground">سنوات من الخبرة</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-secondary mb-2">5000+</div>
                  <p className="text-muted-foreground">عميل راضٍ</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">50+</div>
                  <p className="text-muted-foreground">منتج وخدمة</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-secondary mb-2">24/7</div>
                  <p className="text-muted-foreground">دعم العملاء</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 mb-16">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">رسالتنا</h3>
                <p className="text-muted-foreground leading-relaxed">
                  تقديم خدمات طباعة عالية الجودة تتجاوز توقعات عملائنا، مع الالتزام بالمواعيد
                  والأسعار التنافسية. نسعى لأن نكون الخيار الأول لكل من يبحث عن التميز في الطباعة.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                  <Eye className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">رؤيتنا</h3>
                <p className="text-muted-foreground leading-relaxed">
                  أن نكون الشركة الرائدة في مجال خدمات الطباعة في المنطقة، معروفين بالابتكار
                  والجودة والخدمة المتميزة. نطمح لتوسيع خدماتنا وتقديم حلول طباعة شاملة لجميع القطاعات.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">قيمنا</h2>
            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">الجودة</h3>
                  <p className="text-muted-foreground text-sm">
                    نلتزم بأعلى معايير الجودة في كل مشروع
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">الالتزام</h3>
                  <p className="text-muted-foreground text-sm">
                    نحترم مواعيد التسليم ونلتزم بوعودنا
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">الابتكار</h3>
                  <p className="text-muted-foreground text-sm">
                    نستخدم أحدث التقنيات والأساليب
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">رضا العملاء</h3>
                  <p className="text-muted-foreground text-sm">
                    سعادة عملائنا هي أولويتنا القصوى
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">لماذا نحن؟</h2>
            <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Printer className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">أحدث التقنيات</h3>
                  <p className="text-muted-foreground text-sm">
                    نستخدم أحدث معدات الطباعة لضمان أفضل النتائج
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">فريق محترف</h3>
                  <p className="text-muted-foreground text-sm">
                    فريق من الخبراء المتخصصين في مجال الطباعة والتصميم
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">تنوع المنتجات</h3>
                  <p className="text-muted-foreground text-sm">
                    مجموعة واسعة من المنتجات والخدمات لتلبية جميع الاحتياجات
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">أسعار تنافسية</h3>
                  <p className="text-muted-foreground text-sm">
                    أفضل الأسعار مع الحفاظ على أعلى مستويات الجودة
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-gradient-primary border-none">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                هل أنت مستعد للبدء؟
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                دعنا نساعدك في تحويل أفكارك إلى واقع ملموس بخدمات طباعة احترافية
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
