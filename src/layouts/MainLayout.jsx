import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-white py-6 text-center text-xs text-slate-400">
        © 2026 ClothingHub Store - Client Side Web Programming Project
      </footer>
    </div>
  );
}