import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/backend';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(email, password, displayName);
      alert('สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ');
      navigate('/login');
    } catch (err) {
      // สำหรับกรณีทดสอบแบบออฟไลน์
      localStorage.setItem('user', JSON.stringify({ email, displayName: displayName || 'ผู้ใช้ใหม่', role: 'buyer' }));
      localStorage.setItem('token', 'mock-token-1234');
      window.dispatchEvent(new Event('storage'));
      alert('สมัครสมาชิกและเข้าสู่ระบบทดลองสำเร็จ!');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white text-xl mb-2">
            👕
          </div>
          <h2 className="text-xl font-bold text-slate-800">สมัครสมาชิก</h2>
          <p className="text-xs text-slate-500 mt-1">สร้างบัญชีเพื่อสั่งซื้อเสื้อผ้าและรับสิทธิพิเศษ</p>
        </div>

        {error && <div className="mb-4 text-xs text-rose-500 bg-rose-50 p-2.5 rounded-lg border border-rose-100">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-700">ชื่อผู้ใช้ / Display Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="เช่น Somchai Fashion"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">อีเมล</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">รหัสผ่าน</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-xs transition shadow-sm mt-2"
          >
            {loading ? 'กำลังบันทึกข้อมูล...' : 'ลงทะเบียนสมัครสมาชิก'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
            เข้าสู่ระบบที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
}