"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { mockAnatomyRegions } from "@/lib/mock-data";

// Tipe data pilihan onboarding
export interface OnboardingState {
  selectedRegions: string[]; // ID regio (misal: "reg-caput")
  examName: string;
  examDate: string; // format YYYY-MM-DD
  dailyHours: number; // 1 - 6 jam
  studyDays: string[]; // ["Sen", "Sel", ...]
  preferences: string[]; // ["ringkasan", "soal", "flashcard", "3d"]
}

// Opsi preferensi belajar
const STUDY_PREFERENCES = [
  {
    id: "ringkasan",
    title: "Ringkasan Materi AI",
    desc: "Ekstraksi poin inti, bagan ringkas, dan subtopik terstruktur.",
    icon: "bi bi-journal-text",
  },
  {
    id: "soal",
    title: "Latihan Soal Interaktif",
    desc: "Kuis pilihan ganda klinis dengan umpan balik dan pembahasan.",
    icon: "bi bi-question-circle",
  },
  {
    id: "flashcard",
    title: "Flashcard Istilah",
    desc: "Active recall untuk nomenklatur Latin dan terminologi medis.",
    icon: "bi bi-card-text",
  },
  {
    id: "3d",
    title: "Visualisasi 3D Anatomi",
    desc: "Eksplorasi letak dan topografi struktur organ secara spasial.",
    icon: "bi bi-box-seam",
  },
];

// Hari dalam seminggu
const WEEK_DAYS = [
  { key: "Sen", label: "Senin" },
  { key: "Sel", label: "Selasa" },
  { key: "Rab", label: "Rabu" },
  { key: "Kam", label: "Kamis" },
  { key: "Jum", label: "Jumat" },
  { key: "Sab", label: "Sabtu" },
  { key: "Min", label: "Minggu" },
];

export default function OnboardingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#64748b]">
          Menyiapkan modul onboarding...
        </div>
      }
    >
      <OnboardingContent />
    </React.Suspense>
  );
}

function OnboardingContent() {
  const router = useRouter();

  // Langkah wizard saat ini (1 sampai 4)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Batas minimum tanggal ujian (besok)
  const [minDate, setMinDate] = useState<string>("");

  // State data onboarding
  const [formData, setFormData] = useState<OnboardingState>({
    selectedRegions: ["reg-caput", "reg-membrum"],
    examName: "Ujian Blok Anatomi & Muskuloskeletal",
    examDate: "", // Ditetapkan pada client mount
    dailyHours: 2,
    studyDays: ["Sen", "Sel", "Rab", "Kam", "Jum"],
    preferences: ["ringkasan", "soal", "flashcard", "3d"],
  });

  // State proses loading AI simulasi
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  // Inisialisasi tanggal masa depan pada client-side mount (menghindari prerender time discrepancy)
  useEffect(() => {
    const today = new Date();
    const minD = new Date(today);
    minD.setDate(minD.getDate() + 1);
    setMinDate(minD.toISOString().split("T")[0]);

    const defaultTarget = new Date(today);
    defaultTarget.setDate(defaultTarget.getDate() + 14);
    setFormData((prev) => ({
      ...prev,
      examDate: prev.examDate || defaultTarget.toISOString().split("T")[0],
    }));
  }, []);

  // Helper tanggal masa depan (YYYY-MM-DD)
  function getFutureDate(daysAhead: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split("T")[0];
  }

  // Hitung sisa hari menuju ujian
  const daysUntilExam = useMemo(() => {
    if (!formData.examDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(formData.examDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [formData.examDate]);

  // Validasi langkah saat ini
  const validationError = useMemo(() => {
    if (currentStep === 1) {
      if (formData.selectedRegions.length === 0) {
        return "Pilih minimal satu regio tubuh untuk menyusun materi.";
      }
    } else if (currentStep === 2) {
      if (!formData.examDate) {
        return "Tentukan tanggal ujian Anda.";
      }
      if (daysUntilExam === null || daysUntilExam <= 0) {
        return "Tanggal ujian harus di masa depan (minimal 1 hari dari hari ini).";
      }
    } else if (currentStep === 3) {
      if (formData.studyDays.length === 0) {
        return "Pilih minimal satu hari belajar aktif per minggu.";
      }
      if (formData.preferences.length === 0) {
        return "Pilih minimal satu preferensi metode belajar.";
      }
    }
    return null;
  }, [currentStep, formData, daysUntilExam]);

  // Handler toggle regio
  const handleToggleRegion = (regionId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedRegions.includes(regionId);
      const updated = exists
        ? prev.selectedRegions.filter((id) => id !== regionId)
        : [...prev.selectedRegions, regionId];
      return { ...prev, selectedRegions: updated };
    });
  };

  // Handler toggle hari belajar
  const handleToggleDay = (dayKey: string) => {
    setFormData((prev) => {
      const exists = prev.studyDays.includes(dayKey);
      const updated = exists
        ? prev.studyDays.filter((d) => d !== dayKey)
        : [...prev.studyDays, dayKey];
      return { ...prev, studyDays: updated };
    });
  };

  // Handler toggle preferensi
  const handleTogglePreference = (prefId: string) => {
    setFormData((prev) => {
      const exists = prev.preferences.includes(prefId);
      const updated = exists
        ? prev.preferences.filter((p) => p !== prefId)
        : [...prev.preferences, prefId];
      return { ...prev, preferences: updated };
    });
  };

  // Navigasi wizard
  const handleNext = () => {
    if (validationError) return;
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Eksekusi buat rencana belajar (Simulasi AI ~3 detik)
  const handleCreatePlan = () => {
    setIsGenerating(true);
    setLoadingMessage("Menganalisis jadwal dan tanggal ujian...");

    setTimeout(() => {
      setLoadingMessage("Memetakan subtopik regio dan target materi harian...");
    }, 1100);

    setTimeout(() => {
      setLoadingMessage("Menyusun rencana belajar adaptif dan latihan 3D...");
    }, 2200);

    setTimeout(() => {
      setIsGenerating(false);
      router.push("/beranda");
    }, 3300);
  };

  // Info langkah wizard
  const stepsConfig = [
    { number: 1, title: "Topik Regio", desc: "Regio tubuh yang akan dipelajari" },
    { number: 2, title: "Jadwal Ujian", desc: "Tanggal target dan sisa waktu" },
    { number: 3, title: "Waktu Belajar", desc: "Durasi, hari, dan preferensi" },
    { number: 4, title: "Tinjau Rencana", desc: "Verifikasi dan buat rencana AI" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-2 sm:py-4">
      {/* =====================================================================
          HEADER HALAMAN & PENJELASAN
          ===================================================================== */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b] tracking-tight">
              Pengaturan Awal Belajar (Onboarding)
            </h1>
            <p className="text-[13px] text-[#64748b] mt-0.5">
              Sesuaikan target dan jadwal Anda agar PRIMA dapat menyusun rencana belajar yang terarah.
            </p>
          </div>
          <Link
            href="/beranda"
            className="self-start sm:self-auto text-xs font-semibold text-[#3b76e1] hover:underline flex items-center gap-1.5"
          >
            <span>Lewati ke Beranda</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>

      {/* =====================================================================
          PROGRESS INDICATOR WIZARD
          ===================================================================== */}
      <div className="metis-card p-4 sm:p-5 mb-6">
        {/* Step Numbers & Labels */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
          {stepsConfig.map((s) => {
            const isCompleted = currentStep > s.number;
            const isCurrent = currentStep === s.number;

            return (
              <button
                key={s.number}
                type="button"
                onClick={() => {
                  if (s.number < currentStep) setCurrentStep(s.number);
                }}
                disabled={s.number > currentStep}
                className={`flex flex-col items-center text-center transition-all ${
                  s.number < currentStep
                    ? "cursor-pointer hover:opacity-80"
                    : "cursor-default"
                }`}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Langkah ${s.number}: ${s.title}`}
              >
                {/* Circle Badge */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                    isCompleted
                      ? "bg-[#198754] text-white shadow-xs"
                      : isCurrent
                      ? "bg-[#3b76e1] text-white ring-4 ring-[#dbeafe] shadow-xs"
                      : "bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]"
                  }`}
                >
                  {isCompleted ? <i className="bi bi-check-lg text-sm"></i> : s.number}
                </div>
                {/* Title */}
                <span
                  className={`text-xs font-semibold tracking-tight truncate max-w-full ${
                    isCurrent
                      ? "text-[#1e293b]"
                      : isCompleted
                      ? "text-[#198754]"
                      : "text-[#64748b]"
                  }`}
                >
                  {s.title}
                </span>
                {/* Step Subtitle (Desktop only) */}
                <span className="hidden sm:block text-[11px] text-[#64748b] truncate max-w-full">
                  {s.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-[#3b76e1] h-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* =====================================================================
          KONTEN LANGKAH WIZARD
          ===================================================================== */}
      <div className="metis-card p-5 sm:p-7 mb-6">
        {/* ===================================================================
            LANGKAH 1: TOPIK REGIO ANATOMI
            =================================================================== */}
        {currentStep === 1 && (
          <div>
            <div className="mb-5 pb-3 border-b border-[#f1f5f9]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3b76e1] bg-[#eff6ff] px-2 py-0.5 rounded-sm">
                Langkah 1 dari 4
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1e293b] mt-1.5">
                Pilih Regio Anatomi yang Akan Dipelajari
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Anda dapat memilih satu atau lebih regio tubuh. PRIMA akan memfokuskan kuis, ringkasan, dan visualisasi 3D pada regio yang dipilih.
              </p>
            </div>

            {/* Grid 6 Kartu Regio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {mockAnatomyRegions.map((region) => {
                const isSelected = formData.selectedRegions.includes(region.id);

                return (
                  <div
                    key={region.id}
                    onClick={() => handleToggleRegion(region.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleToggleRegion(region.id);
                      }
                    }}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    className={`p-4 rounded-[8px] border transition-all cursor-pointer select-none flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#3b76e1] ${
                      isSelected
                        ? "bg-[#eff6ff] border-[#3b76e1] shadow-xs"
                        : "bg-white border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-[6px] flex items-center justify-center text-base ${
                              isSelected
                                ? "bg-[#3b76e1] text-white"
                                : "bg-[#f1f5f9] text-[#475569]"
                            }`}
                          >
                            <i className={region.icon}></i>
                          </div>
                          <div>
                            <h3 className="text-[13.5px] font-bold text-[#1e293b] leading-tight">
                              {region.name}
                            </h3>
                            <span className="text-[11px] text-[#64748b] block font-medium">
                              {region.subName}
                            </span>
                          </div>
                        </div>

                        {/* Checkbox indicator */}
                        <div
                          className={`w-5 h-5 rounded-[4px] border flex items-center justify-center text-xs transition-colors shrink-0 ${
                            isSelected
                              ? "bg-[#3b76e1] border-[#3b76e1] text-white"
                              : "border-[#cbd5e1] bg-white"
                          }`}
                        >
                          {isSelected && <i className="bi bi-check-lg"></i>}
                        </div>
                      </div>

                      {/* Deskripsi Satu Kalimat */}
                      <p className="text-[11.5px] text-[#64748b] line-clamp-3 leading-relaxed mt-1">
                        {region.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-[#64748b]">
                      <span>{region.structuresCount} struktur utama</span>
                      <span className="italic font-serif text-[#64748b] truncate max-w-[140px]">
                        {region.latinName}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rekapitulasi Seleksi */}
            <div className="mt-4 p-3 rounded-[6px] bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between text-xs">
              <span className="text-[#64748b]">
                Terpilih:{" "}
                <strong className="text-[#1e293b]">
                  {formData.selectedRegions.length} dari 6 regio
                </strong>
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    selectedRegions:
                      prev.selectedRegions.length === mockAnatomyRegions.length
                        ? []
                        : mockAnatomyRegions.map((r) => r.id),
                  }))
                }
                className="text-[11.5px] font-semibold text-[#3b76e1] hover:underline"
              >
                {formData.selectedRegions.length === mockAnatomyRegions.length
                  ? "Batalkan Semua"
                  : "Pilih Semua Regio"}
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            LANGKAH 2: JADWAL UJIAN & PERHITUNGAN HARI
            =================================================================== */}
        {currentStep === 2 && (
          <div>
            <div className="mb-5 pb-3 border-b border-[#f1f5f9]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3b76e1] bg-[#eff6ff] px-2 py-0.5 rounded-sm">
                Langkah 2 dari 4
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1e293b] mt-1.5">
                Kapan Ujian Anatomi Anda Dilaksanakan?
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Sistem akan menghitung sisa hari secara otomatis untuk membagi target belajar harian yang proporsional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Input Ujian */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="exam-name"
                    className="block text-xs font-bold text-[#1e293b] mb-1.5"
                  >
                    Nama Blok atau Ujian
                  </label>
                  <input
                    id="exam-name"
                    type="text"
                    value={formData.examName}
                    onChange={(e) =>
                      setFormData({ ...formData, examName: e.target.value })
                    }
                    placeholder="Contoh: Ujian Blok Anatomi Sistem Muskuloskeletal"
                    className="w-full px-3.5 py-2.5 rounded-[6px] border border-[#cbd5e1] text-xs text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#3b76e1] focus:border-transparent transition-all"
                  />
                  <span className="text-[11px] text-[#64748b] mt-1 block">
                    Nama blok memudahkan pelabelan jadwal pada kalender perencana.
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="exam-date"
                    className="block text-xs font-bold text-[#1e293b] mb-1.5"
                  >
                    Tanggal Pelaksanaan Ujian <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="exam-date"
                    type="date"
                    min={minDate || "2026-11-07"} // Tidak boleh tanggal yang sudah lewat
                    value={formData.examDate}
                    onChange={(e) =>
                      setFormData({ ...formData, examDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-[6px] border border-[#cbd5e1] text-xs text-[#1e293b] focus:outline-none focus:ring-2 focus:ring-[#3b76e1] focus:border-transparent transition-all"
                  />
                  <span className="text-[11px] text-[#64748b] mt-1 block">
                    Pilih tanggal di masa depan (minimal besok).
                  </span>
                </div>

                {/* Tombol Cepat Pilihan Hari */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-[#64748b] uppercase block mb-1.5">
                    Pilihan Waktu Cepat:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "7 Hari (1 Minggu)", days: 7 },
                      { label: "14 Hari (2 Minggu)", days: 14 },
                      { label: "21 Hari (3 Minggu)", days: 21 },
                      { label: "30 Hari (1 Bulan)", days: 30 },
                    ].map((opt) => (
                      <button
                        key={opt.days}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, examDate: getFutureDate(opt.days) })
                        }
                        className="px-2.5 py-1 rounded-[4px] border border-[#cbd5e1] bg-white text-[11.5px] text-[#334155] hover:bg-[#f1f5f9] transition-colors"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kartu Ringkasan Sisa Hari (Kalkulasi Otomatis) */}
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#475569] uppercase tracking-wider mb-3">
                    <i className="bi bi-calendar-check text-[#3b76e1]"></i>
                    <span>Analisis Rentang Waktu</span>
                  </div>

                  {daysUntilExam !== null && daysUntilExam > 0 ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-[8px] bg-white border border-[#e2e8f0] shadow-2xs">
                        <span className="text-[11px] text-[#64748b] uppercase font-bold tracking-wider block">
                          Sisa Waktu Persiapan
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-3xl font-extrabold text-[#3b76e1]">
                            {daysUntilExam}
                          </span>
                          <span className="text-sm font-semibold text-[#1e293b]">
                            hari lagi
                          </span>
                        </div>
                        <span className="text-xs text-[#64748b] mt-1 block">
                          Pelaksanaan:{" "}
                          <strong className="text-[#1e293b]">
                            {new Date(formData.examDate).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </strong>
                        </span>
                      </div>

                      <div className="p-3 bg-[#eff6ff] border border-[#dbeafe] rounded-[6px] text-xs text-[#1e40af] flex items-start gap-2.5">
                        <i className="bi bi-info-circle-fill text-sm shrink-0 mt-0.5"></i>
                        <p className="leading-relaxed">
                          Dengan rentang <strong>{daysUntilExam} hari</strong>, AI akan membagi topik secara bertahap: 70% penguasaan materi awal dan 30% pengulangan terprogram (*spaced review*) menjelang ujian.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-[8px] bg-[#fef2f2] border border-[#fecaca] text-xs text-[#b91c1c]">
                      <div className="font-bold mb-1 flex items-center gap-1.5">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <span>Tanggal Tidak Valid</span>
                      </div>
                      <p>
                        Tanggal ujian yang Anda masukkan sudah lewat atau hari ini. Mohon tentukan tanggal di masa depan.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#e2e8f0] text-[11px] text-[#64748b]">
                  Tips: Jadwal ujian dapat disesuaikan kembali sewaktu-waktu di menu Perencana Belajar.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            LANGKAH 3: WAKTU BELAJAR & PREFERENSI METODE
            =================================================================== */}
        {currentStep === 3 && (
          <div>
            <div className="mb-5 pb-3 border-b border-[#f1f5f9]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3b76e1] bg-[#eff6ff] px-2 py-0.5 rounded-sm">
                Langkah 3 dari 4
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1e293b] mt-1.5">
                Berapa Waktu Belajar dan Metode yang Anda Sukai?
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Target harian akan disesuaikan dengan ketersediaan waktu luang dan gaya belajar Anda.
              </p>
            </div>

            <div className="space-y-6">
              {/* Bagian 1: Slider Jam Belajar */}
              <div className="p-4 sm:p-5 rounded-[8px] bg-[#f8fafc] border border-[#e2e8f0]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <label
                      htmlFor="daily-hours"
                      className="text-xs font-bold text-[#1e293b] block"
                    >
                      Komitmen Belajar per Hari
                    </label>
                    <span className="text-[11px] text-[#64748b]">
                      Berapa jam yang realistis dapat Anda luangkan setiap hari aktif?
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-[6px] bg-white border border-[#cbd5e1] flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xl font-bold text-[#3b76e1]">
                      {formData.dailyHours}
                    </span>
                    <span className="text-xs font-medium text-[#475569]">
                      jam / hari
                    </span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  id="daily-hours"
                  type="range"
                  min="1"
                  max="6"
                  step="0.5"
                  value={formData.dailyHours}
                  onChange={(e) =>
                    setFormData({ ...formData, dailyHours: parseFloat(e.target.value) })
                  }
                  className="w-full accent-[#3b76e1] cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-[#64748b] mt-2 font-medium">
                  <span>1 Jam (Ringan)</span>
                  <span>2 - 3 Jam (Disarankan untuk Preklinik)</span>
                  <span>6 Jam (Intensif)</span>
                </div>
              </div>

              {/* Bagian 2: Hari Belajar Aktif (Chips) */}
              <div>
                <label className="text-xs font-bold text-[#1e293b] block mb-1">
                  Hari Belajar Aktif per Minggu <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-[#64748b] block mb-2.5">
                  Tentukan hari-hari Anda bersedia menerima target materi baru. Hari yang tidak dipilih dialokasikan untuk istirahat.
                </span>

                <div className="flex flex-wrap gap-2">
                  {WEEK_DAYS.map((d) => {
                    const isSelected = formData.studyDays.includes(d.key);
                    return (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => handleToggleDay(d.key)}
                        className={`px-3.5 py-2 rounded-[6px] text-xs font-semibold border transition-all ${
                          isSelected
                            ? "bg-[#3b76e1] text-white border-[#3b76e1] shadow-2xs"
                            : "bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f1f5f9]"
                        }`}
                        aria-pressed={isSelected}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] text-[#64748b] mt-1.5 block">
                  Terpilih: {formData.studyDays.length} hari per minggu (
                  {formData.studyDays.join(", ")})
                </span>
              </div>

              {/* Bagian 3: Preferensi Metode Belajar */}
              <div>
                <label className="text-xs font-bold text-[#1e293b] block mb-1">
                  Preferensi Metode Belajar <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-[#64748b] block mb-2.5">
                  Boleh pilih lebih dari satu. AI akan memprioritaskan format ini dalam rekomendasi latihan harian.
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STUDY_PREFERENCES.map((pref) => {
                    const isSelected = formData.preferences.includes(pref.id);
                    return (
                      <div
                        key={pref.id}
                        onClick={() => handleTogglePreference(pref.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleTogglePreference(pref.id);
                          }
                        }}
                        className={`p-3.5 rounded-[8px] border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isSelected
                            ? "bg-[#eff6ff] border-[#3b76e1]"
                            : "bg-white border-[#e2e8f0] hover:bg-[#f8fafc]"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-[4px] border flex items-center justify-center text-xs mt-0.5 shrink-0 ${
                            isSelected
                              ? "bg-[#3b76e1] border-[#3b76e1] text-white"
                              : "border-[#cbd5e1] bg-white"
                          }`}
                        >
                          {isSelected && <i className="bi bi-check-lg"></i>}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <i className={`${pref.icon} text-sm text-[#3b76e1]`}></i>
                            <h4 className="text-[13px] font-bold text-[#1e293b]">
                              {pref.title}
                            </h4>
                          </div>
                          <p className="text-[11.5px] text-[#64748b] mt-0.5 leading-relaxed">
                            {pref.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            LANGKAH 4: TINJAUAN RINGKASAN & PEMBUATAN RENCANA AI
            =================================================================== */}
        {currentStep === 4 && (
          <div>
            <div className="mb-5 pb-3 border-b border-[#f1f5f9]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3b76e1] bg-[#eff6ff] px-2 py-0.5 rounded-sm">
                Langkah 4 dari 4
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1e293b] mt-1.5">
                Tinjau Pengaturan Rencana Belajar Anda
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Pastikan data di bawah sudah sesuai sebelum AI memproses target harian.
              </p>
            </div>

            <div className="space-y-4">
              {/* Bagian 1: Regio Anatomi */}
              <div className="p-4 rounded-[8px] bg-[#f8fafc] border border-[#e2e8f0]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1e293b] uppercase tracking-wider flex items-center gap-1.5">
                    <i className="bi bi-layers text-[#3b76e1]"></i>
                    Regio Anatomi Terpilih ({formData.selectedRegions.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-[#3b76e1] hover:underline"
                  >
                    Ubah
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.selectedRegions.map((rId) => {
                    const reg = mockAnatomyRegions.find((r) => r.id === rId);
                    return (
                      <span
                        key={rId}
                        className="px-2.5 py-1 rounded-full bg-white border border-[#cbd5e1] text-xs font-semibold text-[#1e293b] flex items-center gap-1.5 shadow-2xs"
                      >
                        <i className={`${reg?.icon || "bi bi-check"} text-[#3b76e1]`}></i>
                        {reg?.name || rId}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Bagian 2: Jadwal Ujian */}
              <div className="p-4 rounded-[8px] bg-[#f8fafc] border border-[#e2e8f0]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1e293b] uppercase tracking-wider flex items-center gap-1.5">
                    <i className="bi bi-calendar-event text-[#3b76e1]"></i>
                    Jadwal Target Ujian
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-semibold text-[#3b76e1] hover:underline"
                  >
                    Ubah
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#64748b] block text-[11px]">Nama Blok:</span>
                    <strong className="text-[#1e293b] font-semibold">
                      {formData.examName || "Ujian Anatomi"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64748b] block text-[11px]">Tanggal Pelaksanaan:</span>
                    <strong className="text-[#1e293b] font-semibold">
                      {new Date(formData.examDate).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      <span className="text-[#3b76e1]">({daysUntilExam} hari lagi)</span>
                    </strong>
                  </div>
                </div>
              </div>

              {/* Bagian 3: Komitmen & Preferensi */}
              <div className="p-4 rounded-[8px] bg-[#f8fafc] border border-[#e2e8f0]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1e293b] uppercase tracking-wider flex items-center gap-1.5">
                    <i className="bi bi-clock-history text-[#3b76e1]"></i>
                    Komitmen Waktu & Format
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs font-semibold text-[#3b76e1] hover:underline"
                  >
                    Ubah
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#64748b] block text-[11px]">Durasi Harian:</span>
                    <strong className="text-[#1e293b] font-semibold">
                      {formData.dailyHours} Jam / hari
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64748b] block text-[11px]">Hari Belajar:</span>
                    <strong className="text-[#1e293b] font-semibold">
                      {formData.studyDays.join(", ")} ({formData.studyDays.length} hari/minggu)
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#64748b] block text-[11px]">Metode Prioritas:</span>
                    <strong className="text-[#1e293b] font-semibold">
                      {formData.preferences
                        .map(
                          (pId) =>
                            STUDY_PREFERENCES.find((sp) => sp.id === pId)?.title
                        )
                        .join(", ")}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Catatan Transparansi AI */}
              <div className="p-3 bg-[#eff6ff] border border-[#dbeafe] rounded-[6px] text-xs text-[#1e40af] flex items-center gap-2">
                <i className="bi bi-robot text-base shrink-0"></i>
                <span className="text-[11.5px] leading-relaxed">
                  Rencana disusun oleh AI sebagai alat bantu belajar adaptif dan bukan penilai kelulusan formal.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            PESAN GALAT VALIDASI (Jika Ada)
            =================================================================== */}
        {validationError && (
          <div className="mt-4 p-3 rounded-[6px] bg-[#fef2f2] border border-[#fecaca] text-xs text-[#b91c1c] flex items-center gap-2">
            <i className="bi bi-exclamation-circle-fill text-sm shrink-0"></i>
            <span>{validationError}</span>
          </div>
        )}

        {/* ===================================================================
            TOMBOL KONTROL WIZARD (KEMBALI & LANJUT)
            =================================================================== */}
        <div className="mt-6 pt-4 border-t border-[#f1f5f9] flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 rounded-[6px] border border-[#cbd5e1] bg-white text-xs font-semibold text-[#334155] hover:bg-[#f1f5f9] transition-all flex items-center gap-1.5"
            >
              <i className="bi bi-arrow-left"></i>
              <span>Kembali</span>
            </button>
          ) : (
            <div></div> // Placeholder untuk menjaga tombol lanjut di sisi kanan
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={Boolean(validationError)}
              className={`px-5 py-2.5 rounded-[6px] text-xs font-semibold transition-all flex items-center gap-1.5 ${
                validationError
                  ? "bg-[#e2e8f0] text-[#94a3b8] cursor-not-allowed"
                  : "bg-[#3b76e1] text-white hover:bg-[#2563eb] shadow-xs active:scale-95"
              }`}
            >
              <span>Lanjut ke Langkah Berikutnya</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCreatePlan}
              className="px-6 py-2.5 rounded-[6px] text-xs font-bold bg-[#198754] text-white hover:bg-[#157347] shadow-sm active:scale-95 transition-all flex items-center gap-2"
            >
              <i className="bi bi-magic"></i>
              <span>Buat Rencana Belajar</span>
            </button>
          )}
        </div>
      </div>

      {/* =====================================================================
          MODAL SIMULASI PROSES AI (~3 DETIK)
          ===================================================================== */}
      {isGenerating && (
        <div className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[12px] p-6 shadow-xl border border-[#e2e8f0] text-center">
            {/* Spinner AI */}
            <div className="w-12 h-12 border-3 border-[#3b76e1]/20 border-t-[#3b76e1] rounded-full animate-spin mx-auto mb-4"></div>

            <h3 className="text-base font-bold text-[#1e293b] mb-1">
              Menyusun Rencana Belajar Adaptif
            </h3>
            <p className="text-xs text-[#64748b] mb-4">
              AI PRIMA sedang memproses data pengaturan Anda...
            </p>

            {/* Pesan Tahapan AI */}
            <div className="p-3 bg-[#eff6ff] border border-[#dbeafe] rounded-[6px] text-xs font-medium text-[#1e40af] min-h-[44px] flex items-center justify-center">
              <span>{loadingMessage}</span>
            </div>

            {/* Progress Bar Loading */}
            <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-[#3b76e1] h-full animate-pulse w-full"></div>
            </div>

            <span className="text-[11px] text-[#64748b] mt-3 block">
              Mohon tunggu beberapa saat...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
