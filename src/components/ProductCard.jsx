import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { wished, toggleWishlist, addCart } from '../api/backend';

export default function ProductCard({ product, onEditProduct }) {
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  const productName = product.name || product.title || 'เสื้อผ้าแฟชั่น';
  const productImage = product.image_url || product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500';

  useEffect(() => {
    let alive = true;
    wished(product.id).then((liked) => {
      if (alive) setIsFav(liked);
    }).catch(() => {
      if (alive) setIsFav(false);
    });
    return () => { alive = false; };
  }, [product.id]);

  const toggleFav = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('กรุณาเข้าสู่ระบบก่อนกดถูกใจ');
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'buyer') return;
    try {
      const data = await toggleWishlist(product.id);
      setIsFav(!!data?.liked);
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (err) {
      alert(err.message || 'บันทึกถูกใจไม่สำเร็จ');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า');
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'buyer') {
      alert('บัญชีผู้ขายและแอดมินเพิ่มสินค้าลงตะกร้าไม่ได้');
      return;
    }
    try {
      const size = (product.sizes && product.sizes[0]) || 'M';
      await addCart(product.id, size, 1);
      window.dispatchEvent(new Event('cartUpdated'));
      alert('เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว!');
    } catch (err) {
      alert(err.message || 'เพิ่มลงตะกร้าไม่สำเร็จ');
    }
  };

  return (
    <div className="group rounded-2xl border border-[#EBD9C8] bg-white p-3 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative">
      {/* ปุ่มกดหัวใจสำหรับผู้ซื้อ */}
      {currentUser?.role !== 'seller' && currentUser?.role !== 'admin' && (
        <button
          onClick={toggleFav}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm shadow-sm hover:scale-110 transition"
        >
          <span className={isFav ? 'text-rose-500 font-bold' : 'text-[#A68F7E]'}>{isFav ? '❤️' : '🤍'}</span>
        </button>
      )}

      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#F7F2EB] flex items-center justify-center mb-3">
          <img
            src={productImage}
            alt={productName}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>

        <h3 className="truncate text-xs md:text-sm font-semibold text-[#38281F] group-hover:text-[#8C6D58] transition">
          {productName}
        </h3>

        <div className="mt-1 flex items-baseline justify-between">
          <p className="text-sm md:text-base font-bold text-[#8C6D58]">
            ฿{Number(product.price || 0).toLocaleString()}
          </p>
          <span className="text-[10px] text-[#A68F7E]">สต็อก {product.stock || 20}</span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-500">
          <span>★</span>
          <span className="font-semibold text-[#533C2C]">{product.rating || '4.5'}</span>
        </div>
      </Link>

      {/* สลับปุ่มตามบทบาท */}
      {currentUser?.role === 'seller' ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            if (onEditProduct) onEditProduct(product);
            else navigate('/seller');
          }}
          className="mt-3 w-full bg-[#8C6D58] hover:bg-[#6B4F3B] text-white py-2 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1"
        >
          <span>✏️</span> แก้ไขข้อมูลเสื้อผ้า
        </button>
      ) : currentUser?.role === 'admin' ? (
        <div className="mt-3 py-1.5 bg-[#FAF7F2] border border-[#EBD9C8] rounded-xl text-[11px] text-center text-[#8C6D58] font-semibold">
          🛡️ โหมดผู้ดูแลระบบ
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full bg-[#FAF5EE] hover:bg-[#8C6D58] text-[#6B4F3B] hover:text-white border border-[#DFC8B2] py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
        >
          <span>🛒</span> เพิ่มลงตะกร้า
        </button>
      )}
    </div>
  );
}