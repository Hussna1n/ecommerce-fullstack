import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product, User } from '../types';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartItem[] },
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find(i => i.product.id === action.payload.id);
      if (existing) existing.quantity += 1;
      else state.items.push({ product: action.payload, quantity: 1 });
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(i => i.product.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; qty: number }>) => {
      const item = state.items.find(i => i.product.id === action.payload.id);
      if (item) item.quantity = action.payload.qty;
    },
    clearCart: state => { state.items = []; },
  },
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as User | null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    logout: state => {
      state.user = null; state.token = null; state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export const { setAuth, logout } = authSlice.actions;

export const store = configureStore({
  reducer: { cart: cartSlice.reducer, auth: authSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
