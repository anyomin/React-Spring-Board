import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PostsApi } from "../api/posts";
import { useAuth } from "../AuthContext";

export default function PostDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const data = await PostsApi.detail(id);
        setPost(data);
      } catch (e) {
        setError(e.message || "불러오기 실패");
      }
    })();
  }, [id]);

  const onDelete = async () => {
    if (!window.confirm("삭제할까요?")) return;
    try {
      await PostsApi.remove(id);
      nav("/posts");
    } catch (e) {
      alert(e.message || "삭제 실패");
    }
  };

  if (error) return <div style={{ padding: 20, color: "crimson" }}>{error}</div>;
  if (!post) return <div style={{ padding: 20 }}>로딩중...</div>;

  const isOwner = user && post.authorId === user.id; // ✅ 핵심

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
      <h1>{post.title}</h1>
      <div style={{ opacity: 0.8, marginBottom: 12 }}>
        {post.authorNickname} <span style={{ opacity: 0.5 }}>({post.authorLoginId})</span>
      </div>

      <div style={{ whiteSpace: "pre-wrap", border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        {post.content}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={() => nav("/posts")} style={{ padding: "8px 12px" }}>목록</button>

        {isOwner && (
          <>
            <button onClick={() => nav(`/posts/${id}/edit`)} style={{ padding: "8px 12px" }}>
              수정
            </button>
            <button onClick={onDelete} style={{ padding: "8px 12px", color: "crimson" }}>
              삭제
            </button>
          </>
        )}
      </div>

      {!user && (
        <div style={{ marginTop: 12, opacity: 0.7 }}>
          로그인하면 작성자 권한이 적용돼요. <Link to="/login">로그인</Link>
        </div>
      )}
    </div>
  );
}
