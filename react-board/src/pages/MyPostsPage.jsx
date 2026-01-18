import { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { PostsApi } from "../api/posts";
import { formatYmdHm } from "../api/client";

export default function MyPostsPage() {
  const nav = useNavigate(); // ✅ nav 생성

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const data = await PostsApi.mine();
        setPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "내 글 불러오기 실패");
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
      <h1 style={{ fontSize: 40, margin: 0 }}>내가 쓴 게시글</h1>
      {error && <div style={{ color: "crimson", marginTop: 12 }}>{error}</div>}

      <div style={{ marginTop: 16, border: "1px solid #333", borderRadius: 16, overflow: "hidden" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 200px",
          background: "#1f1f1f",
          color: "white",
          padding: "14px 16px",
          fontWeight: 800,
        }}>
          <div>번호</div>
          <div>제목</div>
          <div>작성일</div>
        </div>

        {posts.map((p, idx) => (
          <div key={p.id} style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 200px",
            padding: "14px 16px",
            borderTop: "1px solid #ddd",
            alignItems: "center",
            background: "white",
          }}>
            <div>{idx + 1}</div>
            <div style={{ fontWeight: 700 }}>
              <Link to={`/posts/${p.id}`} style={{ textDecoration: "none", color: "#111" }}>
                {p.title}
              </Link>
            </div>
            <div style={{ opacity: 0.8 }}>{formatYmdHm(p.createdAt)}</div>
            
          </div>
          
        ))}
        

        {posts.length === 0 && !error && (
          <div style={{ padding: 16 }}>내가 쓴 글이 없어요</div>
        )}
      </div>
      <button onClick={() => nav("/posts")} style={{ padding: "8px 12px" }}>목록</button>
      
    </div>
  );
}
