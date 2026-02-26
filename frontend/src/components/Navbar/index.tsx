import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { RootState, logout } from '../../store';

export default function Navbar() {
  const { items } = useSelector((s: RootState) => s.cart);
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">ShopHub</Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                <Package className="w-5 h-5" /><span className="hidden sm:inline">Orders</span>
              </Link>
              <span className="text-gray-700 text-sm">Hi, {user?.firstName}</span>
              <button onClick={() => { dispatch(logout()); navigate('/'); }}
                className="flex items-center gap-1 text-gray-600 hover:text-red-600">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
              <User className="w-5 h-5" /><span>Login</span>
            </Link>
          )}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs
                               rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
