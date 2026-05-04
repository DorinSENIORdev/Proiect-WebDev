import Navbar from "../components/Navbar";

export default function NotFoundPage({
  onGoHome,
  onAddAnnouncement,
  onAuthClick,
  onOpenMyAnnouncements,
  onOpenFavorites,
  onOpenNotifications,
  isAuthenticated,
  currentUser,
  favoritesCount,
  notificationsCount,
  onLogout,
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

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-3xl font-black text-slate-900">Pagina nu exista</h2>
          <p className="mt-3 text-slate-600">
            Ruta accesata nu a fost gasita. Te poti intoarce la pagina principala.
          </p>
          <button className="btn-primary-luxe mt-6" onClick={onGoHome} type="button">
            Inapoi acasa
          </button>
        </div>
      </section>
    </div>
  );
}
