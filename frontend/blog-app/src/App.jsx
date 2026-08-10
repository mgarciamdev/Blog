import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import BlogLandingPage from "./pages/Blog/BlogLandingPage";
import BlogPostView from "./pages/Blog/BlogPostView";
import PostByTags from "./pages/Blog/PostByTags";
import SearchPosts from "./pages/Blog/SearchPosts";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import BlogPostEditor from "./pages/Admin/BlogPostEditor";
import BlogPosts from "./pages/Admin/BlogPosts";
import Comments from "./pages/Admin/Comments";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Verify from "./pages/Auth/Verify";
import Users from "./pages/Admin/Users";
import Profile from "./pages/Profile/Profile";

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
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify" element={<Verify />} />

          {/* Rutas Privadas del Administrador */}
          <Route element={<PrivateRoute allowedRoles={["admin", "superadmin"]} />}>
            <Route path="/posts" element={<BlogPosts />} />
            <Route path="/create" element={<BlogPostEditor />} />
            <Route
              path="/edit/:postSlug"
              element={<BlogPostEditor isEdit={true} />}
            />
            <Route path="/comments" element={<Comments />} />
            <Route path="/users" element={<Users />} />
          </Route>

          {/* Rutas Privadas de los miembros */}
          <Route element={<PrivateRoute allowedRoles={["member"]} />}>

          </Route>

          {/* DASHBOARD */}
          <Route element={<PrivateRoute allowedRoles={["member", "admin", "superadmin"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          
          {/* PROFILE */}
          <Route element={<PrivateRoute allowedRoles={["member", "admin", "superadmin"]} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

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