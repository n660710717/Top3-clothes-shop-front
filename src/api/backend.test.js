import { apiFetch } from './backend';

global.fetch = jest.fn();

describe('apiFetch Helper Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('คืนค่าข้อมูล JSON เมื่อเซิร์ฟเวอร์ตอบกลับสำเร็จ (200 OK)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ items: [{ id: 1, title: 'เสื้อยืดแขนสั้น' }] }),
    });

    const data = await apiFetch('/api/products');

    expect(data).toEqual({ items: [{ id: 1, title: 'เสื้อยืดแขนสั้น' }] });
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/products'), expect.any(Object));
  });

  test('คืนค่า null ทันทีและไม่เรียก res.json() เมื่อเซิร์ฟเวอร์ตอบกลับ Status 204 No Content', async () => {
    const mockJson = jest.fn();
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
      json: mockJson,
    });

    const result = await apiFetch('/api/seller/products/101', { method: 'DELETE', token: 'mock-token' });

    expect(result).toBeNull();
    expect(mockJson).not.toHaveBeenCalled();
  });

  test('throw Error พร้อมข้อความเมื่อ res.ok เป็น false', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'กรุณาเข้าสู่ระบบก่อน' }),
    });

    await expect(apiFetch('/api/cart')).rejects.toThrow('กรุณาเข้าสู่ระบบก่อน');
  });
});