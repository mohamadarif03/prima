"use client";

import React, { useState, Suspense, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  mockAnatomyRegions,
  getStructuresByRegion,
  getQuizQuestionsByRegion,
  Anatomy3DStructure,
  QuizQuestionItem,
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
      <div className="w-full h-[450px] sm:h-[520px] lg:h-full min-h-[420px] flex flex-col items-center justify-center bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] p-6 text-center">
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
        <div className="p-8 text-center text-[13px] text-[#64748b]">
          <div className="w-6 h-6 border-2 border-[#0d6efd] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Memuat modul anatomi 3D...
        </div>
      }
    >
      <LatihanContent />
    </Suspense>
  );
}

function LatihanContent() {
  const searchParams = useSearchParams();

  // Parameter URL support: ?regio=thorax & ?struktur=arcus_aortae
  const regioParam =
    searchParams.get("regio") ||
    searchParams.get("region") ||
    searchParams.get("topic") ||
    searchParams.get("topik");
  const strukturParam =
    searchParams.get("struktur") ||
    searchParams.get("structure") ||
    searchParams.get("mesh");

  // ==========================================
  // STATE MODE: "jelajahi" (default) ATAU "kuis"
  // ==========================================
  const [activeMode, setActiveMode] = useState<"jelajahi" | "kuis">("jelajahi");

  // State Regio Aktif (Default Regio Caput)
  const [selectedRegionId, setSelectedRegionId] = useState<string>("reg-caput");
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);
  const [isLoadingRegion, setIsLoadingRegion] = useState<boolean>(false);

  // State Kontrol Viewer & Filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [isFullWidth, setIsFullWidth] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ==========================================
  // STATE MODE KUIS 3D INTERAKTIF
  // ==========================================
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestionItem[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [quizAnswerState, setQuizAnswerState] = useState<"unanswered" | "correct" | "incorrect">("unanswered");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isHintActive, setIsHintActive] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // ==========================================
  // SINKRONISASI PARAMETER URL (?regio=... & ?struktur=...)
  // ==========================================
  useEffect(() => {
    if (!regioParam) return;

    const lower = regioParam.toLowerCase();
    let targetRegId = "reg-caput";

    if (lower.includes("caput") || lower.includes("kepala")) {
      targetRegId = "reg-caput";
    } else if (lower.includes("collum") || lower.includes("leher")) {
      targetRegId = "reg-collum";
    } else if (
      lower.includes("thorax") ||
      lower.includes("dada") ||
      lower.includes("jantung") ||
      lower.includes("cor")
    ) {
      targetRegId = "reg-thorax";
    } else if (lower.includes("abdomen") || lower.includes("perut")) {
      targetRegId = "reg-abdomen";
    } else if (lower.includes("pelvis") || lower.includes("panggul")) {
      targetRegId = "reg-pelvis";
    } else if (
      lower.includes("membrum") ||
      lower.includes("lengan") ||
      lower.includes("tungkai") ||
      lower.includes("ekstremitas")
    ) {
      targetRegId = "reg-membrum";
    }

    setSelectedRegionId(targetRegId);
  }, [regioParam]);

  // Selected Region Object
  const selectedRegion = useMemo(() => {
    return (
      mockAnatomyRegions.find((r) => r.id === selectedRegionId) ||
      mockAnatomyRegions[0]
    );
  }, [selectedRegionId]);

  // Active 3D model URL
  const activeModelUrl = useMemo(() => {
    return selectedRegion.modelUrl || "/models/muscles.glb";
  }, [selectedRegion]);

  // Structures for active region
  const structures = useMemo(() => {
    return getStructuresByRegion(selectedRegionId);
  }, [selectedRegionId]);

  // Auto-fokus struktur dari parameter URL atau pilih struktur pertama
  useEffect(() => {
    if (structures.length === 0) {
      setSelectedStructureId(null);
      return;
    }

    if (strukturParam) {
      const cleanParam = strukturParam.toLowerCase().replace(/[-_]/g, "");
      const matched = structures.find(
        (s) =>
          s.id.toLowerCase().replace(/[-_]/g, "") === cleanParam ||
          s.meshId.toLowerCase().replace(/[-_]/g, "") === cleanParam ||
          s.nameLatin.toLowerCase().replace(/[^a-z0-9]/g, "").includes(cleanParam) ||
          s.nameIndo.toLowerCase().replace(/[^a-z0-9]/g, "").includes(cleanParam)
      );

      if (matched) {
        setSelectedStructureId(matched.id);
        showToast(`Menyorot struktur: ${matched.nameLatin}`);
        return;
      }
    }

    // Default: pilih struktur pertama bila belum ada
    if (!selectedStructureId || !structures.some((s) => s.id === selectedStructureId)) {
      setSelectedStructureId(structures[0].id);
    }
  }, [structures, strukturParam]);

  // Currently active/inspected structure
  const activeStructure: Anatomy3DStructure | undefined = useMemo(() => {
    if (!selectedStructureId) return structures[0];
    return (
      structures.find(
        (s) => s.id === selectedStructureId || s.meshId === selectedStructureId
      ) || structures[0]
    );
  }, [selectedStructureId, structures]);

  // Struktur Terkait yang Dapat Diklik
  const relatedStructures = useMemo(() => {
    if (!activeStructure) return [];
    if (activeStructure.relatedStructureIds && activeStructure.relatedStructureIds.length > 0) {
      return structures.filter((s) =>
        activeStructure.relatedStructureIds?.includes(s.id)
      );
    }
    // Fallback: ambil 2 struktur lain dari kategori yang sama
    return structures
      .filter((s) => s.id !== activeStructure.id && s.category === activeStructure.category)
      .slice(0, 3);
  }, [activeStructure, structures]);

  // Filtered structures for the right-hand browser
  const filteredStructures = useMemo(() => {
    return structures.filter((s) => {
      const matchSearch =
        searchQuery === "" ||
        s.nameIndo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nameLatin.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        selectedCategory === "Semua" ||
        s.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [structures, searchQuery, selectedCategory]);

  // Sinkronisasi Soal Kuis saat Regio Berubah
  useEffect(() => {
    const questions = getQuizQuestionsByRegion(selectedRegionId);
    setQuizQuestions(questions);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setAnsweredCount(0);
    setQuizAnswerState("unanswered");
    setSelectedOptionId(null);
    setIsHintActive(false);
  }, [selectedRegionId]);

  const currentQuizQuestion: QuizQuestionItem | undefined = quizQuestions[currentQuizIndex];

  // Handle Pergantian Regio dengan Efek Lazy Loading
  const handleRegionChange = (newRegionId: string) => {
    if (newRegionId === selectedRegionId) return;
    setIsLoadingRegion(true);
    setSelectedRegionId(newRegionId);
    setSearchQuery("");
    setSelectedCategory("Semua");
    setMobileDrawerOpen(false);

    setTimeout(() => {
      setIsLoadingRegion(false);
    }, 450);
  };

  // Handle Klik Mesh pada Model 3D
  const handleMeshClick = (meshId: string) => {
    if (activeMode === "jelajahi") {
      setSelectedStructureId(meshId);
      setMobileDrawerOpen(true);
    } else if (activeMode === "kuis" && currentQuizQuestion) {
      // Mode Kuis Klik-Struktur
      if (quizAnswerState !== "unanswered") return;

      const isCorrect =
        meshId === currentQuizQuestion.targetStructureId ||
        structures.find((s) => s.id === currentQuizQuestion.targetStructureId)?.meshId === meshId;

      if (isCorrect) {
        setQuizAnswerState("correct");
        setQuizScore((prev) => prev + 1);
        showToast("Benar sekali! Struktur anatomis tepat.");
      } else {
        setQuizAnswerState("incorrect");
        showToast("Kurang tepat. Periksa kembali lokasi struktur.");
      }
      setAnsweredCount((prev) => prev + 1);
    }
  };

  // Handle Jawab Soal Pilihan Ganda Kuis
  const handleAnswerQuizOption = (optionId: string) => {
    if (!currentQuizQuestion || quizAnswerState !== "unanswered") return;
    setSelectedOptionId(optionId);

    const isCorrect = optionId === currentQuizQuestion.targetStructureId;
    if (isCorrect) {
      setQuizAnswerState("correct");
      setQuizScore((prev) => prev + 1);
      showToast("Jawaban Benar!");
    } else {
      setQuizAnswerState("incorrect");
      showToast("Jawaban Kurang Tepat.");
    }
    setAnsweredCount((prev) => prev + 1);
  };

  // Lanjut ke Soal Kuis Berikutnya
  const handleNextQuiz = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setQuizAnswerState("unanswered");
      setSelectedOptionId(null);
      setIsHintActive(false);
    } else {
      showToast(`Kuis selesai! Skor akhir: ${quizScore}/${quizQuestions.length}`);
    }
  };

  return (
    <div className="space-y-5">
      {/* ========================================================= */}
      {/* TOP HEADER: JUDUL & TOGGLE MODE (Jelajahi vs Kuis 3D) */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-[#64748b] uppercase tracking-wider">
              PRIMA · Visualisasi Anatomi (F6)
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#0d6efd] font-bold border border-[#bfdbfe]">
              3D Atlas Medis
            </span>
          </div>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-[#1e293b] tracking-tight">
            Anatomi 3D Berbasis Regio
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#64748b] mt-0.5">
            Model 3D interaktif 6 regio tubuh manusia dengan nama Latin baku dan korelasi klinis.
          </p>
        </div>

        {/* TOGGLE MODE PILL: JELAJAHI VS KUIS */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-[#f1f5f9] p-1 rounded-[8px] flex items-center border border-[#e2e8f0]">
            <button
              type="button"
              onClick={() => setActiveMode("jelajahi")}
              className={`px-3.5 py-1.5 text-[12.5px] font-bold rounded-[6px] transition flex items-center gap-1.5 ${
                activeMode === "jelajahi"
                  ? "bg-[#0d6efd] text-white shadow-xs"
                  : "text-[#64748b] hover:text-[#1e293b]"
              }`}
            >
              <i className="bi bi-compass"></i>
              <span>Mode Jelajahi</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("kuis")}
              className={`px-3.5 py-1.5 text-[12.5px] font-bold rounded-[6px] transition flex items-center gap-1.5 ${
                activeMode === "kuis"
                  ? "bg-[#0d6efd] text-white shadow-xs"
                  : "text-[#64748b] hover:text-[#1e293b]"
              }`}
            >
              <i className="bi bi-ui-checks"></i>
              <span>Kuis 3D</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6 REGIO SELECTION ARENA (Interactive Cards Grid) */}
      {/* ========================================================= */}
      <div className="metis-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0d6efd]"></span>
            <h2 className="text-[13.5px] font-bold text-[#1e293b]">
              Pilih Fokus Regio Tubuh
            </h2>
            <span className="text-[11.5px] text-[#64748b] hidden sm:inline">
              · Dimuat terpisah per regio (lazy load)
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#0d6efd] bg-[#eff6ff] px-2.5 py-0.5 rounded-full border border-[#bfdbfe]">
            6 Regio Anatomi
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
                className={`text-left p-3 rounded-[8px] border transition relative flex flex-col justify-between h-[125px] group ${
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

                  <span className="bg-[#10b981]/10 text-[#047857] border border-[#10b981]/30 text-[9.5px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                    <span>3D</span>
                  </span>
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
                      {reg.name}
                    </h3>
                  </div>
                  <span className="text-[10.5px] text-[#64748b] block truncate mt-0.5 font-medium">
                    {reg.subName}
                  </span>
                </div>

                {/* Bottom: Mastery & Structures count */}
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
                    {reg.masteryScore}% Kuat
                  </span>
                  <span className="text-[#64748b]">
                    {structures.length || reg.structuresCount} Bagian
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODE KUIS 3D (Jika Mode Kuis Aktif) */}
      {/* ========================================================= */}
      {activeMode === "kuis" && currentQuizQuestion && (
        <div className="metis-card p-4 sm:p-5 bg-gradient-to-r from-[#eff6ff] to-white border-[#bfdbfe]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#bfdbfe]/60 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0d6efd] text-white font-bold text-[11px]">
                Soal {currentQuizIndex + 1} dari {quizQuestions.length}
              </span>
              <span className="text-[11.5px] font-semibold text-[#1e40af]">
                Skor: {quizScore} / {answeredCount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsHintActive(true)}
                className="px-2.5 py-1 bg-white hover:bg-[#fffbeb] text-[#92400e] border border-[#fde68a] text-[11.5px] font-semibold rounded-[6px] flex items-center gap-1 transition"
              >
                <i className="bi bi-lightbulb-fill text-[#d97706]"></i>
                <span>Petunjuk Lokasi</span>
              </button>
              {quizAnswerState !== "unanswered" && (
                <button
                  type="button"
                  onClick={handleNextQuiz}
                  className="px-3 py-1 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[11.5px] font-bold rounded-[6px] flex items-center gap-1 transition"
                >
                  <span>Soal Berikutnya</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[15px] font-bold text-[#1e293b]">
              {currentQuizQuestion.promptText}
            </h3>
            <div className="inline-block px-3 py-1 bg-white border border-[#bfdbfe] rounded-[6px] text-[#0d6efd] font-bold text-[13.5px] italic">
              {currentQuizQuestion.latinName}
            </div>

            {isHintActive && currentQuizQuestion.hint && (
              <p className="text-[12px] text-[#92400e] bg-[#fffbeb] p-2.5 rounded border border-[#fde68a] animate-fade-in">
                <strong>Petunjuk:</strong> {currentQuizQuestion.hint}
              </p>
            )}

            {/* Opsi Pilihan Ganda (jika ada) */}
            {currentQuizQuestion.options && currentQuizQuestion.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {currentQuizQuestion.options.map((opt) => (
                  <button
                    key={opt.structureId}
                    type="button"
                    onClick={() => handleAnswerQuizOption(opt.structureId)}
                    className={`p-2.5 rounded-[6px] border text-left text-[12.5px] font-medium transition ${
                      selectedOptionId === opt.structureId
                        ? opt.structureId === currentQuizQuestion.targetStructureId
                          ? "bg-[#dcfce7] border-[#16a34a] text-[#166534]"
                          : "bg-[#fee2e2] border-[#dc2626] text-[#991b1b]"
                        : "bg-white border-[#cbd5e1] hover:bg-[#f8fafc]"
                    }`}
                  >
                    <span>{opt.nameIndo}</span>
                    <span className="block text-[11px] italic text-[#64748b] mt-0.5">
                      {opt.nameLatin}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Pembahasan Kuis */}
            {quizAnswerState !== "unanswered" && (
              <div
                className={`p-3 rounded-[6px] border text-[12px] leading-relaxed animate-fade-in ${
                  quizAnswerState === "correct"
                    ? "bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]"
                    : "bg-[#fef2f2] border-[#fecaca] text-[#991b1b]"
                }`}
              >
                <strong>{quizAnswerState === "correct" ? "Hebat!" : "Catatan:"}</strong>{" "}
                {currentQuizQuestion.explanation}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MAIN 3D EXPLORER & ANATOMY INSPECTOR */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* 3D ANATOMY VIEWER (8 Kolom atau 12 Kolom saat Layar Lebar) */}
        <div
          className={`metis-card flex flex-col overflow-hidden transition-all duration-300 relative ${
            isFullWidth ? "lg:col-span-12" : "lg:col-span-8"
          }`}
        >
          {/* Top Controls Bar */}
          <div className="metis-card-header flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <i className="bi bi-box text-[#0d6efd] text-[15px]"></i>
              <h2 className="metis-card-title">
                {selectedRegion.name} ({selectedRegion.subName})
              </h2>
            </div>

            {/* CONTROLS VIEWER: Toggle Label, Fullscreen */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowLabels(!showLabels)}
                className={`h-[28px] px-2.5 rounded-[5px] text-[11px] font-semibold border transition flex items-center gap-1 ${
                  showLabels
                    ? "bg-[#0d6efd] text-white border-[#0d6efd]"
                    : "bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f8fafc]"
                }`}
                title="Tampilkan atau sembunyikan label nama struktur pada viewer"
              >
                <i className={`bi ${showLabels ? "bi-tag-fill" : "bi-tag"}`}></i>
                <span>Label</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullWidth(!isFullWidth)}
                className="h-[28px] px-2.5 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#475569] text-[11px] font-medium rounded-[5px] transition flex items-center gap-1"
                title="Toggle tampilan layar lebar"
              >
                <i
                  className={`bi ${
                    isFullWidth ? "bi-layout-sidebar" : "bi-arrows-fullscreen"
                  }`}
                ></i>
                <span className="hidden sm:inline">
                  {isFullWidth ? "Detail" : "Lebar"}
                </span>
              </button>
            </div>
          </div>

          {/* 3D Canvas Container */}
          <div className="p-3 flex-1 flex flex-col min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] relative">
            {isLoadingRegion ? (
              <div className="w-full h-full min-h-[440px] flex flex-col items-center justify-center bg-[#f8fafc] rounded-[8px]">
                <div className="w-8 h-8 border-3 border-[#0d6efd] border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-[13px] font-bold text-[#1e293b]">
                  Memuat Struktur {selectedRegion.name}...
                </p>
              </div>
            ) : (
              <>
                <AnatomyViewer
                  structures={structures}
                  selectedStructureId={selectedStructureId}
                  highlightedStructureId={selectedStructureId}
                  correctStructureId={
                    activeMode === "kuis" && quizAnswerState === "correct"
                      ? currentQuizQuestion?.targetStructureId || null
                      : null
                  }
                  incorrectStructureId={
                    activeMode === "kuis" && quizAnswerState === "incorrect"
                      ? selectedOptionId || null
                      : null
                  }
                  hintStructureId={
                    activeMode === "kuis" && isHintActive
                      ? currentQuizQuestion?.targetStructureId || null
                      : null
                  }
                  onMeshClick={handleMeshClick}
                  modelUrl={activeModelUrl}
                  className="flex-1"
                />

                {/* FLOATING HTML LABEL DI POJOK ATAS CANVAS */}
                {showLabels && activeStructure && (
                  <div className="absolute top-6 left-6 z-20 bg-white/95 backdrop-blur-sm border border-[#cbd5e1] px-3.5 py-2 rounded-[8px] shadow-md animate-fade-in pointer-events-none max-w-[280px]">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#0d6efd] animate-ping"></span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748b]">
                        {activeStructure.category}
                      </span>
                    </div>
                    <strong className="text-[13.5px] font-bold text-[#1e293b] block leading-tight">
                      {activeStructure.nameIndo}
                    </strong>
                    <span className="text-[11.5px] text-[#0d6efd] italic font-semibold block mt-0.5">
                      {activeStructure.nameLatin}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* INSPECTOR & DAFTAR STRUKTUR ANATOMI (Panel Kanan Desktop) */}
        {/* ========================================================= */}
        {!isFullWidth && (
          <div className="lg:col-span-4 metis-card flex flex-col justify-between overflow-hidden">
            <div className="metis-card-header">
              <div>
                <h2 className="metis-card-title flex items-center gap-2">
                  <i className="bi bi-info-circle text-[#0d6efd]"></i>
                  <span>Detail Struktur Terpilih</span>
                </h2>
                <span className="text-[11.5px] text-[#64748b]">
                  Pemeriksa morfologis, klinis, dan struktur terkait
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-4 overflow-y-auto">
              {activeStructure ? (
                <div className="space-y-4">
                  {/* Header Detail Struktur Terpilih */}
                  <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#eff6ff] text-[#0d6efd] border border-[#bfdbfe]">
                        {activeStructure.category}
                      </span>
                      <span
                        className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${
                          activeStructure.masteryStatus === "dikuasai"
                            ? "bg-[#dcfce7] text-[#166534]"
                            : activeStructure.masteryStatus === "berkembang"
                            ? "bg-[#fffbeb] text-[#b45309]"
                            : "bg-[#fee2e2] text-[#b91c1c]"
                        }`}
                      >
                        {activeStructure.masteryStatus.replace("_", " ")}
                      </span>
                    </div>

                    <h3 className="text-[18px] font-bold text-[#1e293b] leading-snug">
                      {activeStructure.nameIndo}
                    </h3>
                    <p className="text-[13.5px] text-[#0d6efd] italic font-semibold">
                      {activeStructure.nameLatin}
                    </p>

                    <p className="text-[12.5px] text-[#334155] leading-relaxed pt-2 border-t border-[#e2e8f0]">
                      {activeStructure.description}
                    </p>

                    {/* Korelasi Klinis */}
                    {activeStructure.clinicalNote && (
                      <div className="mt-2 p-2.5 bg-[#fffbeb] border border-[#fef3c7] rounded-[6px] text-[#92400e] text-[11.5px] leading-relaxed flex items-start gap-2">
                        <i className="bi bi-heart-pulse-fill text-[#d97706] text-[14px] mt-0.5 flex-shrink-0"></i>
                        <div>
                          <strong className="block font-bold">Korelasi Klinis:</strong>
                          <span>{activeStructure.clinicalNote}</span>
                        </div>
                      </div>
                    )}

                    {/* STRUKTUR TERKAIT YANG BISA DIKLIK */}
                    {relatedStructures.length > 0 && (
                      <div className="pt-2 border-t border-[#e2e8f0]">
                        <span className="text-[11px] font-bold text-[#64748b] block mb-1.5">
                          Struktur Terkait (Klik untuk Menyorot):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {relatedStructures.map((rel) => (
                            <button
                              key={rel.id}
                              type="button"
                              onClick={() => setSelectedStructureId(rel.id)}
                              className="px-2 py-1 bg-white hover:bg-[#eff6ff] hover:border-[#bfdbfe] border border-[#cbd5e1] rounded text-[11px] font-medium text-[#1e293b] flex items-center gap-1 transition"
                            >
                              <i className="bi bi-link-45deg text-[#0d6efd]"></i>
                              <span>{rel.nameLatin}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TOMBOL AKSI: FLASHCARD & MATERI */}
                    <div className="pt-3 border-t border-[#e2e8f0] grid grid-cols-2 gap-2">
                      <Link
                        href={`/flashcard?materi=mat-01&struktur=${activeStructure.id}`}
                        className="h-[32px] px-2.5 bg-white hover:bg-[#f0fdf4] border border-[#cbd5e1] hover:border-[#86efac] text-[#166534] text-[11.5px] font-bold rounded-[6px] flex items-center justify-center gap-1.5 transition"
                      >
                        <i className="bi bi-card-heading text-[#16a34a]"></i>
                        <span>Buat Flashcard</span>
                      </Link>

                      <Link
                        href="/materi"
                        className="h-[32px] px-2.5 bg-white hover:bg-[#eff6ff] border border-[#cbd5e1] hover:border-[#bfdbfe] text-[#0d6efd] text-[11.5px] font-bold rounded-[6px] flex items-center justify-center gap-1.5 transition"
                      >
                        <i className="bi bi-journal-text"></i>
                        <span>Materi Terkait</span>
                      </Link>
                    </div>
                  </div>

                  {/* Filter & Daftar Struktur di Regio Ini */}
                  <div className="space-y-2 pt-2 border-t border-[#f1f5f9]">
                    <div className="flex items-center justify-between">
                      <label className="text-[12px] font-bold text-[#1e293b]">
                        Daftar Struktur ({filteredStructures.length}):
                      </label>
                      <span className="text-[11px] text-[#64748b]">
                        Pilih untuk meninjau
                      </span>
                    </div>

                    {/* Pencarian Struktur Cepat */}
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nama Indonesia atau Latin..."
                        className="w-full h-[32px] px-2.5 pl-8 bg-[#f8fafc] border border-[#cbd5e1] rounded-[6px] text-[12px] text-[#1e293b] placeholder-[#64748b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
                      />
                      <i className="bi bi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748b] text-[11px]"></i>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] text-[11px]"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Filter Kategori Chips: Tulang, Otot, Organ, Pembuluh, Saraf */}
                    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin text-[11px]">
                      {["Semua", "tulang", "otot", "organ", "vaskular", "saraf"].map((cat) => {
                        const count =
                          cat === "Semua"
                            ? structures.length
                            : structures.filter((s) => s.category.toLowerCase() === cat).length;
                        if (cat !== "Semua" && count === 0) return null;

                        const labelMap: Record<string, string> = {
                          Semua: `Semua (${count})`,
                          tulang: `Tulang (${count})`,
                          otot: `Otot (${count})`,
                          organ: `Organ (${count})`,
                          vaskular: `Pembuluh (${count})`,
                          saraf: `Saraf (${count})`,
                        };

                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-2 py-0.5 rounded-[4px] font-medium whitespace-nowrap transition ${
                              selectedCategory.toLowerCase() === cat.toLowerCase()
                                ? "bg-[#0d6efd] text-white"
                                : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                            }`}
                          >
                            {labelMap[cat] || cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* List of structures */}
                    <div className="max-h-[200px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                      {filteredStructures.map((struct) => {
                        const isSelected =
                          selectedStructureId === struct.id ||
                          selectedStructureId === struct.meshId;
                        return (
                          <button
                            key={struct.id}
                            type="button"
                            onClick={() => setSelectedStructureId(struct.id)}
                            className={`w-full text-left p-2 rounded-[5px] border transition flex items-center justify-between text-[11.5px] ${
                              isSelected
                                ? "bg-[#eff6ff] border-[#0d6efd] text-[#0d6efd] font-semibold"
                                : "bg-white border-[#e2e8f0] text-[#334155] hover:bg-[#f8fafc]"
                            }`}
                          >
                            <div className="min-w-0 flex-1 truncate">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="text-[9.5px] uppercase font-bold px-1 py-0.2 rounded-[3px]"
                                  style={{
                                    backgroundColor: `${struct.baseColor}15`,
                                    color: struct.baseColor,
                                  }}
                                >
                                  {struct.category}
                                </span>
                                <span className="block truncate font-medium">
                                  {struct.nameIndo}
                                </span>
                              </div>
                              <span className="text-[10px] text-[#64748b] italic block truncate mt-0.5">
                                {struct.nameLatin}
                              </span>
                            </div>
                            <span
                              className="w-2.5 h-2.5 rounded-full ml-2 flex-shrink-0"
                              style={{ backgroundColor: struct.baseColor }}
                              title={`Kategori: ${struct.category}`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-[#64748b] text-[12px]">
                  <i className="bi bi-hand-index text-[24px] text-[#cbd5e1] block mb-2"></i>
                  <span>Klik pada model 3D untuk melihat detail anatomi</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* DRAWER / BOTTOM SHEET PADA HP */}
      {/* ========================================================= */}
      {mobileDrawerOpen && activeStructure && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end lg:hidden animate-fade-in"
        >
          <div className="bg-white rounded-t-[16px] w-full max-h-[80vh] overflow-y-auto p-5 space-y-3 animate-slide-up shadow-xl">
            <div className="w-12 h-1 bg-[#cbd5e1] rounded-full mx-auto mb-2"></div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#0d6efd] bg-[#eff6ff] px-2 py-0.5 rounded">
                  {activeStructure.category}
                </span>
                <h3 className="text-[17px] font-bold text-[#1e293b] mt-1">
                  {activeStructure.nameIndo}
                </h3>
                <span className="text-[13px] text-[#0d6efd] italic font-semibold">
                  {activeStructure.nameLatin}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 text-[#94a3b8] hover:text-[#1e293b]"
                aria-label="Tutup drawer"
              >
                <i className="bi bi-x-lg text-[16px]"></i>
              </button>
            </div>

            <p className="text-[12.5px] text-[#334155] leading-relaxed pt-2 border-t border-[#f1f5f9]">
              {activeStructure.description}
            </p>

            {activeStructure.clinicalNote && (
              <div className="p-2.5 bg-[#fffbeb] border border-[#fef3c7] rounded text-[#92400e] text-[11.5px]">
                <strong>Korelasi Klinis:</strong> {activeStructure.clinicalNote}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href={`/flashcard?materi=mat-01&struktur=${activeStructure.id}`}
                className="h-[36px] bg-[#16a34a] text-white font-bold rounded-[6px] text-[12px] flex items-center justify-center gap-1"
              >
                <i className="bi bi-card-heading"></i>
                <span>Flashcard</span>
              </Link>
              <Link
                href="/materi"
                className="h-[36px] bg-[#0d6efd] text-white font-bold rounded-[6px] text-[12px] flex items-center justify-center gap-1"
              >
                <i className="bi bi-journal-text"></i>
                <span>Materi</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1e293b] text-white text-[12.5px] px-4 py-2.5 rounded-[7px] shadow-lg flex items-center gap-2 border border-[#334155] animate-fade-in">
          <i className="bi bi-check-circle-fill text-[#10b981]"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
