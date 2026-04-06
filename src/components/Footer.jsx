export default function Footer() {
  return (
    <footer id="footer" className="border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-serif text-lg font-bold text-ink">
          Inkwell<span className="text-amber">.</span>
        </div>
        <p className="text-xs text-ink-faint tracking-wide">
          © {new Date().getFullYear()} Inkwell. Crafted with intention.
        </p>
      </div>
    </footer>
  );
}
