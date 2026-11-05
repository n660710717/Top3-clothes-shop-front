import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { DEFAULT_USERS } from './LoginPage';

export default function UserProfilePage() {
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('user') || '{"displayName":"Praewa Buyer","email":"praewa@buyer.com","role":"buyer"}');
  });

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  const [orders] = useState([
    { id: 'ORD-8801', date: '2026-11-01', total: 590, status: 'จัดส่งสำเร็จ', items: 'กางเกงยีนส์ขายาว (1 ชิ้น)' },
    { id: 'ORD-8802', date: '2026-11-04', total: 299, status: 'กำลังจัดส่ง', items: 'เสื้อยืดคอกลมสีขาว (1 ชิ้น)' }
  ]);

  // ฟังก์ชันเปลี่ยนรหัสผ่านจริง
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    const storedUsers = JSON.parse(localStorage.getItem('app_users') || JSON.stringify(DEFAULT_USERS));
    const userIndex = storedUsers.findIndex((u) => u.email.toLowerCase() === currentUser.email.toLowerCase());

    if (userIndex === -1) {
      setPasswordMsg({ type: 'error', text: 'ไม่พบข้อมูลบัญชีผู้ใช้ในระบบ' });
      return;
    }

    // ตรวจสอบรหัสผ่านเดิม
    if (storedUsers[userIndex].password !== oldPassword) {
      setPasswordMsg({ type: 'error', text: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร' });
      return;
    }

    // อัปเดตรหัสผ่านใหม่ลงฐานข้อมูล app_users
    storedUsers[userIndex].password = newPassword;
    localStorage.setItem('app_users', JSON.stringify(storedUsers));

    // อัปเดตข้อมูลเซสชันปัจจุบัน
    const updatedCurrentUser = { ...currentUser, password: newPassword };
    localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
    setCurrentUser(updatedCurrentUser);

    setPasswordMsg({ type: 'success', text: 'เปลี่ยนรหัสผ่านสำเร็จ! กรุณใช้รหัสผ่านใหม่ในการเข้าสู่ระบบครั้งถัดไป' });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

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
                  placeholder="อย่างน้อย 6 ตัวอักษร"
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