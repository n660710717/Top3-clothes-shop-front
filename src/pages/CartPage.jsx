import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(saved);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQty = (index, delta) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    updateCart(updated);
  };

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    updateCart(updated);
  };

  const totalPrice = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3B32] font-sans">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* ปุ่มออกจากหน้าตะกร้า / ย้อนกลับหน้าร้าน */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#8C6D58] bg-[#F5EBE1] hover:bg-[#EBD9C8] px-3.5 py-2 rounded-xl border border-[#DCC5AF] transition shadow-sm"
          >
            ← ออกจากตะกร้า / ย้อนกลับหน้าร้านค้า
          </Link>
          <span className="text-xs text-[#A68F7E]">จำนวน {cart.length} รายการ</span>
        </div>

        <h1 className="text-xl font-bold text-[#38281F] mb-6 flex items-center gap-2">
          <span>🛒</span> ตะกร้าสินค้าของคุณ
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#EBD9C8] p-12 text-center shadow-sm">
            <span className="text-5xl">🛍️</span>
            <p className="text-[#8C6D58] text-sm mt-4 font-semibold">ไม่มีสินค้าอยู่ในตะกร้าของคุณ</p>
            <Link
              to="/"
              className="mt-5 inline-block bg-[#6B4F3B] hover:bg-[#533C2C] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition shadow-sm"
            >
              ← กลับไปเลือกซื้อเสื้อผ้าหน้าร้าน
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-white rounded-2xl border border-[#EBD9C8] p-4 flex items-center gap-4 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl bg-[#FAF7F2] shrink-0 border border-[#EBD9C8]"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#38281F] truncate">{item.name}</h3>
                    <p className="text-xs text-[#A68F7E] mt-0.5">ไซส์: {item.chosenSize || 'S'}</p>
                    <p className="text-xs font-bold text-[#8C6D58] mt-1">
                      ฿{(Number(item.price) || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center border border-[#DCC5AF] rounded-xl bg-[#FAF7F2]">
                    <button onClick={() => updateQty(index, -1)} className="px-3 py-1 text-xs text-[#533C2C] hover:bg-[#EBD9C8] rounded-l-xl">-</button>
                    <span className="px-2 text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => updateQty(index, 1)} className="px-3 py-1 text-xs text-[#533C2C] hover:bg-[#EBD9C8] rounded-r-xl">+</button>
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-[#A68F7E] hover:text-rose-600 text-lg px-1 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* สรุปรายการ */}
            <div className="bg-white rounded-2xl border border-[#EBD9C8] p-6 shadow-sm h-fit">
              <h2 className="text-sm font-bold text-[#38281F] border-b border-[#F5EBE1] pb-3">สรุปสั่งซื้อ</h2>
              <div className="space-y-2.5 mt-4 text-xs text-[#533C2C]">
                <div className="flex justify-between">
                  <span>ยอดรวมสินค้า</span>
                  <span>฿{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span className="text-emerald-700 font-bold">ฟรี</span>
                </div>
                <div className="border-t border-[#F5EBE1] pt-3 flex justify-between font-bold text-sm text-[#38281F]">
                  <span>ยอดชำระสุทธิ</span>
                  <span className="text-[#8C6D58]">฿{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  alert('ชำระเงินจำลองสำเร็จ! ยอดรวม ฿' + totalPrice.toLocaleString());
                  updateCart([]);
                  navigate('/');
                }}
                className="mt-6 w-full bg-[#6B4F3B] hover:bg-[#533C2C] text-white font-bold py-3 rounded-xl text-xs transition shadow-sm"
              >
                ดำเนินการสั่งซื้อ
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}