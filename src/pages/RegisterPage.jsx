import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/backend';
import { useNotice } from '../components/Notice';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { notify } = useNotice();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 8) {
      setErrorMessage('รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร');
      return;
    }

    try {
      await register(email.trim(), password, displayName.trim(), role);
      notify('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบด้วยบัญชีของคุณ');
      navigate('/login');
    } catch (err) {
      setErrorMessage(err.message || 'สมัครสมาชิกไม่สำเร็จ');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-sans text-[#4A3B32]">
      <div className="bg-white rounded-3xl border border-[#EBD9C8] p-8 max-w-md w-full shadow-xl">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-[#6B4F3B]">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8C6D58] text-white text-lg shadow">
              🧶
            </span>
            <span>Clothing<span className="text-[#8C6D58]">Hub</span></span>
          </Link>
          <h1 className="text-lg font-bold text-[#38281F] mt-4">สมัครสมาชิกใหม่</h1>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-[#533C2C]">ชื่อผู้ใช้งาน / ชื่อร้านค้า</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="เช่น คุณกิตติ หรือ My Shop"
              className="mt-1 w-full p-2.5 border border-[#DCC5AF] rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-[#533C2C]">อีเมล</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              className="mt-1 w-full p-2.5 border border-[#DCC5AF] rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-[#533C2C]">กำหนดรหัสผ่าน</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="อย่างน้อย 8 ตัวอักษร"
              className="mt-1 w-full p-2.5 border border-[#DCC5AF] rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-[#533C2C]">ประเภทบัญชีผู้ใช้</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full p-2.5 border border-[#DCC5AF] rounded-xl bg-white font-medium"
            >
              <option value="buyer">👤 ผู้ซื้อ (Buyer)</option>
              <option value="seller">🏪 ผู้ขาย (Seller)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#6B4F3B] hover:bg-[#533C2C] text-white font-bold py-3 rounded-xl text-xs transition shadow-md mt-2"
          >
            ยืนยันสมัครสมาชิก
          </button>
        </form>

        <div className="mt-5 text-center text-xs">
          <span className="text-[#A68F7E]">มีบัญชีผู้ใช้อยู่แล้ว? </span>
          <Link to="/login" className="font-bold text-[#8C6D58] hover:underline">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}