import { NavLink, Outlet } from 'react-router-dom';

export default function SellerLayout() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm ${isActive ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100'}`;

  return (
    <div className="mx-auto max-w-6xl p-4 md:flex gap-6">
      <aside className="w-full md:w-56 mb-4 space-y-1">
        <h2 className="px-4 text-xs font-bold text-slate-400 uppercase mb-2">Seller Centre</h2>
        <NavLink to="/seller" end className={linkClass}>แดชบอร์ดร้านค้า</NavLink>
        <NavLink to="/seller/products" className={linkClass}>จัดการเสื้อผ้า</NavLink>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}