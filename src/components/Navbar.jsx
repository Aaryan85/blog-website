import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md shadow-[0_1px_0_var(--color-border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          id="logo"
          className="font-serif text-2xl font-bold tracking-tight text-ink hover:text-amber-dark transition-colors"
        >
          Inkwell
          <span className="text-amber">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" label="Journal" active={isActive("/")} />
          {user && <NavLink to="/create" label="Write" active={isActive("/create")} />}

          {user ? (
            <div className="flex items-center gap-4 ml-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber to-amber-dark flex items-center justify-center text-white font-serif font-bold text-xs">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <span className="text-sm font-medium text-ink">{user.name}</span>
              </div>
              <button
                id="logout-btn"
                onClick={logout}
                className="px-3.5 py-1.5 rounded-xl border border-border text-xs font-medium text-ink-muted
                  hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-300 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              id="login-btn"
              className="px-5 py-2 rounded-xl bg-ink text-cream text-sm font-medium
                hover:bg-ink-light transition-all duration-300 ml-2"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 group"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-ink rounded transition-all duration-300 ${
              mobileOpen ? "rotate-45 translate-y-[4px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-ink rounded transition-all duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-[4px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-cream/95 backdrop-blur-md ${
          mobileOpen ? "max-h-60 border-b border-border" : "max-h-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          <NavLink to="/" label="Journal" active={isActive("/")} mobile />
          {user && <NavLink to="/create" label="Write" active={isActive("/create")} mobile />}

          {user ? (
            <div className="flex items-center justify-between pt-2 border-t border-border mt-1">
              <span className="text-sm text-ink">{user.name}</span>
              <button
                onClick={logout}
                className="text-sm text-red-500 font-medium cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-block text-center px-5 py-2.5 rounded-xl bg-ink text-cream text-sm font-medium mt-1"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, label, active, mobile }) {
  return (
    <Link
      to={to}
      className={`relative font-sans text-sm font-medium tracking-wide uppercase transition-colors ${
        mobile ? "text-base" : ""
      } ${
        active
          ? "text-amber-dark"
          : "text-ink-muted hover:text-ink"
      }`}
    >
      {label}
      {active && !mobile && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber rounded-full animate-slide-in" />
      )}
    </Link>
  );
}
