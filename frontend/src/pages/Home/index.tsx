import { useState, useEffect } from 'react';
import { productApi } from '../../api';
import { Product, PagedResult } from '../../types';
import ProductCard from '../../components/ProductCard';
import { Search } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    productApi.getCategories().then(r => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    productApi.getAll({ search, category, minPrice, maxPrice, page, pageSize: 12 })
      .then(r => {
        const data: PagedResult<Product> = r.data;
        setProducts(data.items);
        setTotal(data.totalCount);
      })
      .finally(() => setLoading(false));
  }, [search, category, minPrice, maxPrice, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search products..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-2">
          <input className="w-28 px-3 py-2 border rounded-lg" placeholder="Min $"
            value={minPrice} onChange={e => setMinPrice(e.target.value)} type="number" />
          <input className="w-28 px-3 py-2 border rounded-lg" placeholder="Max $"
            value={maxPrice} onChange={e => setMaxPrice(e.target.value)} type="number" />
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-80" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(total / 12) }).map((_, i) => (
              <button key={i}
                className={`px-4 py-2 rounded-lg ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
