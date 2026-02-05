import React from "react";
import { Heart, Bell, User, Plus } from "lucide-react";
import EasySellIcon from "./EasySellIcon";



const BRAND = {
  name: "EasySell",
  dark: "#121826",
  dark2: "#0B1220",
  accent: "#7C3AED",
};


export default function Navbar({ onAddAnnouncement, showAddButton = true }) {
  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10"
      style={{ background: `linear-gradient(180deg, ${BRAND.dark}, ${BRAND.dark2})` }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <EasySellIcon size={40} />

          <div className="text-white">
            <div className="text-lg font-extrabold leading-none">{BRAND.name}</div>
            <div className="text-xs text-white/70">Cumpără & vinde simplu</div>
          </div>
        </div>

      <div className="flex items-center gap-2 text-white">
        {showAddButton && (
          <button
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm md:hidden"
            onClick={onAddAnnouncement}
            type="button"
          >
            <Plus size={18} />
            Anunț
          </button>
        )}

        <div className="hidden items-center gap-5 md:flex">
          <button className="rounded-full p-2 hover:bg-white/10" type="button">
            <Heart size={20} />
          </button>

          <button className="rounded-full p-2 hover:bg-white/10" type="button">
            <Bell size={20} />
          </button>

          <button
            className="flex items-center gap-2 rounded-full p-2 hover:bg-white/10"
            type="button"
          >
            <User size={20} />
            <span className="text-sm">Contul meu</span>
          </button>

          {showAddButton && (
            <>
              <div className="h-6 w-px bg-white/20" />
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:shadow-md"
                onClick={onAddAnnouncement}
                type="button"
              >
                <Plus size={18} />
                Adaugă anunț
              </button>
            </>
          )}
        </div>
      </div>
      </div>
    </header>
  );
}
