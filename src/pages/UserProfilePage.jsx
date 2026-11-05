import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { changePassword, getMyOrders, applyForShop } from '../api/backend';
import { useNotice } from '../components/Notice';

export default function UserProfilePage() {
  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  const [orders, setOrders] = useState([]);
  const [shopName, setShopName] = useState('');
  const { notify } = useNotice();

  useEffect(() => {
    if (currentUser?.role !== 'buyer') return;
    getMyOrders().then(setOrders).catch(() => setOrders([]));
  }, [currentUser]);

  const handleApplyShop = async (e) => {
    e.preventDefault();
    try {
      await applyForShop(shopName.trim());
      setShopName('');
      notify('ส่งคำขอเปิดร้านแล้ว รอผู้ดูแลอนุมัติ');
    } catch (err) {
      notify(err.message || 'ส่งคำขอไม่สำเร็จ');
    }
  };

  // ฟังก์ชันเปลี่ยนรหัสผ่านจริง
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await changePassword(oldPassword, newPassword, token);
      setPasswordMsg({ type: 'success', text: 'เปลี่ยนรหัสผ่านสำเร็จ! กรุณาใช้รหัสผ่านใหม่ในการเข้าสู่ระบบครั้งถัดไป' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ' });
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#4A3B32] font-sans">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-sm text-[#8C6D58] mb-4">เข้าสู่ระบบก่อนดูโปรไฟล์และคำสั่งซื้อของตัวเอง</p>
          <Link to="/login" className="text-xs font-bold text-white bg-[#6B4F3B] px-4 py-2 rounded-xl">เข้าสู่ระบบ</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A3B32] font-sans">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link to="/" className="text-xs text-[#8C6D58] font-bold hover:underline mb-4 inline-block">
          ← กลับไปหน้าร้านค้าหลัก
        </Link>
        
        {/* หัวข้อโปรไฟล์ */}
        <div className="bg-white rounded-3xl border border-[#EBD9C8] p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#8C6D58] text-white flex items-center justify-center text-2xl font-bold">
              👤
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#38281F]">{currentUser.displayName}</h1>
              <p className="text-xs text-[#A68F7E]">{currentUser.email}</p>
              <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                บัญชีผู้ใช้ ({currentUser.role ? currentUser.role.toUpperCase() : 'BUYER'})
              </span>
            </div>
          </div>
        </div>

        {currentUser.role === 'buyer' && (
          <form onSubmit={handleApplyShop} className="bg-white rounded-3xl border border-[#EBD9C8] p-6 mb-6 shadow-sm">
            <h2 className="text-base font-bold text-[#38281F] mb-3">ขอเปิดร้านค้า</h2>
            <div className="flex gap-2">
              <input
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="ชื่อร้าน"
                className="flex-1 p-2.5 border border-[#DCC5AF] rounded-xl text-xs"
              />
              <button type="submit" className="bg-[#6B4F3B] text-white text-xs font-bold px-4 rounded-xl">
                ส่งคำขอ
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ฟอร์มเปลี่ยนรหัสผ่าน */}
          <div className="bg-white rounded-3xl border border-[#EBD9C8] p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#38281F] mb-4 flex items-center gap-2">
              <span>🔒</span> เปลี่ยนรหัสผ่าน (Change Password)
            </h2>

            {passwordMsg.text && (
              <div className={`p-3 rounded-xl text-xs mb-4 font-semibold ${
                passwordMsg.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#533C2C]">รหัสผ่านปัจจุบัน</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="ป้อนรหัสผ่านเดิม"
                  className="mt-1 w-full p-2.5 border border-[#DCC5AF] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#533C2C]">รหัสผ่านใหม่</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className="mt-1 w-full p-2.5 border border-[#DCC5AF] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#533C2C]">ยืนยันรหัสผ่านใหม่</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="ป้อนรหัสผ่านใหม่อีกครั้ง"
                  className="mt-1 w-full p-2.5 border border-[#DCC5AF] rounded-xl focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#6B4F3B] hover:bg-[#533C2C] text-white py-2.5 rounded-xl font-bold shadow-sm transition"
              >
                บันทึกการเปลี่ยนรหัสผ่าน
              </button>
            </form>
          </div>

          {/* ประวัติสั่งซื้อ */}
          <div className="bg-white rounded-3xl border border-[#EBD9C8] p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#38281F] mb-4 flex items-center gap-2">
              <span>📦</span> ประวัติการสั่งซื้อของคุณ
            </h2>
            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.id} className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EBD9C8] flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#38281F]">{ord.id}</span>
                    <p className="text-[#6A5243] mt-0.5">{ord.items}</p>
                    <span className="text-[10px] text-[#A68F7E]">{ord.date}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#8C6D58]">฿{ord.total}</p>
                    <span className="text-emerald-700 font-semibold text-[10px]">{ord.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}