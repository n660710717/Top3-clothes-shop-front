import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);
    try {
      const member = await login(email.trim(), password);
      if (member?.role === 'admin') {
        navigate('/admin');
      } else if (member?.role === 'seller') {
        navigate('/seller');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMessage(err.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setSubmitting(false);
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
          <h1 className="text-lg font-bold text-[#38281F] mt-4">เข้าสู่ระบบ</h1>
          <p className="text-xs text-[#A68F7E]">กรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งานระบบ</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-[#533C2C]">อีเมล (Email)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              className="mt-1 w-full p-3 border border-[#DCC5AF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8C6D58]/40"
            />
          </div>

          <div>
            <label className="font-semibold text-[#533C2C]">รหัสผ่าน (Password)</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full p-3 border border-[#DCC5AF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8C6D58]/40"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#6B4F3B] hover:bg-[#533C2C] text-white font-bold py-3 rounded-xl text-xs transition shadow-md mt-2 disabled:opacity-60"
          >
            {submitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs pt-4 border-t border-[#F5EBE1]">
          <span className="text-[#A68F7E]">ยังไม่มีบัญชีสมาชิก? </span>
          <Link to="/register" className="font-bold text-[#8C6D58] hover:underline">
            สมัครสมาชิกใหม่
          </Link>
        </div>
      </div>
    </div>
  );
}
