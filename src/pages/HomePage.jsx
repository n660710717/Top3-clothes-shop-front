import { useState, useEffect } from 'react';
import { getProducts } from '../api/backend';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data || []);
      setFilteredProducts(data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = [...products];
    if (activeCategory !== 'ทั้งหมด') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchKeyword.trim() !== '') {
      const q = searchKeyword.toLowerCase();
      result = result.filter((p) => (p.name || p.title || '').toLowerCase().includes(q));
    }
    setFilteredProducts(result);
  }, [searchKeyword, activeCategory, products]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3B32] font-sans">
      <Navbar
        onSearch={(kw) => setSearchKeyword(kw)}
        onCategorySelect={(cat) => setActiveCategory(cat)}
      />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Banner */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#F5EBE1] via-[#EBD9C8] to-[#DFCAAF] p-8 md:p-12 border border-[#DEC4A6] shadow-sm">
          <div className="max-w-lg z-10 relative">
            <span className="inline-block bg-[#8C6D58] text-white text-[11px] font-medium tracking-wider px-3 py-1 rounded-full uppercase mb-3">
              Special Autumn Collection
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#38281F]">คอลเลกชันใหม่ล่าสุด</h1>
            <p className="mt-2 text-xs md:text-sm text-[#6A5243]">สัมผัสเสื้อผ้าสไตล์มินิมอล เอิร์ธโทนสุดอบอุ่น</p>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 text-center text-[#A68F7E] font-medium animate-pulse">กำลังโหลดคอลเลกชันเสื้อผ้า...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}