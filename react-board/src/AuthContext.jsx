// src/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { Auth } from "./api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await Auth.me();
        setUser(me);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ 추가: 로그아웃 함수
  const logout = async () => {
    try {
      await Auth.logout(); // 서버 세션 끊기
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null); // 프론트 상태도 끊기
    }
  };

  // ✅ value에 logout 추가
  const value = { user, setUser, loading, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
