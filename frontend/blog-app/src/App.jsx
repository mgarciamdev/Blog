import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import BlogLandingPage from "./pages/Blog/BlogLandingPage";
import BlogPostView from "./pages/Blog/BlogPostView";
import PostByTags from "./pages/Blog/PostByTags";
import SearchPosts from "./pages/Blog/SearchPosts";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import BlogPostEditor from "./pages/Admin/BlogPostEditor";
import BlogPosts from "./pages/Admin/BlogPosts";
import Comments from "./pages/Admin/Comments";
import AdminLogin from "./pages/Admin/AdminLogin";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Rutas predeterminadas */}
          <Route path="/" element={<BlogLandingPage />} />
          <Route path="/:slug" element={<BlogPostView />} />
          <Route path="/tag/:tagName" element={<PostByTags />} />
          <Route path="/search" element={<SearchPosts />} />

          {/* Rutas Privadas del Administrador */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/posts" element={<BlogPosts />} />
            <Route path="/admin/create" element={<BlogPostEditor />} />
            <Route
              path="/admin/edit/:postSlug"
              element={<BlogPostEditor isEdit={true} />}
            />
            <Route path="/admin/comments" element={<Comments />} />
          </Route>

          {/* Rutas Privadas de los miembros */}
          <Route element={<PrivateRoute allowedRoles={["member"]} />}>

          </Route>

          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App