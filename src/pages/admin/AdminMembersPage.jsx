import { useState, useEffect } from 'react';
import { getAdminMembers, setMemberRole } from '../../api/backend';
import { Link } from 'react-router-dom';

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    getAdminMembers(token).then((data) => setMembers(data || []));
  }, [token]);

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await setMemberRole(memberId, newRole, token);
      setMembers(members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
      alert('เปลี่ยนสิทธิ์สำเร็จ!');
    } catch (e) {
      alert('เกิดข้อผิดพลาดในการเปลี่ยนสิทธิ์');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">🛡️ จัดการสมาชิกและสิทธิ์ (Admin Backoffice)</h1>
          <Link to="/admin/dashboard" className="text-xs text-emerald-600 hover:underline">← กลับ Dashboard</Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b5e55] text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">ชื่อ</th>
                <th className="p-3">อีเมล</th>
                <th className="p-3">สิทธิ์ปัจจุบัน</th>
                <th className="p-3">เปลี่ยนสิทธิ์</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="p-3">{m.id}</td>
                  <td className="p-3 font-semibold">{m.displayName}</td>
                  <td className="p-3 text-slate-500">{m.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.role === 'admin' ? 'bg-rose-100 text-rose-700' : m.role === 'seller' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={m.role}
                      onChange={(e) => handleRoleChange(m.id, e.target.value)}
                      className="border border-slate-200 rounded p-1 text-xs"
                    >
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
    </div>
  );
}