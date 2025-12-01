import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/products?category=${category.slug}`}>
      <Card className="group overflow-hidden hover:shadow-hover transition-smooth cursor-pointer">
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={category.image_url || 'https://via.placeholder.com/400x300'}
            alt={category.name_ar}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-smooth">
                {category.name_ar}
              </h3>
              {category.description_ar && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {category.description_ar}
                </p>
              )}
            </div>
            <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-smooth" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
