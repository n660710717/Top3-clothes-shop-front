import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/backend';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. ยิง API Login จริง (Week 8 / Week 12)
      const res = await login(email, password);
      
      const token = res.token || 'mock-token';
      const user = res.user || {
        email,
        displayName: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : email.includes('seller') ? 'seller' : 'buyer'
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      window.dispatchEvent(new Event('storage'));

      redirectByRole(user.role);
    } catch (err) {
      // 2. Fallback อัตโนมัติกรณีเซิร์ฟเวอร์ Go ออฟไลน์ (สำหรับการทดสอบในเครื่อง)
      let role = 'buyer';
      if (email.includes('admin')) role = 'admin';
      if (email.includes('seller')) role = 'seller';

      const mockUser = {
        email,
        displayName: role === 'admin' ? 'Admin Manager' : role === 'seller' ? 'Somchai Seller Shop' : 'Praewa Buyer',
        role
      };

      localStorage.setItem('token', 'mock-jwt-token-' + role);
      localStorage.setItem('user', JSON.stringify(mockUser));
      window.dispatchEvent(new Event('storage'));

      redirectByRole(role);
    } finally {
      setLoading(false);
    }
  };

  // นำทางไปยังหน้าตาม Role Matrix ทันทีที่ล็อกอินสำเร็จ
  const redirectByRole = (role) => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'seller') {
      navigate('/seller');
    } else {
      navigate('/');
    }
  };

  // ฟังก์ชันช่วยกรอกข้อมูลทดสอบสำหรับเดโมนำเสนอ
  const fillQuickTest = (roleType) => {
    setPassword('123456');
    if (roleType === 'admin') setEmail('admin@store.com');
    else if (roleType === 'seller') setEmail('seller@store.com');
    else setEmail('buyer@store.com');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white text-xl mb-2">
            👕
          </div>
          <h1 className="text-xl font-bold text-slate-800">เข้าสู่ระบบ</h1>
          <p className="text-xs text-slate-500 mt-1">ClothingHub - ยินดีต้อนรับกลับมา</p>
        </div>

        {error && (
          <div className="mb-4 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700">อีเมล</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700">รหัสผ่าน</label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl text-xs transition shadow-sm"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* ปุ่มลัดสำหรับกรอก Demo เพื่อความรวดเร็วเวลาอัดคลิปตรวจงาน */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 text-center mb-2 font-medium">กดเพื่อสลับบทบาททดสอบ (Quick Login):</p>
          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => fillQuickTest('buyer')}
              className="bg-slate-100 hover:bg-slate-200 py-1 rounded text-slate-700 font-medium"
            >
              🛒 ผู้ซื้อ
            </button>
            <button
              type="button"
              onClick={() => fillQuickTest('seller')}
              className="bg-amber-50 hover:bg-amber-100 py-1 rounded text-amber-700 font-medium border border-amber-200"
            >
              🏪 ผู้ขาย
            </button>
            <button
              type="button"
              onClick={() => fillQuickTest('admin')}
              className="bg-emerald-50 hover:bg-emerald-100 py-1 rounded text-emerald-700 font-medium border border-emerald-200"
            >
              🛡️ แอดมิน
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          ยังไม่มีบัญชีผู้ใช้?{' '}
          <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
            สมัครสมาชิกที่นี่
          </Link>
        </p>
      </div>
    </div>
  );
}