import { createContext, useContext, useState } from 'react';
import * as api from '../api/backend';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('store.token'));
  const [member, setMember] = useState(() => JSON.parse(localStorage.getItem('store.member') || 'null'));

  function remember({ token, member }) {
    setToken(token);
    setMember(member);
    localStorage.setItem('store.token', token);
    localStorage.setItem('store.member', JSON.stringify(member));
  }

  async function login(email, password) {
    const data = await api.login(email, password);
    remember(data);
  }

  function logout() {
    setToken(null);
    setMember(null);
    localStorage.removeItem('store.token');
    localStorage.removeItem('store.member');
  }

  // คำนวณสถานะสิทธิ์สดๆ
  const isLoggedIn = Boolean(token);
  const role = member?.role || 'buyer'; // 'buyer' | 'seller' | 'admin'
  const isBuyer = role === 'buyer';
  const isSeller = role === 'seller';
  const isAdmin = role === 'admin';

  const value = { token, member, role, isLoggedIn, isBuyer, isSeller, isAdmin, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);