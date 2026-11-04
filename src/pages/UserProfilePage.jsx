import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function UserProfilePage() {
  const user = JSON.parse(localStorage.getItem('user') || '{"displayName":"Praewa Buyer","email":"buyer@store.com"}');

  const [orders] = useState([
    { id: 'ORD-8801', date: '2026-11-01', total: 590, status: 'จัดส่งสำเร็จ', items: 'กางเกงยีนส์ขายาว (1 ชิ้น)' },
    { id: 'ORD-8802', date: '2026-11-04', total: 299, status: 'กำลังจัดส่ง', items: 'เสื้อยืดคอกลมสีขาว (1 ชิ้น)' }
  ]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3B32] font-sans">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link to="/" className="text-xs text-[#8C6D58] font-bold hover:underline mb-4 inline-block">
          ← กลับไปหน้าร้านค้า
        </Link>
        
        <div className="bg-white rounded-3xl border border-[#EBD9C8] p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#8C6D58] text-white flex items-center justify-center text-2xl font-bold">
              👤
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#38281F]">{user.displayName || 'Praewa Buyer'}</h1>
              <p className="text-xs text-[#A68F7E]">{user.email}</p>
              <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                บัญชีผู้ซื้อ (Buyer Account)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#EBD9C8] p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#38281F] mb-4">ประวัติการสั่งซื้อของคุณ</h2>
          <div className="space-y-3">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EBD9C8] flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-[#38281F]">{ord.id}</span>
                  <span className="mx-2 text-[#A68F7E]">({ord.date})</span>
                  <p className="text-[#6A5243] mt-1">{ord.items}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#8C6D58] text-sm">฿{ord.total}</p>
                  <span className="text-emerald-700 font-semibold text-[11px]">{ord.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}