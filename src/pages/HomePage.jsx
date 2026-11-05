import { useState, useEffect } from 'react';
import { getProducts } from '../api/backend';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // เพิ่ม State สำหรับจัดการข้อผิดพลาด
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 1. ดึงข้อมูลสินค้าพร้อมรองรับ Error Handling
  useEffect(() => {
    setLoading(true);
    setError(null);

    getProducts()
      .then((data) => {
        setProducts(data || []);
        setFilteredProducts(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ หรือดึงข้อมูลสินค้าได้ในขณะนี้');
        setLoading(false);
      });
  }, []);

  // 2. กรองสินค้าตามหมวดหมู่และคำค้นหา
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

        {/* แสดงผลตาม UI States ครบทั้ง 3 เงื่อนไข */}
        
        {/* 1. Loading State (กำลังโหลดข้อมูล) */}
        {loading && (
          <div className="py-24 text-center text-[#A68F7E] font-medium animate-pulse">
            <div className="text-3xl mb-2">🧶</div>
            กำลังโหลดคอลเลกชันเสื้อผ้า...
          </div>
        )}

        {/* 2. Error State (เกิดข้อผิดพลาด/ยิง API ไม่ผ่าน) */}
        {!loading && error && (
          <div className="py-12 px-6 text-center text-rose-700 bg-rose-50 border border-rose-200 rounded-3xl shadow-sm max-w-xl mx-auto">
            <span className="text-4xl block mb-2">⚠️</span>
            <p className="font-bold text-sm">{error}</p>
            <p className="text-xs text-rose-500 mt-1">กรุณาตรวจสอบการเชื่อมต่อ API หรือรีเฟรชหน้าใหม่อีกครั้ง</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              🔄 ลองใหม่อีกครั้ง
            </button>
          </div>
        )}

        {/* 3. Empty State (ไม่มีข้อมูล/ค้นหาไม่พบ) */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#EBD9C8] p-8 shadow-sm max-w-lg mx-auto">
            <span className="text-5xl block mb-3">🧺</span>
            <h3 className="text-base font-bold text-[#38281F]">ไม่พบรายการเสื้อผ้าที่ค้นหา</h3>
            <p className="text-xs text-[#A68F7E] mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดใหม่อีกครั้ง</p>
            <button
              onClick={() => {
                setActiveCategory('ทั้งหมด');
                setSearchKeyword('');
              }}
              className="mt-4 bg-[#8C6D58] hover:bg-[#6B4F3B] text-white px-4 py-2 rounded-xl text-xs font-bold transition"
            >
              ล้างการค้นหาทั้งหมด
            </button>
          </div>
        )}

        {/* Success Grid (แสดงรายการสินค้าเมื่อดึงข้อมูลสำเร็จ) */}
        {!loading && !error && filteredProducts.length > 0 && (
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