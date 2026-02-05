import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Navbar from "./components/Navbar";
import AnnouncementCard from "./components/AnnouncementCard";

const BRAND = { bg: "#F6F7FB", dark: "#0B1220" };

export default function CategoryPage({
  category,
  announcements,
  onAddAnnouncement,
  onBackHome,
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
    <div className="min-h-screen" style={{ background: BRAND.bg }}>
      <Navbar onAddAnnouncement={onAddAnnouncement} />

      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="grid gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 md:grid-cols-[1fr_140px]">
          <label className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 ring-1 ring-black/5">
            <Search className="text-slate-400" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
              placeholder="Caută în anunțuri"
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-indigo-500">
              Categoria
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {category}
            </h1>
          </div>
          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
            onClick={onBackHome}
            type="button"
          >
            Înapoi la categorii
          </button>
        </div>

        <div className="mt-8 grid gap-4">
          {filteredAnnouncements.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm ring-1 ring-black/5">
              Nu există anunțuri pentru această categorie.
            </div>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
