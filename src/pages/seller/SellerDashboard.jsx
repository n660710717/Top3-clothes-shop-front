import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSellerProducts, deleteProduct, getSellerOrders, shipOrder, createSellerProduct, updateSellerProduct } from '../../api/backend';
import { useNotice } from '../../components/Notice';

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('token');
  const { notify, confirm } = useNotice();
  //const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formProduct, setFormProduct] = useState({
    id: null, name: '', category: 'เสื้อ', price: '', stock: '', image: ''
  });

  useEffect(() => {
    getSellerProducts(token).then((data) => setProducts(data || [])).catch(() => setProducts([]));
    getSellerOrders().then(setOrders).catch(() => setOrders([]));
  }, [token]);

  const handleDelete = async (id) => {
    if (!(await confirm('คุณแน่ใจว่าต้องการลบสินค้านี้ออกจากร้าน Somchai Seller Shop?'))) return;
    try {
      await deleteProduct(id, token);
      setProducts(products.filter((p) => p.id !== id));
      notify('ลบสินค้าสำเร็จ');
    } catch (e) {
      notify(e.message || 'ลบสินค้าไม่สำเร็จ');
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormProduct({ id: null, name: '', category: 'เสื้อ', price: '', stock: '', image: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setIsEditing(true);
    setFormProduct({ id: p.id, name: p.name || p.title, category: p.category || 'เสื้อ', price: p.price, stock: p.stock || 20, image: p.image_url || p.image });
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const body = {
      name: formProduct.name,
      category: formProduct.category,
      price: Number(formProduct.price),
      stock: Number(formProduct.stock),
      image: formProduct.image,
    };
    try {
      if (isEditing) {
        await updateSellerProduct(formProduct.id, body);
        notify('แก้ไขรายละเอียดสินค้าเรียบร้อย');
      } else {
        await createSellerProduct(body);
        notify('เพิ่มสินค้าใหม่เรียบร้อย');
      }
      setProducts(await getSellerProducts(token));
      setShowModal(false);
    } catch (err) {
      notify(err.message || 'บันทึกสินค้าไม่สำเร็จ');
    }
  };

  const handleUpdateShipping = async (orderId, trackingNo) => {
    if (!trackingNo.trim()) {
      notify('กรุณากรอกเลขพัสดุก่อนจัดส่ง');
      return;
    }
    try {
      await shipOrder(orderId, trackingNo.trim());
      setOrders(await getSellerOrders());
      notify(`อัปเดตคำสั่งซื้อ ${orderId} เป็นจัดส่งแล้ว!`);
    } catch (err) {
      notify(err.message || 'อัปเดตการจัดส่งไม่สำเร็จ');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] text-[#4A3B32] font-sans">
      {/* Sidebar ด้านซ้าย - ใช้ sticky top-0 h-screen ตรึงติดหน้าจอเสมอ */}
      <aside className="w-64 bg-[#2C1D15] text-white flex flex-col p-4 shrink-0 shadow-md sticky top-0 h-screen">
        <div className="flex items-center gap-2 font-bold text-xl px-2 py-4 mb-4 text-[#DFC8B2]">
          <span>🏪</span> Seller<span className="text-white">Centre</span>
        </div>
        
        <nav className="space-y-1.5 text-xs font-medium flex-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition text-left ${activeTab === 'overview' ? 'bg-[#533C2C] text-white font-bold' : 'text-[#DEC4A6] hover:bg-[#533C2C]/50'}`}
          >
            <span>📊</span> ภาพรวมร้านค้า
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition text-left ${activeTab === 'products' ? 'bg-[#533C2C] text-white font-bold' : 'text-[#DEC4A6] hover:bg-[#533C2C]/50'}`}
          >
            <span>👗</span> จัดการเสื้อผ้า ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition text-left ${activeTab === 'orders' ? 'bg-[#533C2C] text-white font-bold' : 'text-[#DEC4A6] hover:bg-[#533C2C]/50'}`}
          >
            <span>📦</span> คำสั่งซื้อของลูกค้า ({orders.length})
          </button>
        </nav>

        {/* ปุ่มย้อนกลับไปหน้าหลักร้านค้า แสดงที่มุมซ้ายล่างตลอดเวลา */}
        <div className="mt-auto pt-4 border-t border-[#533C2C]/60 text-xs">
          <p className="text-[#DFC8B2] font-bold">Somchai Seller Shop</p>
          <Link
            to="/"
            className="w-full mt-3 flex items-center justify-center gap-2 bg-[#533C2C] hover:bg-[#6B4F3B] text-[#DFC8B2] hover:text-white py-2.5 rounded-xl font-bold transition border border-[#8C6D58] shadow-sm"
          >
            ← ย้อนกลับไปหน้าหลักร้านค้า
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-x-hidden">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl font-bold text-[#38281F] mb-6">ภาพรวมร้านค้า Somchai Seller Shop</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#533C2C] text-white p-6 rounded-2xl shadow-sm">
                <p className="text-xs text-[#DEC4A6]">ยอดขายสะสมเดือนนี้</p>
                <p className="text-3xl font-extrabold mt-1">฿45,200</p>
              </div>
              <div className="bg-[#6B4F3B] text-white p-6 rounded-2xl shadow-sm">
                <p className="text-xs text-[#DEC4A6]">คำสั่งซื้อที่ต้องจัดส่ง</p>
                <p className="text-3xl font-extrabold mt-1">{orders.filter((o) => o.status === 'รอการจัดส่ง').length} รายการ</p>
              </div>
              <div className="bg-[#8C6D58] text-white p-6 rounded-2xl shadow-sm">
                <p className="text-xs text-[#DEC4A6]">สินค้าพร้อมขายทั้งหมด</p>
                <p className="text-3xl font-extrabold mt-1">{products.length} รายการ</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#38281F]">รายการเสื้อผ้าทั้งหมด ({products.length} ชิ้น)</h2>
              <button onClick={handleOpenAdd} className="bg-[#6B4F3B] hover:bg-[#533C2C] text-white text-xs px-4 py-2.5 rounded-xl font-bold">
                + เพิ่มเสื้อผ้าใหม่
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#EBD9C8] overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#533C2C] text-white">
                  <tr>
                    <th className="p-3.5">รูปภาพ</th>
                    <th className="p-3.5">ชื่อสินค้า</th>
                    <th className="p-3.5">หมวดหมู่</th>
                    <th className="p-3.5">ราคา</th>
                    <th className="p-3.5">คะแนนรีวิว</th>
                    <th className="p-3.5 text-center">สต็อก</th>
                    <th className="p-3.5 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EBE1]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF7F2]">
                      <td className="p-2.5">
                        <img src={p.image_url || p.image} alt="" className="w-10 h-10 object-cover rounded-xl border" />
                      </td>
                      <td className="p-2.5 font-bold text-[#38281F]">{p.name || p.title}</td>
                      <td className="p-2.5 text-[#8C6D58]">{p.category}</td>
                      <td className="p-2.5 font-bold text-[#6B4F3B]">฿{Number(p.price).toLocaleString()}</td>
                      <td className="p-2.5 text-amber-500 font-bold">{p.reviewCount > 0 ? `★ ${p.rating}` : 'ยังไม่มีรีวิว'}</td>
                      <td className="p-2.5 text-center font-bold">{p.stock || 20}</td>
                      <td className="p-2.5 text-center">
                        <div className="inline-flex gap-2">
                          <button onClick={() => handleOpenEdit(p)} className="bg-[#8C6D58] text-white px-3 py-1 rounded-lg font-bold">
                            แก้ไข
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="bg-rose-600 text-white px-3 py-1 rounded-lg font-bold">
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-bold text-[#38281F] mb-6">คำสั่งซื้อและการจัดส่งพัสดุ</h2>
            <div className="bg-white rounded-2xl border border-[#EBD9C8] overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#533C2C] text-white font-medium">
                  <tr>
                    <th className="p-3.5">รหัสออเดอร์</th>
                    <th className="p-3.5">ลูกค้า</th>
                    <th className="p-3.5">รายการเสื้อผ้า</th>
                    <th className="p-3.5">ยอดชำระ</th>
                    <th className="p-3.5">สถานะ</th>
                    <th className="p-3.5">หมายเลขพัสดุ</th>
                    <th className="p-3.5 text-center">จัดการส่ง</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EBE1]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF7F2]">
                      <td className="p-3.5 font-bold text-[#38281F]">{ord.id}</td>
                      <td className="p-3.5 font-medium">{ord.customer}</td>
                      <td className="p-3.5">{ord.item}</td>
                      <td className="p-3.5 font-bold text-[#6B4F3B]">฿{ord.amount}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'จัดส่งแล้ว' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {ord.status === 'จัดส่งแล้ว' ? (
                          <span className="font-mono text-[#533C2C] font-semibold">{ord.trackingNo}</span>
                        ) : (
                          <input
                            type="text"
                            placeholder="กรอก Tracking..."
                            id={`tracking-${ord.id}`}
                            className="p-1.5 border border-[#DCC5AF] rounded-lg text-xs w-32 focus:outline-none"
                          />
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {ord.status !== 'จัดส่งแล้ว' ? (
                          <button
                            onClick={() => {
                              const input = document.getElementById(`tracking-${ord.id}`);
                              handleUpdateShipping(ord.id, input ? input.value : '');
                            }}
                            className="bg-[#6B4F3B] hover:bg-[#533C2C] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold"
                          >
                            จัดส่งสำเร็จ
                          </button>
                        ) : (
                          <span className="text-emerald-600 text-[11px] font-bold">✓ ส่งเรียบร้อย</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#EBD9C8]">
              <h3 className="font-bold text-[#38281F] mb-4">{isEditing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>
              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold">ชื่อสินค้า</label>
                  <input type="text" required value={formProduct.name} onChange={(e) => setFormProduct({ ...formProduct, name: e.target.value })} className="w-full p-2 border rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold">ราคา (฿)</label>
                    <input type="number" required value={formProduct.price} onChange={(e) => setFormProduct({ ...formProduct, price: e.target.value })} className="w-full p-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="font-bold">สต็อก</label>
                    <input type="number" required value={formProduct.stock} onChange={(e) => setFormProduct({ ...formProduct, stock: e.target.value })} className="w-full p-2 border rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="font-bold">URL รูปภาพ</label>
                  <input type="text" required value={formProduct.image} onChange={(e) => setFormProduct({ ...formProduct, image: e.target.value })} className="w-full p-2 border rounded-xl font-mono text-[10px]" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 border rounded-xl">ยกเลิก</button>
                  <button type="submit" className="px-4 py-1.5 bg-[#6B4F3B] text-white font-bold rounded-xl">บันทึก</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}