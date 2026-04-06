export const seedPosts = [
  {
    title: "The Architecture of Stillness: Why Great Design Feels Inevitable",
    author: "Inkwell Team",
    tags: ["Design", "Architecture", "Philosophy"],
    excerpt:
      "Great design doesn't announce itself — it simply removes every reason to look elsewhere. An exploration of restraint, negative space, and the courage to leave things out.",
    body: `## The Weight of Empty Space

There's a particular kind of silence that exists inside well-designed rooms. Not the silence of absence, but the silence of *resolution* — every element has found its place, and the air itself seems to exhale.

I think about this often when I sit in Barcelona's Pavilion by Mies van der Rohe. The marble walls don't shout. The water doesn't perform. Everything simply *is*, with the quiet confidence of something that couldn't have been otherwise.

> "Less is more." — Ludwig Mies van der Rohe

### The Paradox of Restraint

We live in an era of maximalism. Our feeds overflow, our interfaces bristle with options, our buildings compete for attention with ever-more-dramatic geometries. And yet the spaces that stay with us — the ones we return to in memory — tend to be the simplest.

This isn't minimalism as aesthetic trend. It's minimalism as **ethic**: the belief that every element earns its place or gets removed.

### Learning to Subtract

The hardest skill in any creative discipline isn't addition — it's subtraction. A junior architect adds features. A senior architect removes walls.

The same principle applies to writing, to code, to cooking. Mastery lives in knowing what to leave out.

---

The next time you enter a space that moves you, ask yourself: what isn't there? The answer might teach you more about design than anything that is.`,
    coverImage: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80",
  },
  {
    title: "Rust in Production: A Year of Memory Safety Without the Safety Net",
    author: "Inkwell Team",
    tags: ["Rust", "Programming", "Systems"],
    excerpt:
      "After migrating our core infrastructure from C++ to Rust, we expected fewer segfaults. What we didn't expect was how the borrow checker would reshape the way our entire team thinks about software.",
    body: `## The Decision

We didn't choose Rust because it was trendy. We chose it because our C++ codebase had accumulated fifteen years of memory bugs that no amount of valgrind or address sanitizers could fully eradicate.

### The Borrow Checker is a Teacher, Not a Tyrant

The most common complaint about Rust — "I'm fighting the borrow checker" — usually means you're trying to write C++ in Rust syntax. Once we stopped fighting and started *listening*, our designs improved dramatically.

### Production Numbers

After twelve months:

- **Zero** memory-safety incidents (down from ~4/quarter)
- **23%** reduction in p99 latency (no GC pauses)
- **40%** reduction in memory usage
- Build times went from 2 min (C++) to 8 min (Rust)

> "The compiler is the most patient code reviewer you'll ever have."

### The Hard Parts

Async Rust is still rough — Pin, Send, Sync bounds, and lifetime interactions with async can produce truly bewildering error messages. And compile times remain our biggest developer-experience challenge.

But would we go back? Not a chance.

---

*If you're considering Rust for production, start with a small, well-bounded service. Let the borrow checker teach your team.*`,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
  },
  {
    title: "On Reading Slowly in the Age of Infinite Scroll",
    author: "Inkwell Team",
    tags: ["Culture", "Reading", "Attention"],
    excerpt:
      "We've optimized everything for speed — our feeds, our meals, our relationships. What happens when we deliberately slow down the one activity that was never meant to be fast?",
    body: `## The Speed of Thought

I used to read 50 books a year. I kept a spreadsheet, tracked my pages-per-day, posted my annual wrap-ups. I was, by every metric, a **productive reader**.

I was also retaining almost nothing.

### The Attention Economy's Silent Tax

Our devices have trained us to skim. We scroll through articles at 250 words-per-minute, eyes darting for bold text and bullet points.

> "The purpose of reading is not to get to the end of the book." — Mortimer Adler

### My Experiment in Slow Reading

Six months ago, I set myself three rules:

1. **One book at a time.** No parallel reads.
2. **No more than 30 pages per sitting.** Quality over quantity.
3. **Write a paragraph about each chapter** before moving on.

The results surprised me — I read fewer books but remembered and connected ideas across them in ways I never had before.

### A Counter-Cultural Act

There's something almost rebellious about reading slowly in 2026. Every platform wants your attention fractured. To sit with a book for an hour, undistracted, is to opt out of the attention marketplace entirely.

---

*Put down the spreadsheet. Pick up the book. Read the same paragraph twice if it moves you.*`,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80",
  },
];
