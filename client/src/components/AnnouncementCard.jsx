export default function AnnouncementCard({ announcement }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      {announcement.imageUrl ? (
        <img
          src={announcement.imageUrl}
          alt={announcement.title}
          className="h-40 w-full rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400">
          Fără poză
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {announcement.category}
          </p>
          <h3 className="text-lg font-semibold text-slate-900">
            {announcement.title}
          </h3>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
          {announcement.price} lei
        </span>
      </div>
      <p className="text-sm text-slate-600">{announcement.description}</p>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{announcement.location}</span>
        <span>{announcement.contact}</span>
      </div>
    </article>
  );
}
