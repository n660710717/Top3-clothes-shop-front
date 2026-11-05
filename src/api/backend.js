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

export function applyForShop(shopName) {
  return apiFetch('/api/me/seller-application', {
    method: 'POST',
    token: tokenOf(),
    body: { shopName },
  });
}

export async function getSellerApplications() {
  const data = await apiFetch('/api/admin/seller-applications', { token: tokenOf() });
  return data?.items || [];
}

export function approveSellerApplication(id) {
  return apiFetch(`/api/admin/seller-applications/${id}/approve`, {
    method: 'POST',
    token: tokenOf(),
  });
}

export function setMemberRole(memberId, role, token) {
  return apiFetch(`/api/admin/members/${memberId}/role`, { method: 'PUT', body: { role }, token });
}

function tokenOf() {
  return localStorage.getItem('token');
}

let wishSet = null;
let wishFlight = null;

export function clearPersonalCache() {
  wishSet = null;
  wishFlight = null;
}

async function loadWishSet() {
  if (wishSet) return wishSet;
  if (!wishFlight) {
    wishFlight = apiFetch('/api/me/wishlist', { token: tokenOf() })
      .then((data) => {
        wishSet = new Set((data?.items || []).map((item) => item.id));
        return wishSet;
      })
      .finally(() => {
        wishFlight = null;
      });
  }
  return wishFlight;
}

export async function wished(productId) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user || user.role !== 'buyer') return false;
  const set = await loadWishSet();
  return set.has(productId);
}

export async function getWishlist() {
  const data = await apiFetch('/api/me/wishlist', { token: tokenOf() });
  const items = data?.items || [];
  wishSet = new Set(items.map((item) => item.id));
  return items;
}

export async function toggleWishlist(productId) {
  const data = await apiFetch(`/api/me/wishlist/${productId}`, { method: 'PUT', token: tokenOf() });
  if (wishSet) {
    if (data?.liked) wishSet.add(productId);
    else wishSet.delete(productId);
  }
  return data;
}

export async function getCart() {
  const data = await apiFetch('/api/me/cart', { token: tokenOf() });
  return data?.items || [];
}

export function addCart(productId, size, quantity = 1) {
  return apiFetch('/api/me/cart', {
    method: 'POST',
    token: tokenOf(),
    body: { productId, size, quantity },
  });
}

export function setCartItem(productId, size, quantity) {
  return apiFetch('/api/me/cart', {
    method: 'PUT',
    token: tokenOf(),
    body: { productId, size, quantity },
  });
}

export function checkout() {
  return apiFetch('/api/me/orders', { method: 'POST', token: tokenOf() });
}

export async function getMyOrders() {
  const data = await apiFetch('/api/me/orders', { token: tokenOf() });
  return data?.items || [];
}

export async function getReviews(productId) {
  const data = await apiFetch(`/api/products/${productId}/reviews`);
  return data?.items || [];
}

export function createReview(productId, rating, comment) {
  return apiFetch(`/api/products/${productId}/reviews`, {
    method: 'POST',
    token: tokenOf(),
    body: { rating, comment },
  });
}

export function deleteReview(reviewId) {
  return apiFetch(`/api/reviews/${reviewId}`, { method: 'DELETE', token: tokenOf() });
}

export async function getMessages(productId) {
  const data = await apiFetch(`/api/products/${productId}/messages`, { token: tokenOf() });
  return data?.items || [];
}

export function sendMessage(productId, text) {
  return apiFetch(`/api/products/${productId}/messages`, {
    method: 'POST',
    token: tokenOf(),
    body: { text },
  });
}

export function createDispute(productId, reason) {
  return apiFetch(`/api/products/${productId}/disputes`, {
    method: 'POST',
    token: tokenOf(),
    body: { reason },
  });
}

export async function getAdminReviews() {
  const data = await apiFetch('/api/admin/reviews', { token: tokenOf() });
  return data?.items || [];
}

export async function getDisputes() {
  const data = await apiFetch('/api/admin/disputes', { token: tokenOf() });
  return data?.items || [];
}

export function resolveDispute(id) {
  return apiFetch(`/api/admin/disputes/${id}`, { method: 'DELETE', token: tokenOf() });
}

export async function getSellerOrders() {
  const data = await apiFetch('/api/seller/orders', { token: tokenOf() });
  return data?.items || [];
}

export function shipOrder(id, trackingNo) {
  return apiFetch(`/api/seller/orders/${id}`, {
    method: 'PUT',
    token: tokenOf(),
    body: { trackingNo },
  });
}

export function createSellerProduct(body) {
  return apiFetch('/api/seller/products', { method: 'POST', token: tokenOf(), body });
}

export function updateSellerProduct(id, body) {
  return apiFetch(`/api/seller/products/${id}`, { method: 'PUT', token: tokenOf(), body });
}
