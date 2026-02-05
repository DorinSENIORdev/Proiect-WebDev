import React, { useMemo, useState } from "react";
import { Search, MapPin } from "lucide-react";
import Navbar from "./components/Navbar";
import { categories } from "./data/categories";


const BRAND = { bg: "#F6F7FB", dark: "#0B1220" };

function CategoryCard({ cat, onClick }) {
  return (
    <button
      onClick={() => onClick(cat)}
      className="group w-full  rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
      type="button"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="grid h-20 w-20 place-items-center rounded-full text-4xl bg-indigo-50">
          {cat.emoji}
        </div>
        <div className="text-center text-base font-semibold text-slate-900">
          {cat.name}
        </div>
        <div className="text-center text-sm text-slate-500 opacity-0 transition group-hover:opacity-100">
          Vezi anunțuri →
        </div>
      </div>
    </button>
  );
}

export default function HomePage({
  onAddAnnouncement = () => {},
  onSelectCategory = () => {},
}) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Toată țara");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen" style={{ background: BRAND.bg }}>
      <Navbar onAddAnnouncement={onAddAnnouncement} />

      {/* Search bar */}
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="grid gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 md:grid-cols-[1fr_260px_140px]">
          <label className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 ring-1 ring-black/5">
            <Search className="text-slate-400" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Ce anume cauți?"
            />
          </label>

          <label className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 ring-1 ring-black/5">
            <MapPin className="text-slate-400" size={18} />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Locație"
            />
          </label>

          <button
            className="rounded-xl px-4 py-3 text-sm font-semibold text-white"
            style={{ background: BRAND.dark }}
            type="button"
          >
            Căutare
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-center text-3xl font-extrabold text-slate-900 md:text-4xl">
          Categorii principale
        </h1>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((cat) => (
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
