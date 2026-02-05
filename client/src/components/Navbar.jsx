import React from "react";
import { MessageCircle, Heart, Bell, User, Plus } from "lucide-react";
import { Search, MapPin } from "lucide-react";
import EasySellIcon from "./EasySellIcon";



const BRAND = {
  name: "EasySell",
  dark: "#121826",
  dark2: "#0B1220",
  accent: "#7C3AED",
};


export default function Navbar() {
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

        {/* Icons (desktop) */}
        <nav className="hidden items-right gap-5 text-white/85 md:flex">
          <button className="hover:text-white" type="button" aria-label="Favorite">
            <Heart size={18} />
          </button>
          <button className="hover:text-white" type="button" aria-label="Notificări">
            <Bell size={18} />
          </button>
          <button className="flex items-center gap-2 hover:text-white" type="button">
            <User size={18} /> Contul tău
          </button>
        </nav>

        {/* Add button */}
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:shadow-md"
          type="button"
          onClick={() => alert("Mai târziu: pagina de adăugat anunț")}
        >
          <Plus size={18} />
          Adaugă anunț nou
        </button>
      </div>
    </header>
  );
}
