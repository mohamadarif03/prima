"use client";

import React, { useState, Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  mock3DStructures,
  mockQuizQuestions,
  mockAnatomyRegions,
  QuizMode,
  QuizQuestionItem,
  Anatomy3DStructure,
} from "@/lib/mock-data";

// Dynamic Client Component Loader for Three.js (No SSR)
const AnatomyViewer = dynamic(
  () =>
    import("@/components/anatomy/AnatomyViewer").then(
      (mod) => mod.AnatomyViewer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] sm:h-[480px] lg:h-full min-h-[380px] flex flex-col items-center justify-center bg-[#f8f9fa] border border-[#e2e8f0] rounded-[8px] p-6 text-center">
        <div className="w-9 h-9 border-3 border-[#0d6efd] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-[13.5px] font-semibold text-[#1e293b]">
          Memuat Model 3D Anatomi...
        </p>
        <p className="text-[12px] text-[#64748b] mt-0.5">
          Menyiapkan grafis WebGL dan koordinat struktur
        </p>
      </div>
    ),
  }
);

export default function LatihanPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#64748b]">
          Memuat modul latihan...
        </div>
      }
    >
      <LatihanContent />
    </Suspense>
  );
}

function LatihanContent() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic") || searchParams.get("topik");

  // Region and mode selection
  const [selectedRegionId, setSelectedRegionId] = useState("reg-01");
  const [currentMode, setCurrentMode] = useState<QuizMode>("klik-struktur");

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredState, setAnsweredState] = useState<
    "unanswered" | "correct" | "incorrect"
  >("unanswered");
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [clickedMeshId, setClickedMeshId] = useState<string | null>(null);
  const [isHintActive, setIsHintActive] = useState(false);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // Score keeping
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectStructures, setIncorrectStructures] = useState<
    Anatomy3DStructure[]
  >([]);

  // Demo loading state
  const [isLoading, setIsLoading] = useState(false);

  // Structures for active region
  const structures = mock3DStructures;

  // Filter questions for the selected mode
  const activeQuestions = useMemo(() => {
    return mockQuizQuestions.filter((q) => q.mode === currentMode);
  }, [currentMode]);

  const currentQuestion: QuizQuestionItem | undefined =
    activeQuestions[currentQuestionIndex];

  // Target structure for current question
  const targetStructure = useMemo(() => {
    if (!currentQuestion) return undefined;
    return structures.find((s) => s.id === currentQuestion.targetStructureId);
  }, [currentQuestion, structures]);

  // Handle Mode Change (Resets session)
  const handleModeChange = (mode: QuizMode) => {
    setCurrentMode(mode);
    setCurrentQuestionIndex(0);
    setAnsweredState("unanswered");
    setSelectedChoiceId(null);
    setClickedMeshId(null);
    setIsHintActive(false);
    setIsSessionFinished(false);
    setCorrectCount(0);
    setIncorrectStructures([]);
  };

  // Reset / Repeat Quiz Session
  const handleResetSession = () => {
    setCurrentQuestionIndex(0);
    setAnsweredState("unanswered");
    setSelectedChoiceId(null);
    setClickedMeshId(null);
    setIsHintActive(false);
    setIsSessionFinished(false);
    setCorrectCount(0);
    setIncorrectStructures([]);
  };

  // Click handler for 3D Mesh (Mode: "klik-struktur")
  const handleMeshClick = (meshId: string) => {
    if (answeredState !== "unanswered" || isSessionFinished) return;
    if (currentMode !== "klik-struktur" || !targetStructure) return;

    setClickedMeshId(meshId);
    setIsHintActive(false);

    if (meshId === targetStructure.id) {
      setAnsweredState("correct");
      setCorrectCount((prev) => prev + 1);
    } else {
      setAnsweredState("incorrect");
      if (!incorrectStructures.some((s) => s.id === targetStructure.id)) {
        setIncorrectStructures((prev) => [...prev, targetStructure]);
      }
    }
  };

  // Option select handler (Mode: "sebutkan-nama")
  const handleOptionSelect = (optionStructureId: string) => {
    if (answeredState !== "unanswered" || isSessionFinished) return;
    if (currentMode !== "sebutkan-nama" || !targetStructure) return;

    setSelectedChoiceId(optionStructureId);
    setIsHintActive(false);

    if (optionStructureId === targetStructure.id) {
      setAnsweredState("correct");
      setCorrectCount((prev) => prev + 1);
    } else {
      setAnsweredState("incorrect");
      if (!incorrectStructures.some((s) => s.id === targetStructure.id)) {
        setIncorrectStructures((prev) => [...prev, targetStructure]);
      }
    }
  };

  // Next Question Button
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < activeQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnsweredState("unanswered");
      setSelectedChoiceId(null);
      setClickedMeshId(null);
      setIsHintActive(false);
    } else {
      setIsSessionFinished(true);
    }
  };

  // Progress calculations
  const totalQuestions = activeQuestions.length;
  const currentStep = Math.min(currentQuestionIndex + 1, totalQuestions);
  const progressPercent =
    totalQuestions > 0 ? Math.round((currentStep / totalQuestions) * 100) : 0;
  const scorePercent =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // 3D visual states calculation
  const correctStructureId =
    answeredState === "correct"
      ? targetStructure?.id || null
      : answeredState === "incorrect"
      ? targetStructure?.id || null
      : null;

  const incorrectStructureId =
    answeredState === "incorrect" && clickedMeshId !== targetStructure?.id
      ? clickedMeshId
      : null;

  const highlightedStructureId =
    currentMode === "sebutkan-nama" && answeredState === "unanswered"
      ? targetStructure?.id || null
      : null;

  const hintStructureId = isHintActive ? targetStructure?.id || null : null;

  return (
    <AppShell>
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[21px] font-medium text-[#1e293b] leading-tight">
              Latihan Anatomi 3D
            </h1>
            {topicParam && (
              <span className="badge-shipped flex items-center gap-1">
                <span>Fokus Topik: Saraf Lengan</span>
                <Link
                  href="/latihan"
                  className="hover:text-white/80 ml-1 font-bold"
                  title="Hapus fokus topik"
                >
                  ✕
                </Link>
              </span>
            )}
          </div>
          <p className="text-[12.5px] text-[#64748b] mt-0.5">
            Eksplorasi spasial interaktif untuk memperkuat retensi struktur dan inervasi
          </p>
        </div>

        {/* Header Right: Region & Demo Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLoading(!isLoading)}
            className={`h-[34px] px-3 border text-[12.5px] font-medium rounded-[6px] transition hidden md:flex items-center gap-1.5 ${
              isLoading
                ? "bg-[#0d6efd] text-white border-[#0d6efd]"
                : "bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f8fafc]"
            }`}
          >
            <i className="bi bi-hourglass-split"></i>
            <span>{isLoading ? "Mode Normal" : "Simulasi Loading"}</span>
          </button>

          <select
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="h-[34px] px-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[12.5px] font-medium text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
          >
            {mockAnatomyRegions.map((reg) => (
              <option key={reg.id} value={reg.id}>
                {reg.name} ({reg.latinName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* QUIZ CONTROLS & SESSION PROGRESS BAR */}
      <div className="metis-card p-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Mode Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] font-semibold text-[#475569]">
              Mode Kuis:
            </span>
            <div className="btn-group-period">
              <button
                onClick={() => handleModeChange("klik-struktur")}
                className={`btn-period ${
                  currentMode === "klik-struktur" ? "active" : ""
                }`}
              >
                <i className="bi bi-cursor-fill mr-1"></i>
                Klik Struktur
              </button>
              <button
                onClick={() => handleModeChange("sebutkan-nama")}
                className={`btn-period ${
                  currentMode === "sebutkan-nama" ? "active" : ""
                }`}
              >
                <i className="bi bi-ui-checks mr-1"></i>
                Sebutkan Nama
              </button>
            </div>
          </div>

          {/* Session Progress Indicator */}
          <div className="flex items-center gap-3 min-w-[220px]">
            <span className="text-[12.5px] font-semibold text-[#1e293b] whitespace-nowrap">
              Soal {currentStep} dari {totalQuestions}
            </span>
            <ProgressBar value={progressPercent} color="blue" size="md" />
          </div>
        </div>
      </div>

      {/* MAIN PRACTICE WORKSPACE (2 COLUMNS: 65% VIEWER & 35% QUIZ PANEL) */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          <div className="lg:col-span-8 metis-card h-[450px] p-6 flex flex-col justify-between">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-64 w-full rounded-[8px]" />
            <Skeleton className="h-4 w-60" />
          </div>
          <div className="lg:col-span-4 metis-card h-[450px] p-6 space-y-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-28 w-full rounded-[6px]" />
          </div>
        </div>
      ) : isSessionFinished ? (
        /* 5. LAYAR RINGKASAN SESI */
        <div className="metis-card p-6 sm:p-8 max-w-2xl mx-auto mb-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-[#e8f5e9] text-[#1b5e20] flex items-center justify-center text-[28px] mx-auto mb-4 shadow-sm">
            <i className="bi bi-award-fill"></i>
          </div>

          <h2 className="text-[20px] font-bold text-[#1e293b]">
            Sesi Latihan Selesai!
          </h2>
          <p className="text-[13px] text-[#64748b] mt-1 max-w-md mx-auto">
            Hasil latihanmu telah direkam ke dalam jadwal Spaced Repetition untuk
            menyesuaikan interval pengulangan berikutnya.
          </p>

          {/* Summary Score Boxes */}
          <div className="grid grid-cols-3 gap-3 my-6 text-center">
            <div className="p-3.5 bg-[#f8f9fa] border border-[#e2e8f0] rounded-[8px]">
              <span className="text-[11.5px] text-[#64748b] block">Skor Sesi</span>
              <span className="text-[24px] font-bold text-[#0d6efd] block leading-snug">
                {scorePercent}%
              </span>
            </div>
            <div className="p-3.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[8px]">
              <span className="text-[11.5px] text-[#166534] block">Jawaban Benar</span>
              <span className="text-[24px] font-bold text-[#198754] block leading-snug">
                {correctCount}
              </span>
            </div>
            <div className="p-3.5 bg-[#fff5f5] border border-[#fed7d7] rounded-[8px]">
              <span className="text-[11.5px] text-[#991b1b] block">Perlu Diulang</span>
              <span className="text-[24px] font-bold text-[#dc2626] block leading-snug">
                {totalQuestions - correctCount}
              </span>
            </div>
          </div>

          {/* Incorrect Structures Notification */}
          {incorrectStructures.length > 0 && (
            <div className="mb-6 text-left border border-[#fed7d7] bg-[#fff5f5] rounded-[8px] p-4">
              <div className="flex items-center gap-2 text-[#991b1b] font-semibold text-[13px] mb-2">
                <i className="bi bi-arrow-repeat text-[15px]"></i>
                <span>Struktur yang akan diulang lebih cepat:</span>
              </div>
              <div className="space-y-1.5 divide-y divide-[#fed7d7]/60">
                {incorrectStructures.map((struct) => (
                  <div
                    key={struct.id}
                    className="pt-1.5 flex items-center justify-between text-[12px]"
                  >
                    <div>
                      <strong className="text-[#0f172a]">{struct.nameIndo}</strong>
                      <span className="italic text-[#64748b] ml-1.5">
                        ({struct.nameLatin})
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#dc2626] bg-white px-2 py-0.5 rounded-[3px] border border-[#fca5a5]">
                      Interval 1 Hari
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleResetSession}
              className="h-[36px] px-4 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white font-semibold text-[13px] rounded-[6px] flex items-center gap-1.5 shadow-sm transition"
            >
              <i className="bi bi-arrow-repeat"></i>
              <span>Ulangi Sesi Latihan</span>
            </button>
            <Link
              href="/beranda"
              className="h-[36px] px-4 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#334155] font-semibold text-[13px] rounded-[6px] flex items-center gap-1.5 transition"
            >
              <i className="bi bi-house-door"></i>
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5 items-stretch">
          {/* KOLOM KIRI: 3D VIEWER (Sekitar 65% lebar / 8 Kolom di Laptop) */}
          <div className="lg:col-span-8 metis-card flex flex-col overflow-hidden">
            <div className="metis-card-header">
              <div className="flex items-center gap-2">
                <i className="bi bi-box text-[#0d6efd] text-[15px]"></i>
                <h2 className="metis-card-title">
                  Model Anatomi: Anggota Gerak Atas
                </h2>
              </div>
              <span className="text-[11.5px] text-[#64748b]">
                {currentMode === "klik-struktur"
                  ? "Klik mesh struktur untuk menjawab"
                  : "Struktur target disorot warna biru"}
              </span>
            </div>

            {/* 3D Canvas Container */}
            <div className="p-3 flex-1 flex flex-col">
              <AnatomyViewer
                structures={structures}
                selectedStructureId={clickedMeshId}
                highlightedStructureId={highlightedStructureId}
                correctStructureId={correctStructureId}
                incorrectStructureId={incorrectStructureId}
                hintStructureId={hintStructureId}
                onMeshClick={handleMeshClick}
                className="flex-1"
              />
            </div>
          </div>

          {/* KOLOM KANAN: PANEL LATIHAN & KUIS (35% lebar / 4 Kolom di Laptop) */}
          <div className="lg:col-span-4 metis-card flex flex-col justify-between">
            <div className="metis-card-header">
              <div>
                <h2 className="metis-card-title">Instruksi Soal</h2>
                <span className="text-[11.5px] text-[#64748b]">
                  {currentMode === "klik-struktur"
                    ? "Mode Klik Struktur 3D"
                    : "Mode Identifikasi Nama"}
                </span>
              </div>
              <span className="text-[11.5px] font-bold text-[#0d6efd] bg-[#f1f5f9] px-2 py-0.5 rounded-[4px] border border-[#e2e8f0]">
                Soal {currentStep}/{totalQuestions}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              {/* Question Body */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block">
                  Pertanyaan:
                </span>
                <p className="text-[14px] font-medium text-[#1e293b] leading-relaxed">
                  {currentQuestion?.promptText}
                </p>

                {/* Highlighted Target Label */}
                <div className="p-3 bg-[#f8f9fa] border border-[#e2e8f0] rounded-[6px]">
                  <strong className="text-[14px] text-[#0d6efd] block font-bold">
                    {currentQuestion?.latinName}
                  </strong>
                  <span className="text-[11.5px] text-[#64748b]">
                    Regio: Extremitas Superior
                  </span>
                </div>

                {/* MODE 1: KLIK STRUKTUR (Action instruction & Hint) */}
                {currentMode === "klik-struktur" && (
                  <div className="space-y-3 pt-1">
                    <p className="text-[12px] text-[#475569] bg-[#f8fafc] p-2.5 rounded-[5px] border border-[#e2e8f0]/80 flex items-center gap-2">
                      <i className="bi bi-mouse text-[#0d6efd] text-[15px]"></i>
                      <span>Putar dan klik langsung pada mesh model 3D di samping.</span>
                    </p>

                    {/* Hint Button */}
                    {answeredState === "unanswered" && (
                      <button
                        onClick={() => setIsHintActive(!isHintActive)}
                        className={`h-[30px] px-3 rounded-[5px] text-[12px] font-semibold border transition flex items-center gap-1.5 ${
                          isHintActive
                            ? "bg-[#fff8e1] border-[#ffe082] text-[#b45309]"
                            : "bg-white border-[#cbd5e1] text-[#64748b] hover:bg-[#f8fafc]"
                        }`}
                      >
                        <i className="bi bi-lightbulb-fill text-[#cc7a00]"></i>
                        <span>{isHintActive ? "Sembunyikan Petunjuk" : "Bantuan / Petunjuk"}</span>
                      </button>
                    )}

                    {isHintActive && (
                      <div className="p-2.5 bg-[#fff8e1] border border-[#ffe082] rounded-[5px] text-[#8d6e63] text-[12px]">
                        <strong>Petunjuk:</strong> {currentQuestion?.hint}
                      </div>
                    )}
                  </div>
                )}

                {/* MODE 2: SEBUTKAN NAMA (4 Multiple Choice Options) */}
                {currentMode === "sebutkan-nama" && currentQuestion?.options && (
                  <div className="space-y-2 pt-1">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = selectedChoiceId === opt.structureId;
                      const isCorrect =
                        answeredState !== "unanswered" &&
                        opt.structureId === currentQuestion.targetStructureId;
                      const isWrongChoice =
                        answeredState === "incorrect" && isSelected;

                      let btnStyle =
                        "bg-white border-[#cbd5e1] text-[#1e293b] hover:bg-[#f8fafc]";
                      if (isCorrect) {
                        btnStyle =
                          "bg-[#e8f5e9] border-[#81c784] text-[#1b5e20] shadow-2xs";
                      } else if (isWrongChoice) {
                        btnStyle =
                          "bg-[#ffebee] border-[#e57373] text-[#c62828]";
                      }

                      return (
                        <button
                          key={opt.structureId}
                          disabled={answeredState !== "unanswered"}
                          onClick={() => handleOptionSelect(opt.structureId)}
                          className={`w-full text-left p-3 rounded-[6px] border transition ${btnStyle} disabled:cursor-default`}
                        >
                          <div className="text-[13px] font-bold leading-snug">
                            {opt.nameIndo}
                          </div>
                          <div className="text-[11px] italic opacity-80 mt-0.5">
                            {opt.nameLatin}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* FEEDBACK BANNER (Appears after answer) */}
              {answeredState !== "unanswered" && (
                <div className="space-y-3 pt-3 border-t border-[#f1f5f9] animate-in fade-in duration-200">
                  {answeredState === "correct" ? (
                    <div className="p-3 bg-[#e8f5e9] border border-[#a5d6a7] rounded-[6px] text-[#1b5e20] text-[12.5px]">
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <i className="bi bi-check-circle-fill text-[16px]"></i>
                        <span>Jawaban Kamu Benar!</span>
                      </div>
                      <p className="leading-relaxed text-[12px]">
                        {currentQuestion?.explanation}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#ffebee] border border-[#ef9a9a] rounded-[6px] text-[#b71c1c] text-[12.5px]">
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <i className="bi bi-x-circle-fill text-[16px]"></i>
                        <span>Belum Tepat (Perlu Diulang)</span>
                      </div>
                      <p className="leading-relaxed text-[12px]">
                        {currentQuestion?.explanation}
                      </p>
                      <span className="block mt-1.5 text-[11px] text-[#7f1d1d] font-semibold">
                        Struktur yang benar ditandai warna hijau pada model 3D.
                      </span>
                    </div>
                  )}

                  {/* Continue Button */}
                  <button
                    onClick={handleNextQuestion}
                    className="w-full h-[36px] bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[13px] font-semibold rounded-[6px] flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <span>
                      {currentStep < totalQuestions
                        ? "Lanjut ke Soal Berikutnya"
                        : "Lihat Ringkasan Sesi"}
                    </span>
                    <i className="bi bi-chevron-right text-[12px]"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
