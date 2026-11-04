export function Loading({ text = 'กำลังโหลดข้อมูล...' }) {
  return <p className="py-12 text-center text-slate-400">{text}</p>;
}

export function ErrorBox({ error, onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-medium text-red-700">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
      <p className="mt-1 text-sm text-red-500">{error?.message || 'โปรดลองใหม่อีกครั้ง'}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm text-red-700 hover:bg-red-100">
          ลองใหม่
        </button>
      )}
    </div>
  );
}

export function ConfirmBox({ open, title, children, confirmText = 'ยืนยัน', busy, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <div className="mt-2 text-sm text-slate-600">{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} disabled={busy} className="rounded-lg border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            ยกเลิก
          </button>
          <button onClick={onConfirm} disabled={busy} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">
            {busy ? 'กำลังดำเนินการ...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export const btnPrimary = 'rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-slate-300';
export const btnDanger = 'rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:bg-slate-300';
export const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none';