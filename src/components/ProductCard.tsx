import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import '../index.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = `${product.base_price.toFixed(2)} ر.س`;

  return (
    <Link to={`/products/${product.slug}`} className="block">
      <div className="uiverse-card bg-muted animate-pulse-slow"> {/* Added a skeleton-like background */}
        
        {/* Optimized Image with Performance Attributes */}
        <img
          src={product.image_url || 'https://via.placeholder.com/400'}
          alt={product.name_ar}
          className="uiverse-img"
          
          // 1. Loading Strategy
          loading="eager"       // Change to 'eager' ONLY for the first 2-4 items on the page
          fetchPriority="high"  // Tells the browser this image is a priority
          
          // 2. Rendering Optimization
          decoding="async"      // Decodes image off-main-thread to prevent UI lag
          
          // 3. Layout Stability (Prevents Jumps)
          width="400"
          height="400"
          
          // 4. Smooth Entry
          onLoad={(e) => {
            e.currentTarget.parentElement?.classList.remove('animate-pulse-slow');
            e.currentTarget.style.opacity = '1';
          }}
          style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }} 
        />

        <div className="uiverse-textBox">
          <p className="uiverse-head">{product.name_ar}</p>
          {product.description_ar && (
            <span className="uiverse-desc line-clamp-2 px-4">
              {product.description_ar}
            </span>
          )}
          <p className="uiverse-price">{formattedPrice}</p>
          <div className="mt-2 bg-yellow-500 text-black px-4 py-1 rounded-full text-xs font-bold">
            عرض التفاصيل
          </div>
        </div>
        
        {product.featured && (
          <div className="absolute top-4 right-4 z-30 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded-md uppercase">
            MOMAYAZ
          </div>
        )}
      </div>
    </Link>
  );
});

export default ProductCard;