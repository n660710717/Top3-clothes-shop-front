import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(favs);
  }, []);

  const removeFav = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3B32] font-sans">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-[#38281F]">❤️ รายการสินค้าที่ชอบ (Wishlist)</h1>
          <Link to="/" className="text-xs font-bold text-[#8C6D58] hover:underline">
            ← เลือกดูสินค้าเพิ่ม
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EBD9C8] p-12 text-center">
            <span className="text-4xl">🤍</span>
            <p className="text-[#8C6D58] text-sm mt-3 font-semibold">คุณยังไม่มีรายการสินค้าที่กดหัวใจไว้</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#EBD9C8] p-3 shadow-sm relative">
                <button
                  onClick={() => removeFav(item.id)}
                  className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-white text-rose-600 font-bold text-xs shadow"
                >
                  ✕
                </button>
                <img src={item.image} alt="" className="w-full aspect-square object-cover rounded-xl bg-[#FAF7F2] mb-2" />
                <h3 className="font-semibold text-xs text-[#38281F] truncate">{item.name}</h3>
                <p className="font-bold text-[#8C6D58] text-sm mt-1">฿{item.price}</p>
                <Link
                  to={`/products/${item.id}`}
                  className="mt-2 block text-center bg-[#F5EBE1] text-[#6B4F3B] py-1.5 rounded-xl text-xs font-bold"
                >
                  ดูรายละเอียด
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}