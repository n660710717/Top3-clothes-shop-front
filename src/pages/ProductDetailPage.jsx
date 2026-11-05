import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct, getReviews, createReview, deleteReview, addCart, getMessages, sendMessage, createDispute } from '../api/backend';
import Navbar from '../components/Navbar';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  
  // ระบบรีวิวและดาวสำหรับผู้ซื้อ
  const [userRating, setUserRating] = useState(5);
  const [userReview, setUserReview] = useState('');
  const [reviewsList, setReviewsList] = useState([]);

  // ระบบแชทติดต่อผู้ขายแบบเรียลไทม์ (Live Chat Box)
  const [showChatModal, setShowChatModal] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'seller', text: 'สวัสดีครับ Somchai Seller Shop ยินดีให้บริการ สอบถามข้อมูลเสื้อผ้าเพิ่มเติมได้เลยครับ 😊', time: '10:00 น.' }
  ]);

  // ระบบร้องเรียน (Dispute)
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    setLoading(true);
    getProduct(id).then((data) => {
      setProduct(data);
      if (data?.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
      setLoading(false);
    }).catch(() => {
      setProduct(null);
      setLoading(false);
    });
    getReviews(id).then(setReviewsList).catch(() => setReviewsList([]));
    const saved = JSON.parse(localStorage.getItem('user') || 'null');
    if (saved?.role === 'buyer') {
      getMessages(id).then((items) => {
        setChatMessages([
          { id: 'welcome', sender: 'seller', text: 'สวัสดีค่ะ ยินดีให้บริการ สอบถามข้อมูลเสื้อผ้าเพิ่มเติมได้เลยค่ะ', time: '' },
          ...items,
        ]);
      }).catch(() => {});
    }
  }, [id]);

  const reloadMessages = async () => {
    const items = await getMessages(id);
    setChatMessages([
      { id: 'welcome', sender: 'seller', text: 'สวัสดีค่ะ ยินดีให้บริการ สอบถามข้อมูลเสื้อผ้าเพิ่มเติมได้เลยค่ะ', time: '' },
      ...items,
    ]);
  };

  const handleSendMessage = async (textToSend) => {
    const msg = textToSend || inputMessage;
    if (!msg.trim()) return;
    if (!currentUser || currentUser.role !== 'buyer') {
      alert('กรุณาเข้าสู่ระบบด้วยบัญชีผู้ซื้อก่อนทักร้าน');
      return;
    }
    try {
      await sendMessage(id, msg.trim());
      setInputMessage('');
      await reloadMessages();
    } catch (err) {
      alert(err.message || 'ส่งข้อความไม่สำเร็จ');
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!currentUser) {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า');
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'buyer') {
      alert('บัญชีสิทธิ์ผู้ขายและแอดมินไม่สามารถเพิ่มสินค้าลงตะกร้าได้');
      return;
    }
    if (!selectedSize) {
      alert('กรุณาเลือกไซซ์');
      return;
    }
    try {
      await addCart(product.id, selectedSize, 1);
      window.dispatchEvent(new Event('cartUpdated'));
      alert('เพิ่มสินค้าลงตะกร้าเรียบร้อย!');
    } catch (err) {
      alert(err.message || 'เพิ่มลงตะกร้าไม่สำเร็จ');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('กรุณาเข้าสู่ระบบก่อนส่งความคิดเห็น');
      return;
    }
    if (currentUser.role !== 'buyer') {
      alert('สิทธิ์ผู้ขายและแอดมินไม่สามารถส่งรีวิวสินค้าได้');
      return;
    }
    if (!userReview.trim()) return;
    try {
      await createReview(id, userRating, userReview.trim());
      setUserReview('');
      setReviewsList(await getReviews(id));
      alert('ขอบคุณสำหรับคะแนนและรีวิวสินค้า!');
    } catch (err) {
      alert(err.message || 'ส่งรีวิวไม่สำเร็จ');
    }
  };

  const handleDeleteReviewByAdmin = async (reviewId) => {
    if (!window.confirm('แอดมินยืนยันการลบคอมเมนต์นี้เนื่องจากไม่เหมาะสม?')) return;
    try {
      await deleteReview(reviewId);
      setReviewsList(await getReviews(id));
      alert('แอดมินทำการลบคอมเมนต์เรียบร้อยแล้ว');
    } catch (err) {
      alert(err.message || 'ลบรีวิวไม่สำเร็จ');
    }
  };

  const handleSendDispute = async (e) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;
    if (!currentUser || currentUser.role !== 'buyer') {
      alert('กรุณาเข้าสู่ระบบด้วยบัญชีผู้ซื้อก่อนร้องเรียน');
      return;
    }
    try {
      await createDispute(id, disputeReason.trim());
      setShowDisputeModal(false);
      setDisputeReason('');
      alert('ส่งเรื่องร้องเรียนสินค้าไปยังผู้ดูแลระบบเรียบร้อยแล้ว!');
    } catch (err) {
      alert(err.message || 'ส่งคำร้องไม่สำเร็จ');
    }
  };

  if (loading) return <div className="text-center py-24 text-[#8C6D58] font-medium">กำลังโหลดข้อมูลเสื้อผ้า...</div>;
  if (!product) return <div className="text-center py-24 text-[#8C6D58]">ไม่พบรายการสินค้าที่ค้นหา</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#4A3B32]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* ลิงก์ย้อนกลับแยกตามบทบาท */}
        {currentUser?.role === 'seller' ? (
          <div className="flex justify-between items-center mb-5">
            <Link to="/seller" className="text-xs font-bold text-[#8C6D58] hover:underline inline-flex items-center gap-1 bg-[#F5EBE1] px-3.5 py-2 rounded-xl border border-[#DCC5AF] shadow-sm">
              ← ย้อนกลับไปหน้าจัดการสินค้า (Seller Centre)
            </Link>
            <button
              onClick={() => navigate('/seller')}
              className="bg-[#8C6D58] text-white text-xs px-4 py-2 rounded-xl font-bold hover:bg-[#6B4F3B] shadow-sm transition"
            >
              ✏️ ไปแก้ไขสินค้านี้ในระบบหลังบ้าน
            </button>
          </div>
        ) : (
          <Link to="/" className="text-xs text-[#8C6D58] font-bold hover:underline mb-5 inline-block">
            ← ย้อนกลับไปหน้าร้านค้าหลัก
          </Link>
        )}

        {/* รายละเอียดสินค้า */}
        <div className="bg-white rounded-3xl border border-[#EBD9C8] p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
          <div className="aspect-square bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#EBD9C8]">
            <img src={product.image_url || product.image} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs bg-[#F5EBE1] text-[#6B4F3B] px-3 py-1 rounded-full font-bold">
                {product.category}
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-[#38281F] mt-3">
                {product.name || product.title}
              </h1>

              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-extrabold text-[#8C6D58]">
                  ฿{Number(product.price).toLocaleString()}
                </span>
                <span className="text-xs text-[#A68F7E]">สต็อก: {product.stock || 20} ชิ้น</span>
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-sm text-amber-500">
                <span>{reviewsList.length > 0 ? `★ ${(reviewsList.reduce((sum, rev) => sum + Number(rev.rating), 0) / reviewsList.length).toFixed(1)}` : 'ยังไม่มีรีวิว'}</span>
                <span className="text-xs text-[#A68F7E]">({reviewsList.length} รีวิวจากผู้ซื้อ)</span>
              </div>

              {/* ปุ่มแชทติดต่อผู้ขาย (ซ่อนจากฝั่งผู้ขาย) */}
              {currentUser?.role !== 'seller' && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowChatModal(true)}
                    className="inline-flex items-center gap-2 bg-[#F5EBE1] hover:bg-[#EBD9C8] text-[#6B4F3B] border border-[#DFC8B2] px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <span>💬</span> แชทพูดคุยกับร้านค้าผู้ขาย (Somchai Seller Shop)
                  </button>
                </div>
              )}

              {/* เลือกไซส์ */}
              <div className="mt-5">
                <label className="text-xs font-semibold text-[#533C2C]">เลือกขนาดไซส์:</label>
                <div className="flex gap-2 mt-2">
                  {(product.sizes || ['S', 'M', 'L']).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                        selectedSize === s
                          ? 'border-[#8C6D58] bg-[#F5EBE1] text-[#6B4F3B]'
                          : 'border-[#DCC5AF] text-[#6A5243] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ปุ่มการทำงานตามระดับสิทธิ์ */}
            {currentUser?.role === 'seller' ? (
              <div className="mt-6 p-4 rounded-2xl bg-[#F5EBE1] border border-[#EBD9C8] text-xs text-[#6B4F3B]">
                <p className="font-bold flex items-center gap-1.5 text-sm">
                  <span>🏪</span> คุณกำลังดูสินค้าในฐานะเจ้าของร้าน (Somchai Seller Shop)
                </p>
                <p className="mt-1 text-[11px] text-[#8C6D58]">
                  คุณสามารถรับชมรีวิวและคะแนนดาวของลูกค้าได้ด้านล่าง หากต้องการปรับปรุงราคาหรือสต็อกสินค้า สามารถคลิกปุ่ม "ย้อนกลับไปหน้าจัดการสินค้า" ด้านบนได้ทันที
                </p>
              </div>
            ) : currentUser?.role === 'admin' ? (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                🛡️ คุณอยู่ในโหมดผู้ดูแลระบบ (Admin Mode) - สามารถตรวจสอบรายการและลบคอมเมนต์ที่ไม่เหมาะสมได้ที่ด้านล่าง
              </div>
            ) : (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#6B4F3B] hover:bg-[#533C2C] text-white font-bold py-3 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2"
                >
                  <span>🛒</span> เพิ่มลงตะกร้าสินค้า
                </button>
                <button
                  onClick={() => setShowDisputeModal(true)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-3 rounded-xl text-xs font-bold"
                  title="แจ้งเรื่องร้องเรียนไปยังแอดมิน"
                >
                  🚩 ร้องเรียนสินค้า
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ส่วนให้คะแนนดาวและรีวิว (สำหรับผู้ซื้อ) & รายการคอมเมนต์ */}
        <div className="mt-8 bg-white rounded-3xl border border-[#EBD9C8] p-6 md:p-8 shadow-sm">
          <h2 className="text-base font-bold text-[#38281F] mb-4">ความคิดเห็นและคะแนนรีวิวจากผู้ซื้อ</h2>

          {/* ฟอร์มให้คะแนนและพิมพ์คอมเมนต์ของผู้ซื้อ */}
          {(!currentUser || currentUser.role === 'buyer') && (
            <form onSubmit={handleReviewSubmit} className="mb-6 bg-[#FAF7F2] p-5 rounded-2xl border border-[#EBD9C8]">
              <h3 className="text-xs font-bold text-[#38281F] mb-2">เขียนรีวิวและให้คะแนนสินค้านี้</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-[#6A5243]">เลือกคะแนนดาว:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`text-xl transition ${star <= userRating ? 'text-amber-500 scale-110' : 'text-[#DCC5AF]'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-600 ml-2">{userRating} / 5 ดาว</span>
              </div>
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="พิมพ์รีวิวของคุณเกี่ยวกับเนื้อผ้า ขนาดไซส์ การจัดส่ง..."
                rows="3"
                required
                className="w-full text-xs p-3 rounded-xl border border-[#DCC5AF] focus:outline-none focus:ring-1 focus:ring-[#8C6D58] bg-white"
              />
              <div className="mt-3 flex justify-end">
                <button type="submit" className="bg-[#6B4F3B] hover:bg-[#533C2C] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm">
                  ส่งรีวิวและคะแนน
                </button>
              </div>
            </form>
          )}

          {/* รายการแสดงความคิดเห็น */}
          <div className="space-y-4">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="border-b border-[#F5EBE1] pb-3.5 text-xs flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#38281F]">{rev.user}</span>
                    <span className="text-[10px] text-[#A68F7E]">{rev.date}</span>
                  </div>
                  <div className="text-amber-500 my-1 font-bold">{'★'.repeat(rev.rating)}</div>
                  <p className="text-[#6A5243] leading-relaxed">{rev.comment}</p>
                </div>

                {/* สิทธิ์ลบคอมเมนต์เฉพาะผู้ดูแลระบบ (Admin) */}
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => handleDeleteReviewByAdmin(rev.id)}
                    className="text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-rose-200"
                  >
                    🗑️ ลบคอมเมนต์นี้ (Admin)
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ระบบแชทพูดคุยกับผู้ขาย (Live Chat Modal) */}
        {showChatModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#EBD9C8] flex flex-col h-[520px]">
              {/* Header แชท */}
              <div className="bg-[#533C2C] text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#8C6D58] flex items-center justify-center text-base font-bold text-white border border-white/20">
                    🏪
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Somchai Seller Shop</h3>
                    <span className="text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span> ร้านค้ากำลังออนไลน์
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* ข้อความแชท */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF7F2] text-xs">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-[#8C6D58] text-white rounded-br-none'
                          : 'bg-white text-[#38281F] border border-[#EBD9C8] shadow-sm rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-[#A68F7E] mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* ปุ่มคำถามด่วน */}
              <div className="p-2 bg-white border-t border-[#F5EBE1] flex gap-1.5 overflow-x-auto text-[11px]">
                {['มีสินค้าพร้อมส่งไหมครับ?', 'ขอสอบถามขนาดไซส์เพิ่มเติม', 'จัดส่งใช้เวลากี่วันครับ?'].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="bg-[#F5EBE1] hover:bg-[#EBD9C8] text-[#6B4F3B] px-3 py-1 rounded-full whitespace-nowrap transition"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* ฟอร์มพิมพ์ส่งแชท */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-[#EBD9C8] flex gap-2"
              >
                <input
                  type="text"
                  placeholder="พิมพ์ข้อความสอบถามผู้ขาย..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 border border-[#DCC5AF] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#8C6D58]"
                />
                <button
                  type="submit"
                  className="bg-[#6B4F3B] hover:bg-[#533C2C] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  ส่ง
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal ร้องเรียนสินค้า */}
        {showDisputeModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-[#EBD9C8]">
              <h3 className="text-base font-bold text-[#38281F] mb-3">🚩 ส่งเรื่องร้องเรียนสินค้าถึงผู้ดูแลระบบ</h3>
              <form onSubmit={handleSendDispute} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-[#533C2C]">เหตุผลการร้องเรียน:</label>
                  <textarea
                    required
                    rows="3"
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="ระบุข้อผิดพลาด เช่น สินค้าไม่ตรงปก, ร้านค้าส่งของช้าเกินกำหนด..."
                    className="mt-1.5 w-full p-2.5 border border-[#DCC5AF] rounded-xl focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowDisputeModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#DCC5AF] text-[#6B4F3B]"
                  >
                    ยกเลิก
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold">
                    ส่งเรื่องร้องเรียน
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}