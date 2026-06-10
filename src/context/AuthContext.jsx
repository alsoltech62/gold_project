import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gold_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('gold_token'));

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('gold_user', JSON.stringify(userData));
    localStorage.setItem('gold_token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gold_user');
    localStorage.removeItem('gold_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin: user?.is_admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
