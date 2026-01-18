import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostsApi } from "../api/posts";   
import { api } from "../api/client";       

export default function PostEditPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await PostsApi.detail(id); // ✅ 통일
        setTitle(data.title ?? "");
        setContent(data.content ?? "");
        setAuthor(data.authorNickname ?? "");
      } catch (e) {
        alert(e.message || "불러오기 실패");
        nav("/posts");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, nav]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목/내용은 필수!");
      return;
    }

    try {
      setLoading(true);
      await PostsApi.update(id, title, content);  
      nav(`/posts/${id}`);
    } catch (e) {
      if (e.status === 401) nav("/login");
      else alert(e.message || "수정 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <button onClick={() => nav(`/posts/${id}`)} style={{ marginBottom: 12 }}>
        ← 상세로
      </button>

      <h2>글 수정</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} />
        <input value={author} readOnly style={{ opacity: 0.7 }} />
        <button disabled={loading} type="submit">
          {loading ? "저장중..." : "저장"}
        </button>
      </form>
    </div>
  );
}
