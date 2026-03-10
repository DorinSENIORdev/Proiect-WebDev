import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import Navbar from "./components/Navbar";
import { loginUser, registerUser } from "./lib/api";

const INPUT_STYLE =
  "rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

export default function AuthPage({
  defaultMode = "login",
  onAuthSuccess,
  onBackHome,
  onGoHome,
  onAuthClick,
  isAuthenticated,
  currentUser,
  onLogout,
}) {
  const [mode, setMode] = useState(defaultMode === "register" ? "register" : "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMode(defaultMode === "register" ? "register" : "login");
  }, [defaultMode]);

  const title = useMemo(() => {
    return mode === "login" ? "Autentificare" : "Creare cont";
  }, [mode]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim() || (mode === "register" && !name.trim())) {
      setError("Completeaza toate campurile necesare.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = mode === "register" ? { name, email, password } : { email, password };
      const data = mode === "register" ? await registerUser(payload) : await loginUser(payload);

      onAuthSuccess?.(data);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar
        onLogoClick={onGoHome}
        showAddButton={false}
        onAuthClick={onAuthClick}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main className="mx-auto max-w-xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Cont EasySell
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-900 md:text-4xl">{title}</h1>
          </div>
          <button className="btn-secondary-luxe" onClick={onBackHome} type="button">
            <ArrowLeft size={16} />
            Inapoi
          </button>
        </div>

        <div className="mt-6 inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              mode === "login" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              mode === "register"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
            onClick={() => setMode("register")}
            type="button"
          >
            Register
          </button>
        </div>

        <form
          className="mt-4 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          onSubmit={handleSubmit}
        >
          {mode === "register" && (
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Nume
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={INPUT_STYLE}
                placeholder="Ex: Ion Popescu"
              />
            </label>
          )}

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={INPUT_STYLE}
              placeholder="Ex: ion@email.com"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Parola
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={INPUT_STYLE}
              placeholder="Minim 6 caractere"
            />
          </label>

          <button className="btn-primary-luxe" type="submit" disabled={isSubmitting}>
            {mode === "login" ? <LogIn size={17} /> : <UserPlus size={17} />}
            {isSubmitting
              ? "Se proceseaza..."
              : mode === "login"
                ? "Intra in cont"
                : "Creeaza cont"}
          </button>

          {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
        </form>
      </main>
    </div>
  );
}
