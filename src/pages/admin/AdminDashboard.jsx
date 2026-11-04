import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminMembers, setMemberRole } from '../../api/backend';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('approvals');
  const [members, setMembers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const token = localStorage.getItem('token');

  // คำขออนุมัติผู้ขายใหม่
  const [sellerApplications, setSellerApplications] = useState([
    { id: 101, shopName: 'Minimal Chic Shop', owner: 'คุณศิริพร', email: 'siriporn@shop.com', phone: '081-234-5678', date: '2026-11-03', status: 'รอการอนุมัติ' },
    { id: 102, shopName: 'Korean Streetwear', owner: 'คุณนนทวัฒน์', email: 'nont@shop.com', phone: '089-876-5432', date: '2026-11-04', status: 'รอการอนุมัติ' }
  ]);

  // คอมเมนต์สำหรับให้แอดมินลบ
  const [comments, setComments] = useState([
    { id: 1, productName: 'เสื้อยืดคอกลมสีขาว', user: 'คุณสุภาพร (Buyer)', comment: 'ข้อความไม่เหมาะสม สแปมลิงก์', date: '2026-11-02' },
    { id: 2, productName: 'กางเกงยีนส์ขายาว', user: 'คุณกิตติศักดิ์ (Buyer)', comment: 'ผ้าใส่สบายมากครับ จัดส่งรวดเร็ว', date: '2026-11-03' }
  ]);

  useEffect(() => {
    getAdminMembers(token).then((data) => setMembers(data || []));
    const savedDisputes = JSON.parse(localStorage.getItem('disputes') || '[]');
    setDisputes(savedDisputes);
  }, [token]);

  const handleApproveSeller = (appId) => {
    setSellerApplications(sellerApplications.filter((a) => a.id !== appId));
    alert('อนุมัติเปิดร้านค้าใหม่บนแพลตฟอร์มสำเร็จ!');
  };

  const handleResolveDispute = (disputeId) => {
    const updated = disputes.filter((d) => d.id !== disputeId);
    setDisputes(updated);
    localStorage.setItem('disputes', JSON.stringify(updated));
    alert('แอดมินทำการเคลียร์เรื่องร้องเรียนสำเร็จ!');
  };

  const handleDeleteComment = (commentId) => {
    if (!window.confirm('แอดมินยืนยันการลบคอมเมนต์ที่ไม่เหมาะสมนี้จากระบบ?')) return;
    setComments(comments.filter((c) => c.id !== commentId));
    alert('ลบคอมเมนต์สำเร็จ');
  };

  const handleRoleChange = async (memberId, newRole) => {
    await setMemberRole(memberId, newRole, token);
    setMembers(members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
    alert('ปรับปรุงสิทธิ์สมาชิกเรียบร้อย');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar ด้านซ้าย */}
      <aside className="w-64 bg-[#063b36] text-white flex flex-col p-4 shrink-0 shadow-md">
        <div className="flex items-center gap-2 font-bold text-xl px-2 py-4 mb-4 text-emerald-400">
          <span>🛡️</span> Admin<span className="text-white">Backoffice</span>
        </div>

        <nav className="space-y-1.5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition text-left ${activeTab === 'approvals' ? 'bg-[#0e5c54] text-white font-bold' : 'text-emerald-100 hover:bg-[#0e5c54]/50'}`}
          >
            <span>🏪</span> อนุมัติผู้ขายใหม่ ({sellerApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition text-left ${activeTab === 'disputes' ? 'bg-[#0e5c54] text-white font-bold' : 'text-emerald-100 hover:bg-[#0e5c54]/50'}`}
          >
            <span>🚩</span> คำร้องเรียนจากผู้ซื้อ ({disputes.length})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition text-left ${activeTab === 'comments' ? 'bg-[#0e5c54] text-white font-bold' : 'text-emerald-100 hover:bg-[#0e5c54]/50'}`}
          >
            <span>💬</span> จัดการคอมเมนต์รีวิว ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition text-left ${activeTab === 'members' ? 'bg-[#0e5c54] text-white font-bold' : 'text-emerald-100 hover:bg-[#0e5c54]/50'}`}
          >
            <span>👥</span> จัดการสมาชิก & สิทธิ์ ({members.length})
          </button>
        </nav>

        {/* ปุ่มย้อนกลับไปหน้าหลักร้านค้าที่มุมซ้ายล่าง */}
        <div className="mt-auto pt-4 border-t border-[#0e5c54] text-xs">
          <p className="text-emerald-200 font-bold">Admin Manager</p>
          <Link
            to="/"
            className="w-full mt-3 flex items-center justify-center gap-2 bg-[#0e5c54] hover:bg-[#084841] text-emerald-100 hover:text-white py-2.5 rounded-xl font-bold transition border border-emerald-600 shadow-sm"
          >
            ← ย้อนกลับไปหน้าหลักร้าน
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-x-hidden">
        {activeTab === 'approvals' && (
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">อนุมัติคำขอเปิดร้านค้าใหม่</h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b5e55] text-white font-medium">
                  <tr>
                    <th className="p-3.5">ชื่อร้านค้า</th>
                    <th className="p-3.5">เจ้าของร้าน</th>
                    <th className="p-3.5">อีเมลติดต่อ</th>
                    <th className="p-3.5">วันที่ยื่นเรื่อง</th>
                    <th className="p-3.5 text-center">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellerApplications.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-400">ไม่มีคำขอเปิดร้านค้าใหม่ในขณะนี้</td></tr>
                  ) : (
                    sellerApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-800">{app.shopName}</td>
                        <td className="p-3.5 font-medium">{app.owner}</td>
                        <td className="p-3.5 text-slate-500">{app.email}</td>
                        <td className="p-3.5">{app.date}</td>
                        <td className="p-3.5 text-center">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedSeller(app);
                                setShowContactModal(true);
                              }}
                              className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg font-bold"
                            >
                              📞 ติดต่อผู้ขาย
                            </button>
                            <button
                              onClick={() => handleApproveSeller(app.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold"
                            >
                              อนุมัติเปิดร้าน
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'disputes' && (
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">รายการคำร้องเรียนจากผู้ซื้อ</h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b5e55] text-white">
                  <tr>
                    <th className="p-3.5">ผู้ร้องเรียน</th>
                    <th className="p-3.5">สินค้าที่อ้างถึง</th>
                    <th className="p-3.5">เหตุผลการร้องเรียน</th>
                    <th className="p-3.5 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {disputes.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-slate-400">ไม่มีคำร้องเรียนในขณะนี้</td></tr>
                  ) : (
                    disputes.map((d) => (
                      <tr key={d.id}>
                        <td className="p-3.5 font-bold text-slate-800">{d.buyerName}</td>
                        <td className="p-3.5 font-medium text-emerald-800">{d.productName}</td>
                        <td className="p-3.5 text-slate-600">{d.reason}</td>
                        <td className="p-3.5 text-center">
                          <button onClick={() => handleResolveDispute(d.id)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold">
                            เคลียร์เรื่องเรียบร้อย
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">จัดการลบคอมเมนต์รีวิวที่ไม่เหมาะสม</h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b5e55] text-white">
                  <tr>
                    <th className="p-3.5">ชื่อสินค้า</th>
                    <th className="p-3.5">ผู้เขียนรีวิว</th>
                    <th className="p-3.5">ข้อความคอมเมนต์</th>
                    <th className="p-3.5">วันที่</th>
                    <th className="p-3.5 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comments.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3.5 font-bold text-slate-800">{c.productName}</td>
                      <td className="p-3.5 text-slate-600">{c.user}</td>
                      <td className="p-3.5 text-slate-700">{c.comment}</td>
                      <td className="p-3.5 text-slate-400">{c.date}</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded-lg font-bold"
                        >
                          🗑️ ลบคอมเมนต์นี้
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">จัดการสิทธิ์สมาชิกในระบบ</h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b5e55] text-white">
                  <tr>
                    <th className="p-3.5">ชื่อผู้ใช้</th>
                    <th className="p-3.5">อีเมล</th>
                    <th className="p-3.5">สิทธิ์ปัจจุบัน</th>
                    <th className="p-3.5">สลับสิทธิ์</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((m) => (
                    <tr key={m.id}>
                      <td className="p-3.5 font-bold">{m.displayName}</td>
                      <td className="p-3.5 text-slate-500">{m.email}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100">
                          {m.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <select value={m.role} onChange={(e) => handleRoleChange(m.id, e.target.value)} className="border p-1 rounded text-xs">
                          <option value="buyer">buyer</option>
                          <option value="seller">seller</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal สำหรับแอดมินติดต่อผู้ขาย */}
        {showContactModal && selectedSeller && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
              <h3 className="text-base font-bold text-slate-800 mb-3">📞 ช่องทางติดต่อร้านค้าผู้ขาย</h3>
              <div className="space-y-2 text-xs text-slate-600">
                <p><strong className="text-slate-800">ชื่อร้านค้า:</strong> {selectedSeller.shopName}</p>
                <p><strong className="text-slate-800">เจ้าของร้าน:</strong> {selectedSeller.owner}</p>
                <p><strong className="text-slate-800">อีเมล:</strong> {selectedSeller.email}</p>
                <p><strong className="text-slate-800">เบอร์โทรศัพท์:</strong> {selectedSeller.phone || '081-234-5678'}</p>
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="bg-[#0b5e55] text-white text-xs px-4 py-2 rounded-xl font-bold"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}