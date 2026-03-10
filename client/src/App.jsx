import { useCallback, useEffect, useState } from "react";
import AnnouncementFormPage from "./AnnouncementFormPage";
import AuthPage from "./AuthPage";
import CategoryPage from "./CategoryPage";
import Footer from "./components/Footer";
import HomePage from "./HomePage";
import "./index.css";
import { createAnnouncement, fetchAnnouncements, fetchMe } from "./lib/api";

const TOKEN_KEY = "easysell_auth_token";

export default function App() {
  const [page, setPage] = useState({ type: "home", category: null, mode: "login" });
  const [announcements, setAnnouncements] = useState([]);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? "");
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [globalError, setGlobalError] = useState("");

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
    setPage({ type: "home", category: null, mode: "login" });
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken("");
    setCurrentUser(null);
    setPage({ type: "home", category: null, mode: "login" });
  };

  const openCreatePage = () => {
    if (!authToken) {
      setPage({ type: "auth", category: null, mode: "login" });
      return;
    }
    setPage({ type: "create", category: null, mode: "login" });
  };

  const handleAddAnnouncement = async (announcement) => {
    if (!authToken) {
      throw new Error("Trebuie sa fii autentificat ca sa publici.");
    }

    const created = await createAnnouncement(authToken, announcement);
    setAnnouncements((prev) => [created, ...prev]);
    setPage({ type: "category", category: created.category, mode: "login" });
  };

  return (
    <>
      {globalError && (
        <div className="mx-auto mt-4 max-w-6xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          API error: {globalError}. Verifica daca server-ul backend ruleaza.
        </div>
      )}

      {page.type === "home" && (
        <HomePage
          onAddAnnouncement={openCreatePage}
          onGoHome={() => setPage({ type: "home", category: null, mode: "login" })}
          onSelectCategory={(category) => setPage({ type: "category", category, mode: "login" })}
          isAuthenticated={Boolean(authToken)}
          currentUser={currentUser}
          onAuthClick={() => setPage({ type: "auth", category: null, mode: "login" })}
          onLogout={handleLogout}
        />
      )}

      {page.type === "create" && (
        <AnnouncementFormPage
          initialCategory={page.category}
          onAddAnnouncement={handleAddAnnouncement}
          onBackHome={() => setPage({ type: "home", category: null, mode: "login" })}
          onGoHome={() => setPage({ type: "home", category: null, mode: "login" })}
          isAuthenticated={Boolean(authToken)}
          currentUser={currentUser}
          onAuthClick={() => setPage({ type: "auth", category: null, mode: "login" })}
          onLogout={handleLogout}
        />
      )}

      {page.type === "category" && (
        <CategoryPage
          announcements={announcements}
          isLoading={loadingAnnouncements}
          category={page.category}
          onAddAnnouncement={openCreatePage}
          onBackHome={() => setPage({ type: "home", category: null, mode: "login" })}
          onGoHome={() => setPage({ type: "home", category: null, mode: "login" })}
          isAuthenticated={Boolean(authToken)}
          currentUser={currentUser}
          onAuthClick={() => setPage({ type: "auth", category: null, mode: "login" })}
          onLogout={handleLogout}
        />
      )}

      {page.type === "auth" && (
        <AuthPage
          defaultMode={page.mode}
          onAuthSuccess={handleAuthSuccess}
          onBackHome={() => setPage({ type: "home", category: null, mode: "login" })}
          onGoHome={() => setPage({ type: "home", category: null, mode: "login" })}
          onAuthClick={() => setPage({ type: "auth", category: null, mode: "login" })}
          isAuthenticated={Boolean(authToken)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
      <Footer />
    </>
  );
}
