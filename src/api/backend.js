const BASE = process.env.REACT_APP_API_URL || '';

// 🚪 1. ประตูเดียวสื่อสาร API กลาง (apiFetch)
export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({ error: 'เซิร์ฟเวอร์ไม่ได้ตอบกลับเป็น JSON' }));
  if (!res.ok) {
    const err = new Error(data.error?.message ?? data.error ?? `เซิร์ฟเวอร์ตอบกลับ ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

// คัดเฉพาะ ID เสื้อผ้าจริงจาก Unsplash (ตัดรูปรองเท้าและรูปคนออกทั้งหมด)
const verifiedImages = {
  tops: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80'
  ],
  pants: [
    'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&auto=format&fit=crop&q=80'
  ],
  dresses: [
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=600&auto=format&fit=crop&q=80'
  ]
};

const adjectives = ['ทรง Oversize', 'สไตล์เกาหลี', 'ผ้าคอตตอน 100%', 'งานป้ายพรีเมียม', 'ผ้านุ่มระบายอากาศ', 'รุ่นฮิต 2026', 'มินิมอลเบสิก'];
const colors = ['สีขาว', 'สีดำ', 'สีครีม', 'สียีนส์ฟอก', 'สีเขียวเซจ', 'สีน้ำเงินคลาสสิก', 'สีพาสเทล'];

// สร้างข้อมูลจำลองสินค้า 150 ชิ้น
export const staticProducts = [];
let currentId = 1;

// 1. เสื้อ 50 ตัว
for (let i = 1; i <= 50; i++) {
  const isTshirt = i === 1;
  const isHoodie = i === 4;
  const name = isTshirt ? 'เสื้อยืดคอกลมสีขาว' : isHoodie ? 'เสื้อฮู้ดสีดำ' : `เสื้อยืดคอกลม ${adjectives[i % adjectives.length]} ${colors[i % colors.length]} รุ่น T${i}`;
  const price = isTshirt ? 299 : isHoodie ? 690 : 199 + (i % 8) * 35;
  const img = verifiedImages.tops[(i - 1) % verifiedImages.tops.length];

  staticProducts.push({
    id: currentId++,
    name,
    title: name,
    category: 'เสื้อ',
    price,
    stock: 25 + (i % 25),
    sizes: ['S', 'M', 'L', 'XL'],
    rating: isTshirt ? 4.8 : isHoodie ? 4.7 : Number((4.1 + (i % 9) * 0.1).toFixed(1)),
    reviewsCount: 12 + (i % 50),
    description: `${name} ตัดเย็บจากเนื้อผ้าคุณภาพดี ให้ความรู้สึกนุ่มสบาย ระบายเหงื่อได้ดี ไม่ระคายเคืองผิว เหมาะกับการใส่ในชีวิตประจำวัน`,
    image: img,
    image_url: img
  });
}

// 2. กางเกง 50 ตัว
for (let i = 1; i <= 50; i++) {
  const isJeans = i === 1;
  const name = isJeans ? 'กางเกงยีนส์ขายาว' : `กางเกงขายาวทรงสวย ${adjectives[i % adjectives.length]} ${colors[i % colors.length]} รุ่น P${i}`;
  const price = isJeans ? 590 : 380 + (i % 6) * 50;
  const img = verifiedImages.pants[(i - 1) % verifiedImages.pants.length];

  staticProducts.push({
    id: currentId++,
    name,
    title: name,
    category: 'กางเกง',
    price,
    stock: 20 + (i % 20),
    sizes: ['28', '30', '32', '34'],
    rating: isJeans ? 4.5 : Number((4.2 + (i % 8) * 0.1).toFixed(1)),
    reviewsCount: 8 + (i % 40),
    description: `${name} ผ้ายีนส์และสแล็คเนื้อแน่น ทนทานต่อการซัก ทรงสวยเข้ารูป แมตช์กับเสื้อได้หลากหลายสไตล์`,
    image: img,
    image_url: img
  });
}

// 3. เดรส 50 ตัว (คัดเฉพาะรูปชุดเดรสล้วน)
for (let i = 1; i <= 50; i++) {
  const isDress = i === 1;
  const name = isDress ? 'เดรสลายดอกไม้' : `เดรสแฟชั่นเกาหลี ${adjectives[i % adjectives.length]} ${colors[i % colors.length]} รุ่น D${i}`;
  const price = isDress ? 450 : 290 + (i % 6) * 60;
  const img = verifiedImages.dresses[(i - 1) % verifiedImages.dresses.length];

  staticProducts.push({
    id: currentId++,
    name,
    title: name,
    category: 'เดรส',
    price,
    stock: 15 + (i % 15),
    sizes: ['S', 'M', 'Free Size'],
    rating: isDress ? 4.9 : Number((4.3 + (i % 7) * 0.1).toFixed(1)),
    reviewsCount: 15 + (i % 30),
    description: `${name} ผ้าชีฟองและคอตตอนเกรดดี พลิ้วสวย มีซับในทั้งตัว ใส่สบาย ให้ลุคสวยหวานสไตล์คาเฟ่`,
    image: img,
    image_url: img
  });
}

// 🛍️ API สำหรับดึงสินค้า
export async function getProducts() {
  try {
    const data = await apiFetch('/api/products');
    if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
      return data.items;
    }
  } catch (err) {}
  return staticProducts;
}

// แก้ไขจุดนี้: แปลง id เป็น Number เสมอ เพื่อให้ค้นหาเจอและไม่เกิด NaN
export async function getProduct(id) {
  try {
    const data = await apiFetch(`/api/products/${id}`);
    if (data && data.id) return data;
  } catch (err) {}
  
  const targetId = Number(id);
  const found = staticProducts.find((p) => Number(p.id) === targetId);
  return found || staticProducts[0];
}

export function login(email, password) {
  return apiFetch('/api/auth/login', { method: 'POST', body: { email, password } });
}

export function register(email, password, displayName) {
  return apiFetch('/api/auth/register', { method: 'POST', body: { email, password, displayName } });
}

export async function getSellerProducts(token) {
  try {
    const data = await apiFetch('/api/seller/products', { token });
    return data?.items || [];
  } catch (err) {
    return staticProducts;
  }
}

export function deleteProduct(id, token) {
  return apiFetch(`/api/seller/products/${id}`, { method: 'DELETE', token });
}

export async function getAdminMembers(token) {
  try {
    const data = await apiFetch('/api/admin/members', { token });
    return data?.items || [];
  } catch (err) {
    return [
      { id: 1, displayName: 'Admin User', email: 'admin@clothinghub.com', role: 'admin' },
      { id: 2, displayName: 'Somchai Shop', email: 'somchai@seller.com', role: 'seller' },
      { id: 3, displayName: 'Praewa Rueangsri', email: 'buyer@store.com', role: 'buyer' },
    ];
  }
}

export function setMemberRole(memberId, role, token) {
  return apiFetch(`/api/admin/members/${memberId}/role`, { method: 'PUT', body: { role }, token });
}