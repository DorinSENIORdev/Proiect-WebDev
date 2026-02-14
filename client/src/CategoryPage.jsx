import { useMemo, useState } from "react";
import { ArrowLeft, Search, Sparkles } from "lucide-react";
import Navbar from "./components/Navbar";
import AnnouncementCard from "./components/AnnouncementCard";

export default function CategoryPage({
  category,
  announcements,
  onAddAnnouncement,
  onBackHome,
  onGoHome,
}) {
  const [query, setQuery] = useState("");

  const filteredAnnouncements = useMemo(() => {
    const q = query.trim().toLowerCase();
    return announcements.filter((announcement) => {
      if (announcement.category !== category) return false;
      if (!q) return true;
      return [announcement.title, announcement.location, announcement.description]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [announcements, category, query]);

  return (
    <div className="min-h-screen">
      <Navbar
        onAddAnnouncement={onAddAnnouncement}
        onLogoClick={onGoHome}
      />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Categoria selectata
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-900 md:text-4xl">
              {category}
            </h1>
          </div>
          <button className="btn-secondary-luxe" onClick={onBackHome} type="button">
            <ArrowLeft size={16} />
            Inapoi la categorii
          </button>
        </div>

        <div className="mt-7 grid gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[1fr_140px]">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 px-3 py-3">
            <Search className="text-slate-400" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Cauta in anunturi"
            />
          </label>
          <button className="btn-primary-luxe group relative" type="button">
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 opacity-0 transition duration-500 group-hover:translate-x-6 group-hover:opacity-100" />
            <span className="relative inline-flex items-center justify-center gap-2">
              <Sparkles size={16} />
              Cauta
            </span>
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filteredAnnouncements.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              Nu exista anunturi pentru aceasta categorie.
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
