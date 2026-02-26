import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import Navbar from './components/Navbar';
import Home from './pages/Home';

const CartPage = () => <div className="max-w-4xl mx-auto p-8"><h1 className="text-2xl font-bold">Shopping Cart</h1></div>;
const LoginPage = () => <div className="max-w-md mx-auto p-8"><h1 className="text-2xl font-bold">Login</h1></div>;
const OrdersPage = () => <div className="max-w-4xl mx-auto p-8"><h1 className="text-2xl font-bold">My Orders</h1></div>;

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </Provider>
  );
}
