import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 20 }}>로딩중...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
