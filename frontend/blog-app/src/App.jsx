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
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Rutas publicas */}
          <Route path="/" element={<BlogLandingPage />} />
          <Route path="/posts/:slug" element={<BlogPostView />} />
          <Route path="/tags/:tagName" element={<PostByTags />} />
          <Route path="/search" element={<SearchPosts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Rutas Privadas del Administrador */}
          <Route element={<PrivateRoute allowedRoles={["admin", "superadmin"]} />}>
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

          {/* DASHBOARD */}
          <Route element={<PrivateRoute allowedRoles={["member", "admin", "superadmin"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          {/* Rutas para inicio de Sesión o Creación de Cuenta */}

        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          position: "top-right",
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </div>
  )
}

export default App