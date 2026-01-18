import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function PostWritePage() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");

  const canSubmit = title.trim() && content.trim();

  const onSubmit = async (e) => {
    e.preventDefault();

  
    if (!canSubmit) {
      setMsg("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setMsg("");
      await api("/api/posts", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });
      nav("/posts");
    } catch (e) {
      // ✅ 로그인 풀렸으면 로그인 페이지로
      if (e.status === 401) {
        nav("/login");
        return;
      }
      setMsg(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto" }}>
      <h2>글쓰기</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용" rows={10} />

      
        <button disabled={!canSubmit}>등록</button>
      </form>

      {msg && <div style={{ marginTop: 10, color: "crimson" }}>{msg}</div>}
    </div>
  );
}
