const BASE = "";

export async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // 401은 로그인 안 된 정상 케이스로 다루고 싶을 때가 많아서 메시지 분리
  if (!res.ok) {
    const text = await res.text();
    const msg = text || `${res.status} ${res.statusText}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

  
  // 날짜 포맷: YYYY-MM-DD HH:mm 고정
  export function formatYmdHm(isoString) {
    if (!isoString) return "-";
    const d = new Date(isoString);
  
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
  
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }
  