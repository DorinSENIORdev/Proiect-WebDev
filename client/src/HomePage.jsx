import { useMemo, useState } from "react";
import { ChevronRight, MapPin, Search, Sparkles } from "lucide-react";
import Navbar from "./components/Navbar";
import { categories } from "./data/categories";

const BRAND = {
  deep: "#0f172a",
  accentSoft: "#ccfbf1",
  surface: "#ffffff",
};

function CategoryCard({ cat, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-3xl border border-slate-200/80 bg-white/90 p-5 text-left shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_18px_28px_-20px_rgba(6,182,212,0.8)]"
      type="button"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-2xl">
          {cat.emoji}
        </div>
        <ChevronRight
          className="translate-x-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500"
          size={18}
        />
      </div>
      <h3 className="mt-5 text-lg font-bold text-slate-900">{cat.name}</h3>
      <p className="mt-1 text-sm text-slate-500">Vezi anunturile disponibile</p>
    </button>
  );
}

export default function HomePage({
  onAddAnnouncement = () => {},
  onGoHome = () => {},
  onSelectCategory = () => {},
}) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Toata tara");

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen">
      <Navbar onAddAnnouncement={onAddAnnouncement} onLogoClick={onGoHome} />

      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white/70">
        <div
          className="hero-blob pointer-events-none absolute -right-10 top-0 h-44 w-44 rounded-full blur-3xl"
          style={{ background: "rgba(245, 158, 11, 0.22)" }}
        />

        <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 md:pb-12 md:pt-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Marketplace local
          </p>
          <h1
            className="mt-2 max-w-2xl text-4xl font-black leading-tight md:text-5xl"
            style={{ color: BRAND.deep }}
          >
            Cumperi si vinzi rapid, fara batai de cap.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
            Gaseste produse aproape de tine sau publica in cateva secunde un
            anunt care chiar iese in evidenta.
          </p>

          <div
            className="mt-8 grid gap-3 rounded-3xl border border-slate-200/80 p-3 shadow-lg md:grid-cols-[1fr_220px_150px]"
            style={{ background: BRAND.surface }}
          >
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-3">
              <Search className="text-slate-400" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Ce cauti azi?"
              />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-3">
              <MapPin className="text-slate-400" size={18} />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Locatie"
              />
            </label>
            <button
              className="btn-primary-luxe group relative"
              type="button"
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 opacity-0 transition duration-500 group-hover:translate-x-6 group-hover:opacity-100" />
              <span className="relative inline-flex items-center justify-center gap-2">
                <Sparkles size={16} />
                Cauta
              </span>
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Exploreaza
            </p>
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
              Categorii principale
            </h2>
          </div>
          <div
            className="rounded-2xl px-4 py-2 text-sm font-semibold"
            style={{ background: BRAND.accentSoft, color: BRAND.deep }}
          >
            {filteredCategories.length} categorii
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              cat={cat}
              onClick={() => onSelectCategory(cat.name)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
