"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { mockUserProfile, mockDashboardStats } from "@/lib/mock-data";

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard Belajar",
    subtitle: "Ringkasan retensi memori dan rekomendasi latihan adaptif",
  },
  "/latihan": {
    title: "Latihan Anatomi 3D",
    subtitle: "Eksplorasi model 3D dan kuis identifikasi struktur",
  },
  "/perencana": {
    title: "Perencana Belajar",
    subtitle: "Penjadwalan target harian dan persiapan tanggal ujian",
  },
  "/kelemahan": {
    title: "Peta Kelemahan Topik",
    subtitle: "Analisis diagnostik materi yang membutuhkan repetisi intensif",
  },
  "/pengaturan": {
    title: "Pengaturan Akun",
    subtitle: "Preferensi interval repetisi dan profil mahasiswa",
  },
};

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const pathname = usePathname();
  const [notificationOpen, setNotificationOpen] = useState(false);

  const currentPage = pageTitles[pathname] || {
    title: "PRIMA Medika",
    subtitle: "Platform Review Interaktif Medis Adaptif",
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight">
              {currentPage.title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 dark:border dark:border-teal-800">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              Preklinik Smt {mockUserProfile.semester}
            </span>
          </div>
          <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {currentPage.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Notification & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Review Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300">
          <Clock className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          <span>
            Target Ujian: <strong className="text-slate-800 dark:text-slate-100">{mockDashboardStats.daysUntilExam} hari lagi</strong>
          </span>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition"
            aria-label="Lihat Notifikasi"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
              3
            </span>
          </button>

          {/* Notification Popup Dropdown */}
          {notificationOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setNotificationOpen(false)}
              />
              <div className="absolute right-0 mt-2 z-40 w-80 sm:w-96 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Notifikasi Belajar
                    </span>
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                      3 Baru
                    </span>
                  </div>
                  <button
                    onClick={() => setNotificationOpen(false)}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Tutup
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mt-2 text-xs">
                  <div className="py-2.5 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 shrink-0">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        12 Item Jatuh Tempo Hari Ini
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Pleksus brakialis perlu repetisi agar tidak terlupa sebelum ujian.
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">15 menit lalu</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Rekomendasi Adaptif Baru
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Sistem menyiapkan 3 kuis 3D untuk Rotator Cuff.
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">1 jam lalu</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Streak 5 Hari Tercapai!
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Konsistensi belajarmu meningkat 18% dibanding minggu lalu.
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Kemarin</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700/80" />

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="relative">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white font-bold text-sm shadow-xs overflow-hidden">
              R
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" />
          </div>

          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {mockUserProfile.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
              {mockUserProfile.institution}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
