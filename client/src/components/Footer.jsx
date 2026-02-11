export default function Footer() {
  return (
    <footer className="brand-gradient-bg mt-8 border-t border-white/10 text-slate-100">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-[1fr_auto] md:items-center">
        <div className="glass-panel-dark p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            Proiect WebDev
          </p>
          <h3 className="mt-2 text-2xl font-black text-white md:text-3xl">
            EasySell - platforma de anunturi locale
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200">
            Acest proiect a fost implementat de <span className="font-bold text-white">Betivu Dorin</span>,
            student la <span className="font-bold text-white">Universitatea de Stat "Alecu Russo" din Balti</span>,
            grupa <span className="font-bold text-white">IS21Z</span>.
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Dezvoltat cu pasiune in orasul Balti, Republica Moldova.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-200/35 bg-emerald-300/15 px-3 py-1 text-xs font-semibold text-emerald-200">
              USARB
            </span>
            <span className="rounded-full border border-cyan-200/35 bg-cyan-300/15 px-3 py-1 text-xs font-semibold text-cyan-200">
              Grupa IS21Z
            </span>
            <span className="rounded-full border border-amber-200/35 bg-amber-300/15 px-3 py-1 text-xs font-semibold text-amber-100">
              Balti
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
