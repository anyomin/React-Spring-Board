import { useMemo } from "react";

export default function Pagination({ page, totalPages, onChange, windowSize = 5 }) {
  const pages = useMemo(() => {
    const size = Math.max(3, windowSize);
    let start = Math.max(1, page - Math.floor(size / 2));
    let end = start + size - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - size + 1);
    }

    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [page, totalPages, windowSize]);

  const canNext = page < totalPages;
  const canPrev = page > 1;

  return (
    <div style={styles.wrap}>
      <div style={styles.bar}>
        
       
        <button
          onClick={() => canPrev && onChange(page - 1)}
          disabled={!canPrev}
          style={{ ...styles.navBtn, ...(canPrev ? {} : styles.nextDisabled) }}
        >
          이전 <span style={{ fontSize: 18, lineHeight: 1 }}>‹</span>
        </button>

        {pages.map((p) => {
          const active = p === page;
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              style={{ ...styles.pageBtn, ...(active ? styles.activeBtn : {}) }}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => canNext && onChange(page + 1)}
          disabled={!canNext}
          style={{ ...styles.nextBtn, ...(canNext ? {} : styles.nextDisabled) }}
        >
          다음 <span style={{ fontSize: 18, lineHeight: 1 }}>›</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: "flex", justifyContent: "center", flex: 1 },
  bar: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "10px 16px",
    background: "white",
    borderRadius: 999,
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  pageBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    border: "none",
    background: "transparent",
    color: "#b8b8b8",
    fontWeight: 800,
    cursor: "pointer",
  },
  activeBtn: {
    background: "#2f6d64",
    color: "white",
  },
  navBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 800,
    color: "#666",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 6px",
  },
  nextBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 800,
    color: "#666",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 6px",
  },
  nextDisabled: { opacity: 0.35},
};
