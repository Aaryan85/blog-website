import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { usePosts } from "./hooks/usePosts";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import EditorPage from "./pages/EditorPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function AppRoutes() {
  const { posts, loading, error, getPost, createPost, updatePost, deletePost, allTags } = usePosts();

  return (
    <>
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={<HomePage posts={posts} allTags={allTags} loading={loading} error={error} />}
          />
          <Route
            path="/post/:id"
            element={<PostPage getPost={getPost} deletePost={deletePost} />}
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <EditorPage createPost={createPost} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditorPage getPost={getPost} updatePost={updatePost} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-cream">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}