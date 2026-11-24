import { NavLink, Route, Routes } from "react-router-dom";
import { profile } from "./data.js";
import FavoriteQuote from "./FavoriteQuote.jsx";
import Home from "./pages/Home.jsx";
import Blog from "./pages/Blog.jsx";
import Photos from "./pages/Photos.jsx";

const navigation = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blog" },
  { to: "/photos", label: "Photos" },
];

export default function App() {
  return (
    <div className="site-layout">
      <header className="topbar">
        <nav className="navigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home profile={profile} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/photos" element={<Photos />} />
        </Routes>
        <FavoriteQuote />
      </main>
      <footer className="site-footer">© {new Date().getFullYear()} {profile.name}</footer>
    </div>
  );
}
