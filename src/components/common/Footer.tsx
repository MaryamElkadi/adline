import { Link } from 'react-router-dom';
import { Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto py-12 px-4 xl:px-6">
        <div className="grid grid-cols-1 @md:grid-cols-2 xl:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">خ</span>
              </div>
              <span className="text-xl font-bold">خط الاعلان</span>
            </div>
            <p className="text-secondary-foreground/80 leading-relaxed">
              نقدم خدمات الطباعة الاحترافية بأعلى جودة وأفضل الأسعار. نحن متخصصون في طباعة جميع أنواع المطبوعات التجارية والشخصية.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-secondary-foreground/80 hover:text-primary transition-smooth">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-secondary-foreground/80 hover:text-primary transition-smooth">
                  المنتجات
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-secondary-foreground/80 hover:text-primary transition-smooth">
                  المدونة
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-foreground/80 hover:text-primary transition-smooth">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-foreground/80 hover:text-primary transition-smooth">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">خدماتنا</h3>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li>طباعة بطاقات الأعمال</li>
              <li>طباعة الملصقات</li>
              <li>طباعة العلب والصناديق</li>
              <li>طباعة الأكياس</li>
              <li>طباعة المنتجات الورقية</li>
              <li>تصميم مخصص</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <div className="space-y-3">
              <a
                href="mailto:info@khat-alailan.com"
                className="flex items-center gap-2 text-secondary-foreground/80 hover:text-primary transition-smooth"
              >
                <Mail className="h-5 w-5" />
                info@khat-alailan.com
              </a>
              <a
                href="tel:+966500000000"
                className="flex items-center gap-2 text-secondary-foreground/80 hover:text-primary transition-smooth"
              >
                <Phone className="h-5 w-5" />
                +966 50 000 0000
              </a>
              <div className="flex gap-4 mt-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-foreground/80 hover:text-primary transition-smooth"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-foreground/80 hover:text-primary transition-smooth"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-foreground/80 hover:text-primary transition-smooth"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-foreground/20 text-center">
          <p className="text-secondary-foreground/80">
            {currentYear} خط الاعلان
          </p>
        </div>
      </div>
    </footer>
  );
}
