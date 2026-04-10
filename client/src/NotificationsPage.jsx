import { ArrowLeft, Bell, Clock3 } from "lucide-react";
import Navbar from "./components/Navbar";

function formatNotificationDate(value) {
  if (!value) {
    return "Data necunoscuta";
  }

  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function NotificationsPage({
  notifications,
  isLoading = false,
  onBackHome,
  onGoHome,
  onAddAnnouncement,
  onAuthClick = () => {},
  onOpenMyAnnouncements = () => {},
  onOpenFavorites = () => {},
  onOpenNotifications = () => {},
  isAuthenticated = false,
  currentUser = null,
  favoritesCount = 0,
  notificationsCount = 0,
  onLogout = () => {},
  onViewAnnouncement = () => {},
}) {
  return (
    <div className="min-h-screen">
      <Navbar
        onAddAnnouncement={onAddAnnouncement}
        onLogoClick={onGoHome}
        onAuthClick={onAuthClick}
        onOpenMyAnnouncements={onOpenMyAnnouncements}
        onOpenFavorites={onOpenFavorites}
        onOpenNotifications={onOpenNotifications}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        favoritesCount={favoritesCount}
        notificationsCount={notificationsCount}
        onLogout={onLogout}
      />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Activitate recenta
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-900 md:text-4xl">
              Notificarile tale
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Vezi cine a apreciat anunturile publicate de tine.
            </p>
          </div>
          <button className="btn-secondary-luxe" onClick={onBackHome} type="button">
            <ArrowLeft size={16} />
            Inapoi acasa
          </button>
        </div>

        <div className="mt-8 grid gap-4">
          {isLoading ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              Se incarca notificarile...
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              Nu ai notificari noi momentan.
            </div>
          ) : (
            notifications.map((notification) => (
              <article
                key={notification.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600">
                      <Bell size={16} />
                      {notification.likerName} a dat like anuntului tau
                    </p>
                    <h2 className="mt-2 text-xl font-black text-slate-900">
                      {notification.announcementTitle}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {notification.category} - {notification.location}
                    </p>
                  </div>

                  <button
                    className="btn-secondary-luxe"
                    onClick={() => onViewAnnouncement(notification)}
                    type="button"
                  >
                    Vezi anuntul
                  </button>
                </div>

                <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <Clock3 size={14} />
                  {formatNotificationDate(notification.createdAt)}
                </p>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
