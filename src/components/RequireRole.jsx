import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function RequireRole({ allowedRoles, children }) {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation();

  // ด่านที่ 1: AuthN - ยังไม่ได้ล็อกอิน เด้งไปหน้า /login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // ด่านที่ 2: AuthZ - ตรวจสอบว่า Role ปัจจุบันได้รับอนุญาตหรือไม่
  if (!allowedRoles.includes(role)) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="text-5xl font-bold text-slate-300">403</h1>
        <p className="mt-2 text-slate-600">
          หน้านี้เฉพาะสิทธิ์: <span className="font-semibold">{allowedRoles.join(' หรือ ')}</span> เท่านั้น
        </p>
        <p className="mt-1 text-sm text-slate-400">
          สิทธิ์ของคุณในปัจจุบันคือ: <span className="font-semibold text-red-500">{role}</span>
        </p>
        <Link to="/" className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white">
          กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  return children;
}