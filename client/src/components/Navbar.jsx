import { Bell, Heart, Menu, Plus, User, X } from "lucide-react";
import { useState } from "react";
import EasySellIcon from "./EasySellIcon";

const BRAND = {
  name: "EasySell",
};

export default function Navbar({
  onAddAnnouncement,
  onLogoClick = () => {},
  showAddButton = true,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="brand-gradient-bg sticky top-0 z-50 border-b border-white/10 shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <button
          className="flex items-center gap-3 rounded-xl p-1 text-left transition hover:bg-white/10"
          onClick={() => {
            setIsMobileMenuOpen(false);
            onLogoClick();
          }}
          type="button"
        >
          <EasySellIcon size={42} />
          <div className="text-white">
            <div className="text-xl font-black leading-none">{BRAND.name}</div>
            <div className="text-xs text-white/70">Cumpara si vinde simplu</div>
          </div>
        </button>

        <div className="flex items-center gap-2 text-white">
          <button
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Inchide meniul" : "Deschide meniul"}
            className="btn-icon-luxe md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            type="button"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <button
              className="btn-icon-luxe"
              type="button"
            >
              <Heart size={20} />
            </button>
            <button
              className="btn-icon-luxe"
              type="button"
            >
              <Bell size={20} />
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-white/90 transition duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:text-white"
              type="button"
            >
              <User size={19} />
              <span>Contul meu</span>
            </button>
            {showAddButton && (
              <>
                <div className="h-6 w-px bg-white/20" />
                <button
                  className="btn-primary-luxe !py-2"
                  onClick={onAddAnnouncement}
                  type="button"
                >
                  <Plus size={18} />
                  Adauga anunt
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-slate-950/35 px-4 pb-4 md:hidden">
          <div className="mx-auto mt-3 grid max-w-6xl gap-2 rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur">
            <button
              className="btn-secondary-luxe !justify-start !border-white/20 !bg-white/95"
              onClick={() => setIsMobileMenuOpen(false)}
              type="button"
            >
              <User size={17} />
              Contul meu
            </button>
            <button
              className="btn-secondary-luxe !justify-start !border-white/20 !bg-white/95"
              type="button"
            >
              <Heart size={17} />
              Favorite
            </button>
            <button
              className="btn-secondary-luxe !justify-start !border-white/20 !bg-white/95"
              type="button"
            >
              <Bell size={17} />
              Notificari
            </button>
            {showAddButton && (
              <button
                className="btn-primary-luxe !justify-start"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onAddAnnouncement?.();
                }}
                type="button"
              >
                <Plus size={17} />
                Adauga anunt
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
