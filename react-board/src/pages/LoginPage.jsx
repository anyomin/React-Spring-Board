import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "../api/auth";
import { useAuth } from "../AuthContext";

export default function LoginPage() {
  const nav = useNavigate();
  const { setUser } = useAuth();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await Auth.login(loginId.trim(), password);

      // ✅ 로그인 성공 후 /me 다시 호출해서 user 세팅
      const me = await Auth.me();
      setUser(me);

      nav("/posts");
    } catch (e2) {
      setMsg(e2.message || "로그인 실패");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h2>로그인</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="아이디(loginId)" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" type="password" />
        <button style={{ padding: "10px 14px" }}>로그인</button>
      </form>

      {msg && <div style={{ marginTop: 12, color: "crimson" }}>{msg}</div>}

      <div style={{ marginTop: 12 }}>
        계정이 없나요? <Link to="/signup">회원가입</Link>
      </div>
    </div>
  );
}
