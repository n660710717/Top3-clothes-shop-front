import { createContext, useContext, useState } from 'react';

const NoticeContext = createContext(null);

function toneOf(message) {
  const text = String(message);
  if (/ไม่สำเร็จ|ไม่ได้|กรุณา|ข้อผิดพลาด|ก่อน/.test(text)) return 'error';
  return 'success';
}

const look = {
  success: { ring: 'bg-[#F5EBE1] text-[#6B4F3B]', mark: '✓', title: 'เรียบร้อย' },
  error: { ring: 'bg-rose-50 text-rose-700', mark: '!', title: 'ยังทำไม่ได้' },
  ask: { ring: 'bg-[#F5EBE1] text-[#6B4F3B]', mark: '?', title: 'ยืนยัน' },
};

function Frame({ tone, title, message, children }) {
  const style = look[tone];
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2C1D15]/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-3xl border border-[#EBD9C8] bg-[#FDFBF7] p-6 text-center shadow-xl">
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${style.ring}`}>
          {style.mark}
        </div>
        <h2 className="mt-3 text-base font-bold text-[#38281F]">{title || style.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#533C2C]">{message}</p>
        <div className="mt-5 flex gap-2">{children}</div>
      </div>
    </div>
  );
}

export function NoticeProvider({ children }) {
  const [notice, setNotice] = useState(null);
  const [ask, setAsk] = useState(null);

  const notify = (message, tone) => {
    setNotice({ message: String(message), tone: tone || toneOf(message) });
  };

  const confirm = (message) => new Promise((resolve) => {
    setAsk({ message: String(message), resolve });
  });

  const closeAsk = (accepted) => {
    ask.resolve(accepted);
    setAsk(null);
  };

  return (
    <NoticeContext.Provider value={{ notify, confirm }}>
      {children}
      {notice && (
        <Frame tone={notice.tone} message={notice.message}>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="w-full rounded-xl bg-[#6B4F3B] py-2.5 text-xs font-bold text-white hover:bg-[#533C2C]"
          >
            ตกลง
          </button>
        </Frame>
      )}
      {ask && (
        <Frame tone="ask" message={ask.message}>
          <button
            type="button"
            onClick={() => closeAsk(false)}
            className="w-1/2 rounded-xl border border-[#EBD9C8] bg-white py-2.5 text-xs font-bold text-[#6B4F3B]"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={() => closeAsk(true)}
            className="w-1/2 rounded-xl bg-[#6B4F3B] py-2.5 text-xs font-bold text-white hover:bg-[#533C2C]"
          >
            ยืนยัน
          </button>
        </Frame>
      )}
    </NoticeContext.Provider>
  );
}

export function useNotice() {
  const ctx = useContext(NoticeContext);
  if (!ctx) {
    throw new Error('useNotice ต้องอยู่ภายใต้ NoticeProvider');
  }
  return ctx;
}
