"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import structuresDataRaw from "@/data/structures.json";
import { StructureItem } from "@/components/atlas/AtlasCanvas";

const structuresData = structuresDataRaw as StructureItem[];

// Dynamic Client Component Loader for Three.js Canvas (No SSR)
const AtlasCanvas = dynamic(() => import("@/components/atlas/AtlasCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white/20 backdrop-blur-md rounded-[28px] p-6 text-center">
      <div className="w-10 h-10 border-3 border-[#06192f]/20 border-t-[#06192f] rounded-full animate-spin mb-3"></div>
      <p className="text-xs font-semibold tracking-tight text-[#06192f]">
        Menyiapkan grafis WebGL Atlas 3D...
      </p>
    </div>
  ),
});

export default function Atlas3DPage() {
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Loading & Error states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number | null>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Triggers for Canvas controls
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [zoomTrigger, setZoomTrigger] = useState<{ type: "in" | "out"; count: number }>({
    type: "in",
    count: 0,
  });

  // Floating label position projected from 3D
  const [floatingPos, setFloatingPos] = useState<{
    x: number;
    y: number;
    visible: boolean;
  } | null>(null);

  const chipsRef = useRef<HTMLDivElement | null>(null);

  // Active structure object
  const activeStructure = useMemo(() => {
    return structuresData.find((s) => s.id === selectedStructureId) || null;
  }, [selectedStructureId]);

  // Scroll active chip into view
  useEffect(() => {
    if (!selectedStructureId || !chipsRef.current) return;
    const activeBtn = chipsRef.current.querySelector(
      `[data-id="${selectedStructureId}"]`
    ) as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedStructureId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dcebfa] via-[#edf5fc] to-[#f5f9fd] text-[#06192f] relative overflow-x-hidden selection:bg-[#06192f] selection:text-white antialiased flex flex-col justify-between">
      {/* =========================================================================
           Teks Bayangan Raksasa Sangat Pucat di Latar Belakang (Watermark Typography)
           ========================================================================= */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <span className="text-[clamp(90px,16vw,260px)] font-black tracking-tighter text-[#06192f]/[0.028] whitespace-nowrap transform -rotate-2">
          MEMBRUM
        </span>
      </div>

      {/* =========================================================================
           Header / Navbar (Sama persis dengan Hero PRIMA, 'Atlas 3D' Aktif)
           ========================================================================= */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06192f] rounded-xl"
            aria-label="PRIMA — Platform Review Interaktif Medis Adaptif"
          >
            <div className="w-8 h-8 rounded-lg bg-[#06192f] text-white flex items-center justify-center font-extrabold text-base shadow-[0_3px_8px_rgba(6,25,47,0.16)] group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#06192f]">PRIMA</span>
          </Link>

          {/* Glass Pill Nav (Tepat di Tengah, 'Atlas 3D' Aktif) */}
          <nav
            className="hidden md:flex items-center gap-1 p-1 bg-white/40 border border-white/60 backdrop-blur-md rounded-full shadow-[0_2px_12px_rgba(26,48,78,0.04)]"
            aria-label="Navigasi Utama"
          >
            <Link
              href="/atlas"
              className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight bg-white text-[#06192f] shadow-sm transition-all"
              aria-current="page"
            >
              Atlas 3D
            </Link>
            <Link
              href="/#cara-belajar"
              className="px-4 py-1.5 rounded-full text-xs font-medium tracking-tight text-slate-600 hover:text-[#06192f] hover:bg-white/60 transition-all"
            >
              Cara Belajar
            </Link>
            <Link
              href="/#kurikulum"
              className="px-4 py-1.5 rounded-full text-xs font-medium tracking-tight text-slate-600 hover:text-[#06192f] hover:bg-white/60 transition-all"
            >
              Kurikulum FK
            </Link>
            <Link
              href="/#faq"
              className="px-4 py-1.5 rounded-full text-xs font-medium tracking-tight text-slate-600 hover:text-[#06192f] hover:bg-white/60 transition-all"
            >
              FAQ
            </Link>
          </nav>

          {/* Masuk Button Pill */}
          <Link
            href="/beranda"
            className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full bg-white/45 border border-white/60 backdrop-blur-md hover:bg-white/70 transition-all shadow-[0_2px_12px_rgba(26,48,78,0.04)] text-xs font-semibold text-[#06192f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06192f]"
            aria-label="Masuk ke aplikasi PRIMA"
          >
            <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs text-[#06192f]">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <span>Masuk Aplikasi</span>
          </Link>
        </div>
      </header>

      {/* =========================================================================
           Area Konten Utama: Layout Asimetris (Panggung 3D ~65% + Panel Info Kanan)
           ========================================================================= */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col justify-between">
        {/* Header Halaman: Judul Tipis Sans-Serif + Indeks /01 */}
        <div className="mb-3 sm:mb-4 flex items-baseline justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold tracking-wider text-[#06192f]/60 uppercase">
                Modul Pembelajaran
              </span>
              <span className="text-xs font-extrabold tracking-tight text-[#06192f]">/01</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-[#06192f]">
              Atlas anatomi <span className="font-normal text-slate-500">— anggota gerak atas</span>
            </h1>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-xs font-semibold tracking-tight px-3 py-1 rounded-full bg-white/50 border border-white/60 text-slate-600 backdrop-blur-xs">
              Regio Membrum Superius
            </span>
          </div>
        </div>

        {/* Layout Asimetris: Panggung 3D (Kiri) + Panel Terpilih (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start flex-1">
          {/* =====================================================================
               PANGGUNG 3D (Memenuhi ~65% Layar, Seamless Menyatu dengan Latar)
               ===================================================================== */}
          <section
            className="lg:col-span-8 flex flex-col gap-3 relative"
            aria-label="Kanvas Interaktif Anatomi 3D"
          >
            {/* Wadah Kanvas 3D */}
            <div className="relative w-full h-[55vh] sm:h-[62vh] lg:h-[66vh] rounded-[28px] bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-[2px] overflow-hidden flex items-center justify-center">
              {/* Dynamic Three.js Canvas */}
              <AtlasCanvas
                structures={structuresData}
                selectedStructureId={selectedStructureId}
                onSelectStructure={setSelectedStructureId}
                autoRotate={autoRotate}
                onAutoRotateChange={setAutoRotate}
                showLabels={showLabels}
                onLoadingProgress={(pct) => {
                  setLoadingProgress(pct);
                  if (pct !== null && pct >= 100) {
                    setIsLoading(false);
                  }
                }}
                onLoadSuccess={() => {
                  setIsLoading(false);
                  setHasError(false);
                }}
                onLoadError={(err) => {
                  setIsLoading(false);
                  setHasError(true);
                  setErrorMessage(err);
                }}
                resetTrigger={resetTrigger}
                zoomTrigger={zoomTrigger}
                onFloatingLabelChange={setFloatingPos}
              />

              {/* Label Mengambang 2D (Floating HTML Label Mengikuti Struktur 3D) */}
              {showLabels && activeStructure && floatingPos && floatingPos.visible && (
                <div
                  className="absolute top-0 left-0 -translate-x-1/2 -translate-y-full transition-opacity duration-200 z-20 pointer-events-none"
                  style={{
                    transform: `translate3d(${floatingPos.x}px, ${floatingPos.y}px, 0)`,
                  }}
                  aria-hidden="true"
                >
                  <div className="px-3 py-1.5 rounded-full bg-[#06192f]/90 text-white backdrop-blur-md shadow-lg border border-white/20 flex items-center gap-2 whitespace-nowrap">
                    <span className="text-xs font-bold tracking-tight">{activeStructure.latin}</span>
                    <span className="text-[10px] text-slate-300 font-normal">/</span>
                    <span className="text-[11px] text-slate-200 font-normal">
                      {activeStructure.id_name}
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-[#06192f]/90 rotate-45 mx-auto -mt-1 shadow-xs border-r border-b border-white/20"></div>
                </div>
              )}

              {/* Loading Skeleton dengan Progres Persen */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30 transition-opacity duration-300">
                  <div className="w-10 h-10 border-3 border-[#06192f]/20 border-t-[#06192f] rounded-full animate-spin"></div>
                  <div className="text-center">
                    <p className="text-xs font-semibold tracking-tight text-[#06192f]">
                      {loadingProgress !== null
                        ? `Memuat model 3D... ${loadingProgress}%`
                        : "Menyiapkan anatomi 3D..."}
                    </p>
                    <div className="w-48 h-1.5 bg-white/70 rounded-full mt-2 overflow-hidden border border-white/60">
                      <div
                        className="h-full bg-[#06192f] rounded-full transition-all duration-200"
                        style={{ width: `${loadingProgress ?? 75}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Kartu Penjelasan Error Ramah (Bahasa Indonesia) */}
              {hasError && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
                  <div className="max-w-md p-6 sm:p-7 rounded-3xl bg-white/80 border border-white/80 shadow-[0_12px_36px_rgba(6,25,47,0.08)]">
                    <h3 className="text-base font-bold text-[#06192f] mb-2 tracking-tight">
                      Model 3D Belum Dapat Ditampilkan
                    </h3>
                    <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                      {errorMessage ||
                        "Berkas model anatomi belum dapat dimuat dari penyimpanan lokal atau peramban tidak mendukung akselerasi WebGL."}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setHasError(false);
                        setIsLoading(true);
                        setResetTrigger((c) => c + 1);
                      }}
                      className="px-5 py-2.5 rounded-full bg-[#06192f] text-white text-xs font-semibold tracking-tight hover:bg-[#0a2340] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06192f]"
                    >
                      Coba Muat Ulang
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ===================================================================
                 Bar Kontrol Kaca Berbentuk Pill di Bawah Panggung
                 =================================================================== */}
            <div
              className="flex items-center justify-between gap-2 p-1.5 rounded-full bg-white/45 border border-white/60 backdrop-blur-md shadow-[0_4px_16px_rgba(6,25,47,0.03)]"
              role="toolbar"
              aria-label="Kontrol Tampilan 3D"
            >
              {/* Tombol Putar Otomatis */}
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06192f] ${
                  autoRotate ? "bg-[#06192f] text-white" : "bg-white/45 text-[#06192f] hover:bg-white/80"
                }`}
                aria-pressed={autoRotate}
              >
                Putar otomatis
              </button>

              {/* Grup Kontrol Zoom & Reset */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setZoomTrigger((prev) => ({ type: "in", count: prev.count + 1 }))
                  }
                  className="w-8 h-8 rounded-full bg-white/50 border border-white/60 text-[#06192f] hover:bg-white/80 flex items-center justify-center font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06192f]"
                  aria-label="Perbesar tampilan model"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setZoomTrigger((prev) => ({ type: "out", count: prev.count + 1 }))
                  }
                  className="w-8 h-8 rounded-full bg-white/50 border border-white/60 text-[#06192f] hover:bg-white/80 flex items-center justify-center font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06192f]"
                  aria-label="Perkecil tampilan model"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStructureId(null);
                    setResetTrigger((prev) => prev + 1);
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight bg-white/50 border border-white/60 text-[#06192f] hover:bg-white/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06192f]"
                >
                  Reset tampilan
                </button>
              </div>

              {/* Tombol Toggle Label */}
              <button
                type="button"
                onClick={() => setShowLabels(!showLabels)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06192f] ${
                  showLabels ? "bg-[#06192f] text-white" : "bg-white/45 text-[#06192f] hover:bg-white/80"
                }`}
                aria-pressed={showLabels}
              >
                Tampilkan label
              </button>
            </div>

            {/* ===================================================================
                 Daftar Struktur Sebagai Chip Horizontal (Scrollable & Alternatif Akses)
                 =================================================================== */}
            <div className="w-full">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold tracking-tight text-slate-500 uppercase">
                  Pilih Struktur:
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Klik chip atau langsung sentuh tulang pada model 3D
                </span>
              </div>
              <div
                ref={chipsRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
                role="listbox"
                aria-label="Daftar struktur tulang yang dapat dipilih"
              >
                {structuresData.map((struct) => {
                  const isActive = selectedStructureId === struct.id;
                  return (
                    <button
                      key={struct.id}
                      data-id={struct.id}
                      type="button"
                      onClick={() =>
                        setSelectedStructureId(isActive ? null : struct.id)
                      }
                      className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06192f] ${
                        isActive
                          ? "bg-[#06192f] text-white shadow-md"
                          : "border border-white/60 bg-white/45 text-[#06192f] hover:bg-white/80"
                      }`}
                      aria-label={`Pilih tulang ${struct.id_name} (${struct.latin})`}
                      aria-selected={isActive}
                    >
                      <span>{struct.latin}</span>{" "}
                      <span
                        className={`font-normal text-[11px] ${
                          isActive ? "text-slate-300" : "text-slate-400"
                        }`}
                      >
                        / {struct.id_name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* =====================================================================
               PANEL KANAN / BOTTOM SHEET (Struktur Terpilih)
               ===================================================================== */}
          <aside className="lg:col-span-4 w-full" aria-label="Informasi Struktur Terpilih">
            <div className="w-full p-6 sm:p-7 rounded-3xl bg-white/55 border border-white/70 backdrop-blur-xl shadow-[0_12px_36px_rgba(6,25,47,0.06)] flex flex-col justify-between min-h-[280px] lg:min-h-[460px] transition-all">
              {/* Header Panel */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#06192f]/70">
                    Struktur Terpilih
                  </span>
                  <span className="text-xs font-extrabold text-[#06192f]">/02</span>
                </div>

                {/* Kontainer State (aria-live="polite" untuk pembaca layar) */}
                <div aria-live="polite">
                  {/* State 1: Belum Ada Pilihan */}
                  {!activeStructure ? (
                    <div className="py-10 text-center flex flex-col items-center justify-center">
                      <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-[260px]">
                        Klik bagian tulang pada panggung 3D atau pilih chip di bawah untuk melihat namanya.
                      </p>
                      <div className="mt-4 px-3 py-1 rounded-full bg-white/50 border border-white/60 text-[11px] font-semibold text-slate-500">
                        Navigasi 3D Aktif
                      </div>
                    </div>
                  ) : (
                    /* State 2: Struktur Terpilih */
                    <div className="flex flex-col gap-4">
                      {/* Nama Latin & Indonesia */}
                      <div>
                        <span className="italic text-xs font-semibold text-slate-500 block mb-1">
                          {activeStructure.latin}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#06192f] leading-tight">
                          {activeStructure.id_name}
                        </h2>
                      </div>

                      {/* Regio Anatomi */}
                      <div className="py-2 px-3 rounded-2xl bg-white/50 border border-white/60">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Regio
                        </span>
                        <span className="text-xs font-semibold text-[#06192f]">
                          {activeStructure.region}
                        </span>
                      </div>

                      {/* Keterangan Anatomi Singkat */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                          Deskripsi Anatomi
                        </span>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {activeStructure.note}
                        </p>
                      </div>

                      {/* Label Validasi Medis */}
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                          Perlu divalidasi dosen
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Petunjuk Gestur / Aksesibilitas di Bawah Panel */}
              <div className="pt-4 mt-6 border-t border-white/50 text-[11px] text-slate-400 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span>Putar tampilan:</span>
                  <span className="text-slate-600 font-medium">1 jari / seret mouse</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Perbesar (zoom):</span>
                  <span className="text-slate-600 font-medium">2 jari / scroll mouse</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* =========================================================================
           Footer Minimalis PRIMA
           ========================================================================= */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-400 border-t border-white/40">
        PRIMA MedTech &copy; 2026 &bull; Modul Penunjang Belajar Anatomi Mahasiswa Kedokteran
      </footer>
    </div>
  );
}
