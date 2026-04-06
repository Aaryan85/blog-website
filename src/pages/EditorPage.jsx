import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../context/AuthContext";

export default function EditorPage({ getPost, createPost, updatePost }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    tags: "",
    coverImage: "",
    excerpt: "",
    body: "",
  });

  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditing);
  const [submitError, setSubmitError] = useState("");

  // Load existing post data if editing
  useEffect(() => {
    if (isEditing && getPost) {
      setPageLoading(true);
      getPost(id)
        .then((post) => {
          if (post) {
            setForm({
              title: post.title,
              tags: (post.tags || []).join(", "),
              coverImage: post.coverImage || "",
              excerpt: post.excerpt || "",
              body: post.body,
            });
          } else {
            navigate("/");
          }
        })
        .catch(() => navigate("/"))
        .finally(() => setPageLoading(false));
    }
  }, [id, isEditing, getPost, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (submitError) setSubmitError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.body.trim()) newErrors.body = "Body content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const postData = {
      title: form.title.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      coverImage: form.coverImage.trim(),
      excerpt:
        form.excerpt.trim() ||
        form.body.trim().substring(0, 160).replace(/[#*_`>\n]/g, "") + "...",
      body: form.body,
    };

    setLoading(true);
    setSubmitError("");
    try {
      if (isEditing) {
        await updatePost(id, postData);
        navigate(`/post/${id}`);
      } else {
        const newPost = await createPost(postData);
        navigate(`/post/${newPost._id}`);
      }
    } catch (err) {
      setSubmitError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 bg-cream-dark rounded w-48 mb-8" />
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 bg-cream-dark rounded w-20 mb-2" />
                <div className="h-12 bg-cream-dark rounded w-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="editor-page" className="min-h-screen pt-24 pb-16 px-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to={isEditing ? `/post/${id}` : "/"}
              className="inline-flex items-center gap-2 text-sm text-ink-faint hover:text-amber-dark transition-colors mb-3 group"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {isEditing ? "Back to post" : "Back to Journal"}
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink">
              {isEditing ? "Edit Post" : "Write a New Post"}
            </h1>
            {user && (
              <p className="text-sm text-ink-muted mt-1">
                Publishing as <span className="font-medium text-ink">{user.name}</span>
              </p>
            )}
          </div>

          {/* Preview toggle */}
          <button
            id="preview-toggle"
            onClick={() => setPreview((p) => !p)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300 cursor-pointer ${
              preview
                ? "bg-ink text-cream border-ink"
                : "bg-transparent text-ink-muted border-border hover:border-amber hover:text-amber-dark"
            }`}
          >
            {preview ? "Editor" : "Preview"}
          </button>
        </div>

        {preview ? (
          /* ── Preview mode ──────────────────── */
          <div className="bg-white rounded-2xl border border-border p-8 md:p-12 animate-fade-in">
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="Cover"
                className="w-full h-64 object-cover rounded-xl mb-8"
              />
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 text-xs font-medium tracking-wide uppercase bg-amber-faint text-amber-dark rounded-full"
                  >
                    {tag}
                  </span>
                ))}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-4">
              {form.title || "Untitled Post"}
            </h1>
            <p className="text-sm text-ink-faint mb-8">
              By {user?.name || "Anonymous"} ·{" "}
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <div className="prose-editorial">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {form.body || "*Start writing to see a preview...*"}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          /* ── Editor mode ───────────────────── */
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-fade-in">
                {submitError}
              </div>
            )}

            {/* Title */}
            <FieldGroup label="Title" htmlFor="field-title" error={errors.title}>
              <input
                id="field-title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Your article title..."
                className={fieldClass(errors.title)}
              />
            </FieldGroup>

            {/* Tags */}
            <FieldGroup label="Tags" htmlFor="field-tags" hint="Comma-separated">
              <input
                id="field-tags"
                name="tags"
                type="text"
                value={form.tags}
                onChange={handleChange}
                placeholder="Design, Technology, Culture"
                className={fieldClass()}
              />
            </FieldGroup>

            {/* Cover Image URL */}
            <FieldGroup label="Cover Image URL" htmlFor="field-coverImage">
              <input
                id="field-coverImage"
                name="coverImage"
                type="url"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className={fieldClass()}
              />
              {form.coverImage && (
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  className="mt-3 w-full h-40 object-cover rounded-xl border border-border"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </FieldGroup>

            {/* Excerpt */}
            <FieldGroup label="Excerpt" htmlFor="field-excerpt" hint="Auto-generated from body if left empty">
              <textarea
                id="field-excerpt"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={2}
                placeholder="A short summary of your article..."
                className={fieldClass() + " resize-none"}
              />
            </FieldGroup>

            {/* Body */}
            <FieldGroup label="Body" htmlFor="field-body" error={errors.body} hint="Supports Markdown">
              <textarea
                id="field-body"
                name="body"
                value={form.body}
                onChange={handleChange}
                rows={16}
                placeholder={`## Write your story\n\nStart typing in **Markdown**. Use headings, lists, code blocks, and more.\n\n> "The first draft is just you telling yourself the story."`}
                className={fieldClass(errors.body) + " resize-y font-mono text-sm leading-relaxed"}
              />
            </FieldGroup>

            {/* Submit */}
            <div className="flex items-center gap-4 pt-4">
              <button
                id="submit-post-btn"
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-ink text-cream text-sm font-medium
                  hover:bg-ink-light transition-all duration-300 cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed
                  active:scale-[0.98]"
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Publishing..."
                  : isEditing
                  ? "Update Post"
                  : "Publish Post"}
              </button>
              <Link
                to={isEditing ? `/post/${id}` : "/"}
                className="px-6 py-3 rounded-xl border border-border text-sm font-medium text-ink-muted
                  hover:border-border-dark transition-all duration-300"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

/* ── Field helpers ─────────────────────────────────────── */

function FieldGroup({ label, htmlFor, error, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink mb-1.5">
        {label}
        {hint && <span className="text-ink-faint font-normal ml-2">({hint})</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function fieldClass(error) {
  return `w-full px-4 py-3 rounded-xl border bg-white text-ink placeholder-ink-faint font-sans text-sm
    focus:outline-none focus:ring-2 transition-all duration-300
    ${
      error
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-border focus:border-amber focus:ring-amber/20"
    }`;
}
