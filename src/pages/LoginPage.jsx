import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="login-page" className="min-h-screen flex items-center justify-center px-6 pt-16 pb-12 bg-cream animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-3xl font-bold text-ink">
            Inkwell<span className="text-amber">.</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-ink mt-6 mb-2">Welcome back</h1>
          <p className="text-ink-muted text-sm">Sign in to continue writing</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-8 shadow-[0_4px_20px_var(--color-shadow-warm)]">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-ink mb-1.5">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink placeholder-ink-faint text-sm
                  focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-ink mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink placeholder-ink-faint text-sm
                  focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-300"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-6 px-6 py-3 rounded-xl bg-ink text-cream text-sm font-medium
              hover:bg-ink-light transition-all duration-300 cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-[0.98]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center mt-6 text-sm text-ink-muted">
          Don't have an account?{" "}
          <Link to="/register" className="text-amber-dark font-medium hover:text-amber transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
