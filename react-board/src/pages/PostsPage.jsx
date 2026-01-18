import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatYmdHm } from "../api/client.js";
import Pagination from "../components/pagination.jsx";
import { useAuth } from "../AuthContext";
import { PostsApi } from "../api/posts"; 

import { Button as Ui5Button } from "@ui5/webcomponents-react";

export default function PostsPage() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  // 검색 옵션
  const [searchField, setSearchField] = useState("title"); // title | content | all
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const runSearch = () => {
    setPage(1);
    setKeyword(keywordInput.trim());
  };

  const resetSearch = () => {
    setSearchField("title");
    setKeywordInput("");
    setKeyword("");
    setPage(1);
  };

  useEffect(() => {
    (async () => {
      try {
        setError("");
        setLoading(true);

        
        const data = await PostsApi.list({ keyword });
        setPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || "목록 불러오기 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, [keyword]);

  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pagePosts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return posts.slice(start, start + pageSize);
  }, [posts, page, pageSize]);

  return (
    <div>
      <div style={styles.topBar}>
        <div style={styles.topBarInner}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span style={styles.brand}>🏠 Home</span>
            <span style={{ opacity: 0.7 }}>|</span>
            <span style={styles.menuActive}>게시판</span>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {!user ? (
              <>
                <button style={styles.topLinkBtn} onClick={() => nav("/login")}>
                  로그인
                </button>
                <button style={styles.topLinkBtn} onClick={() => nav("/signup")}>
                  회원가입
                </button>
              </>
            ) : (
              <>
                <button style={styles.topLinkBtn} onClick={() => nav("/my-posts")}>
                  내 글
                </button>
                <button
                  style={styles.topLinkBtn}
                  onClick={async () => {
                    await logout();
                    nav("/posts");
                  }}
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ✅ 가운데 컨텐츠 */}
      <div style={styles.container}>
        <h1 style={styles.title}>List</h1>

        {/* 검색 영역 (사진처럼) */}
        <div style={styles.searchRow}>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            style={styles.select}
            title="검색 옵션"
          >
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="all">제목+내용</option>
          </select>

          <input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="검색어"
            style={styles.searchInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch();
            }}
          />

          <button style={styles.searchBtn} onClick={runSearch}>
            🔍 검색
          </button>

          <button style={styles.resetBtn} onClick={resetSearch}>
            초기화
          </button>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
           
            <Ui5Button onClick={() => (user ? nav("/write") : nav("/login"))}>
              글쓰기
            </Ui5Button>
          </div>
        </div>

        {/* 상태줄 */}
        <div style={styles.meta}>
          {loading ? "로딩중..." : `전체 ${total}개 / ${page} / ${totalPages} 페이지`}
          {error && <span style={{ color: "crimson", marginLeft: 10 }}>{error}</span>}
        </div>

        {/* 테이블 */}
        <div style={styles.tableWrap}>
          <div style={styles.tableHead}>
            <div style={{ width: 80 }}>번호</div>
            <div style={{ flex: 1 }}>제목</div>
            <div style={{ width: 220 }}>작성자</div>
            <div style={{ width: 160, textAlign: "right" }}>작성일</div>
          </div>

          {pagePosts.map((p, idx) => {
            const number = (page - 1) * pageSize + idx + 1;
            return (
              <div
                key={p.id}
                style={styles.tableRow}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
              >
                <div style={{ width: 80, color: "#444" }}>{number}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/posts/${p.id}`} style={styles.link}>
                    {p.title}
                  </Link>
                  <div style={styles.preview} title={p.content}>
                    {p.content}
                  </div>
                </div>

                <div style={{ width: 220, color: "#555" }}>
                  {p.authorNickname ? (
                    <>
                      {p.authorNickname}{" "}
                      <span style={{ opacity: 0.6 }}>({p.authorLoginId})</span>
                    </>
                  ) : (
                    "-"
                  )}
                </div>

                <div style={{ width: 160, textAlign: "right", color: "#666" }}>
                  {formatYmdHm(p.createdAt)}
                </div>
              </div>
            );
          })}

          {!loading && pagePosts.length === 0 && (
            <div style={{ padding: 18, color: "#666" }}>게시글이 없어요</div>
          )}
        </div>

        {/* 하단: 페이지네이션 + 페이지사이즈 */}
        <div style={styles.footerRow}>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            style={styles.select}
          >
            <option value={5}>5개</option>
            <option value={10}>10개</option>
            <option value={20}>20개</option>
          </select>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} windowSize={5} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  topBar: {
    background: "#3d454c",
    height: 44,
    display: "flex",
    alignItems: "center",
  },
  topBarInner: {
    width: "100%",
    maxWidth: 980,
    margin: "0 auto",
    padding: "0 16px",
    display: "flex",
    justifyContent: "space-between",
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
  },
  brand: { fontWeight: 700 },
  menuActive: { fontWeight: 800 },
  topLinkBtn: {
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.85)",
    cursor: "pointer",
    padding: 0,
    fontSize: 13,
  },

  container: { maxWidth: 980, margin: "24px auto", padding: "0 16px" },
  title: { fontSize: 64, fontWeight: 300, margin: "20px 0 16px" },

  searchRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 14,
    border: "1px solid #e5e5e5",
    borderRadius: 6,
    background: "white",
  },
  select: {
    height: 34,
    borderRadius: 4,
    border: "1px solid #d6d6d6",
    padding: "0 10px",
    background: "white",
  },
  searchInput: {
    height: 34,
    width: 240,
    borderRadius: 4,
    border: "1px solid #d6d6d6",
    padding: "0 10px",
  },
  searchBtn: {
    height: 34,
    borderRadius: 4,
    border: "1px solid #cfcfcf",
    background: "#f5f5f5",
    cursor: "pointer",
    padding: "0 12px",
    fontWeight: 700,
  },
  resetBtn: {
    height: 34,
    borderRadius: 4,
    border: "1px solid #cfcfcf",
    background: "white",
    cursor: "pointer",
    padding: "0 12px",
  },
  meta: { margin: "10px 0 12px", color: "#666", fontSize: 13 },

  tableWrap: {
    border: "1px solid #e5e5e5",
    borderRadius: 6,
    overflow: "hidden",
    background: "white",
  },
  tableHead: {
    display: "flex",
    gap: 12,
    padding: "12px 14px",
    borderBottom: "1px solid #eee",
    color: "#555",
    fontWeight: 800,
    fontSize: 13,
  },
  tableRow: {
    display: "flex",
    gap: 12,
    padding: "14px 14px",
    borderBottom: "1px solid #f0f0f0",
    alignItems: "center",
    background: "white",
  },
  link: { textDecoration: "none", color: "#1a1a1a", fontWeight: 800 },
  preview: {
    marginTop: 6,
    color: "#777",
    fontSize: 13,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  footerRow: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
};
