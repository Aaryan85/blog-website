import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";

export default function PostPage({ getPost, deletePost }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getPost(id)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id, getPost]);

  const isAuthor = user && post && post.authorId === user.id;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePost(post._id);
      navigate("/");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
      setShowDelete(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-64 md:h-96 bg-cream-dark rounded-xl mb-8" />
          <div className="h-4 bg-cream-dark rounded w-24 mb-6" />
          <div className="h-8 bg-cream-dark rounded w-3/4 mb-4" />
          <div className="h-8 bg-cream-dark rounded w-1/2 mb-8" />
          <div className="space-y-3">
            <div className="h-4 bg-cream-dark rounded w-full" />
            <div className="h-4 bg-cream-dark rounded w-full" />
            <div className="h-4 bg-cream-dark rounded w-5/6" />
          </div>
        </div>
      </main>
    );
  }

  // Not found / error
  if (error || !post) {
    return (
      <main className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center py-20 animate-fade-in">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="font-serif text-3xl text-ink mb-2">Post not found</h1>
          <p className="text-ink-muted mb-6">
            {error || "The article you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 rounded-xl bg-ink text-cream text-sm font-medium hover:bg-ink-light transition-colors"
          >
            Back to Journal
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="post-page" className="min-h-screen pt-20 pb-16 animate-fade-in">
      {/* Cover image */}
      {post.coverImage && (
        <div className="relative h-64 md:h-96 lg:h-[28rem] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cream" />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-ink-faint hover:text-amber-dark transition-colors mt-8 mb-6 group"
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
          Back to Journal
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(post.tags || []).map((tag) => (
            <span
              key={tag}
              className="inline-block px-3 py-1 text-xs font-medium tracking-wide uppercase 
                bg-amber-faint text-amber-dark rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-ink leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author meta */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-8 mb-8 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber to-amber-dark flex items-center justify-center text-white font-serif font-bold text-sm">
              {post.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="font-medium text-sm text-ink">{post.author}</p>
              <div className="flex items-center gap-2 text-xs text-ink-faint">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Actions — only visible to the author */}
          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link
                id="edit-post-btn"
                to={`/edit/${post._id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium text-ink-muted
                  hover:border-amber hover:text-amber-dark hover:bg-amber-faint transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
                  />
                </svg>
                Edit
              </Link>
              <button
                id="delete-post-btn"
                onClick={() => setShowDelete(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium text-ink-muted cursor-pointer
                  hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="prose-editorial">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>

        {/* Footer divider */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <Link
            to="/"
            className="text-sm text-ink-faint hover:text-amber-dark transition-colors"
          >
            ← Back to all articles
          </Link>
        </div>
      </article>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={showDelete}
        title="Delete this post?"
        message={`"${post.title}" will be permanently removed. This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </main>
  );
}
