import { Routes, Route, Navigate } from "react-router-dom";
import PostsPage from "./pages/PostsPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostWritePage from "./pages/PostWritePage";
import PostEditPage from "./pages/PostEditPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MyPostsPage from "./pages/MyPostsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/posts" replace />} />

      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
      

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/posts/:id/edit" element={<PostEditPage />} />
       {/* ✅ 글쓰기는 로그인 필요 */}
       <Route
        path="/write"
        element={
          <ProtectedRoute>
            <PostWritePage />
          </ProtectedRoute>
        }
      />

      { <Route path="/my-posts" element={<ProtectedRoute><MyPostsPage/></ProtectedRoute>} /> }
    </Routes>
  );
}
