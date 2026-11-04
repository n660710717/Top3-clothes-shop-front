import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getSellerProducts, deleteProduct } from '../../api/backend';
import { Loading, ErrorBox, ConfirmBox} from '../../components/AdminStates';

export default function SellerProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setStatus('loading');
      try {
        const list = await getSellerProducts(token);
        if (!ignore) { setProducts(list); setStatus('success'); }
      } catch (err) {
        if (!ignore) { setError(err); setStatus('error'); }
      }
    }
    load();
    return () => { ignore = true; };
  }, [token]);

  async function handleDelete() {
    setBusy(true);
    try {
      await deleteProduct(target.id, token);
      setProducts(products.filter((p) => p.id !== target.id));
      setTarget(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (status === 'loading') return <Loading />;
  if (status === 'error') return <ErrorBox error={error} />;

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900 mb-4">รายการเสื้อผ้าในร้าน</h1>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3">สินค้า</th>
              <th className="px-4 py-3">ราคา</th>
              <th className="px-4 py-3 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-emerald-600 font-bold">฿{p.price}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setTarget(p)} className="text-xs text-red-500 hover:underline">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmBox open={Boolean(target)} busy={busy} title={`ลบ ${target?.title} ?`} onConfirm={handleDelete} onCancel={() => setTarget(null)}>
        <p>การลบสินค้าจะทำให้ไม่สามารถกู้คืนได้ ยืนยันที่จะลบหรือไม่?</p>
      </ConfirmBox>
    </div>
  );
}