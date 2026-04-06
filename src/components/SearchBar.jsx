import { useState } from "react";

export default function SearchBar({ onSearch, onTagFilter, allTags, activeTag }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div id="search-filter" className="animate-fade-in mb-10">
      {/* Search input */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg
            className="w-4.5 h-4.5 text-ink-faint"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search articles..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-white
            text-ink placeholder-ink-faint font-sans text-sm
            focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/20
            transition-all duration-300"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              onSearch("");
            }}
            className="absolute inset-y-0 right-3 flex items-center text-ink-faint hover:text-ink transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap gap-2">
        <button
          id="tag-filter-all"
          onClick={() => onTagFilter(null)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase cursor-pointer
            transition-all duration-300 border
            ${
              !activeTag
                ? "bg-ink text-cream border-ink"
                : "bg-transparent text-ink-muted border-border hover:border-ink-faint hover:text-ink"
            }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            id={`tag-filter-${tag.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => onTagFilter(tag === activeTag ? null : tag)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase cursor-pointer
              transition-all duration-300 border
              ${
                activeTag === tag
                  ? "bg-amber text-white border-amber"
                  : "bg-transparent text-ink-muted border-border hover:border-amber/40 hover:text-amber-dark hover:bg-amber-faint"
              }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
