"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import ChartJS from "chart.js/auto";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  mock14DaySchedule,
  mockAnatomyRegions,
  DaySchedule,
  DayTargetItem,
} from "@/lib/mock-data";

// Data Onboarding Aktif yang Mendasari Rencana AI
interface OnboardingSummary {
  selectedRegionIds: string[];
  examName: string;
  examDate: string;
  dailyHours: number;
  studyDays: string[];
}

const defaultOnboardingData: OnboardingSummary = {
  selectedRegionIds: ["reg-caput", "reg-thorax", "reg-membrum"],
  examName: "Ujian Blok Anatomi & Muskuloskeletal",
  examDate: "2026-11-20",
  dailyHours: 2.0,
  studyDays: ["Sen", "Sel", "Rab", "Kam", "Jum"],
};

export default function RencanaBelajarPage() {
  // State onboarding data & state rencana
  const [hasPlan, setHasPlan] = useState<boolean>(true);
  const [onboardingData, setOnboardingData] = useState<OnboardingSummary>(defaultOnboardingData);
  const [schedule, setSchedule] = useState<DaySchedule[]>(mock14DaySchedule);
  const [selectedDayId, setSelectedDayId] = useState<string>("day-01");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State simulasi susun ulang AI (loading 2-3 detik dengan pesan bertahap)
  const [isReorganizing, setIsReorganizing] = useState<boolean>(false);
  const [reorganizeStepMsg, setReorganizeStepMsg] = useState<string>("");

  const chartRef = useRef<HTMLCanvasElement | null>(null);

  // Selected Day data
  const selectedDay = useMemo(() => {
    return schedule.find((d) => d.id === selectedDayId) || schedule[0];
  }, [schedule, selectedDayId]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Hitung sisa hari menuju ujian & tanggal format (dihitung dalam effect agar stabil saat prerendering)
  const [daysUntilExam, setDaysUntilExam] = useState<number>(14);
  const [formattedExamDate, setFormattedExamDate] = useState<string>("20 Nov 2026");

  useEffect(() => {
    if (!onboardingData.examDate) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(onboardingData.examDate);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setDaysUntilExam(diff > 0 ? diff : 14);
    try {
      setFormattedExamDate(
        target.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
    } catch {
      setFormattedExamDate(onboardingData.examDate);
    }
  }, [onboardingData.examDate]);

  // Toggle checklist target harian (local state)
  const handleToggleTarget = (dayId: string, targetId: string) => {
    setSchedule((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        const updatedTargets = day.targets.map((t) =>
          t.id === targetId ? { ...t, completed: !t.completed } : t
        );
        return { ...day, targets: updatedTargets };
      })
    );
  };

  // Simulasi Susun Ulang Rencana oleh AI (2–3 Detik)
  const handleReorganizePlan = () => {
    setIsReorganizing(true);
    setReorganizeStepMsg("Menganalisis kembali beban belajar dan sisa hari menuju ujian...");

    setTimeout(() => {
      setReorganizeStepMsg("Menyesuaikan distribusi repetisi antar regio dan preferensi aktivitas...");
    }, 900);

    setTimeout(() => {
      setReorganizeStepMsg("Menyusun jadwal 14 hari yang optimal dan adaptif...");
    }, 1800);

    setTimeout(() => {
      setIsReorganizing(false);
      // Reset checklist untuk simulasi penyusunan ulang
      setSchedule((prev) =>
        prev.map((day, idx) => ({
          ...day,
          targets: day.targets.map((t) => ({ ...t, completed: idx === 0 && t.id === "t-01-1" })),
        }))
      );
      showToast("Rencana belajar berhasil disusun ulang secara adaptif oleh AI!");
    }, 2600);
  };

  // Kalkulasi statistik ringkas hari terpilih
  const selectedDayTotal = selectedDay ? selectedDay.targets.length : 0;
  const selectedDayCompleted = selectedDay
    ? selectedDay.targets.filter((t) => t.completed).length
    : 0;
  const selectedDayPercent =
    selectedDayTotal > 0
      ? Math.round((selectedDayCompleted / selectedDayTotal) * 100)
      : 0;

  // Chart.js: Grafik Beban Belajar 14 Hari
  useEffect(() => {
    if (!hasPlan || !chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const bgColors = schedule.map((item) => {
      if (item.id === selectedDayId) {
        return "#0d6efd"; // Aktif dipilih
      }
      if (item.isHeavyLoad) {
        return "#cc7a00"; // Beban tinggi
      }
      return "#93c5fd"; // Normal
    });

    const chartInstance = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: schedule.map((d) => d.formattedDate),
        datasets: [
          {
            label: "Beban Item",
            data: schedule.map((d) => d.totalItems),
            backgroundColor: bgColors,
            borderRadius: {
              topLeft: 4,
              topRight: 4,
              bottomLeft: 0,
              bottomRight: 0,
            },
            borderSkipped: false,
            barPercentage: 0.6,
            categoryPercentage: 0.85,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (_, elements) => {
          if (elements && elements.length > 0) {
            const index = elements[0].index;
            if (schedule[index]) {
              setSelectedDayId(schedule[index].id);
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e293b",
            titleFont: { size: 12, family: "'Inter', sans-serif" },
            bodyFont: { size: 12, family: "'Inter', sans-serif" },
            padding: 8,
            cornerRadius: 4,
            callbacks: {
              title: (items) => {
                const idx = items[0].dataIndex;
                return `${schedule[idx].dayName}, ${schedule[idx].formattedDate}`;
              },
              label: (context) => {
                const idx = context.dataIndex;
                const isHeavy = schedule[idx].isHeavyLoad;
                return ` ${context.parsed.y} item target ${isHeavy ? "(Beban Padat ⚠️)" : ""}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: "#e2e8f0" },
            ticks: {
              font: { size: 11, family: "'Inter', sans-serif" },
              color: "#64748b",
              padding: 6,
            },
          },
          y: {
            min: 0,
            max: 35,
            border: { display: false },
            grid: { color: "#f1f5f9" },
            ticks: {
              stepSize: 10,
              font: { size: 11, family: "'Inter', sans-serif" },
              color: "#64748b",
              padding: 8,
            },
          },
        },
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, [schedule, selectedDayId, hasPlan]);

  // Helper render ikon dan badge aktivitas PRD
  const renderActivityMeta = (target: DayTargetItem) => {
    switch (target.activityType) {
      case "materi":
        return {
          icon: "bi bi-journal-text",
          iconColor: "text-[#0d6efd] bg-[#eff6ff]",
          badgeText: "Rangkuman AI",
          badgeColor: "bg-[#eff6ff] text-[#1e40af] border-[#dbeafe]",
        };
      case "soal":
        return {
          icon: "bi bi-question-circle",
          iconColor: "text-[#198754] bg-[#f0fdf4]",
          badgeText: "Latihan Soal",
          badgeColor: "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]",
        };
      case "flashcard":
        return {
          icon: "bi bi-card-text",
          iconColor: "text-[#d97706] bg-[#fffbeb]",
          badgeText: "Flashcard",
          badgeColor: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]",
        };
      case "3d":
        return {
          icon: "bi bi-box-seam",
          iconColor: "text-[#6366f1] bg-[#eef2ff]",
          badgeText: "Anatomi 3D",
          badgeColor: "bg-[#eef2ff] text-[#3730a3] border-[#c7d2fe]",
        };
      default:
        return {
          icon: "bi bi-check2-circle",
          iconColor: "text-[#475569] bg-[#f8fafc]",
          badgeText: target.category || "Aktivitas",
          badgeColor: "bg-[#f1f5f9] text-[#475569] border-[#e2e8f0]",
        };
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[6px] bg-[#1e293b] px-4 py-3 text-[13px] text-white shadow-lg animate-in fade-in duration-200">
          <i className="bi bi-info-circle text-[#38bdf8]"></i>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#94a3b8] hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* =====================================================================
          PAGE HEADER
          ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[21px] font-bold text-[#1e293b] leading-tight">
              Rencana Belajar
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] text-[10.5px] font-semibold flex items-center gap-1">
              <i className="bi bi-robot text-xs"></i>
              Disusun oleh AI
            </span>
          </div>
          <p className="text-[12.5px] text-[#64748b] mt-0.5">
            Jadwal dan target belajar adaptif yang disusun oleh AI berdasarkan hasil onboarding.
          </p>
        </div>

        {/* Toggle Simulasi (Memudahkan Pengujian State Kosong vs Ada Data) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setHasPlan((prev) => !prev);
              showToast(hasPlan ? "Menampilkan state kosong (belum onboarding)" : "Menampilkan rencana belajar aktif");
            }}
            className="h-[30px] px-2.5 rounded-[5px] border border-[#cbd5e1] bg-white text-[11px] font-medium text-[#475569] hover:bg-[#f8fafc] transition"
            title="Uji tampilan state kosong jika belum ada data onboarding"
          >
            <i className="bi bi-arrow-left-right text-[#0d6efd] mr-1"></i>
            <span>{hasPlan ? "Uji: State Kosong" : "Uji: Tampilkan Rencana"}</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          STATE 1: BELUM ADA ONBOARDING (EMPTY STATE)
          ===================================================================== */}
      {!hasPlan ? (
        <div className="metis-card p-10 text-center my-6">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#eff6ff] border border-[#dbeafe] text-[#0d6efd] flex items-center justify-center text-3xl mb-4">
              <i className="bi bi-compass"></i>
            </div>
            <h2 className="text-lg font-bold text-[#1e293b] mb-1.5">
              Belum Ada Rencana Belajar
            </h2>
            <p className="text-xs text-[#64748b] leading-relaxed mb-6">
              Anda belum mengisi pengaturan awal belajar. Buka wizard onboarding untuk memilih regio anatomi, tanggal ujian, dan komitmen waktu harian agar AI dapat memetakan target belajar Anda.
            </p>
            <Link
              href="/onboarding"
              className="h-[38px] px-5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-xs font-semibold rounded-[6px] flex items-center gap-2 shadow-xs transition"
            >
              <i className="bi bi-magic text-sm"></i>
              <span>Mulai Onboarding</span>
            </Link>
          </div>
        </div>
      ) : (
        /* =====================================================================
            STATE 2: RENCANA BELAJAR AKTIF (TERSTRUKTUR OLEH AI)
            ===================================================================== */
        <>
          {/* =================================================================
              BAGIAN 1: KARTU "DASAR RENCANA" (HASIL ONBOARDING)
              ================================================================= */}
          <div className="metis-card p-5 mb-5 border-l-4 border-l-[#0d6efd]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[6px] bg-[#eff6ff] text-[#0d6efd] flex items-center justify-center text-base">
                  <i className="bi bi-sliders"></i>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[14.5px] font-bold text-[#1e293b]">
                      Dasar Rencana Belajar
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <i className="bi bi-robot text-[11px]"></i>
                      Disusun oleh AI
                    </span>
                  </div>
                  <span className="text-[11.5px] text-[#64748b]">
                    Parameter preferensi yang Anda isi saat onboarding awal
                  </span>
                </div>
              </div>

              {/* Action Buttons: Ubah Pengaturan & Susun Ulang Rencana */}
              <div className="flex items-center gap-2">
                <Link
                  href="/onboarding"
                  className="h-[32px] px-3 rounded-[5px] border border-[#cbd5e1] bg-white text-xs font-semibold text-[#334155] hover:bg-[#f8fafc] transition flex items-center gap-1.5"
                >
                  <i className="bi bi-pencil-square text-[#64748b]"></i>
                  <span>Ubah Pengaturan</span>
                </Link>

                <button
                  type="button"
                  onClick={handleReorganizePlan}
                  className="h-[32px] px-3.5 rounded-[5px] bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                >
                  <i className="bi bi-arrow-repeat"></i>
                  <span>Susun Ulang Rencana</span>
                </button>
              </div>
            </div>

            {/* Grid 4 Kolom Dasar Rencana */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3.5 text-xs">
              {/* Kolom 1: Regio Dipelajari */}
              <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px]">
                <span className="text-[10.5px] uppercase font-bold text-[#64748b] tracking-wider block mb-1">
                  Regio Dipelajari
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {onboardingData.selectedRegionIds.map((rId) => {
                    const reg = mockAnatomyRegions.find((r) => r.id === rId);
                    return (
                      <span
                        key={rId}
                        className="px-2 py-0.5 rounded-[4px] bg-white border border-[#cbd5e1] text-[11px] font-semibold text-[#1e293b]"
                      >
                        {reg?.name || rId}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Kolom 2: Target Ujian & Sisa Hari */}
              <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px]">
                <span className="text-[10.5px] uppercase font-bold text-[#64748b] tracking-wider block mb-1">
                  Target Ujian Blok
                </span>
                <strong className="text-[12px] font-bold text-[#1e293b] block truncate">
                  {onboardingData.examName}
                </strong>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#64748b]">
                  <i className="bi bi-calendar-check text-[#0d6efd]"></i>
                  <span>{formattedExamDate}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#fef3c7] text-[#92400e] font-bold text-[10px]">
                    {daysUntilExam} hari lagi
                  </span>
                </div>
              </div>

              {/* Kolom 3: Komitmen Waktu */}
              <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px]">
                <span className="text-[10.5px] uppercase font-bold text-[#64748b] tracking-wider block mb-1">
                  Waktu Belajar Harian
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-extrabold text-[#0d6efd]">
                    {onboardingData.dailyHours}
                  </span>
                  <span className="text-[11.5px] font-semibold text-[#1e293b]">
                    Jam / hari aktif
                  </span>
                </div>
                <span className="text-[10.5px] text-[#64748b] block mt-0.5">
                  Fokus active recall & latihan soal
                </span>
              </div>

              {/* Kolom 4: Hari Belajar */}
              <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px]">
                <span className="text-[10.5px] uppercase font-bold text-[#64748b] tracking-wider block mb-1">
                  Hari Belajar Aktif
                </span>
                <strong className="text-[12px] font-bold text-[#1e293b] block">
                  {onboardingData.studyDays.length} Hari per Minggu
                </strong>
                <span className="text-[11px] text-[#64748b] block mt-1">
                  {onboardingData.studyDays.join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* =================================================================
              BAGIAN 2: JADWAL 14 HARI & DAFTAR TARGET AKTIVITAS PRD
              ================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
            {/* KOLOM KIRI: STRIP KALENDER & CHECKLIST TARGET (7 Kolom di Laptop) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* STRIP KALENDER 14 HARI */}
              <div className="metis-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <i className="bi bi-calendar3 text-[#0d6efd] text-[15px]"></i>
                    <h2 className="text-[14.5px] font-semibold text-[#1e293b]">
                      Jadwal 14 Hari ke Depan
                    </h2>
                  </div>
                  <span className="text-[11.5px] text-[#64748b]">
                    Geser tanggal untuk melihat target per hari
                  </span>
                </div>

                {/* Horizontal Scrollable Calendar Strip */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {schedule.map((day) => {
                    const isSelected = day.id === selectedDayId;
                    const completedCount = day.targets.filter((t) => t.completed).length;
                    const isAllDone =
                      day.targets.length > 0 && completedCount === day.targets.length;

                    return (
                      <button
                        key={day.id}
                        onClick={() => setSelectedDayId(day.id)}
                        className={`flex flex-col items-center justify-center min-w-[62px] py-2.5 px-1.5 rounded-[7px] border transition cursor-pointer text-center ${
                          isSelected
                            ? "bg-[#0d6efd] border-[#0d6efd] text-white shadow-xs"
                            : "bg-white border-[#e2e8f0] text-[#334155] hover:bg-[#f8fafc] hover:border-[#cbd5e1]"
                        }`}
                      >
                        <span
                          className={`text-[11px] uppercase tracking-wider font-semibold ${
                            isSelected ? "text-white/90" : "text-[#64748b]"
                          }`}
                        >
                          {day.shortDay}
                        </span>
                        <span
                          className={`text-[16px] font-bold mt-0.5 leading-tight ${
                            isSelected ? "text-white" : "text-[#0f172a]"
                          }`}
                        >
                          {day.formattedDate.split(" ")[0]}
                        </span>

                        {/* Status Dots */}
                        <div className="mt-1 flex items-center gap-1">
                          {isAllDone ? (
                            <i
                              className={`bi bi-check-circle-fill text-[10px] ${
                                isSelected ? "text-white" : "text-[#198754]"
                              }`}
                            ></i>
                          ) : day.isHeavyLoad ? (
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isSelected ? "bg-white" : "bg-[#cc7a00]"
                              }`}
                              title="Beban Padat"
                            />
                          ) : (
                            <span
                              className={`text-[10px] font-semibold ${
                                isSelected ? "text-white/80" : "text-[#64748b]"
                              }`}
                            >
                              {day.totalItems}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Smart Suggestion Notification Pill */}
                {selectedDay?.smartSuggestion && (
                  <div className="mt-3 p-2.5 bg-[#fff8e1] border border-[#ffe082] rounded-[6px] text-[#8d6e63] text-[12px] flex items-start gap-2">
                    <i className="bi bi-lightbulb-fill text-[#cc7a00] text-[14px] shrink-0 mt-0.5"></i>
                    <div className="flex-1">
                      <strong className="text-[#bf360c] font-semibold">
                        Saran Adaptif AI:{" "}
                      </strong>
                      <span>{selectedDay.smartSuggestion}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* CHECKLIST TARGET HARI TERPILIH (AKTIVITAS PRD) */}
              <div className="metis-card flex-1 flex flex-col">
                <div className="metis-card-header">
                  <div>
                    <h2 className="metis-card-title flex items-center gap-2">
                      <span>
                        Target: {selectedDay.dayName}, {selectedDay.formattedDate}
                      </span>
                      {selectedDay.isToday && (
                        <span className="badge-completed">Hari Ini</span>
                      )}
                      {selectedDay.isHeavyLoad && (
                        <span className="bg-[#cc7a00] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[4px]">
                          Beban Padat
                        </span>
                      )}
                    </h2>
                    <p className="text-[12px] text-[#64748b] mt-0.5">
                      Centang target selesai atau tekan &quot;Mulai&quot; untuk langsung menuju aktivitas terkait
                    </p>
                  </div>

                  <span
                    className={
                      selectedDayPercent === 100 ? "badge-completed" : "badge-shipped"
                    }
                  >
                    {selectedDayCompleted} dari {selectedDayTotal} Selesai ({selectedDayPercent}%)
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Progress Bar Pencapaian */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-[12px] text-[#475569] mb-1.5 font-medium">
                        <span>Pencapaian Target Hari Ini</span>
                        <span className="font-bold text-[#0f172a]">{selectedDayPercent}%</span>
                      </div>
                      <ProgressBar
                        value={selectedDayPercent}
                        color={selectedDayPercent === 100 ? "green" : "blue"}
                        size="md"
                      />
                    </div>

                    {/* Target Items List (Fitur F3, F4, F5, F6) */}
                    {selectedDay.targets.length === 0 ? (
                      <EmptyState
                        title="Tidak Ada Target Hari Ini"
                        description="Hari ini dialokasikan untuk istirahat atau mengulang catatan mandiri."
                      />
                    ) : (
                      <div className="border border-[#e2e8f0] rounded-[6px] divide-y divide-[#e2e8f0] bg-white">
                        {selectedDay.targets.map((target) => {
                          const meta = renderActivityMeta(target);

                          return (
                            <div
                              key={target.id}
                              className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                                target.completed ? "bg-[#f8fafc]" : "hover:bg-[#fbfcfe]"
                              }`}
                            >
                              {/* Left: Checkbox & Info */}
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <input
                                  type="checkbox"
                                  checked={target.completed}
                                  onChange={() =>
                                    handleToggleTarget(selectedDay.id, target.id)
                                  }
                                  className="w-4 h-4 mt-0.5 text-[#0d6efd] rounded border-[#cbd5e1] focus:ring-[#0d6efd] cursor-pointer shrink-0"
                                  aria-label={`Tandai selesai: ${target.title}`}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`text-[13px] ${
                                        target.completed
                                          ? "line-through text-[#94a3b8]"
                                          : "font-semibold text-[#1e293b]"
                                      }`}
                                    >
                                      {target.title}
                                    </span>
                                  </div>
                                  {target.latinTerm && (
                                    <span className="block text-[11px] italic text-[#64748b] mt-0.5">
                                      {target.latinTerm}
                                    </span>
                                  )}

                                  {/* Meta: Kategori & Estimasi Waktu */}
                                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                                    <span
                                      className={`px-2 py-0.5 rounded-[4px] border font-medium ${meta.badgeColor}`}
                                    >
                                      <i className={`${meta.icon} mr-1`}></i>
                                      {meta.badgeText}
                                    </span>
                                    {target.durationMinutes && (
                                      <span className="text-[#64748b] flex items-center gap-1 font-medium">
                                        <i className="bi bi-stopwatch text-slate-400"></i>
                                        {target.durationMinutes} menit
                                      </span>
                                    )}
                                    <span className="text-[#94a3b8]">&bull;</span>
                                    <span className="text-[#64748b]">
                                      {target.itemCount} item
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Tombol Aksi Mulai */}
                              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                <Link
                                  href={target.actionUrl || "/latihan"}
                                  onClick={() =>
                                    showToast(`Membuka aktivitas: ${target.title}`)
                                  }
                                  className="h-[28px] px-3 rounded-[5px] bg-[#eff6ff] hover:bg-[#dbeafe] text-[#1d4ed8] border border-[#bfdbfe] text-xs font-semibold flex items-center gap-1 transition"
                                >
                                  <span>Mulai</span>
                                  <i className="bi bi-arrow-right text-[11px]"></i>
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Bottom Quick Info */}
                  <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[12px] text-[#64748b]">
                    <span>
                      Total beban hari ini:{" "}
                      <strong className="text-[#1e293b]">
                        {selectedDay.totalItems} item
                      </strong>
                    </span>
                    <Link
                      href="/latihan"
                      className="text-xs font-semibold text-[#0d6efd] hover:underline flex items-center gap-1"
                    >
                      <span>Buka Sesi Latihan Utama</span>
                      <i className="bi bi-chevron-right text-[10px]"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN: PROGRES PER REGIO & DISTRIBUSI BEBAN (5 Kolom di Laptop) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {/* KARTU PROGRES PER REGIO ANATOMI */}
              <div className="metis-card">
                <div className="metis-card-header">
                  <div>
                    <h2 className="metis-card-title">Progres Penguasaan per Regio</h2>
                    <p className="text-[12px] text-[#64748b] mt-0.5">
                      Pencapaian materi pada 3 regio target ujian blok
                    </p>
                  </div>
                  <span className="badge-completed">3 Regio Target</span>
                </div>

                <div className="p-5 space-y-4">
                  {[
                    {
                      name: "Regio Caput (Kepala & Wajah)",
                      latin: "Musculi Capitis & Faciei",
                      mastered: 12,
                      total: 15,
                      percent: 80,
                      color: "green" as const,
                      status: "Kuat",
                    },
                    {
                      name: "Regio Thorax (Dinding Dada & Toraks)",
                      latin: "Musculi Thoracis & Cor",
                      mastered: 10,
                      total: 12,
                      percent: 83,
                      color: "green" as const,
                      status: "Kuat",
                    },
                    {
                      name: "Regio Membrum (Anggota Gerak Atas)",
                      latin: "Musculi Membri Superioris",
                      mastered: 11,
                      total: 18,
                      percent: 61,
                      color: "blue" as const,
                      status: "Sedang",
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="p-3.5 border border-[#e2e8f0] rounded-[7px] bg-[#ffffff] hover:border-[#cbd5e1] transition shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <h3 className="text-[13px] font-bold text-[#1e293b]">
                            {item.name}
                          </h3>
                          <span className="text-[11px] italic text-[#64748b]">
                            {item.latin}
                          </span>
                        </div>
                        <span
                          className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] ${
                            item.status === "Kuat"
                              ? "bg-[#dcfce7] text-[#15803d]"
                              : "bg-[#e0f2fe] text-[#0369a1]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-[#64748b]">Penguasaan:</span>
                          <span className="font-bold text-[#1e293b]">
                            {item.mastered} / {item.total} struktur ({item.percent}%)
                          </span>
                        </div>
                        <ProgressBar value={item.percent} color={item.color} size="sm" />
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 text-[11px] text-[#64748b] flex items-center justify-between">
                    <span>Target total: 45 struktur silabus anatomi</span>
                    <Link href="/kelemahan" className="text-[#0d6efd] font-semibold hover:underline">
                      Lihat Peta Kelemahan
                    </Link>
                  </div>
                </div>
              </div>

              {/* KARTU GRAFIK BEBAN BELAJAR 14 HARI (CHART.JS) */}
              <div className="metis-card">
                <div className="metis-card-header">
                  <div>
                    <h2 className="metis-card-title">Grafik Beban Belajar per Hari</h2>
                    <p className="text-[12px] text-[#64748b] mt-0.5">
                      Distribusi item dalam rentang 14 hari persiapan
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10.5px]">
                    <span className="flex items-center gap-1 text-[#475569]">
                      <span className="w-2 h-2 rounded-full bg-[#0d6efd]"></span>
                      Dipilih
                    </span>
                    <span className="flex items-center gap-1 text-[#475569]">
                      <span className="w-2 h-2 rounded-full bg-[#cc7a00]"></span>
                      Padat
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="w-full h-[220px] relative">
                    <canvas ref={chartRef}></canvas>
                  </div>
                  <span className="text-[11px] text-slate-400 block text-center mt-2">
                    Klik pada batang grafik untuk berpindah ke tanggal tersebut
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================
              BAGIAN 3: CATATAN TRANSPARANSI AI DI BAGIAN BAWAH
              ================================================================= */}
          <div className="p-3.5 bg-[#eff6ff] border border-[#dbeafe] rounded-[8px] text-xs text-[#1e40af] flex items-center gap-2.5 mb-6">
            <i className="bi bi-robot text-lg text-[#2563eb] shrink-0"></i>
            <p className="leading-relaxed">
              <strong>Catatan:</strong> Rencana disusun oleh AI sebagai alat bantu. Sesuaikan dengan jadwal kuliahmu.
            </p>
          </div>
        </>
      )}

      {/* =====================================================================
          MODAL SIMULASI SUSUN ULANG AI (2–3 Detik)
          ===================================================================== */}
      {isReorganizing && (
        <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[12px] p-6 shadow-xl border border-[#e2e8f0] text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Spinner AI */}
            <div className="w-12 h-12 border-3 border-[#0d6efd]/20 border-t-[#0d6efd] rounded-full animate-spin mx-auto mb-4"></div>

            <h3 className="text-base font-bold text-[#1e293b] mb-1">
              Menyusun Ulang Rencana Belajar
            </h3>
            <p className="text-xs text-[#64748b] mb-4">
              AI PRIMA sedang menghitung ulang alokasi jadwal dan target harian...
            </p>

            {/* Pesan Tahapan AI */}
            <div className="p-3 bg-[#eff6ff] border border-[#dbeafe] rounded-[6px] text-xs font-medium text-[#1e40af] min-h-[44px] flex items-center justify-center">
              <span>{reorganizeStepMsg}</span>
            </div>

            {/* Progress Bar Loading */}
            <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-[#0d6efd] h-full animate-pulse w-full"></div>
            </div>

            <span className="text-[11px] text-[#64748b] mt-3 block">
              Mohon tunggu sekitar 2–3 detik...
            </span>
          </div>
        </div>
      )}
    </>
  );
}
