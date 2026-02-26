import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { addToCart } from '../../store';
import { Product } from '../../types';
import toast from 'react-hot-toast';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`}>
        <img src={product.imageUrl || 'https://via.placeholder.com/300'}
          alt={product.name} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-800 mt-1 hover:text-blue-600 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
          <button onClick={handleAddToCart} disabled={product.stock === 0}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2
                       rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
        {product.stock > 0 && product.stock < 10 && (
          <p className="text-xs text-orange-500 mt-1">Only {product.stock} left!</p>
        )}
      </div>
    </div>
  );
}
