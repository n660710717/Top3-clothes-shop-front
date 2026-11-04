import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ onSearch, onCategorySelect }) {
  const [keyword, setKeyword] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  const updateStatus = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));

    const favs = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistCount(favs.length);

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { setUser(null); }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    updateStatus();
    window.addEventListener('storage', updateStatus);
    window.addEventListener('cartUpdated', updateStatus);
    window.addEventListener('wishlistUpdated', updateStatus);
    return () => {
      window.removeEventListener('storage', updateStatus);
      window.removeEventListener('cartUpdated', updateStatus);
      window.removeEventListener('wishlistUpdated', updateStatus);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(keyword);
  };

  const handleSelectCat = (cat) => {
    setShowCategoryMenu(false);
    if (onCategorySelect) onCategorySelect(cat);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowUserDropdown(false);
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2] border-b border-[#EBD9C8] shadow-sm font-sans">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        {/* โลโก้แบรนด์ */}
        <Link to="/" onClick={() => handleSelectCat('ทั้งหมด')} className="flex items-center gap-2 font-bold text-[#6B4F3B] text-lg shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8C6D58] text-white text-base shadow-sm">
            🧶
          </div>
          <span className="text-[#38281F]">Clothing<span className="text-[#8C6D58]">Hub</span></span>
        </Link>

        {/* ค้นหา */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md mx-2">
          <input
            type="text"
            placeholder="ค้นหาเสื้อผ้า, สไตล์มินิมอล, โทนครีม..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            className="w-full rounded-full border border-[#DCC5AF] bg-white py-1.5 pl-4 pr-10 text-xs text-[#4A3B32] placeholder-[#A68F7E] focus:outline-none focus:ring-2 focus:ring-[#8C6D58]/40"
          />
          <button type="submit" className="absolute right-3 top-2 text-[#8C6D58] hover:text-[#533C2C] text-xs">
            🔍
          </button>
        </form>

        {/* เมนูมุมขวาบน */}
        <div className="flex items-center gap-4 text-xs text-[#533C2C] font-medium shrink-0">
          {/* หมวดหมู่ */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="flex items-center gap-1 hover:text-[#8C6D58] py-1"
            >
              <span>หมวดหมู่</span>
              <span className="text-[10px]">▼</span>
            </button>
            {showCategoryMenu && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl bg-white p-1.5 shadow-lg border border-[#EBD9C8] z-50">
                {['ทั้งหมด', 'เสื้อ', 'กางเกง', 'เดรส'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleSelectCat(cat)}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-[#F5EBE1] hover:text-[#6B4F3B] transition"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ตะกร้าและ Wishlist เฉพาะผู้ซื้อ */}
          {user?.role !== 'seller' && user?.role !== 'admin' && (
            <>
              <Link to="/wishlist" className="relative cursor-pointer hover:text-[#8C6D58] flex items-center" title="รายการที่ชอบ">
                <span className="text-lg">❤️</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative cursor-pointer hover:text-[#8C6D58] flex items-center" title="ตะกร้าสินค้า">
                <span className="text-xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#8C6D58] text-[10px] font-bold text-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* User Dropdown มุมขวาบน (ใช้จุดเดียวทั้ง Buyer, Seller, Admin) */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 bg-[#F5EBE1] hover:bg-[#EBD9C8] px-3 py-1.5 rounded-full border border-[#DCC5AF] transition shadow-sm"
              >
                <span className="text-sm">
                  {user.role === 'admin' ? '🛡️' : user.role === 'seller' ? '🏪' : '👤'}
                </span>
                <span className="font-bold text-[#38281F] max-w-[120px] truncate">
                  {user.displayName || (user.role === 'seller' ? 'Somchai Seller Shop' : user.role === 'admin' ? 'Admin Manager' : 'Praewa Buyer')}
                </span>
                <span className="text-[10px] text-[#8C6D58]">▼</span>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white p-2 shadow-xl border border-[#EBD9C8] z-50 text-xs">
                  <div className="px-3 py-2 border-b border-[#F5EBE1]">
                    <p className="font-bold text-[#38281F]">
                      {user.displayName || (user.role === 'seller' ? 'Somchai Seller Shop' : user.role === 'admin' ? 'Admin Manager' : 'Praewa Buyer')}
                    </p>
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold mt-1 ${
                      user.role === 'admin' ? 'bg-rose-100 text-rose-700' : user.role === 'seller' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </div>

                  {/* เมนูลัดตามสิทธิ์ */}
                  {user.role === 'seller' && (
                    <Link
                      to="/seller"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#533C2C] hover:bg-[#FAF7F2] transition my-1 font-semibold"
                    >
                      <span>🏪</span> แดชบอร์ดผู้ขาย (Seller Centre)
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#533C2C] hover:bg-[#FAF7F2] transition my-1 font-semibold"
                    >
                      <span>🛡️</span> ระบบหลังบ้านแอดมิน (Admin)
                    </Link>
                  )}

                  {user.role === 'buyer' && (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#533C2C] hover:bg-[#FAF7F2] transition my-1"
                      >
                        <span>👤</span> ข้อมูล & ประวัติสั่งซื้อ
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#533C2C] hover:bg-[#FAF7F2] transition mb-1"
                      >
                        <span>❤️</span> สินค้าที่ชอบ ({wishlistCount})
                      </Link>
                    </>
                  )}

                  {/* ปุ่มออกจากระบบเพียงจุดเดียวที่มุมบนขวา */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 font-bold hover:bg-rose-50 transition border-t border-[#F5EBE1]"
                  >
                    <span>🚪</span> ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hover:text-[#8C6D58]">เข้าสู่ระบบ</Link>
              <span className="text-[#DEC4A6]">|</span>
              <Link to="/register" className="bg-[#8C6D58] hover:bg-[#6B4F3B] text-white px-3 py-1 rounded-full text-xs transition font-semibold">
                สมัครสมาชิก
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}