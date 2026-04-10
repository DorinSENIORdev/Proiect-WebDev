import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import AnnouncementCollectionPage from "./AnnouncementCollectionPage";
import AnnouncementFormPage from "./AnnouncementFormPage";
import AuthPage from "./AuthPage";
import CategoryPage from "./CategoryPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HomePage from "./HomePage";
import NotificationsPage from "./NotificationsPage";
import "./index.css";
import { categories, findCategoryBySlug, slugifyCategoryName } from "./data/categories";
import {
  createAnnouncement,
  fetchAnnouncements,
  fetchMe,
  fetchNotifications,
  toggleAnnouncementLike,
} from "./lib/api";

const TOKEN_KEY = "easysell_auth_token";

function NotFoundPage({
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

function AuthRoute(props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultMode = searchParams.get("mode") === "register" ? "register" : "login";

  return <AuthPage defaultMode={defaultMode} {...props} />;
}

function CreateAnnouncementRoute(props) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const requestedCategory = searchParams.get("category");
  const initialCategory = categories.some((category) => category.name === requestedCategory)
    ? requestedCategory
    : undefined;

  return <AnnouncementFormPage initialCategory={initialCategory} {...props} />;
}

function CategoryRoute(props) {
  const { slug } = useParams();
  const location = useLocation();
  const category = slug ? findCategoryBySlug(slug) : null;

  if (!category) {
    return <NotFoundPage {...props} />;
  }

  return (
    <CategoryPage
      key={`${slug ?? "unknown"}:${location.search}`}
      {...props}
      category={category.name}
      onAddAnnouncement={() => props.onAddAnnouncement(category.name)}
    />
  );
}

function AppContent() {
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? "");
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [likeMutationIds, setLikeMutationIds] = useState([]);
  const [globalError, setGlobalError] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = Boolean(authToken);

  const loadAnnouncements = useCallback(async () => {
    setLoadingAnnouncements(true);
    setGlobalError("");

    try {
      const items = await fetchAnnouncements({ token: authToken });
      setAnnouncements(items);
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setLoadingAnnouncements(false);
    }
  }, [authToken]);

  const loadNotifications = useCallback(async () => {
    if (!authToken) {
      setNotifications([]);
      setLoadingNotifications(false);
      return;
    }

    setLoadingNotifications(true);

    try {
      const items = await fetchNotifications(authToken);
      setNotifications(items);
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setLoadingNotifications(false);
    }
  }, [authToken]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  useEffect(() => {
    if (!authToken) {
      setCurrentUser(null);
      setNotifications([]);
      return;
    }

    fetchMe(authToken)
      .then((user) => setCurrentUser(user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken("");
        setCurrentUser(null);
        setNotifications([]);
      });
  }, [authToken]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const favoriteAnnouncements = useMemo(() => {
    return announcements.filter((announcement) => announcement.isLiked);
  }, [announcements]);

  const myAnnouncements = useMemo(() => {
    if (!currentUser) {
      return [];
    }

    return announcements.filter(
      (announcement) => Number(announcement.userId) === Number(currentUser.id)
    );
  }, [announcements, currentUser]);

  const updateAnnouncementLikeState = useCallback((announcementId, nextLiked) => {
    setAnnouncements((prev) =>
      prev.map((announcement) => {
        if (announcement.id !== announcementId) {
          return announcement;
        }

        const currentLikeCount = Number(announcement.likeCount ?? 0);
        return {
          ...announcement,
          isLiked: nextLiked,
          likeCount: Math.max(0, currentLikeCount + (nextLiked ? 1 : -1)),
        };
      })
    );
  }, []);

  const handleAuthSuccess = ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setAuthToken(token);
    setCurrentUser(user);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken("");
    setCurrentUser(null);
    setNotifications([]);
    navigate("/");
  };

  const goHome = () => {
    navigate("/");
  };

  const openAuthPage = () => {
    navigate("/auth");
  };

  const openMyAnnouncementsPage = () => {
    if (!authToken) {
      navigate("/auth");
      return;
    }

    navigate("/contul-meu");
  };

  const openFavoritesPage = () => {
    if (!authToken) {
      navigate("/auth");
      return;
    }

    navigate("/favorite");
  };

  const openNotificationsPage = () => {
    if (!authToken) {
      navigate("/auth");
      return;
    }

    loadNotifications();
    navigate("/notificari");
  };

  const openCategoryPage = (selectedCategory, searchQuery = "", locationQuery = "") => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }

    if (locationQuery.trim()) {
      params.set("location", locationQuery.trim());
    }

    const queryString = params.toString();
    const path = `/categorii/${slugifyCategoryName(selectedCategory)}`;
    navigate(queryString ? `${path}?${queryString}` : path);
  };

  const openCreatePage = (category = null) => {
    if (!authToken) {
      navigate("/auth");
      return;
    }

    const search = category ? `?category=${encodeURIComponent(category)}` : "";
    navigate(`/anunt-nou${search}`);
  };

  const handleAddAnnouncement = async (announcement) => {
    if (!authToken) {
      throw new Error("Trebuie sa fii autentificat ca sa publici.");
    }

    const created = await createAnnouncement(authToken, announcement);
    setAnnouncements((prev) => [created, ...prev]);
    navigate(`/categorii/${slugifyCategoryName(created.category)}`);
  };

  const handleToggleLike = async (announcement) => {
    if (!authToken) {
      navigate("/auth");
      return;
    }

    if (likeMutationIds.includes(announcement.id)) {
      return;
    }

    setLikeMutationIds((prev) => [...prev, announcement.id]);

    try {
      const nextLiked = !announcement.isLiked;
      await toggleAnnouncementLike(authToken, announcement.id, announcement.isLiked);
      updateAnnouncementLikeState(announcement.id, nextLiked);
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setLikeMutationIds((prev) => prev.filter((id) => id !== announcement.id));
    }
  };

  const openNotificationAnnouncement = (notification) => {
    openCategoryPage(notification.category, notification.announcementTitle, notification.location);
  };

  const navbarSharedProps = {
    onAuthClick: openAuthPage,
    onOpenMyAnnouncements: openMyAnnouncementsPage,
    onOpenFavorites: openFavoritesPage,
    onOpenNotifications: openNotificationsPage,
    isAuthenticated,
    currentUser,
    favoritesCount: favoriteAnnouncements.length,
    notificationsCount: notifications.length,
    onLogout: handleLogout,
  };

  return (
    <>
      {globalError && (
        <div className="mx-auto mt-4 max-w-6xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          API error: {globalError}.
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onAddAnnouncement={openCreatePage}
              onGoHome={goHome}
              onSelectCategory={openCategoryPage}
              announcements={announcements}
              isLoadingAnnouncements={loadingAnnouncements}
              {...navbarSharedProps}
            />
          }
        />
        <Route
          path="/categorii"
          element={
            <HomePage
              onAddAnnouncement={openCreatePage}
              onGoHome={goHome}
              onSelectCategory={openCategoryPage}
              announcements={announcements}
              isLoadingAnnouncements={loadingAnnouncements}
              {...navbarSharedProps}
            />
          }
        />
        <Route
          path="/categorii/:slug"
          element={
            <CategoryRoute
              announcements={announcements}
              isLoading={loadingAnnouncements}
              onAddAnnouncement={openCreatePage}
              onBackHome={goHome}
              onGoHome={goHome}
              onToggleLike={handleToggleLike}
              pendingLikeIds={likeMutationIds}
              {...navbarSharedProps}
            />
          }
        />
        <Route
          path="/contul-meu"
          element={
            isAuthenticated ? (
              <AnnouncementCollectionPage
                title="Anunturile mele"
                eyebrow="Contul tau"
                description="Toate anunturile publicate din contul tau sunt aici."
                announcements={myAnnouncements}
                emptyMessage="Nu ai publicat niciun anunt pana acum."
                isLoading={loadingAnnouncements}
                onBackHome={goHome}
                onAddAnnouncement={openCreatePage}
                onGoHome={goHome}
                onToggleLike={handleToggleLike}
                pendingLikeIds={likeMutationIds}
                {...navbarSharedProps}
              />
            ) : (
              <Navigate replace to="/auth" />
            )
          }
        />
        <Route
          path="/favorite"
          element={
            isAuthenticated ? (
              <AnnouncementCollectionPage
                title="Anunturile favorite"
                eyebrow="Lista salvata"
                description="Aici vezi toate anunturile pe care le-ai apreciat."
                announcements={favoriteAnnouncements}
                emptyMessage="Nu ai niciun anunt salvat la favorite."
                isLoading={loadingAnnouncements}
                onBackHome={goHome}
                onAddAnnouncement={openCreatePage}
                onGoHome={goHome}
                onToggleLike={handleToggleLike}
                pendingLikeIds={likeMutationIds}
                {...navbarSharedProps}
              />
            ) : (
              <Navigate replace to="/auth" />
            )
          }
        />
        <Route
          path="/notificari"
          element={
            isAuthenticated ? (
              <NotificationsPage
                notifications={notifications}
                isLoading={loadingNotifications}
                onBackHome={goHome}
                onGoHome={goHome}
                onAddAnnouncement={openCreatePage}
                onViewAnnouncement={openNotificationAnnouncement}
                {...navbarSharedProps}
              />
            ) : (
              <Navigate replace to="/auth" />
            )
          }
        />
        <Route
          path="/anunt-nou"
          element={
            authToken ? (
              <CreateAnnouncementRoute
                onAddAnnouncement={handleAddAnnouncement}
                onBackHome={goHome}
                onGoHome={goHome}
                {...navbarSharedProps}
              />
            ) : (
              <Navigate replace to="/auth" />
            )
          }
        />
        <Route
          path="/auth"
          element={
            <AuthRoute
              onAuthSuccess={handleAuthSuccess}
              onBackHome={goHome}
              onGoHome={goHome}
              {...navbarSharedProps}
            />
          }
        />
        <Route
          path="*"
          element={
            <NotFoundPage
              onGoHome={goHome}
              onAddAnnouncement={openCreatePage}
              {...navbarSharedProps}
            />
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
