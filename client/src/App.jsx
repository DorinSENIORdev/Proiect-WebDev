import { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import AnnouncementFormPage from "./AnnouncementFormPage";
import AuthPage from "./AuthPage";
import CategoryPage from "./CategoryPage";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HomePage from "./HomePage";
import "./index.css";
import { categories, findCategoryBySlug, slugifyCategoryName } from "./data/categories";
import { createAnnouncement, fetchAnnouncements, fetchMe } from "./lib/api";

const TOKEN_KEY = "easysell_auth_token";

function NotFoundPage({
  onGoHome,
  onAddAnnouncement,
  onAuthClick,
  isAuthenticated,
  currentUser,
  onLogout,
}) {
  return (
    <div className="min-h-screen">
      <Navbar
        onAddAnnouncement={onAddAnnouncement}
        onLogoClick={onGoHome}
        onAuthClick={onAuthClick}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
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
  const category = slug ? findCategoryBySlug(slug) : null;

  if (!category) {
    return <NotFoundPage {...props} />;
  }

  return (
    <CategoryPage
      {...props}
      category={category.name}
      onAddAnnouncement={() => props.onAddAnnouncement(category.name)}
    />
  );
}

function AppContent() {
  const [announcements, setAnnouncements] = useState([]);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? "");
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [globalError, setGlobalError] = useState("");
  const navigate = useNavigate();

  const loadAnnouncements = useCallback(async () => {
    setLoadingAnnouncements(true);
    setGlobalError("");
    try {
      const items = await fetchAnnouncements();
      setAnnouncements(items);
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setLoadingAnnouncements(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  useEffect(() => {
    if (!authToken) {
      setCurrentUser(null);
      return;
    }

    fetchMe(authToken)
      .then((user) => setCurrentUser(user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken("");
        setCurrentUser(null);
      });
  }, [authToken]);

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
    navigate("/");
  };

  const goHome = () => {
    navigate("/");
  };

  const openAuthPage = () => {
    navigate("/auth");
  };

  const openCategoryPage = (category) => {
    navigate(`/categorii/${slugifyCategoryName(category)}`);
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

  return (
    <>
      {globalError && (
        <div className="mx-auto mt-4 max-w-6xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          API error: {globalError}. Verifica daca server-ul backend ruleaza.
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
              isAuthenticated={Boolean(authToken)}
              currentUser={currentUser}
              onAuthClick={openAuthPage}
              onLogout={handleLogout}
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
              isAuthenticated={Boolean(authToken)}
              currentUser={currentUser}
              onAuthClick={openAuthPage}
              onLogout={handleLogout}
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
              isAuthenticated={Boolean(authToken)}
              currentUser={currentUser}
              onAuthClick={openAuthPage}
              onLogout={handleLogout}
            />
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
                isAuthenticated={Boolean(authToken)}
                currentUser={currentUser}
                onAuthClick={openAuthPage}
                onLogout={handleLogout}
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
              onAuthClick={openAuthPage}
              isAuthenticated={Boolean(authToken)}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="*"
          element={
            <NotFoundPage
              onGoHome={goHome}
              onAddAnnouncement={openCreatePage}
              onAuthClick={openAuthPage}
              isAuthenticated={Boolean(authToken)}
              currentUser={currentUser}
              onLogout={handleLogout}
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
