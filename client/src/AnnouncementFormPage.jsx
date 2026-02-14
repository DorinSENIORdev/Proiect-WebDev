import { useState } from "react";
import { ArrowLeft, ImagePlus } from "lucide-react";
import Navbar from "./components/Navbar";
import { categories } from "./data/categories";

const FIELD_STYLE =
  "rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

export default function AnnouncementFormPage({
  onAddAnnouncement,
  onBackHome,
  initialCategory,
  onGoHome,
}) {
  const [selectedFileName, setSelectedFileName] = useState("Nicio imagine aleasa");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    setSubmitError("");
    onAddAnnouncement({
      id: Date.now(),
      title: formData.title.trim(),
      price: formData.price.trim() || "0",
      category: formData.category,
      location: formData.location.trim() || "Nespecificat",
      contact: formData.contact.trim() || "Anonim",
      description: formData.description.trim() || "Fara descriere.",
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
    setSelectedFileName("Nicio imagine aleasa");
    setIsSubmitting(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFileName("Nicio imagine aleasa");
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
      return;
    }
    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setFormData((prev) => ({ ...prev, imageUrl: result }));
    };
    reader.onerror = () => {
      setSubmitError("Imaginea nu a putut fi citita.");
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen">
      <Navbar
        onLogoClick={onGoHome}
        showAddButton={false}
      />

      <main className="mx-auto max-w-5xl overflow-x-hidden px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Publicare rapida
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-900 md:text-4xl">
              Adauga un anunt nou
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Completeaza informatiile principale, apoi publica in cateva secunde.
            </p>
          </div>
          <button className="btn-secondary-luxe" onClick={onBackHome} type="button">
            <ArrowLeft size={16} />
            Inapoi
          </button>
        </div>

        <form
          className="mt-6 grid gap-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          onSubmit={handleSubmit}
        >
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Titlu
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={FIELD_STYLE}
              placeholder="Ex: Laptop gaming in stare excelenta"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Pret (lei)
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={FIELD_STYLE}
                placeholder="Ex: 1500"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Categoria
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={FIELD_STYLE}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Locatie
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={FIELD_STYLE}
                placeholder="Ex: Iasi"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Contact
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className={FIELD_STYLE}
                placeholder="Ex: 0777777777"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Descriere
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={FIELD_STYLE}
              placeholder="Descrie produsul cat mai clar: starea, detalii, livrare."
            />
          </label>

          <label className="grid gap-3 text-sm font-semibold text-slate-700">
            <span className="inline-flex items-center gap-2">
              <ImagePlus size={16} />
              Fotografie
            </span>
            <input
              id="announcement-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
            <div className="flex w-full flex-wrap items-center gap-3">
              <label
                htmlFor="announcement-image"
                className="btn-secondary-luxe cursor-pointer !border-blue-200 !bg-blue-50 !text-blue-900"
              >
                Alege imagine
              </label>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-500">
                {selectedFileName}
              </span>
            </div>
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview anunt"
                className="h-52 w-full rounded-xl object-cover"
              />
            )}
          </label>

          <button className="btn-primary-luxe" type="submit">
            {isSubmitting ? "Se publica..." : "Publica anunt"}
          </button>
          {submitError && (
            <p className="text-sm font-semibold text-rose-600">{submitError}</p>
          )}
        </form>
      </main>
    </div>
  );
}
