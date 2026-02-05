import { useState } from "react";
import Navbar from "./components/Navbar";
import { categories } from "./data/categories";

const BRAND = { bg: "#F6F7FB" };

export default function AnnouncementFormPage({
  onAddAnnouncement,
  onBackHome,
  initialCategory,
}) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: initialCategory ?? categories[0]?.name ?? "",
    location: "",
    contact: "",
    description: "",
    imageUrl: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.title.trim()) {
      return;
    }

    onAddAnnouncement({
      id: Date.now(),
      title: formData.title.trim(),
      price: formData.price.trim() || "0",
      category: formData.category,
      location: formData.location.trim() || "Nespecificat",
      contact: formData.contact.trim() || "Anonim",
      description:
        formData.description.trim() || "Descrierea nu a fost completată încă.",
      imageUrl: formData.imageUrl,
    });

    setFormData((prev) => ({
      ...prev,
      title: "",
      price: "",
      location: "",
      contact: "",
      description: "",
      imageUrl: "",
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, imageUrl }));
  };

  return (
    <div className="min-h-screen" style={{ background: BRAND.bg }}>
      <Navbar showAddButton={false} />

      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Adaugă un anunț nou
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Completează detaliile ca să publici rapid anunțul tău.
            </p>
          </div>
          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-300"
            onClick={onBackHome}
            type="button"
          >
            Înapoi
          </button>
        </div>

        <form
          className="grid gap-5 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5"
          onSubmit={handleSubmit}
        >
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Titlu
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Ex: 1500"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Categoria
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Ex: Iași"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Persoană de contact
            <input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Ex: Alexandra"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Descriere
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Spune câteva detalii despre produs."
            />
          </label>

          <label className="grid gap-3 text-sm font-medium text-slate-700">
            Poză
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Previzualizare anunț"
                className="h-48 w-full rounded-xl object-cover"
              />
            )}
          </label>

          <button
            className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            type="submit"
          >
            Publică anunț
          </button>
        </form>
      </main>
    </div>
  );
}
