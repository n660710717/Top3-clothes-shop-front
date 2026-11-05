import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminMembers, getDisputes, resolveDispute, getAdminReviews, deleteReview, getSellerApplications, approveSellerApplication } from '../../api/backend';
import { useNotice } from '../../components/Notice';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('members');
  const [members, setMembers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [comments, setComments] = useState([]);
  const [sellerApplications, setSellerApplications] = useState([]);
  const { notify, confirm } = useNotice();
  //const [showContactModal, setShowContactModal] = useState(false);
  //const [selectedSeller, setSelectedSeller] = useState(null);

  // โหลดรายการสมาชิกทั้งหมดที่สมัครเข้ามาในระบบ
  useEffect(() => {
    const token = localStorage.getItem('token');
    getAdminMembers(token).then(setMembers).catch(() => setMembers([]));
    getDisputes().then(setDisputes).catch(() => setDisputes([]));
    getAdminReviews().then(setComments).catch(() => setComments([]));
    getSellerApplications().then(setSellerApplications).catch(() => setSellerApplications([]));
  }, []);

  const handleApproveSeller = async (appId) => {
    try {
      await approveSellerApplication(appId);
      setSellerApplications(await getSellerApplications());
      notify('อนุมัติเปิดร้านค้าใหม่บนแพลตฟอร์มสำเร็จ!');
    } catch (err) {
      notify(err.message || 'อนุมัติร้านไม่สำเร็จ');
    }
  };

  const handleResolveDispute = async (disputeId) => {
    try {
      await resolveDispute(disputeId);
      setDisputes(await getDisputes());
      notify('แอดมินทำการเคลียร์เรื่องร้องเรียนสำเร็จ!');
    } catch (err) {
      notify(err.message || 'ปิดคำร้องไม่สำเร็จ');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!(await confirm('แอดมินยืนยันการลบคอมเมนต์ที่ไม่เหมาะสมนี้จากระบบ?'))) return;
    try {
      await deleteReview(commentId);
      setComments(await getAdminReviews());
      notify('ลบคอมเมนต์สำเร็จ');
    } catch (err) {
      notify(err.message || 'ลบคอมเมนต์ไม่สำเร็จ');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar ด้านซ้าย */}
      <aside className="w-64 bg-[#063b36] text-white flex flex-col p-4 shrink-0 shadow-md sticky top-0 h-screen">
        <div className="flex items-center gap-2 font-bold text-xl px-2 py-4 mb-4 text-emerald-400">
          <span>🛡️</span> Admin<span className="text-white">Backoffice</span>
        </div>

        <nav className="space-y-1.5 text-xs font-medium flex-1">
          <button
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition text-left ${activeTab === 'members' ? 'bg-[#0e5c54] text-white font-bold' : 'text-emerald-100 hover:bg-[#0e5c54]/50'}`}
          >
            <span>👥</span> รายชื่อสมาชิกในระบบ ({members.length})
          </button>
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
        </nav>

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
        {/* แท็บสมาชิก (ดูรายชื่อและอีเมลอย่างเดียว ไม่มีการสลับสิทธิ์) */}
        {activeTab === 'members' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">รายชื่อสมาชิกและอีเมลผู้ใช้งานในระบบ</h2>
                <p className="text-xs text-slate-500">แสดงข้อมูลอีเมลและประเภทบัญชีของผู้ใช้ทั้งหมดที่ลงทะเบียนเข้ามา</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                รวมทั้งหมด {members.length} บัญชี
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b5e55] text-white font-medium">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">ชื่อผู้ใช้งาน / ร้านค้า</th>
                    <th className="p-3.5">อีเมล (Email)</th>
                    <th className="p-3.5">ประเภทบัญชีผู้ใช้</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3.5 text-slate-400 font-mono">#{m.id}</td>
                      <td className="p-3.5 font-bold text-slate-800">{m.displayName}</td>
                      <td className="p-3.5 font-medium text-slate-600">{m.email}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          m.role === 'admin'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : m.role === 'seller'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {m.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* แท็บคำขออนุมัติผู้ขาย */}
        {activeTab === 'approvals' && (
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">อนุมัติคำขอเปิดร้านค้าใหม่</h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b5e55] text-white">
                  <tr>
                    <th className="p-3.5">ชื่อร้านค้า</th>
                    <th className="p-3.5">เจ้าของร้าน</th>
                    <th className="p-3.5">อีเมลติดต่อ</th>
                    <th className="p-3.5">วันที่ยื่นเรื่อง</th>
                    <th className="p-3.5 text-center">ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellerApplications.length === 0 && (
                    <tr>
                      <td className="p-4 text-slate-500" colSpan="5">ยังไม่มีคำขอเปิดร้าน</td>
                    </tr>
                  )}
                  {sellerApplications.map((app) => (
                    <tr key={app.id}>
                      <td className="p-3.5 font-bold">{app.shopName}</td>
                      <td className="p-3.5">{app.owner}</td>
                      <td className="p-3.5 text-slate-500">{app.email}</td>
                      <td className="p-3.5">{app.date}</td>
                      <td className="p-3.5 text-center">
                        <button onClick={() => handleApproveSeller(app.id)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold">
                          อนุมัติเปิดร้าน
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* แท็บข้อพิพาท/คำร้องเรียน */}
        {activeTab === 'disputes' && (
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">รายการคำร้องเรียนจากผู้ซื้อ</h2>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b5e55] text-white">
                  <tr>
                    <th className="p-3.5">ผู้ร้องเรียน</th>
                    <th className="p-3.5">สินค้าที่อ้างถึง</th>
                    <th className="p-3.5">เหตุผล</th>
                    <th className="p-3.5 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {disputes.map((d) => (
                    <tr key={d.id}>
                      <td className="p-3.5 font-bold">{d.buyerName}</td>
                      <td className="p-3.5 text-emerald-800 font-medium">{d.productName}</td>
                      <td className="p-3.5">{d.reason}</td>
                      <td className="p-3.5 text-center">
                        <button onClick={() => handleResolveDispute(d.id)} className="bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold">
                          เคลียร์เรื่องเรียบร้อย
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* แท็บลบคอมเมนต์รีวิว */}
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
                    <th className="p-3.5 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comments.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3.5 font-bold">{c.productName}</td>
                      <td className="p-3.5">{c.user}</td>
                      <td className="p-3.5">{c.comment}</td>
                      <td className="p-3.5 text-center">
                        <button onClick={() => handleDeleteComment(c.id)} className="bg-rose-600 text-white px-3 py-1 rounded-lg font-bold">
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
      </main>
    </div>
  );
}