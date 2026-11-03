"use client";

import React, { useState, Suspense, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  mock3DStructures,
  mockQuizQuestions,
  mockAnatomyRegions,
  mockHeart3DStructures,
  mockHeartQuizQuestions,
  mockCaput3DStructures,
  mockCaputQuizQuestions,
  getStructuresByRegion,
  getQuizQuestionsByRegion,
  QuizMode,
  QuizQuestionItem,
  Anatomy3DStructure,
  AnatomyPracticeRegion,
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
          Menyiapkan grafis WebGL dan koordinat struktur regio
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
          Memuat modul latihan anatomi...
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

  // Default to Regio Thorax (features real 3D heart model)
  const [selectedRegionId, setSelectedRegionId] = useState("reg-thorax");
  const [currentMode, setCurrentMode] = useState<QuizMode>("klik-struktur");

  // Handle URL search params mapping to regions
  useEffect(() => {
    if (!topicParam) return;
    const lower = topicParam.toLowerCase();
    if (lower.includes("caput") || lower.includes("kepala")) {
      setSelectedRegionId("reg-caput");
    } else if (lower.includes("collum") || lower.includes("leher")) {
      setSelectedRegionId("reg-collum");
    } else if (lower.includes("thorax") || lower.includes("dada") || lower.includes("jantung")) {
      setSelectedRegionId("reg-thorax");
    } else if (lower.includes("abdomen") || lower.includes("perut")) {
      setSelectedRegionId("reg-abdomen");
    } else if (lower.includes("pelvis") || lower.includes("pinggul")) {
      setSelectedRegionId("reg-pelvis");
    } else if (lower.includes("membrum") || lower.includes("lengan") || lower.includes("gerak")) {
      setSelectedRegionId("reg-membrum");
    }
  }, [topicParam]);

  // Selected Region Object
  const selectedRegion = useMemo(() => {
    return (
      mockAnatomyRegions.find((r) => r.id === selectedRegionId) ||
      mockAnatomyRegions[2] // Fallback to Thorax
    );
  }, [selectedRegionId]);

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
  const structures = useMemo(() => {
    return getStructuresByRegion(selectedRegionId);
  }, [selectedRegionId]);

  // Filter questions for the selected mode & region
  const activeQuestions = useMemo(() => {
    const list = getQuizQuestionsByRegion(selectedRegionId);
    return list.filter((q) => q.mode === currentMode);
  }, [selectedRegionId, currentMode]);

  const currentQuestion: QuizQuestionItem | undefined =
    activeQuestions[currentQuestionIndex];

  // Target structure for current question
  const targetStructure = useMemo(() => {
    if (!currentQuestion) return undefined;
    return structures.find((s) => s.id === currentQuestion.targetStructureId);
  }, [currentQuestion, structures]);

  // Handle Region Change
  const handleRegionChange = (newRegionId: string) => {
    setSelectedRegionId(newRegionId);
    setCurrentQuestionIndex(0);
    setAnsweredState("unanswered");
    setSelectedChoiceId(null);
    setClickedMeshId(null);
    setIsHintActive(false);
    setIsSessionFinished(false);
    setCorrectCount(0);
    setIncorrectStructures([]);
  };

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

  // Next question handler
  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnsweredState("unanswered");
      setSelectedChoiceId(null);
      setClickedMeshId(null);
      setIsHintActive(false);
    } else {
      setIsSessionFinished(true);
    }
  };

  // Summary Metrics
  const totalQuestions = activeQuestions.length || 1;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const currentStep = isSessionFinished
    ? totalQuestions
    : currentQuestionIndex + 1;
  const progressPercent = Math.round((currentStep / totalQuestions) * 100);

  // Mesh state calculations
  const correctStructureId =
    answeredState === "correct" ? targetStructure?.id || null : null;

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
    <div className="space-y-5">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[21px] font-medium text-[#1e293b] leading-tight">
              Latihan Anatomi 3D Berbasis Regio
            </h1>
            {topicParam && (
              <span className="badge-shipped flex items-center gap-1">
                <span>Filter: {topicParam}</span>
                <Link
                  href="/latihan"
                  className="hover:text-white/80 ml-1 font-bold"
                  title="Hapus filter"
                >
                  ✕
                </Link>
              </span>
            )}
          </div>
          <p className="text-[12.5px] text-[#64748b] mt-0.5">
            Eksplorasi spasial interaktif terbagi dalam 6 regio utama tubuh manusia sesuai Terminologia Anatomica
          </p>
        </div>

        {/* Header Right: Simulation & Quick Selector */}
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
        </div>
      </div>

      {/* 6 REGIO SELECTION ARENA (Interactive Cards Grid) */}
      <div className="metis-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0d6efd]"></span>
            <h2 className="text-[13.5px] font-bold text-[#1e293b]">
              Pilih Fokus Regio Tubuh
            </h2>
            <span className="text-[11.5px] text-[#64748b] hidden sm:inline">
              · Klik regio untuk memuat model 3D dan set soal terkait
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#0d6efd] bg-[#eff6ff] px-2.5 py-0.5 rounded-full border border-[#bfdbfe]">
            6 Regio Tersedia
          </span>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {mockAnatomyRegions.map((reg) => {
            const isSelected = selectedRegionId === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => handleRegionChange(reg.id)}
                className={`text-left p-3 rounded-[7px] border transition relative flex flex-col justify-between h-[130px] group ${
                  isSelected
                    ? "bg-[#eff6ff] border-[#0d6efd] ring-2 ring-[#0d6efd]/30 shadow-xs"
                    : "bg-white border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                }`}
              >
                {/* Top: Number & 3D Badge */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded-[4px] ${
                      isSelected
                        ? "bg-[#0d6efd] text-white"
                        : "bg-[#f1f5f9] text-[#475569] group-hover:bg-[#e2e8f0]"
                    }`}
                  >
                    #{reg.number}
                  </span>

                  {reg.modelUrl && (
                    <span className="bg-[#10b981]/10 text-[#047857] border border-[#10b981]/30 text-[9.5px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                      <span>3D Asli</span>
                    </span>
                  )}
                </div>

                {/* Middle: Icon & Titles */}
                <div className="my-1">
                  <div className="flex items-center gap-1.5">
                    <i
                      className={`${reg.icon} text-[15px] ${
                        isSelected ? "text-[#0d6efd]" : "text-[#64748b]"
                      }`}
                    ></i>
                    <h3
                      className={`text-[13px] font-bold leading-tight ${
                        isSelected ? "text-[#0d6efd]" : "text-[#1e293b]"
                      }`}
                    >
                      {reg.subName}
                    </h3>
                  </div>
                  <span className="text-[10.5px] text-[#64748b] block truncate mt-0.5 font-medium">
                    {reg.name}
                  </span>
                </div>

                {/* Bottom: Mastery & Due items */}
                <div className="flex items-center justify-between w-full pt-1.5 border-t border-[#f1f5f9] text-[10.5px]">
                  <span
                    className={`font-semibold ${
                      reg.masteryScore >= 75
                        ? "text-[#047857]"
                        : reg.masteryScore >= 55
                        ? "text-[#b45309]"
                        : "text-[#b91c1c]"
                    }`}
                  >
                    {reg.masteryScore}%
                  </span>
                  <span className="text-[#64748b]">
                    {reg.dueCount} review
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE REGION OVERVIEW & QUIZ CONTROLS */}
      <div className="metis-card p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Active Region Context Info */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#eff6ff] border border-[#bfdbfe] text-[#0d6efd] flex items-center justify-center text-[20px] flex-shrink-0">
              <i className={selectedRegion.icon}></i>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[14.5px] text-[#1e293b]">
                  {selectedRegion.name} ({selectedRegion.subName})
                </span>
                <span className="text-[11px] font-medium text-[#475569] italic bg-[#f8fafc] px-2 py-0.5 rounded-[4px] border border-[#e2e8f0]">
                  {selectedRegion.latinName}
                </span>
                <span className="badge-shipped text-[10.5px]">
                  {selectedRegion.structuresCount} Struktur
                </span>
              </div>
              <p className="text-[11.5px] text-[#64748b] mt-0.5">
                {selectedRegion.description}
              </p>
            </div>
          </div>

          {/* Mode Switcher & Progress */}
          <div className="flex items-center gap-4 flex-wrap self-end lg:self-auto">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-[#475569]">
                Mode:
              </span>
              <div className="btn-group-period">
                <button
                  onClick={() => handleModeChange("klik-struktur")}
                  className={`btn-period ${
                    currentMode === "klik-struktur" ? "active" : ""
                  }`}
                >
                  <i className="bi bi-cursor-fill mr-1"></i>Klik 3D
                </button>
                <button
                  onClick={() => handleModeChange("sebutkan-nama")}
                  className={`btn-period ${
                    currentMode === "sebutkan-nama" ? "active" : ""
                  }`}
                >
                  <i className="bi bi-ui-checks mr-1"></i>Identifikasi
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-[170px]">
              <span className="text-[12px] font-semibold text-[#1e293b] whitespace-nowrap">
                {currentStep}/{totalQuestions}
              </span>
              <div className="w-28">
                <ProgressBar value={progressPercent} size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN PRACTICE & QUIZ ARENA */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-8 metis-card p-6 flex flex-col justify-center items-center min-h-[440px]">
            <Skeleton className="w-12 h-12 rounded-full mb-3" />
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="lg:col-span-4 metis-card p-6 space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : isSessionFinished ? (
        /* Sesi Selesai (Summary View) */
        <div className="metis-card p-8 text-center max-w-2xl mx-auto space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] flex items-center justify-center text-[30px]">
            <i className="bi bi-award-fill"></i>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669]">
              Sesi Latihan {selectedRegion.name} Selesai
            </span>
            <h2 className="text-[20px] font-bold text-[#1e293b] mt-1">
              Hasil Latihan: Skor {scorePercent}% ({correctCount}/{totalQuestions}{" "}
              Benar)
            </h2>
            <p className="text-[12.5px] text-[#64748b] mt-1 max-w-md mx-auto">
              PRIMA telah menyesuaikan bobot spaced repetition untuk regio{" "}
              <strong>{selectedRegion.subName}</strong>. Struktur yang keliru akan
              dijadwalkan ulang lebih cepat.
            </p>
          </div>

          {/* Action buttons on finish */}
          <div className="flex items-center justify-center gap-3 pt-3 flex-wrap">
            <button
              onClick={handleResetSession}
              className="h-[36px] px-4 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white font-semibold text-[13px] rounded-[6px] shadow-sm transition flex items-center gap-1.5"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
              <span>Ulangi Regio Ini</span>
            </button>

            {/* Quick Switch to another region */}
            <button
              onClick={() => {
                const nextReg =
                  selectedRegionId === "reg-thorax"
                    ? "reg-membrum"
                    : "reg-thorax";
                handleRegionChange(nextReg);
              }}
              className="h-[36px] px-4 bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#334155] font-semibold text-[13px] rounded-[6px] transition flex items-center gap-1.5"
            >
              <i className="bi bi-arrow-right-circle"></i>
              <span>Lanjut ke Regio Lain</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Practice Arena (Two Columns) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* KOLOM KIRI: 3D ANATOMY VIEWER (8 Kolom di Laptop) */}
          <div className="lg:col-span-8 metis-card flex flex-col overflow-hidden">
            <div className="metis-card-header">
              <div className="flex items-center gap-2">
                <i className="bi bi-box text-[#0d6efd] text-[15px]"></i>
                <h2 className="metis-card-title">
                  Model Anatomi 3D: {selectedRegion.name} ({selectedRegion.subName})
                </h2>
              </div>
              <span className="text-[11.5px] text-[#64748b]">
                {currentMode === "klik-struktur"
                  ? "Klik bagian model 3D untuk menjawab"
                  : "Struktur target disorot warna biru"}
              </span>
            </div>

            {/* 3D Canvas Container */}
            <div className="p-3 flex-1 flex flex-col min-h-[430px] lg:min-h-[520px]">
              <AnatomyViewer
                structures={structures}
                selectedStructureId={clickedMeshId}
                highlightedStructureId={highlightedStructureId}
                correctStructureId={correctStructureId}
                incorrectStructureId={incorrectStructureId}
                hintStructureId={hintStructureId}
                onMeshClick={handleMeshClick}
                modelUrl={selectedRegion.modelUrl}
                className="flex-1"
              />
            </div>
          </div>

          {/* KOLOM KANAN: PANEL LATIHAN & KUIS (4 Kolom di Laptop) */}
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
              <span className="text-[11.5px] font-bold text-[#0d6efd] bg-[#eff6ff] px-2 py-0.5 rounded-[4px]">
                {currentStep} / {totalQuestions}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              {currentQuestion ? (
                <>
                  <div className="space-y-3">
                    <p className="text-[13.5px] font-semibold text-[#1e293b] leading-relaxed">
                      {currentQuestion.promptText}
                    </p>

                    {/* Mode: Klik Struktur */}
                    {currentMode === "klik-struktur" && targetStructure && (
                      <div className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] space-y-1">
                        <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#64748b]">
                          Cari & Klik Struktur:
                        </span>
                        <div className="text-[15px] font-bold text-[#0d6efd]">
                          {targetStructure.nameIndo}
                        </div>
                        <div className="text-[12.5px] text-[#475569] italic">
                          {targetStructure.nameLatin}
                        </div>
                        <div className="pt-2 flex items-center gap-2">
                          <span className="badge-pending text-[10px]">
                            {targetStructure.category}
                          </span>
                          <span className="text-[11px] text-[#64748b]">
                            Tingkat kesulitan: {targetStructure.difficulty}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Mode: Sebutkan Nama (Multiple Choice) */}
                    {currentMode === "sebutkan-nama" && currentQuestion.options && (
                      <div className="space-y-2 pt-1">
                        {currentQuestion.options.map((opt) => {
                          const isSelected = selectedChoiceId === opt.structureId;
                          const isOptCorrect =
                            answeredState !== "unanswered" &&
                            opt.structureId === targetStructure?.id;
                          const isOptIncorrect =
                            answeredState === "incorrect" &&
                            isSelected &&
                            opt.structureId !== targetStructure?.id;

                          return (
                            <button
                              key={opt.structureId}
                              type="button"
                              onClick={() => handleOptionSelect(opt.structureId)}
                              disabled={answeredState !== "unanswered"}
                              className={`w-full text-left p-3 rounded-[6px] border transition flex flex-col ${
                                isOptCorrect
                                  ? "bg-[#ecfdf5] border-[#10b981] text-[#065f46]"
                                  : isOptIncorrect
                                  ? "bg-[#fef2f2] border-[#ef4444] text-[#991b1b]"
                                  : isSelected
                                  ? "bg-[#eff6ff] border-[#0d6efd]"
                                  : "bg-white border-[#cbd5e1] hover:bg-[#f8fafc] text-[#1e293b]"
                              }`}
                            >
                              <span className="font-semibold text-[13px]">
                                {opt.nameIndo}
                              </span>
                              <span className="text-[11px] text-[#64748b] italic">
                                {opt.nameLatin}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Feedback Banner upon answering */}
                  {answeredState !== "unanswered" && (
                    <div
                      className={`p-3.5 rounded-[6px] border space-y-1.5 animate-in fade-in duration-200 ${
                        answeredState === "correct"
                          ? "bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]"
                          : "bg-[#fef2f2] border-[#fecaca] text-[#991b1b]"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[13px]">
                        <i
                          className={`bi ${
                            answeredState === "correct"
                              ? "bi-check-circle-fill text-[#10b981]"
                              : "bi-x-circle-fill text-[#ef4444]"
                          }`}
                        ></i>
                        <span>
                          {answeredState === "correct"
                            ? "Jawaban Tepat!"
                            : "Kurang Tepat"}
                        </span>
                      </div>
                      <p className="text-[12px] leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                      {targetStructure?.clinicalNote && (
                        <div className="pt-1 text-[11.5px] border-t border-black/10 mt-1">
                          <strong>Korelasi Klinis:</strong>{" "}
                          {targetStructure.clinicalNote}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hint Box (if triggered) */}
                  {isHintActive && answeredState === "unanswered" && (
                    <div className="p-3 bg-[#fffbeb] border border-[#fde68a] text-[#92400e] rounded-[6px] text-[12px] flex items-start gap-2 animate-in fade-in">
                      <i className="bi bi-lightbulb-fill text-[#f59e0b] mt-0.5"></i>
                      <div>
                        <strong>Petunjuk Visual:</strong> {currentQuestion.hint}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  icon={<i className="bi bi-check2-all"></i>}
                  title="Tidak ada soal"
                  description="Seluruh soal latihan untuk regio dan mode ini telah selesai."
                />
              )}

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsHintActive(!isHintActive)}
                  disabled={answeredState !== "unanswered"}
                  className="h-[34px] px-3 bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#475569] text-[12px] font-medium rounded-[5px] transition flex items-center gap-1.5 disabled:opacity-40"
                  title="Tampilkan petunjuk lokasi"
                >
                  <i className="bi bi-lightbulb text-[#f59e0b]"></i>
                  <span>Petunjuk</span>
                </button>

                {answeredState !== "unanswered" && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="h-[34px] px-4 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12.5px] font-semibold rounded-[5px] transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>
                      {currentStep < totalQuestions
                        ? "Lanjut ke Soal Berikutnya"
                        : "Lihat Ringkasan Sesi"}
                    </span>
                    <i className="bi bi-chevron-right text-[12px]"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
