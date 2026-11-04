import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const tabClass = ({ isActive }) =>
    `px-4 py-2 text-sm font-semibold rounded-lg ${isActive ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 border-b pb-4 flex items-center gap-4">
        <h1 className="text-xl font-bold text-purple-900">ระบบหลังบ้าน Admin 🛡️</h1>
        <nav className="flex gap-2">
          <NavLink to="/admin" end className={tabClass}>ภาพรวม</NavLink>
          <NavLink to="/admin/members" className={tabClass}>จัดการสมาชิก</NavLink>
        </nav>
      </div>
      <Outlet />
    </div>
  );
}