import { NavLink, Route, Routes } from "react-router-dom";
import { profile } from "./data.js";
import Icon from "./Icon.jsx";
import FavoriteQuote from "./FavoriteQuote.jsx";
import Home from "./pages/Home.jsx";
import Blog from "./pages/Blog.jsx";
import Photos from "./pages/Photos.jsx";

const navigation = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blog" },
  { to: "/photos", label: "Photos" },
];

function Topbar() {
  return (
    <header className="topbar">
      <nav className="navigation" aria-label="Main navigation">
        {navigation.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <div className="site-layout">
      <Topbar />
      <main className="main-content">
        <div className="route-content">
          <Routes>
            <Route path="/" element={<Home profile={profile} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/photos" element={<Photos />} />
          </Routes>
        </div>
        <FavoriteQuote />
      </main>
      <footer className="site-footer">© {new Date().getFullYear()} {profile.name}</footer>
    </div>
  );
}
