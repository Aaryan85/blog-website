import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="register-page" className="min-h-screen flex items-center justify-center px-6 pt-16 pb-12 bg-cream animate-fade-in">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-3xl font-bold text-ink">
            Inkwell<span className="text-amber">.</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-ink mt-6 mb-2">Create an account</h1>
          <p className="text-ink-muted text-sm">Join the conversation, share your stories</p>
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
              <label htmlFor="register-name" className="block text-sm font-medium text-ink mb-1.5">
                Full Name
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Aaryan Yadav"
                autoComplete="name"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink placeholder-ink-faint text-sm
                  focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-ink mb-1.5">
                Email
              </label>
              <input
                id="register-email"
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
              <label htmlFor="register-password" className="block text-sm font-medium text-ink mb-1.5">
                Password
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink placeholder-ink-faint text-sm
                  focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-300"
              />
              <p className="mt-1 text-xs text-ink-faint">Minimum 6 characters</p>
            </div>

            <div>
              <label htmlFor="register-confirm" className="block text-sm font-medium text-ink mb-1.5">
                Confirm Password
              </label>
              <input
                id="register-confirm"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-ink placeholder-ink-faint text-sm
                  focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20 transition-all duration-300"
              />
            </div>
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-6 px-6 py-3 rounded-xl bg-ink text-cream text-sm font-medium
              hover:bg-ink-light transition-all duration-300 cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-[0.98]"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center mt-6 text-sm text-ink-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-dark font-medium hover:text-amber transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
