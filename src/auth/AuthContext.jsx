import { createContext, useContext, useState } from 'react';
import * as api from '../api/backend';

const AuthContext = createContext(null);

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [member, setMember] = useState(readUser);

  function remember({ token, member }) {
    setToken(token);
    setMember(member);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(member));
    window.dispatchEvent(new Event('storage'));
  }

  async function login(email, password) {
    const data = await api.login(email, password);
    remember(data);
    return data.member;
  }

  function logout() {
    setToken(null);
    setMember(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
  }

  const isLoggedIn = Boolean(token);
  const role = member?.role || 'buyer';
  const isBuyer = role === 'buyer';
  const isSeller = role === 'seller';
  const isAdmin = role === 'admin';

  const value = { token, member, role, isLoggedIn, isBuyer, isSeller, isAdmin, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
