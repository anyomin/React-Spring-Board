import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "../api/auth";

export default function SignupPage() {
  const nav = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await Auth.signup(loginId.trim(), nickname.trim(), password);
      setMsg("회원가입 성공! 로그인 페이지로 이동합니다.");
      setTimeout(() => nav("/login"), 500);
    } catch (e2) {
      setMsg(e2.message || "회원가입 실패");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h2>회원가입</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="아이디(loginId)" />
        <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" type="password" />
        <button style={{ padding: "10px 14px" }}>가입하기</button>
      </form>

      {msg && <div style={{ marginTop: 12, color: msg.includes("성공") ? "green" : "crimson" }}>{msg}</div>}

      <div style={{ marginTop: 12 }}>
        이미 계정이 있나요? <Link to="/login">로그인</Link>
      </div>
    </div>
  );
}
