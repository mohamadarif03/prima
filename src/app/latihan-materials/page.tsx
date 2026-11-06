"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  mockMaterials,
  mockMaterialQuizQuestions,
  mockQuizSessionHistories,
  MaterialQuizQuestion,
  QuizSessionHistoryItem,
} from "@/lib/mock-data";
import { EmptyState } from "@/components/ui/EmptyState";

type StageMode = "setup" | "session" | "result";
type QuizMode = "latihan" | "simulasi";
type DifficultyFilter = "semua" | "mudah" | "sedang" | "sulit";

function LatihanSoalContent() {
  const searchParams = useSearchParams();
  const paramMateriId = searchParams.get("materi");
  const paramSubtopicId = searchParams.get("subtopic");

  // ==========================================
  // STATE STAGE & KONFIGURASI
  // ==========================================
  const [currentStage, setCurrentStage] = useState<StageMode>("setup");
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(
    paramMateriId || "mat-01"
  );
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>(
    paramSubtopicId || "semua"
  );
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("semua");
  const [quizMode, setQuizMode] = useState<QuizMode>("latihan");
  const [enableTimer, setEnableTimer] = useState<boolean>(true);

  // Riwayat Sesi
  const [sessionHistories, setSessionHistories] = useState<QuizSessionHistoryItem[]>(
    mockQuizSessionHistories
  );

  // Simulasi Pembuatan Soal oleh AI
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateStep, setGenerateStep] = useState<number>(1);
  const [generatePercent, setGeneratePercent] = useState<number>(10);

  // ==========================================
  // STATE SESI SOAL
  // ==========================================
  const [activeQuestions, setActiveQuestions] = useState<MaterialQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [markedQuestions, setMarkedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5 menit default
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState<boolean>(false);

  // Dialog Laporkan Soal
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>("Kunci jawaban keliru");
  const [reportNote, setReportNote] = useState<string>("");

  // ==========================================
  // STATE HASIL
  // ==========================================
  const [reviewFilter, setReviewFilter] = useState<"semua" | "salah" | "ditandai">("semua");

  // Toast Notifikasi
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sinkronisasi query param materi jika berubah
  useEffect(() => {
    if (paramMateriId) {
      setSelectedMaterialId(paramMateriId);
    }
    if (paramSubtopicId) {
      setSelectedSubtopicId(paramSubtopicId);
    }
  }, [paramMateriId, paramSubtopicId]);

  // Materi yang sedang dipilih
  const currentMaterial = useMemo(() => {
    return mockMaterials.find((m) => m.id === selectedMaterialId) || mockMaterials[0];
  }, [selectedMaterialId]);

  // Daftar subtopik untuk materi terpilih
  const availableSubtopics = useMemo(() => {
    return currentMaterial?.subtopics || [];
  }, [currentMaterial]);

  // Timer Countdown / Stopwatch
  useEffect(() => {
    if (currentStage !== "session") return;

    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);

      if (quizMode === "simulasi" && enableTimer) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishSession();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStage, quizMode, enableTimer]);

  // Format detik ke mm:ss
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ==========================================
  // HANDLER TAHAP 1: MULAI SESI (SIMULASI AI)
  // ==========================================
  const handleStartSession = () => {
    setIsGenerating(true);
    setGenerateStep(1);
    setGeneratePercent(25);

    // Langkah 1: Analisis materi
    setTimeout(() => {
      setGenerateStep(2);
      setGeneratePercent(65);
    }, 800);

    // Langkah 2: Susun distractor & klinis
    setTimeout(() => {
      setGenerateStep(3);
      setGeneratePercent(95);
    }, 1600);

    // Selesai & inisialisasi soal
    setTimeout(() => {
      setGeneratePercent(100);
      setIsGenerating(false);

      // Filter bank soal yang cocok
      let pool = mockMaterialQuizQuestions.filter((q) => q.materialId === selectedMaterialId);

      if (selectedSubtopicId !== "semua") {
        pool = pool.filter((q) => q.subtopicId === selectedSubtopicId);
      }

      if (difficulty !== "semua") {
        pool = pool.filter((q) => q.difficulty === difficulty);
      }

      // Jika pool kosong karena filter terlalu sempit, fallback ke pool materi
      if (pool.length === 0) {
        pool = mockMaterialQuizQuestions.filter((q) => q.materialId === selectedMaterialId);
      }
      if (pool.length === 0) {
        pool = mockMaterialQuizQuestions;
      }

      // Ambil sejumlah questionCount
      const selectedPool = pool.slice(0, questionCount);

      setActiveQuestions(selectedPool);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setMarkedQuestions({});
      setSecondsElapsed(0);
      setSecondsRemaining(questionCount * 60); // 1 menit per soal
      setCurrentStage("session");
    }, 2200);
  };

  // ==========================================
  // HANDLER TAHAP 2: INTERAKSI SOAL
  // ==========================================
  const currentQuestion = activeQuestions[currentQuestionIndex];

  const handleSelectOption = (optionId: "A" | "B" | "C" | "D") => {
    if (!currentQuestion) return;

    // Di mode latihan, jangan ubah jawaban setelah menjawab untuk menjaga keaslian umpan balik
    if (quizMode === "latihan" && userAnswers[currentQuestion.id]) {
      return;
    }

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleToggleMark = () => {
    if (!currentQuestion) return;
    setMarkedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleFinishSession = () => {
    setIsSubmitConfirmOpen(false);

    // Hitung skor akhir
    let correct = 0;
    activeQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOptionId) {
        correct++;
      }
    });

    const calculatedScore =
      activeQuestions.length > 0 ? Math.round((correct / activeQuestions.length) * 100) : 0;

    // Simpan ke riwayat sesi
    const newHistory: QuizSessionHistoryItem = {
      id: `hist-${Date.now().toString().slice(-4)}`,
      dateStr: "Hari ini, baru saja",
      materialTitle: currentMaterial?.title || "Latihan Mandiri Anatomi",
      materialId: selectedMaterialId,
      mode: quizMode,
      score: calculatedScore,
      totalQuestions: activeQuestions.length,
      correctCount: correct,
      durationSeconds: secondsElapsed,
    };

    setSessionHistories((prev) => [newHistory, ...prev]);
    setCurrentStage("result");
  };

  // Kirim Laporan Soal
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportModalOpen(false);
    setReportNote("");
    showToast("Terima kasih! Laporan butir soal telah dicatat untuk evaluasi tim kurikulum.");
  };

  // ==========================================
  // HANDLER TAHAP 3: HASIL & RETEST
  // ==========================================
  // Statistik Hasil
  const resultStats = useMemo(() => {
    let correct = 0;
    let answered = 0;
    const wrongQuestions: MaterialQuizQuestion[] = [];

    activeQuestions.forEach((q) => {
      const ans = userAnswers[q.id];
      if (ans) answered++;
      if (ans === q.correctOptionId) {
        correct++;
      } else {
        wrongQuestions.push(q);
      }
    });

    const score =
      activeQuestions.length > 0 ? Math.round((correct / activeQuestions.length) * 100) : 0;

    // Breakdown per subtopik
    const subtopicBreakdown: Record<
      string,
      { title: string; total: number; correct: number; percentage: number }
    > = {};

    activeQuestions.forEach((q) => {
      if (!subtopicBreakdown[q.subtopicTitle]) {
        subtopicBreakdown[q.subtopicTitle] = {
          title: q.subtopicTitle,
          total: 0,
          correct: 0,
          percentage: 0,
        };
      }
      subtopicBreakdown[q.subtopicTitle].total++;
      if (userAnswers[q.id] === q.correctOptionId) {
        subtopicBreakdown[q.subtopicTitle].correct++;
      }
    });

    Object.values(subtopicBreakdown).forEach((item) => {
      item.percentage = Math.round((item.correct / item.total) * 100);
    });

    return {
      score,
      correct,
      answered,
      total: activeQuestions.length,
      wrongQuestions,
      subtopicBreakdown: Object.values(subtopicBreakdown),
    };
  }, [activeQuestions, userAnswers]);

  // Ulangi Soal yang Salah
  const handleRetryWrongQuestions = () => {
    if (resultStats.wrongQuestions.length === 0) {
      showToast("Selamat! Semua soal telah dijawab dengan benar.");
      return;
    }
    setActiveQuestions(resultStats.wrongQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setMarkedQuestions({});
    setSecondsElapsed(0);
    setSecondsRemaining(resultStats.wrongQuestions.length * 60);
    setCurrentStage("session");
  };

  // Filter Tinjauan Jawaban
  const filteredReviewQuestions = useMemo(() => {
    return activeQuestions.filter((q) => {
      const isWrong = userAnswers[q.id] !== q.correctOptionId;
      const isMarked = !!markedQuestions[q.id];

      if (reviewFilter === "salah") return isWrong;
      if (reviewFilter === "ditandai") return isMarked;
      return true;
    });
  }, [activeQuestions, userAnswers, markedQuestions, reviewFilter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#1e293b] text-white px-4 py-3 rounded-[8px] shadow-lg flex items-center gap-2.5 text-[13px] border border-[#334155] animate-fade-in"
        >
          <i className="bi bi-check-circle-fill text-[#10b981] text-[16px]"></i>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#94a3b8] hover:text-white"
            aria-label="Tutup notifikasi"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAHAP 1: PENGATURAN SESI LATIHAN */}
      {/* ========================================================= */}
      {currentStage === "setup" && (
        <div className="space-y-6">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12px] font-semibold text-[#64748b] uppercase tracking-wider">
                  PRIMA · Fitur AI (F4)
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#0d6efd] font-bold border border-[#bfdbfe]">
                  Generator Soal Adaptif
                </span>
              </div>
              <h1 className="text-[22px] sm:text-[26px] font-bold text-[#1e293b] tracking-tight">
                Latihan Soal & Simulasi Ujian
              </h1>
              <p className="text-[13px] sm:text-[14px] text-[#64748b] mt-0.5">
                AI menyusun soal pilihan ganda dengan kasus klinis dan nama Latin dari materi kuliah yang kamu unggah.
              </p>
            </div>

            <Link
              href="/materi"
              className="h-[34px] px-3.5 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#475569] text-[12.5px] font-medium rounded-[6px] flex items-center gap-1.5 self-start sm:self-auto transition"
            >
              <i className="bi bi-book"></i>
              <span>Pilih dari Halaman Materi</span>
            </Link>
          </div>

          {/* GRID: KARTU KONFIGURASI + RIWAYAT SESI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* KOLOM KIRI (7/12): FORM PENGATURAN */}
            <div className="lg:col-span-7 xl:col-span-8 bg-white border border-[#e2e8f0] rounded-[8px] p-5 sm:p-6 shadow-xs">
              <h2 className="text-[15px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
                <i className="bi bi-sliders text-[#0d6efd]"></i>
                <span>Pengaturan Sesi Latihan</span>
              </h2>

              <div className="space-y-5">
                {/* 1. Pilih Materi */}
                <div>
                  <label className="block text-[12px] font-bold text-[#1e293b] mb-1.5">
                    1. Sumber Materi Kuliah <span className="text-[#dc2626]">*</span>
                  </label>
                  <select
                    value={selectedMaterialId}
                    onChange={(e) => {
                      setSelectedMaterialId(e.target.value);
                      setSelectedSubtopicId("semua");
                    }}
                    className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd]"
                  >
                    {mockMaterials
                      .filter((m) => m.status === "ready")
                      .map((mat) => (
                        <option key={mat.id} value={mat.id}>
                          {mat.title} ({mat.region} · {mat.subtopics.length} Subtopik)
                        </option>
                      ))}
                  </select>
                </div>

                {/* 2. Pilih Subtopik Spesifik */}
                <div>
                  <label className="block text-[12px] font-bold text-[#1e293b] mb-1.5">
                    2. Subtopik Spesifik
                  </label>
                  <select
                    value={selectedSubtopicId}
                    onChange={(e) => setSelectedSubtopicId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd]"
                  >
                    <option value="semua">
                      Semua Subtopik ({availableSubtopics.length} bagian dalam materi ini)
                    </option>
                    {availableSubtopics.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.title} ({sub.latinTerm})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Jumlah Soal & Tingkat Kesulitan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-[#1e293b] mb-1.5">
                      3. Jumlah Butir Soal
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[5, 10, 15].map((cnt) => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => setQuestionCount(cnt)}
                          className={`py-2 text-[12.5px] font-semibold rounded-[6px] border transition ${
                            questionCount === cnt
                              ? "bg-[#0d6efd] text-white border-[#0d6efd] shadow-xs"
                              : "bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f8fafc]"
                          }`}
                        >
                          {cnt} Soal
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#1e293b] mb-1.5">
                      4. Tingkat Kesulitan
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(
                        [
                          { id: "semua", label: "Campur" },
                          { id: "mudah", label: "Mudah" },
                          { id: "sedang", label: "Sedang" },
                          { id: "sulit", label: "Sulit" },
                        ] as const
                      ).map((diff) => (
                        <button
                          key={diff.id}
                          type="button"
                          onClick={() => setDifficulty(diff.id)}
                          className={`py-2 text-[11.5px] font-semibold rounded-[6px] border transition text-center ${
                            difficulty === diff.id
                              ? "bg-[#0d6efd] text-white border-[#0d6efd] shadow-xs"
                              : "bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f8fafc]"
                          }`}
                        >
                          {diff.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Mode Belajar: Latihan vs Simulasi Ujian */}
                <div>
                  <label className="block text-[12px] font-bold text-[#1e293b] mb-1.5">
                    5. Mode Evaluasi
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setQuizMode("latihan")}
                      className={`p-3.5 rounded-[8px] border text-left transition flex items-start gap-3 ${
                        quizMode === "latihan"
                          ? "border-[#0d6efd] bg-[#eff6ff] ring-1 ring-[#0d6efd]"
                          : "border-[#cbd5e1] bg-white hover:bg-[#f8fafc]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          quizMode === "latihan"
                            ? "border-[#0d6efd] bg-[#0d6efd] text-white"
                            : "border-[#cbd5e1] bg-white"
                        }`}
                      >
                        {quizMode === "latihan" && <i className="bi bi-check text-[13px]"></i>}
                      </div>
                      <div>
                        <strong className="text-[13px] font-bold text-[#1e293b] block">
                          Mode Latihan Mandiri
                        </strong>
                        <p className="text-[11.5px] text-[#64748b] mt-0.5 leading-relaxed">
                          Umpan balik langsung setelah menjawab, pembahasan medis instan, dan tautan langsung ke rangkuman materi.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuizMode("simulasi")}
                      className={`p-3.5 rounded-[8px] border text-left transition flex items-start gap-3 ${
                        quizMode === "simulasi"
                          ? "border-[#0d6efd] bg-[#eff6ff] ring-1 ring-[#0d6efd]"
                          : "border-[#cbd5e1] bg-white hover:bg-[#f8fafc]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          quizMode === "simulasi"
                            ? "border-[#0d6efd] bg-[#0d6efd] text-white"
                            : "border-[#cbd5e1] bg-white"
                        }`}
                      >
                        {quizMode === "simulasi" && <i className="bi bi-check text-[13px]"></i>}
                      </div>
                      <div>
                        <strong className="text-[13px] font-bold text-[#1e293b] block">
                          Simulasi Ujian Blok
                        </strong>
                        <p className="text-[11.5px] text-[#64748b] mt-0.5 leading-relaxed">
                          Penilaian dan umpan balik hanya ditampilkan di akhir sesi. Dilengkapi countdown timer resmi ujian.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Opsi Timer (jika Simulasi) */}
                {quizMode === "simulasi" && (
                  <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <i className="bi bi-stopwatch text-[#0d6efd] text-[16px]"></i>
                      <div>
                        <strong className="text-[12px] font-bold text-[#1e293b] block">
                          Aktifkan Batas Waktu Ujian
                        </strong>
                        <span className="text-[11px] text-[#64748b]">
                          {questionCount} menit ({questionCount} soal × 60 detik/soal)
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableTimer}
                        onChange={(e) => setEnableTimer(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[#cbd5e1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0d6efd]"></div>
                    </label>
                  </div>
                )}

                {/* TOMBOL UTAMA BUAT SOAL */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStartSession}
                    disabled={isGenerating}
                    className="w-full h-[42px] bg-[#0d6efd] hover:bg-[#0b5ed7] disabled:bg-[#94a3b8] text-white font-bold text-[13.5px] rounded-[6px] flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    <i className="bi bi-stars"></i>
                    <span>Buat Soal &amp; Mulai Sesi ({questionCount} Soal)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN (5/12): RIWAYAT SESI */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-4">
              <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-3">
                  <h3 className="text-[13.5px] font-bold text-[#1e293b] flex items-center gap-2">
                    <i className="bi bi-clock-history text-[#0d6efd]"></i>
                    <span>Riwayat Sesi Latihan</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded">
                    {sessionHistories.length} Sesi
                  </span>
                </div>

                {sessionHistories.length === 0 ? (
                  <p className="text-[12px] text-[#64748b] text-center py-6">
                    Belum ada riwayat sesi latihan.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {sessionHistories.map((hist) => (
                      <div
                        key={hist.id}
                        className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] hover:border-[#cbd5e1] transition"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <strong className="text-[12.5px] font-bold text-[#1e293b] leading-snug line-clamp-1">
                            {hist.materialTitle}
                          </strong>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold flex-shrink-0 ${
                              hist.score >= 80
                                ? "bg-[#dcfce7] text-[#166534]"
                                : hist.score >= 60
                                ? "bg-[#dbeafe] text-[#1e40af]"
                                : "bg-[#fee2e2] text-[#991b1b]"
                            }`}
                          >
                            {hist.score}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                          <span>
                            {hist.correctCount}/{hist.totalQuestions} Benar ·{" "}
                            {formatTime(hist.durationSeconds)}
                          </span>
                          <span className="capitalize text-[#475569] font-medium">
                            Mode {hist.mode}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#94a3b8] mt-1">{hist.dateStr}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CATATAN STANDAR PRIMA */}
              <div className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] text-[11.5px] text-[#64748b] leading-relaxed">
                <i className="bi bi-info-circle me-1.5 text-[#0d6efd]"></i>
                PRIMA menyusun butir soal menggunakan istilah Latin medis baku dan kasus skenario klinis. Dibuat oleh AI dan dapat mengandung kesalahan.
              </div>
            </div>
          </div>

          {/* MODAL SIMULASI LOADING AI BERTAPAP */}
          {isGenerating && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            >
              <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-xl max-w-md w-full p-6 text-center animate-scale-up">
                <div className="w-12 h-12 rounded-full bg-[#eff6ff] text-[#0d6efd] flex items-center justify-center mx-auto mb-4 text-[22px]">
                  <i className="bi bi-stars animate-spin"></i>
                </div>
                <h3 className="text-[16px] font-bold text-[#1e293b] mb-1">
                  Menyusun Butir Soal AI
                </h3>
                <p className="text-[12.5px] text-[#64748b] mb-4">
                  Menganalisis subtopik &ldquo;{currentMaterial?.title}&rdquo;...
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-[#e2e8f0] h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-[#0d6efd] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${generatePercent}%` }}
                  ></div>
                </div>

                <div className="text-[12px] font-semibold text-[#0d6efd]">
                  {generateStep === 1 && "1. Menyiapkan butir soal dan skenario klinis..."}
                  {generateStep === 2 && "2. Menyusun opsi distractor & istilah Latin..."}
                  {generateStep === 3 && "3. Mengalibrasi pembahasan medis..."}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAHAP 2: SESI PENGERJAAN SOAL */}
      {/* ========================================================= */}
      {currentStage === "session" && currentQuestion && (
        <div className="space-y-5">
          {/* TOP BAR SESI */}
          <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d6efd] bg-[#eff6ff] px-2 py-0.5 rounded-[4px] border border-[#bfdbfe]">
                {currentQuestion.region}
              </span>
              <span className="text-[12px] font-bold text-[#1e293b] truncate max-w-[240px] sm:max-w-md">
                {currentQuestion.subtopicTitle}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  quizMode === "latihan"
                    ? "bg-[#dcfce7] text-[#166534]"
                    : "bg-[#fef3c7] text-[#92400e]"
                }`}
              >
                {quizMode === "latihan" ? "Mode Latihan" : "Simulasi Ujian"}
              </span>
            </div>

            {/* TIMER & AKSI KELUAR */}
            <div className="flex items-center gap-3">
              {quizMode === "simulasi" && enableTimer ? (
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px] font-mono text-[13px] font-bold ${
                    secondsRemaining < 60
                      ? "bg-[#fee2e2] text-[#dc2626] animate-pulse"
                      : "bg-[#f1f5f9] text-[#1e293b]"
                  }`}
                >
                  <i className="bi bi-alarm"></i>
                  <span>{formatTime(secondsRemaining)}</span>
                </div>
              ) : (
                <div className="text-[12px] text-[#64748b] flex items-center gap-1">
                  <i className="bi bi-clock"></i>
                  <span>{formatTime(secondsElapsed)}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="text-[11.5px] text-[#64748b] hover:text-[#dc2626] flex items-center gap-1"
                title="Laporkan butir soal ini"
              >
                <i className="bi bi-flag"></i>
                <span className="hidden sm:inline">Laporkan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm("Keluar dari sesi latihan ini? Jawaban belum tersimpan.")) {
                    setCurrentStage("setup");
                  }
                }}
                className="text-[11.5px] text-[#64748b] hover:text-[#1e293b] px-2 py-1 rounded hover:bg-[#f1f5f9]"
              >
                Keluar
              </button>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0d6efd] h-1.5 rounded-full transition-all duration-200"
              style={{
                width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%`,
              }}
            ></div>
          </div>

          {/* MAIN GRID: SOAL (Kiri) + NAVIGATOR NOMOR (Kanan) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* KOLOM KIRI (8/12): KARTU SOAL & OPSI */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-5 sm:p-6 shadow-xs">
                {/* Header Nomor Soal & Kesulitan */}
                <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#1e293b]">
                      Soal No. {currentQuestionIndex + 1} dari {activeQuestions.length}
                    </span>
                    <span
                      className={`text-[10.5px] font-bold uppercase px-2 py-0.5 rounded ${
                        currentQuestion.difficulty === "mudah"
                          ? "bg-[#dcfce7] text-[#166534]"
                          : currentQuestion.difficulty === "sedang"
                          ? "bg-[#dbeafe] text-[#1e40af]"
                          : "bg-[#fee2e2] text-[#991b1b]"
                      }`}
                    >
                      {currentQuestion.difficulty}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleMark}
                    className={`px-2.5 py-1 text-[11.5px] font-semibold rounded-[6px] border flex items-center gap-1.5 transition ${
                      markedQuestions[currentQuestion.id]
                        ? "bg-[#fef3c7] text-[#92400e] border-[#fde68a]"
                        : "bg-white text-[#64748b] border-[#cbd5e1] hover:bg-[#f8fafc]"
                    }`}
                  >
                    <i
                      className={
                        markedQuestions[currentQuestion.id]
                          ? "bi bi-bookmark-fill text-[#d97706]"
                          : "bi bi-bookmark"
                      }
                    ></i>
                    <span>
                      {markedQuestions[currentQuestion.id] ? "Ditandai (Ragu)" : "Tandai Soal"}
                    </span>
                  </button>
                </div>

                {/* Skenario Klinis / Vignette (jika ada) */}
                {currentQuestion.vignette && (
                  <div className="mb-4 p-3.5 bg-[#f8fafc] border-l-4 border-l-[#0d6efd] border border-[#e2e8f0] rounded-r-[6px] text-[13px] text-[#334155] leading-relaxed flex items-start gap-2.5">
                    <i className="bi bi-hospital text-[#0d6efd] text-[16px] mt-0.5 flex-shrink-0"></i>
                    <div>
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#64748b] block mb-0.5">
                        Skenario Klinis
                      </span>
                      <p>{currentQuestion.vignette}</p>
                    </div>
                  </div>
                )}

                {/* Teks Pertanyaan */}
                <h3 className="text-[15px] font-bold text-[#1e293b] leading-relaxed mb-5">
                  {currentQuestion.questionText}
                </h3>

                {/* 4 OPSI PILIHAN GANDA (A, B, C, D) */}
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = userAnswers[currentQuestion.id] === opt.id;
                    const isAnswered = !!userAnswers[currentQuestion.id];
                    const isCorrect = opt.id === currentQuestion.correctOptionId;

                    // Di mode latihan, berikan umpan balik warna instan
                    let optionStyle =
                      "border-[#cbd5e1] bg-white hover:bg-[#f8fafc] text-[#334155]";
                    let badgeStyle = "bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]";

                    if (quizMode === "latihan" && isAnswered) {
                      if (isCorrect) {
                        optionStyle = "border-[#16a34a] bg-[#f0fdf4] text-[#166534] font-medium";
                        badgeStyle = "bg-[#16a34a] text-white border-[#16a34a]";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "border-[#dc2626] bg-[#fef2f2] text-[#991b1b]";
                        badgeStyle = "bg-[#dc2626] text-white border-[#dc2626]";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-[#0d6efd] bg-[#eff6ff] text-[#1e293b] font-medium ring-1 ring-[#0d6efd]";
                      badgeStyle = "bg-[#0d6efd] text-white border-[#0d6efd]";
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        className={`w-full p-3.5 rounded-[8px] border text-left flex items-start gap-3 transition ${optionStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[12px] flex-shrink-0 mt-0.5 ${badgeStyle}`}
                        >
                          {opt.id}
                        </span>
                        <span className="text-[13.5px] leading-relaxed flex-1">{opt.text}</span>
                        {quizMode === "latihan" && isAnswered && (
                          <span className="flex-shrink-0 ml-2">
                            {isCorrect && (
                              <i className="bi bi-check-circle-fill text-[#16a34a] text-[16px]"></i>
                            )}
                            {isSelected && !isCorrect && (
                              <i className="bi bi-x-circle-fill text-[#dc2626] text-[16px]"></i>
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* PEMBAHASAN MEDIS INSTAN (Hanya Mode Latihan & Sudah Dijawab) */}
                {quizMode === "latihan" && userAnswers[currentQuestion.id] && (
                  <div className="p-4 bg-[#eff6ff] border border-[#bfdbfe] rounded-[8px] space-y-2 animate-fade-in mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e40af]">
                        <i className="bi bi-journal-medical text-[15px]"></i>
                        <span>Pembahasan Medis PRIMA</span>
                      </div>
                      <Link
                        href={`/materi/${currentQuestion.materialSource.materialId}`}
                        className="text-[11.5px] text-[#0d6efd] hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>Lihat di Materi (Hal {currentQuestion.materialSource.page})</span>
                        <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>

                    <p className="text-[12.5px] text-[#334155] leading-relaxed">
                      {currentQuestion.explanation}
                    </p>

                    <div className="pt-2 border-t border-[#bfdbfe]/60 flex items-center gap-2 text-[11px] text-[#64748b]">
                      <span className="font-semibold text-[#1e293b]">Istilah Latin Terkait:</span>
                      <div className="flex flex-wrap gap-1">
                        {currentQuestion.latinTerms.map((term, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-white px-2 py-0.5 rounded border border-[#bfdbfe] italic text-[#0d6efd]"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TOMBOL NAVIGASI SOAL */}
                <div className="flex items-center justify-between pt-3 border-t border-[#f1f5f9]">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    className="px-3.5 py-1.5 bg-white hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed border border-[#cbd5e1] rounded-[6px] text-[12.5px] font-medium text-[#475569] flex items-center gap-1.5 transition"
                  >
                    <i className="bi bi-chevron-left"></i>
                    <span>Sebelumnya</span>
                  </button>

                  {currentQuestionIndex < activeQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentQuestionIndex((prev) =>
                          Math.min(activeQuestions.length - 1, prev + 1)
                        )
                      }
                      className="px-4 py-1.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded-[6px] text-[12.5px] font-semibold flex items-center gap-1.5 transition shadow-xs"
                    >
                      <span>Berikutnya</span>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (quizMode === "simulasi") {
                          setIsSubmitConfirmOpen(true);
                        } else {
                          handleFinishSession();
                        }
                      }}
                      className="px-4 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-[6px] text-[12.5px] font-semibold flex items-center gap-1.5 transition shadow-xs"
                    >
                      <i className="bi bi-check2-all"></i>
                      <span>Selesaikan Sesi</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* KOLOM KANAN (4/12): NAVIGATOR NOMOR SOAL */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-5 shadow-xs">
                <h3 className="text-[13px] font-bold text-[#1e293b] mb-3 flex items-center justify-between">
                  <span>Navigator Nomor Soal</span>
                  <span className="text-[11px] font-normal text-[#64748b]">
                    {Object.keys(userAnswers).length} / {activeQuestions.length} Terjawab
                  </span>
                </h3>

                {/* Grid Nomor Soal */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {activeQuestions.map((q, idx) => {
                    const isCurrent = idx === currentQuestionIndex;
                    const isAnswered = !!userAnswers[q.id];
                    const isMarked = !!markedQuestions[q.id];

                    let btnStyle = "bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f8fafc]";
                    if (isCurrent) {
                      btnStyle = "bg-[#0d6efd] text-white border-[#0d6efd] font-bold ring-2 ring-[#bfdbfe]";
                    } else if (isMarked) {
                      btnStyle = "bg-[#fef3c7] text-[#92400e] border-[#fde68a] font-bold";
                    } else if (isAnswered) {
                      btnStyle = "bg-[#dcfce7] text-[#166534] border-[#86efac] font-bold";
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-9 rounded-[6px] border text-[12px] flex items-center justify-center transition relative ${btnStyle}`}
                      >
                        <span>{idx + 1}</span>
                        {isMarked && !isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] absolute top-1 right-1"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legenda Warna */}
                <div className="pt-3 border-t border-[#f1f5f9] grid grid-cols-2 gap-2 text-[11px] text-[#64748b]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#0d6efd]"></span>
                    <span>Aktif</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#dcfce7] border border-[#86efac]"></span>
                    <span>Sudah dijawab</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#fef3c7] border border-[#fde68a]"></span>
                    <span>Ragu-ragu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-white border border-[#cbd5e1]"></span>
                    <span>Belum dijawab</span>
                  </div>
                </div>

                {/* Selesaikan Sesi Cepat */}
                <div className="mt-4 pt-3 border-t border-[#f1f5f9]">
                  <button
                    type="button"
                    onClick={() => {
                      if (quizMode === "simulasi") {
                        setIsSubmitConfirmOpen(true);
                      } else {
                        handleFinishSession();
                      }
                    }}
                    className="w-full h-[36px] bg-[#16a34a] hover:bg-[#15803d] text-white rounded-[6px] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <i className="bi bi-check2-all"></i>
                    <span>Selesaikan Latihan Sekarang</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MODAL KONFIRMASI SELESAIKAN UJIAN (Simulasi Mode) */}
          {isSubmitConfirmOpen && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            >
              <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-xl max-w-sm w-full p-5 text-center animate-scale-up">
                <div className="w-11 h-11 rounded-full bg-[#eff6ff] text-[#0d6efd] flex items-center justify-center mx-auto mb-3 text-[18px]">
                  <i className="bi bi-question-circle-fill"></i>
                </div>
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-1">
                  Kirim Jawaban Ujian?
                </h3>
                <p className="text-[12.5px] text-[#64748b] mb-4">
                  Kamu telah menjawab{" "}
                  <strong>{Object.keys(userAnswers).length}</strong> dari total{" "}
                  <strong>{activeQuestions.length}</strong> soal. Masih ada{" "}
                  {activeQuestions.length - Object.keys(userAnswers).length} soal belum dijawab.
                </p>

                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitConfirmOpen(false)}
                    className="px-3.5 py-1.5 bg-white border border-[#cbd5e1] text-[#475569] rounded-[6px] text-[12.5px] font-medium"
                  >
                    Periksa Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleFinishSession}
                    className="px-4 py-1.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded-[6px] text-[12.5px] font-semibold shadow-xs"
                  >
                    Ya, Kirim Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL DIALOG LAPORKAN SOAL */}
          {isReportModalOpen && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            >
              <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-xl max-w-md w-full p-5 animate-scale-up">
                <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] mb-3">
                  <h3 className="text-[14px] font-bold text-[#1e293b] flex items-center gap-2">
                    <i className="bi bi-flag-fill text-[#dc2626]"></i>
                    <span>Laporkan Butir Soal No. {currentQuestionIndex + 1}</span>
                  </h3>
                  <button
                    onClick={() => setIsReportModalOpen(false)}
                    className="text-[#94a3b8] hover:text-[#475569]"
                  >
                    <i className="bi bi-x-lg text-[13px]"></i>
                  </button>
                </div>

                <form onSubmit={handleSubmitReport} className="space-y-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#1e293b] mb-1">
                      Kategori Laporan
                    </label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[12.5px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd]"
                    >
                      <option value="Kunci jawaban keliru">Kunci jawaban keliru</option>
                      <option value="Fakta klinis/anatomi tidak akurat">
                        Fakta klinis / anatomi tidak akurat
                      </option>
                      <option value="Istilah Latin keliru eja">Istilah Latin keliru eja</option>
                      <option value="Pembahasan kurang jelas">Pembahasan kurang jelas</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#1e293b] mb-1">
                      Catatan Perbaikan (Opsional)
                    </label>
                    <textarea
                      rows={3}
                      value={reportNote}
                      onChange={(e) => setReportNote(e.target.value)}
                      placeholder="Jelaskan alasan atau referensi buku teks yang benar..."
                      className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[12.5px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsReportModalOpen(false)}
                      className="px-3 py-1.5 bg-white border border-[#cbd5e1] text-[#475569] rounded-[6px] text-[12px] font-medium"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-[#dc2626] text-white rounded-[6px] text-[12px] font-semibold"
                    >
                      Kirim Laporan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAHAP 3: HASIL & ANALISIS PERFORMA */}
      {/* ========================================================= */}
      {currentStage === "result" && (
        <div className="space-y-6">
          {/* KARTU SKOR UTAMA */}
          <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#f1f5f9]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d6efd] bg-[#eff6ff] px-2 py-0.5 rounded-[4px] border border-[#bfdbfe]">
                  Hasil Evaluasi Selesai
                </span>
                <h1 className="text-[22px] font-bold text-[#1e293b] mt-1.5">
                  Ringkasan Skor Latihan Anatomi
                </h1>
                <p className="text-[13px] text-[#64748b] mt-0.5">
                  Materi: <strong>{currentMaterial?.title}</strong> · Durasi {formatTime(secondsElapsed)}
                </p>
              </div>

              {/* Skor Gauge Besar */}
              <div className="flex items-center gap-4 self-start md:self-auto">
                <div
                  className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center font-bold ${
                    resultStats.score >= 80
                      ? "border-[#16a34a] text-[#166534] bg-[#f0fdf4]"
                      : resultStats.score >= 60
                      ? "border-[#0d6efd] text-[#1e40af] bg-[#eff6ff]"
                      : "border-[#dc2626] text-[#991b1b] bg-[#fef2f2]"
                  }`}
                >
                  <span className="text-[24px] leading-none">{resultStats.score}</span>
                  <span className="text-[10px] font-medium text-[#64748b]">/ 100</span>
                </div>

                <div>
                  <div className="text-[13px] font-bold text-[#1e293b]">
                    {resultStats.score >= 80
                      ? "Penguasaan Sangat Baik!"
                      : resultStats.score >= 60
                      ? "Pemahaman Cukup Baik"
                      : "Perlu Latihan Tambahan"}
                  </div>
                  <div className="text-[12px] text-[#64748b] mt-0.5">
                    <strong>{resultStats.correct}</strong> benar dari{" "}
                    <strong>{resultStats.total}</strong> soal ({resultStats.wrongQuestions.length} salah)
                  </div>
                </div>
              </div>
            </div>

            {/* AKSI TOMBOL UTAMA HASIL */}
            <div className="pt-4 flex flex-wrap items-center gap-2.5">
              {resultStats.wrongQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={handleRetryWrongQuestions}
                  className="h-[36px] px-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[12.5px] font-semibold rounded-[6px] flex items-center gap-1.5 transition shadow-xs"
                >
                  <i className="bi bi-arrow-repeat"></i>
                  <span>Ulangi {resultStats.wrongQuestions.length} Soal yang Salah</span>
                </button>
              )}

              <Link
                href={`/flashcard?materi=${selectedMaterialId}&from=wrong`}
                className="h-[36px] px-3.5 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#1e293b] text-[12.5px] font-semibold rounded-[6px] flex items-center gap-1.5 transition"
              >
                <i className="bi bi-card-heading text-[#16a34a]"></i>
                <span>Buat Flashcard dari Soal yang Salah</span>
              </Link>

              <button
                type="button"
                onClick={() => setCurrentStage("setup")}
                className="h-[36px] px-3.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12.5px] font-semibold rounded-[6px] flex items-center gap-1.5 transition ml-auto"
              >
                <i className="bi bi-plus-circle"></i>
                <span>Buat Sesi Latihan Baru</span>
              </button>
            </div>
          </div>

          {/* RINCIAN PER SUBTOPIK & LEVEL EVALUASI */}
          <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-5 shadow-xs">
            <h3 className="text-[14px] font-bold text-[#1e293b] mb-3 flex items-center gap-2">
              <i className="bi bi-bar-chart-steps text-[#0d6efd]"></i>
              <span>Rincian Penguasaan Per Subtopik</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resultStats.subtopicBreakdown.map((item, idx) => {
                let badgeLevel = "Baik";
                let badgeClass = "bg-[#dcfce7] text-[#166534] border-[#86efac]";
                if (item.percentage < 60) {
                  badgeLevel = "Perlu diulang";
                  badgeClass = "bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]";
                } else if (item.percentage < 80) {
                  badgeLevel = "Cukup";
                  badgeClass = "bg-[#dbeafe] text-[#1e40af] border-[#bfdbfe]";
                }

                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <strong className="text-[13px] font-bold text-[#1e293b] leading-snug">
                          {item.title}
                        </strong>
                        <span
                          className={`text-[10.5px] font-bold px-2 py-0.5 rounded border flex-shrink-0 ${badgeClass}`}
                        >
                          {badgeLevel}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-[#64748b] mb-2">
                        {item.correct} dari {item.total} soal benar ({item.percentage}%)
                      </div>
                    </div>

                    <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          item.percentage >= 80
                            ? "bg-[#16a34a]"
                            : item.percentage >= 60
                            ? "bg-[#0d6efd]"
                            : "bg-[#dc2626]"
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TINJAUAN BUTIR JAWABAN */}
          <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f1f5f9] mb-4">
              <h3 className="text-[14px] font-bold text-[#1e293b] flex items-center gap-2">
                <i className="bi bi-card-checklist text-[#0d6efd]"></i>
                <span>Tinjauan Pembahasan Soal</span>
              </h3>

              {/* Filter Tinjauan */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setReviewFilter("semua")}
                  className={`px-2.5 py-1 text-[11.5px] font-semibold rounded-[6px] transition ${
                    reviewFilter === "semua"
                      ? "bg-[#0d6efd] text-white"
                      : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
                  }`}
                >
                  Semua ({activeQuestions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter("salah")}
                  className={`px-2.5 py-1 text-[11.5px] font-semibold rounded-[6px] transition ${
                    reviewFilter === "salah"
                      ? "bg-[#dc2626] text-white"
                      : "bg-[#fee2e2] text-[#991b1b] hover:bg-[#fecaca]"
                  }`}
                >
                  Salah ({resultStats.wrongQuestions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter("ditandai")}
                  className={`px-2.5 py-1 text-[11.5px] font-semibold rounded-[6px] transition ${
                    reviewFilter === "ditandai"
                      ? "bg-[#d97706] text-white"
                      : "bg-[#fef3c7] text-[#92400e] hover:bg-[#fde68a]"
                  }`}
                >
                  Ditandai ({Object.values(markedQuestions).filter(Boolean).length})
                </button>
              </div>
            </div>

            {/* List Review Soal */}
            {filteredReviewQuestions.length === 0 ? (
              <p className="text-[12.5px] text-[#64748b] text-center py-6">
                Tidak ada butir soal yang sesuai dengan filter tinjauan.
              </p>
            ) : (
              <div className="space-y-4">
                {filteredReviewQuestions.map((q, idx) => {
                  const userAnswer = userAnswers[q.id];
                  const isCorrect = userAnswer === q.correctOptionId;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-[8px] border transition ${
                        isCorrect
                          ? "border-[#bbf7d0] bg-[#f0fdf4]/50"
                          : "border-[#fecaca] bg-[#fef2f2]/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full font-bold text-[11px] flex items-center justify-center ${
                              isCorrect
                                ? "bg-[#16a34a] text-white"
                                : "bg-[#dc2626] text-white"
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <span className="text-[12px] font-bold text-[#1e293b]">
                            {q.subtopicTitle}
                          </span>
                        </div>

                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            isCorrect
                              ? "bg-[#dcfce7] text-[#166534]"
                              : "bg-[#fee2e2] text-[#991b1b]"
                          }`}
                        >
                          {isCorrect ? "Benar" : "Salah"}
                        </span>
                      </div>

                      {q.vignette && (
                        <p className="text-[12px] text-[#475569] italic bg-white/80 p-2.5 rounded border border-[#e2e8f0] mb-2">
                          {q.vignette}
                        </p>
                      )}

                      <h4 className="text-[13.5px] font-bold text-[#1e293b] mb-3">
                        {q.questionText}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-[12px]">
                        <div className="p-2.5 rounded bg-white border border-[#e2e8f0]">
                          <span className="text-[10.5px] text-[#64748b] block mb-0.5">
                            Jawabanmu:
                          </span>
                          <strong
                            className={isCorrect ? "text-[#166534]" : "text-[#dc2626]"}
                          >
                            {userAnswer
                              ? `${userAnswer}. ${
                                  q.options.find((o) => o.id === userAnswer)?.text
                                }`
                              : "Tidak dijawab"}
                          </strong>
                        </div>
                        <div className="p-2.5 rounded bg-white border border-[#86efac]">
                          <span className="text-[10.5px] text-[#166534] block mb-0.5">
                            Kunci Jawaban Benar:
                          </span>
                          <strong className="text-[#166534]">
                            {q.correctOptionId}.{" "}
                            {q.options.find((o) => o.id === q.correctOptionId)?.text}
                          </strong>
                        </div>
                      </div>

                      {/* Penjelasan Medis */}
                      <div className="p-3 bg-white rounded border border-[#cbd5e1] text-[12px] text-[#334155] leading-relaxed">
                        <strong className="text-[#0d6efd] block mb-1">Pembahasan:</strong>
                        <p>{q.explanation}</p>
                        <div className="mt-2 pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
                          <span className="text-[#64748b]">
                            Istilah: <em>{q.latinTerms.join(", ")}</em>
                          </span>
                          <Link
                            href={`/materi/${q.materialSource.materialId}`}
                            className="text-[#0d6efd] font-semibold hover:underline"
                          >
                            Buka di Materi (Hal {q.materialSource.page}) &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LatihanMaterialsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-[#64748b] text-[13px]">
          <div className="w-6 h-6 border-2 border-[#0d6efd] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Memuat modul latihan soal...
        </div>
      }
    >
      <LatihanSoalContent />
    </Suspense>
  );
}
