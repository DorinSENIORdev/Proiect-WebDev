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

export default function HomePage({ onAddAnnouncement, onSelectCategory }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Toată țara");
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Bicicletă de oraș, stare excelentă",
      price: "750",
      category: "Sport & Hobby",
      location: "Cluj-Napoca",
      contact: "Andrei Pop",
      description:
        "Bicicletă folosită ocazional, frâne noi și revizie completă.",
    },
    {
      id: 2,
      title: "Canapea extensibilă modernă",
      price: "1200",
      category: "Casă & Grădină",
      location: "București",
      contact: "Maria I.",
      description: "Perfectă pentru living, livrare rapidă în București.",
    },
  ]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: categories[0]?.name ?? "",
    location: "",
    contact: "",
    description: "",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const filteredAnnouncements = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return announcements;
    return announcements.filter((announcement) =>
      [announcement.title, announcement.category, announcement.location]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [announcements, query]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.title.trim()) {
      return;
    }

    setAnnouncements((prev) => [
      {
        id: Date.now(),
        title: formData.title.trim(),
        price: formData.price.trim() || "0",
        category: formData.category,
        location: formData.location.trim() || "Nespecificat",
        contact: formData.contact.trim() || "Anonim",
        description:
          formData.description.trim() ||
          "Descrierea nu a fost completată încă.",
      },
      ...prev,
    ]);

    setFormData((prev) => ({
      ...prev,
      title: "",
      price: "",
      location: "",
      contact: "",
      description: "",
    }));
  };

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

        <section className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Ultimele anunțuri
              </h2>
              <span className="text-sm text-slate-500">
                {filteredAnnouncements.length} rezultate
              </span>
            </div>
            <div className="grid gap-4">
              {filteredAnnouncements.length === 0 ? (
                <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm ring-1 ring-black/5">
                  Nu există anunțuri care să se potrivească filtrului curent.
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
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="text-xl font-bold text-slate-900">
              Adaugă un anunț nou
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Completează câmpurile de mai jos pentru a publica un anunț rapid.
            </p>
            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Titlu
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Ex: Laptop pentru gaming"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Preț (lei)
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Ex: 1500"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Categoria
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Locație
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Ex: Iași"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Persoană de contact
                <input
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Ex: Alexandra"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Descriere
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Spune câteva detalii despre produs."
                />
              </label>

              <button
                className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                type="submit"
              >
                Publică anunț
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
