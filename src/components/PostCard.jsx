import { Link } from "react-router-dom";

export default function PostCard({ post, index }) {
  const isFeatured = index === 0;
  const postId = post._id || post.id;

  return (
    <article
      id={`post-card-${postId}`}
      className={`group animate-fade-in-up ${
        isFeatured ? "md:col-span-2" : ""
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link to={`/post/${postId}`} className="block">
        <div
          className={`relative overflow-hidden rounded-xl bg-white border border-border 
            transition-all duration-500 
            hover:shadow-[0_8px_30px_var(--color-shadow-warm-lg)] 
            hover:border-amber/30
            hover:-translate-y-1
            ${isFeatured ? "md:flex" : ""}`}
        >
          {/* Left accent border */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-amber transition-colors duration-500 rounded-l-xl" />

          {/* Cover image */}
          {post.coverImage && (
            <div
              className={`overflow-hidden ${
                isFeatured ? "md:w-1/2 md:min-h-[320px]" : "h-52"
              }`}
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          )}

          {/* Content */}
          <div className={`p-6 ${isFeatured ? "md:w-1/2 md:p-8 md:flex md:flex-col md:justify-center" : ""}`}>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {(post.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase 
                    bg-amber-faint text-amber-dark rounded-full 
                    transition-all duration-300 
                    group-hover:bg-amber-light"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h2
              className={`font-serif font-bold text-ink leading-snug mb-2 
                transition-colors duration-300 group-hover:text-amber-dark
                ${isFeatured ? "text-2xl md:text-3xl" : "text-xl"}`}
            >
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-ink-muted text-sm leading-relaxed mb-4 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-ink-faint">
              <span className="font-medium text-ink-muted">{post.author}</span>
              <span>·</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
