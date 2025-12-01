import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-hover transition-smooth">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image_url || 'https://via.placeholder.com/400'}
            alt={product.name_ar}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-smooth">
            {product.name_ar}
          </h3>
        </Link>
        {product.description_ar && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description_ar}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">
              {product.base_price.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground mr-1">ر.س</span>
          </div>
          {product.featured && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              مميز
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" size="sm">
          <Link to={`/products/${product.slug}`}>
            <ShoppingCart className="ml-2 h-4 w-4" />
            عرض التفاصيل
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
