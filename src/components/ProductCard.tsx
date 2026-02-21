import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import '../index.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.slug}`} className="block">
      <div className="uiverse-card">
        {/* الصورة التي ستتحرك وتتغشى عند الهوفر */}
        <img
          src={product.image_url || 'https://via.placeholder.com/400'}
          alt={product.name_ar}
          className="uiverse-img"
        />

        {/* صندوق النصوص الذي سيظهر عند الهوفر */}
        <div className="uiverse-textBox">
          <p className="uiverse-head">{product.name_ar}</p>
          
          {product.description_ar && (
            <span className="uiverse-desc line-clamp-2 px-4">
              {product.description_ar}
            </span>
          )}
          
          <p className="uiverse-price">
            {product.base_price.toFixed(2)} ر.س
          </p>
          
          <div className="mt-2 bg-yellow-500 text-black px-4 py-1 rounded-full text-xs font-bold">
            عرض التفاصيل
          </div>
        </div>
        
        {/* شارة "مميز" إذا كان المنتج مميزاً */}
        {product.featured && (
          <div className="absolute top-4 right-4 z-30 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded-md uppercase">
            MOMAYAZ
          </div>
        )}
      </div>
    </Link>
  );
}