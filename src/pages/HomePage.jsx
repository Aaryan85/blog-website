import { useState, useMemo } from "react";
import PostCard from "../components/PostCard";
import SearchBar from "../components/SearchBar";

export default function HomePage({ posts, allTags, loading, error }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);

  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by tag
    if (activeTag) {
      result = result.filter((p) => p.tags.includes(activeTag));
    }

    // Filter by search query (client-side filtering for responsiveness)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
          p.author.toLowerCase().includes(q)
      );
    }

    return result;
  }, [posts, searchQuery, activeTag]);

  return (
    <main id="home-page" className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero section */}
        <header className="mb-12 animate-fade-in">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-ink leading-tight mb-4">
            Thoughts, stories &<br />
            <span className="text-amber">ideas</span> worth sharing.
          </h1>
          <p className="text-ink-muted text-lg max-w-xl leading-relaxed">
            A curated journal of essays on design, technology, culture, and the quiet art of paying attention.
          </p>
        </header>

        {/* Search & filter */}
        <SearchBar
          onSearch={setSearchQuery}
          onTagFilter={setActiveTag}
          allTags={allTags}
          activeTag={activeTag}
        />

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`bg-white rounded-xl border border-border p-6 animate-pulse ${i === 1 ? "md:col-span-2" : ""}`}
              >
                <div className="h-52 bg-cream-dark rounded-lg mb-4" />
                <div className="h-4 bg-cream-dark rounded w-1/4 mb-3" />
                <div className="h-6 bg-cream-dark rounded w-3/4 mb-2" />
                <div className="h-4 bg-cream-dark rounded w-full mb-4" />
                <div className="h-3 bg-cream-dark rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="font-serif text-2xl text-ink mb-2">Something went wrong</h2>
            <p className="text-ink-muted text-sm">{error}</p>
          </div>
        )}

        {/* Posts grid */}
        {!loading && !error && filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post, i) => (
              <PostCard key={post._id} post={post} index={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="font-serif text-2xl text-ink mb-2">No posts found</h2>
            <p className="text-ink-muted text-sm">
              {searchQuery || activeTag
                ? "Try adjusting your search or filters."
                : "Write your first post to get started."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
