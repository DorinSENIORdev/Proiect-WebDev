import { MapPin, Phone } from "lucide-react";

export default function AnnouncementCard({ announcement }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md md:grid md:grid-cols-[300px_1fr] md:items-stretch md:rounded-2xl">
      {announcement.imageUrl ? (
        <img
          src={announcement.imageUrl}
          alt={announcement.title}
          className="h-56 w-full object-cover md:h-full md:min-h-[260px]"
        />
      ) : (
        <div className="grid h-56 w-full place-items-center bg-gradient-to-br from-slate-100 to-blue-50 text-sm font-semibold text-slate-500 md:h-full md:min-h-[260px]">
          Fara poza
        </div>
      )}

      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              {announcement.category}
            </p>
            <h3 className="mt-1 text-xl font-black text-slate-900 md:text-2xl">
              {announcement.title}
            </h3>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800 md:px-4 md:py-1.5 md:text-base">
            {announcement.price} lei
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600 md:mt-4 md:text-base">
          {announcement.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 md:mt-6 md:text-sm">
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} />
            {announcement.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Phone size={14} />
            {announcement.contact}
          </span>
        </div>
      </div>
    </article>
  );
}
