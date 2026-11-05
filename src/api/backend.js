const BASE = process.env.REACT_APP_API_URL || '';

// ประตูเดียวสำหรับเรียก API ของหลังบ้าน
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

export async function getProducts() {
  const data = await apiFetch('/api/products');
  return data?.items || [];
}

export async function getProduct(id) {
  return apiFetch(`/api/products/${id}`);
}

export function login(email, password) {
  return apiFetch('/api/auth/login', { method: 'POST', body: { email, password } });
}

export function register(email, password, displayName, role) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: { email, password, displayName, role },
  });
}

export function changePassword(oldPassword, newPassword, token) {
  return apiFetch('/api/me/password', {
    method: 'PUT',
    token,
    body: { oldPassword, newPassword },
  });
}

export async function getSellerProducts(token) {
  const data = await apiFetch('/api/seller/products', { token });
  return data?.items || [];
}

export function deleteProduct(id, token) {
  return apiFetch(`/api/seller/products/${id}`, { method: 'DELETE', token });
}

export async function getAdminMembers(token) {
  const data = await apiFetch('/api/admin/members', { token });
  return data?.items || [];
}

export function setMemberRole(memberId, role, token) {
  return apiFetch(`/api/admin/members/${memberId}/role`, { method: 'PUT', body: { role }, token });
}
