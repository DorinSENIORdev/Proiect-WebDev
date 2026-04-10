import { ArrowLeft } from "lucide-react";
import Navbar from "./components/Navbar";
import AnnouncementCard from "./components/AnnouncementCard";

export default function AnnouncementCollectionPage({
  title,
  eyebrow,
  description = "",
  announcements,
  emptyMessage,
  isLoading = false,
  onBackHome,
  onAddAnnouncement,
  onGoHome,
  onAuthClick = () => {},
  onOpenMyAnnouncements = () => {},
  onOpenFavorites = () => {},
  onOpenNotifications = () => {},
  onToggleLike = () => {},
  pendingLikeIds = [],
  isAuthenticated = false,
  currentUser = null,
  favoritesCount = 0,
  notificationsCount = 0,
  onLogout = () => {},
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

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              {eyebrow}
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-900 md:text-4xl">
              {title}
            </h1>
            {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
          </div>
          <button className="btn-secondary-luxe" onClick={onBackHome} type="button">
            <ArrowLeft size={16} />
            Inapoi acasa
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {isLoading ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              Se incarca anunturile...
            </div>
          ) : announcements.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              {emptyMessage}
            </div>
          ) : (
            announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onToggleLike={onToggleLike}
                onAuthClick={onAuthClick}
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
                isLikeUpdating={pendingLikeIds.includes(announcement.id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
