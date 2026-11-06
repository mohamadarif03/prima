"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  mockMaterials,
  mockFlashcardDecks,
  mockFlashcards,
  FlashcardDeck,
  FlashcardItem,
} from "@/lib/mock-data";
import { EmptyState } from "@/components/ui/EmptyState";

type FlashcardView = "deck-list" | "session" | "summary";
type RegionFilter = "Semua" | "Caput" | "Collum" | "Thorax" | "Abdomen" | "Pelvis" | "Membrum";

function FlashcardContent() {
  const searchParams = useSearchParams();
  const paramMateriId = searchParams.get("materi");
  const paramFromWrong = searchParams.get("from") === "wrong" || searchParams.get("sumber") === "soal-salah";

  // ==========================================
  // STATE VIEW & DECK
  // ==========================================
  const [currentView, setCurrentView] = useState<FlashcardView>("deck-list");
  const [decks, setDecks] = useState<FlashcardDeck[]>(mockFlashcardDecks);
  const [cards, setCards] = useState<FlashcardItem[]>(mockFlashcards);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>("Semua");

  // Modal Buat Flashcard Baru
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createSource, setCreateSource] = useState<string>(
    paramFromWrong ? "soal-salah" : paramMateriId || "mat-01"
  );
  const [createCardCount, setCreateCardCount] = useState<number>(10);
  const [createCardType, setCreateCardType] = useState<string>("istilah-definisi");
  const [isGeneratingDeck, setIsGeneratingDeck] = useState<boolean>(false);
  const [generateStep, setGenerateStep] = useState<number>(1);
  const [generatePercent, setGeneratePercent] = useState<number>(15);

  // Modal Ubah Nama Deck
  const [editingDeck, setEditingDeck] = useState<FlashcardDeck | null>(null);
  const [newDeckTitle, setNewDeckTitle] = useState<string>("");

  // Modal Hapus Deck
  const [deletingDeck, setDeletingDeck] = useState<FlashcardDeck | null>(null);

  // ==========================================
  // STATE SESI BELAJAR
  // ==========================================
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  const [sessionCards, setSessionCards] = useState<FlashcardItem[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [sessionResults, setSessionResults] = useState<
    Record<string, "unlearned" | "hesitant" | "mastered">
  >({});
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState<boolean>(false);

  // Toast Notifikasi
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Buka modal pembuatan jika ada parameter ?materi atau ?from=wrong
  useEffect(() => {
    if (paramMateriId || paramFromWrong) {
      setCreateSource(paramFromWrong ? "soal-salah" : paramMateriId || "mat-01");
      setIsCreateModalOpen(true);
    }
  }, [paramMateriId, paramFromWrong]);

  // ==========================================
  // SHORTCUT KEYBOARD SESI BELAJAR (Spasi, 1, 2, 3)
  // ==========================================
  useEffect(() => {
    if (currentView !== "session") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Abaikan jika fokus di input / textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        setIsCardFlipped((prev) => !prev);
      } else if (e.key === "1") {
        e.preventDefault();
        handleRateCard("unlearned");
      } else if (e.key === "2") {
        e.preventDefault();
        handleRateCard("hesitant");
      } else if (e.key === "3") {
        e.preventDefault();
        handleRateCard("mastered");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentView, currentCardIndex, sessionCards, isCardFlipped]);

  // ==========================================
  // HANDLER: DAFTAR DECK & PEMBUATAN
  // ==========================================
  const handleStartCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingDeck(true);
    setGenerateStep(1);
    setGeneratePercent(25);

    // Langkah 1: Ekstraksi istilah
    setTimeout(() => {
      setGenerateStep(2);
      setGeneratePercent(65);
    }, 700);

    // Langkah 2: Pemetaan definisi Latin
    setTimeout(() => {
      setGenerateStep(3);
      setGeneratePercent(95);
    }, 1400);

    // Selesai & Tambah Deck Baru
    setTimeout(() => {
      setGeneratePercent(100);
      setIsGeneratingDeck(false);
      setIsCreateModalOpen(false);

      const sourceMat = mockMaterials.find((m) => m.id === createSource);
      const isFromWrong = createSource === "soal-salah";

      const newDeckId = `deck-${Date.now().toString().slice(-4)}`;
      const deckTitle = isFromWrong
        ? "Flashcard Remedial: Butir Soal yang Salah"
        : `Istilah ${sourceMat?.title || "Anatomi Terintegrasi"}`;

      const newDeck: FlashcardDeck = {
        id: newDeckId,
        title: deckTitle,
        region: sourceMat?.region || "Thorax",
        materialId: isFromWrong ? undefined : sourceMat?.id,
        materialTitle: isFromWrong ? "Evaluasi Soal Remedial" : sourceMat?.title,
        cardCount: createCardCount,
        masteredCount: 0,
        hesitantCount: 0,
        unlearnedCount: createCardCount,
        lastStudied: "Baru dibuat",
      };

      // Tambahkan kartu dummy untuk deck baru
      const newGeneratedCards: FlashcardItem[] = Array.from(
        { length: createCardCount },
        (_, idx) => ({
          id: `fc-new-${idx + 1}`,
          deckId: newDeckId,
          front: `Struktur Anatomis ${idx + 1} (${newDeck.region})`,
          latin: `Structura Anatomica ${idx + 1}`,
          back: `Deskripsi posisi orientasi, batas jaringan, dan relasi fungsional struktur ${idx + 1} pada regio ${newDeck.region}.`,
          clinicalHint: "Evaluasi korelasi klinis dan pemahaman topografi praktikum.",
          status: "unlearned",
        })
      );

      setDecks((prev) => [newDeck, ...prev]);
      setCards((prev) => [...prev, ...newGeneratedCards]);
      showToast(`Deck "${deckTitle}" berhasil dibuat oleh AI!`);
    }, 2000);
  };

  // Simpan Ubah Nama
  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeck || !newDeckTitle.trim()) return;

    setDecks((prev) =>
      prev.map((d) => (d.id === editingDeck.id ? { ...d, title: newDeckTitle.trim() } : d))
    );
    showToast(`Nama deck diubah menjadi "${newDeckTitle.trim()}".`);
    setEditingDeck(null);
  };

  // Konfirmasi Hapus Deck
  const handleConfirmDelete = () => {
    if (!deletingDeck) return;
    setDecks((prev) => prev.filter((d) => d.id !== deletingDeck.id));
    setCards((prev) => prev.filter((c) => c.deckId !== deletingDeck.id));
    showToast(`Deck "${deletingDeck.title}" telah dihapus.`);
    setDeletingDeck(null);
  };

  // ==========================================
  // HANDLER: MEMULAI SESI BELAJAR
  // ==========================================
  const handleStartStudySession = (deck: FlashcardDeck, customCards?: FlashcardItem[]) => {
    setActiveDeck(deck);
    const targetCards = customCards || cards.filter((c) => c.deckId === deck.id);

    if (targetCards.length === 0) {
      showToast("Deck ini belum memiliki kartu.");
      return;
    }

    setSessionCards(targetCards);
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
    setSessionResults({});
    setCurrentView("session");
  };

  // Shuffle / Acak Kartu
  const handleShuffleCards = () => {
    setSessionCards((prev) => {
      const shuffled = [...prev].sort(() => Math.random() - 0.5);
      return shuffled;
    });
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
    showToast("Urutan kartu berhasil diacak!");
  };

  // Tandai / Bookmark Kartu Aktif
  const handleToggleBookmark = () => {
    const currentCard = sessionCards[currentCardIndex];
    if (!currentCard) return;

    const newMarked = !currentCard.marked;
    setSessionCards((prev) =>
      prev.map((c, idx) => (idx === currentCardIndex ? { ...c, marked: newMarked } : c))
    );
    setCards((prev) =>
      prev.map((c) => (c.id === currentCard.id ? { ...c, marked: newMarked } : c))
    );

    showToast(newMarked ? "Kartu ditandai!" : "Tanda kartu dihapus.");
  };

  // Penilaian Diri (1: unlearned, 2: hesitant, 3: mastered)
  const handleRateCard = (rating: "unlearned" | "hesitant" | "mastered") => {
    const currentCard = sessionCards[currentCardIndex];
    if (!currentCard) return;

    // Catat hasil lokal sesi
    setSessionResults((prev) => ({
      ...prev,
      [currentCard.id]: rating,
    }));

    // Update status di basis kartu
    setCards((prev) =>
      prev.map((c) => (c.id === currentCard.id ? { ...c, status: rating } : c))
    );

    // Lanjut ke kartu berikutnya atau ringkasan
    if (currentCardIndex < sessionCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsCardFlipped(false);
    } else {
      // Sesi selesai -> Tampilan Ringkasan
      updateDeckStats(activeDeck?.id, {
        ...sessionResults,
        [currentCard.id]: rating,
      });
      setCurrentView("summary");
    }
  };

  // Update statistik deck setelah sesi
  const updateDeckStats = (
    deckId?: string,
    results?: Record<string, "unlearned" | "hesitant" | "mastered">
  ) => {
    if (!deckId || !results) return;

    setDecks((prev) =>
      prev.map((d) => {
        if (d.id !== deckId) return d;
        let mastered = 0;
        let hesitant = 0;
        let unlearned = 0;

        Object.values(results).forEach((r) => {
          if (r === "mastered") mastered++;
          else if (r === "hesitant") hesitant++;
          else unlearned++;
        });

        return {
          ...d,
          masteredCount: mastered,
          hesitantCount: hesitant,
          unlearnedCount: unlearned,
          lastStudied: "Baru saja",
        };
      })
    );
  };

  // Ulangi kartu yang belum hafal dari ringkasan
  const handleRetryUnlearned = () => {
    const unmasteredCards = sessionCards.filter(
      (c) => sessionResults[c.id] === "unlearned" || sessionResults[c.id] === "hesitant"
    );

    if (unmasteredCards.length === 0) {
      showToast("Luar biasa! Semua kartu telah berstatus Hafal.");
      return;
    }

    if (activeDeck) {
      handleStartStudySession(activeDeck, unmasteredCards);
    }
  };

  // Filtered Decks
  const filteredDecks = useMemo(() => {
    return decks.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === "Semua" || d.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [decks, searchQuery, selectedRegion]);

  // Statistik Keseluruhan
  const overallStats = useMemo(() => {
    const totalDecks = decks.length;
    const totalCards = cards.length;
    const masteredCards = cards.filter((c) => c.status === "mastered").length;
    const percentage = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;
    return { totalDecks, totalCards, masteredCards, percentage };
  }, [decks, cards]);

  const currentCard = sessionCards[currentCardIndex];

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
      {/* TAMPILAN 1: DAFTAR DECK FLASHCARD */}
      {/* ========================================================= */}
      {currentView === "deck-list" && (
        <div className="space-y-6">
          {/* TOP HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12px] font-semibold text-[#64748b] uppercase tracking-wider">
                  PRIMA · Fitur AI (F5)
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a] font-bold border border-[#bbf7d0]">
                  Active Recall
                </span>
              </div>
              <h1 className="text-[22px] sm:text-[26px] font-bold text-[#1e293b] tracking-tight">
                Flashcard Istilah Anatomi
              </h1>
              <p className="text-[13px] sm:text-[14px] text-[#64748b] mt-0.5">
                Hafalkan istilah medis Latin, orientasi struktur, dan korelasi klinis secara mandiri.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="h-[36px] px-4 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[13px] font-semibold rounded-[6px] flex items-center gap-2 shadow-xs transition self-start sm:self-auto"
            >
              <i className="bi bi-plus-circle-fill"></i>
              <span>Buat Flashcard Baru</span>
            </button>
          </div>

          {/* STAT KPI MINI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-[6px] bg-[#eff6ff] text-[#0d6efd] flex items-center justify-center text-[18px]">
                <i className="bi bi-collection"></i>
              </div>
              <div>
                <span className="text-[11px] font-medium text-[#64748b] uppercase tracking-wider block">
                  Total Deck
                </span>
                <strong className="text-[18px] font-bold text-[#1e293b]">
                  {overallStats.totalDecks} Paket Belajar
                </strong>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-[6px] bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center text-[18px]">
                <i className="bi bi-card-checklist"></i>
              </div>
              <div>
                <span className="text-[11px] font-medium text-[#64748b] uppercase tracking-wider block">
                  Total Kartu Istilah
                </span>
                <strong className="text-[18px] font-bold text-[#1e293b]">
                  {overallStats.totalCards} Kartu
                </strong>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-4 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-[6px] bg-[#fef3c7] text-[#d97706] flex items-center justify-center text-[18px]">
                <i className="bi bi-award"></i>
              </div>
              <div>
                <span className="text-[11px] font-medium text-[#64748b] uppercase tracking-wider block">
                  Tingkat Hafal
                </span>
                <strong className="text-[18px] font-bold text-[#1e293b]">
                  {overallStats.percentage}% ({overallStats.masteredCards} Kartu)
                </strong>
              </div>
            </div>
          </div>

          {/* FILTER & PENCARIAN */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[13px]"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari deck flashcard, topik, atau regio..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd] placeholder-[#94a3b8]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
                >
                  <i className="bi bi-x-circle-fill text-[13px]"></i>
                </button>
              )}
            </div>

            {/* Region Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
              {(["Semua", "Caput", "Collum", "Thorax", "Abdomen", "Pelvis", "Membrum"] as RegionFilter[]).map(
                (reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-2.5 py-1 text-[11.5px] rounded-[6px] font-medium transition flex-shrink-0 ${
                      selectedRegion === reg
                        ? "bg-[#0d6efd] text-white shadow-xs"
                        : "bg-white text-[#475569] border border-[#cbd5e1] hover:bg-[#f8fafc]"
                    }`}
                  >
                    {reg}
                  </button>
                )
              )}
            </div>
          </div>

          {/* GRID KARTU DECK */}
          {filteredDecks.length === 0 ? (
            <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-8">
              <EmptyState
                title="Tidak Ada Deck Ditemukan"
                description="Tidak ada paket flashcard yang sesuai dengan pencarian atau filter yang dipilih. Buat flashcard baru atau reset filter pencarian."
                action={
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedRegion("Semua");
                    }}
                    className="px-3.5 py-1.5 bg-[#0d6efd] text-white text-[12px] font-semibold rounded-[6px]"
                  >
                    Reset Filter
                  </button>
                }
                icon={<i className="bi bi-card-heading text-[28px] text-[#94a3b8]"></i>}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredDecks.map((deck) => {
                const percentMastered =
                  deck.cardCount > 0 ? Math.round((deck.masteredCount / deck.cardCount) * 100) : 0;

                return (
                  <div
                    key={deck.id}
                    className="metis-card p-5 flex flex-col justify-between hover:border-[#cbd5e1] transition group bg-white"
                  >
                    <div>
                      {/* Top Header Deck */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d6efd] bg-[#eff6ff] px-2 py-0.5 rounded-[4px] border border-[#bfdbfe]">
                          Regio {deck.region}
                        </span>
                        <span className="text-[11px] text-[#64748b] flex items-center gap-1">
                          <i className="bi bi-clock"></i>
                          <span>{deck.lastStudied || "Belum dipelajari"}</span>
                        </span>
                      </div>

                      {/* Judul Deck */}
                      <h3 className="text-[15px] font-bold text-[#1e293b] leading-snug mb-1.5 group-hover:text-[#0d6efd] transition">
                        {deck.title}
                      </h3>

                      {deck.materialTitle && (
                        <p className="text-[11.5px] text-[#64748b] mb-3 flex items-center gap-1">
                          <i className="bi bi-journal-text text-[#0d6efd]"></i>
                          <span className="truncate">{deck.materialTitle}</span>
                        </p>
                      )}

                      {/* Progress Bar Hafal */}
                      <div className="mt-3 mb-4 p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px]">
                        <div className="flex items-center justify-between text-[11.5px] mb-1.5">
                          <span className="font-semibold text-[#1e293b]">Tingkat Penguasaan</span>
                          <span className="font-bold text-[#16a34a]">{percentMastered}% Hafal</span>
                        </div>
                        <div className="w-full bg-[#e2e8f0] h-2 rounded-full overflow-hidden mb-2">
                          <div
                            className="bg-[#16a34a] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentMastered}%` }}
                          ></div>
                        </div>

                        {/* Breakdown 3 Status */}
                        <div className="grid grid-cols-3 gap-1 text-[10.5px] text-center pt-1 border-t border-[#f1f5f9]">
                          <span className="text-[#16a34a] font-semibold">
                            {deck.masteredCount} Hafal
                          </span>
                          <span className="text-[#d97706] font-semibold">
                            {deck.hesitantCount} Ragu
                          </span>
                          <span className="text-[#dc2626] font-semibold">
                            {deck.unlearnedCount} Belum
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartStudySession(deck)}
                        className="flex-1 h-[34px] px-3 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12.5px] font-semibold rounded-[6px] flex items-center justify-center gap-1.5 transition shadow-xs"
                      >
                        <i className="bi bi-play-circle-fill"></i>
                        <span>Mulai Belajar ({deck.cardCount} Kartu)</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDeck(deck);
                            setNewDeckTitle(deck.title);
                          }}
                          className="h-[34px] w-[34px] rounded-[6px] border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#64748b] hover:text-[#0d6efd] flex items-center justify-center transition"
                          title="Ubah nama deck"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingDeck(deck)}
                          className="h-[34px] w-[34px] rounded-[6px] border border-[#cbd5e1] hover:bg-[#fef2f2] text-[#64748b] hover:text-[#dc2626] flex items-center justify-center transition"
                          title="Hapus deck"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CATATAN KEPATUHAN PRD F5 */}
          <div className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] text-[11.5px] text-[#64748b] leading-relaxed">
            <i className="bi bi-info-circle me-1.5 text-[#0d6efd]"></i>
            Flashcard PRIMA memfasilitasi teknik <em>active recall</em> untuk memperkuat memori istilah anatomi. Dibuat oleh AI sebagai alat bantu belajar mandiri.
          </div>

          {/* MODAL BUAT FLASHCARD BARU */}
          {isCreateModalOpen && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            >
              <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-xl max-w-lg w-full p-5 sm:p-6 animate-scale-up">
                <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] mb-4">
                  <div className="flex items-center gap-2">
                    <i className="bi bi-card-heading text-[#0d6efd] text-[18px]"></i>
                    <h3 className="text-[15px] font-bold text-[#1e293b]">Buat Paket Flashcard Baru</h3>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-[#94a3b8] hover:text-[#475569]"
                  >
                    <i className="bi bi-x-lg text-[13px]"></i>
                  </button>
                </div>

                <form onSubmit={handleStartCreateDeck} className="space-y-4">
                  {/* 1. Sumber Materi */}
                  <div>
                    <label className="block text-[12px] font-bold text-[#1e293b] mb-1">
                      Sumber Istilah &amp; Konten <span className="text-[#dc2626]">*</span>
                    </label>
                    <select
                      value={createSource}
                      onChange={(e) => setCreateSource(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd]"
                    >
                      <optgroup label="Materi Kuliah & Rangkuman AI">
                        {mockMaterials
                          .filter((m) => m.status === "ready")
                          .map((mat) => (
                            <option key={mat.id} value={mat.id}>
                              {mat.title} ({mat.region})
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Evaluasi Latihan Soal">
                        <option value="soal-salah">
                          Dari Soal yang Salah Terakhir (Remedial Kuis)
                        </option>
                      </optgroup>
                    </select>
                  </div>

                  {/* 2. Jumlah Kartu */}
                  <div>
                    <label className="block text-[12px] font-bold text-[#1e293b] mb-1">
                      Jumlah Kartu Istilah
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[10, 15, 20].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setCreateCardCount(num)}
                          className={`py-2 text-[12px] font-semibold rounded-[6px] border transition ${
                            createCardCount === num
                              ? "bg-[#0d6efd] text-white border-[#0d6efd] shadow-xs"
                              : "bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f8fafc]"
                          }`}
                        >
                          {num} Kartu
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Jenis Kartu */}
                  <div>
                    <label className="block text-[12px] font-bold text-[#1e293b] mb-1">
                      Fokus Tipe Kartu
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          id: "istilah-definisi",
                          label: "Istilah & Definisi Anatomis",
                          desc: "Sisi depan nama Latin & Indonesia; sisi belakang definisi & letak.",
                        },
                        {
                          id: "struktur-fungsi",
                          label: "Struktur, Inervasi & Vaskularisasi",
                          desc: "Fokus pada jaras persarafan, cabang arteri, dan organ sasaran.",
                        },
                        {
                          id: "korelasi-klinis",
                          label: "Korelasi Klinis & Patologi Sederhana",
                          desc: "Gejala khas trauma, sindrom neuropati, dan fraktur.",
                        },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`p-2.5 rounded-[6px] border flex items-start gap-2.5 cursor-pointer transition ${
                            createCardType === item.id
                              ? "border-[#0d6efd] bg-[#eff6ff]"
                              : "border-[#e2e8f0] bg-white hover:bg-[#f8fafc]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="cardType"
                            checked={createCardType === item.id}
                            onChange={() => setCreateCardType(item.id)}
                            className="mt-0.5 text-[#0d6efd] focus:ring-[#0d6efd]"
                          />
                          <div>
                            <strong className="text-[12px] font-bold text-[#1e293b] block">
                              {item.label}
                            </strong>
                            <span className="text-[11px] text-[#64748b] leading-tight block">
                              {item.desc}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#f1f5f9]">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-3.5 py-1.5 bg-white border border-[#cbd5e1] text-[#475569] rounded-[6px] text-[12.5px] font-medium"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isGeneratingDeck}
                      className="px-4 py-1.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded-[6px] text-[12.5px] font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <i className="bi bi-stars"></i>
                      <span>Ekstrak &amp; Buat Deck AI</span>
                    </button>
                  </div>
                </form>

                {/* MODAL SIMULASI LOADING */}
                {isGeneratingDeck && (
                  <div className="mt-4 p-4 bg-[#eff6ff] border border-[#bfdbfe] rounded-[8px] text-center animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-white text-[#0d6efd] flex items-center justify-center mx-auto mb-2 text-[16px] shadow-xs">
                      <i className="bi bi-stars animate-spin"></i>
                    </div>
                    <strong className="text-[13px] font-bold text-[#1e293b] block mb-1">
                      Menyusun Kartu Flashcard AI...
                    </strong>
                    <div className="w-full bg-[#bfdbfe] h-1.5 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-[#0d6efd] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${generatePercent}%` }}
                      ></div>
                    </div>
                    <span className="text-[11.5px] text-[#1e40af] font-medium">
                      {generateStep === 1 && "1. Menganalisis dokumen materi & istilah Latin..."}
                      {generateStep === 2 && "2. Menyusun pasangan istilah & definisi anatomis..."}
                      {generateStep === 3 && "3. Mengemas paket flashcard..."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODAL UBAH NAMA */}
          {editingDeck && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            >
              <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-xl max-w-md w-full p-5 animate-scale-up">
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-3">Ubah Nama Deck</h3>
                <form onSubmit={handleSaveRename} className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-medium text-[#64748b] mb-1">
                      Nama Paket Flashcard
                    </label>
                    <input
                      type="text"
                      required
                      value={newDeckTitle}
                      onChange={(e) => setNewDeckTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd]"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingDeck(null)}
                      className="px-3 py-1.5 bg-white border border-[#cbd5e1] text-[#475569] rounded-[6px] text-[12px] font-medium"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-[#0d6efd] text-white rounded-[6px] text-[12px] font-semibold"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL HAPUS DECK */}
          {deletingDeck && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            >
              <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-xl max-w-sm w-full p-5 text-center animate-scale-up">
                <div className="w-11 h-11 rounded-full bg-[#fee2e2] text-[#dc2626] flex items-center justify-center mx-auto mb-3 text-[18px]">
                  <i className="bi bi-trash-fill"></i>
                </div>
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-1">Hapus Deck Flashcard?</h3>
                <p className="text-[12.5px] text-[#64748b] mb-4">
                  Deck &ldquo;<strong>{deletingDeck.title}</strong>&rdquo; dan {deletingDeck.cardCount} kartu di dalamnya akan dihapus.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDeletingDeck(null)}
                    className="px-3.5 py-1.5 bg-white border border-[#cbd5e1] text-[#475569] rounded-[6px] text-[12.5px] font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-4 py-1.5 bg-[#dc2626] text-white rounded-[6px] text-[12.5px] font-semibold"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAMPILAN 2: SESI BELAJAR FLASHCARD (KARTU BESAR & BALIK) */}
      {/* ========================================================= */}
      {currentView === "session" && currentCard && activeDeck && (
        <div className="max-w-3xl mx-auto space-y-5">
          {/* TOP BAR SESI */}
          <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d6efd] bg-[#eff6ff] px-2 py-0.5 rounded-[4px] border border-[#bfdbfe]">
                  Regio {activeDeck.region}
                </span>
                <span className="text-[12.5px] font-bold text-[#1e293b] truncate max-w-[260px] sm:max-w-md">
                  {activeDeck.title}
                </span>
              </div>
              <span className="text-[11.5px] text-[#64748b]">
                Kartu {currentCardIndex + 1} dari {sessionCards.length}
              </span>
            </div>

            {/* Tombol Aksi Alat */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShuffleCards}
                className="h-[32px] px-2.5 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#475569] rounded-[6px] text-[11.5px] font-medium flex items-center gap-1 transition"
                title="Acak urutan kartu"
              >
                <i className="bi bi-shuffle"></i>
                <span className="hidden sm:inline">Acak</span>
              </button>

              <button
                type="button"
                onClick={handleToggleBookmark}
                className={`h-[32px] px-2.5 rounded-[6px] text-[11.5px] font-medium flex items-center gap-1 border transition ${
                  currentCard.marked
                    ? "bg-[#fef3c7] text-[#92400e] border-[#fde68a]"
                    : "bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f8fafc]"
                }`}
                title="Tandai kartu ini"
              >
                <i
                  className={currentCard.marked ? "bi bi-star-fill text-[#d97706]" : "bi bi-star"}
                ></i>
                <span className="hidden sm:inline">Tandai</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExitConfirmOpen(true)}
                className="h-[32px] px-2.5 bg-white hover:bg-[#fef2f2] border border-[#cbd5e1] hover:border-[#fca5a5] text-[#64748b] hover:text-[#dc2626] rounded-[6px] text-[11.5px] font-medium transition"
              >
                Keluar
              </button>
            </div>
          </div>

          {/* PROGRESS BAR SESI */}
          <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0d6efd] h-1.5 rounded-full transition-all duration-200"
              style={{
                width: `${((currentCardIndex + 1) / sessionCards.length) * 100}%`,
              }}
            ></div>
          </div>

          {/* KARTU BESAR DENGAN ANIMASI BALIK */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsCardFlipped((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsCardFlipped((prev) => !prev);
              }
            }}
            className="w-full min-h-[340px] sm:min-h-[380px] bg-white border border-[#cbd5e1] rounded-[12px] p-6 sm:p-8 flex flex-col justify-between cursor-pointer select-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
            aria-label="Kartu flashcard: klik atau tekan Spasi untuk membalik kartu"
          >
            {/* Header Mini Sisi Kartu */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] flex items-center gap-1.5">
                <i
                  className={
                    isCardFlipped ? "bi bi-arrow-return-right text-[#16a34a]" : "bi bi-card-text text-[#0d6efd]"
                  }
                ></i>
                <span>{isCardFlipped ? "Sisi Belakang · Definisi & Struktur" : "Sisi Depan · Istilah Anatomi"}</span>
              </span>
              <span className="text-[11px] font-semibold text-[#0d6efd] bg-[#eff6ff] px-2 py-0.5 rounded">
                Klik kartu atau tekan [Spasi] untuk balik
              </span>
            </div>

            {/* KONTEN TENGAH KARTU */}
            <div className="py-6 sm:py-8 text-center my-auto">
              {!isCardFlipped ? (
                // SISI DEPAN
                <div className="space-y-3 animate-fade-in">
                  <span className="text-[12px] font-semibold text-[#64748b] uppercase tracking-wide block">
                    Nama Indonesia / Klinis
                  </span>
                  <h2 className="text-[24px] sm:text-[30px] font-bold text-[#1e293b] leading-tight">
                    {currentCard.front}
                  </h2>
                  <div className="inline-block px-3 py-1 bg-[#eff6ff] text-[#0d6efd] rounded-full text-[15px] font-semibold italic border border-[#bfdbfe]">
                    {currentCard.latin}
                  </div>
                </div>
              ) : (
                // SISI BELAKANG
                <div className="space-y-4 text-left animate-fade-in">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#16a34a] block mb-1">
                      Deskripsi &amp; Letak Anatomis
                    </span>
                    <p className="text-[15px] sm:text-[16px] text-[#1e293b] leading-relaxed">
                      {currentCard.back}
                    </p>
                  </div>

                  {currentCard.clinicalHint && (
                    <div className="p-3.5 bg-[#fffbeb] border border-[#fef3c7] rounded-[8px] flex items-start gap-2.5 text-[#92400e]">
                      <i className="bi bi-lightbulb-fill text-[#d97706] text-[16px] mt-0.5 flex-shrink-0"></i>
                      <div className="text-[12px] leading-relaxed">
                        <strong className="block font-bold mb-0.5">Catatan Klinis / Mnemonic:</strong>
                        <span>{currentCard.clinicalHint}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Kartu */}
            <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11.5px] text-[#94a3b8]">
              <span>PRIMA Flashcard Engine</span>
              <span className="flex items-center gap-1 text-[#0d6efd]">
                <i className="bi bi-arrow-repeat"></i>
                <span>{isCardFlipped ? "Tampilkan Istilah Depan" : "Tampilkan Definisi Belakang"}</span>
              </span>
            </div>
          </div>

          {/* TIGA TOMBOL PENILAIAN DIRI */}
          <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] text-center block mb-2.5">
              Bagaimana penguasaanmu terhadap kartu ini?
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Tombol 1: Belum Hafal */}
              <button
                type="button"
                onClick={() => handleRateCard("unlearned")}
                className="py-3 px-3 bg-[#fef2f2] hover:bg-[#fee2e2] text-[#991b1b] border border-[#fecaca] rounded-[8px] font-semibold text-[13px] flex flex-col items-center justify-center gap-1 transition shadow-xs group"
              >
                <div className="flex items-center gap-1.5">
                  <i className="bi bi-x-circle-fill text-[#dc2626]"></i>
                  <span>Belum Hafal</span>
                </div>
                <span className="text-[10px] text-[#dc2626] font-normal group-hover:font-semibold">
                  Tekan [1]
                </span>
              </button>

              {/* Tombol 2: Ragu-ragu */}
              <button
                type="button"
                onClick={() => handleRateCard("hesitant")}
                className="py-3 px-3 bg-[#fffbeb] hover:bg-[#fef3c7] text-[#92400e] border border-[#fde68a] rounded-[8px] font-semibold text-[13px] flex flex-col items-center justify-center gap-1 transition shadow-xs group"
              >
                <div className="flex items-center gap-1.5">
                  <i className="bi bi-question-circle-fill text-[#d97706]"></i>
                  <span>Ragu-ragu</span>
                </div>
                <span className="text-[10px] text-[#d97706] font-normal group-hover:font-semibold">
                  Tekan [2]
                </span>
              </button>

              {/* Tombol 3: Hafal */}
              <button
                type="button"
                onClick={() => handleRateCard("mastered")}
                className="py-3 px-3 bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#166534] border border-[#bbf7d0] rounded-[8px] font-semibold text-[13px] flex flex-col items-center justify-center gap-1 transition shadow-xs group"
              >
                <div className="flex items-center gap-1.5">
                  <i className="bi bi-check-circle-fill text-[#16a34a]"></i>
                  <span>Hafal</span>
                </div>
                <span className="text-[10px] text-[#16a34a] font-normal group-hover:font-semibold">
                  Tekan [3]
                </span>
              </button>
            </div>

            {/* Navigasi Sebelumnya & Balik */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#f1f5f9] text-[12px]">
              <button
                type="button"
                disabled={currentCardIndex === 0}
                onClick={() => {
                  setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                  setIsCardFlipped(false);
                }}
                className="px-3 py-1 bg-white hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed border border-[#cbd5e1] rounded text-[#475569] flex items-center gap-1"
              >
                <i className="bi bi-chevron-left"></i>
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCardFlipped((prev) => !prev)}
                className="text-[#0d6efd] font-semibold hover:underline flex items-center gap-1"
              >
                <i className="bi bi-arrow-repeat"></i>
                <span>Balik Kartu (Spasi)</span>
              </button>
            </div>
          </div>

          {/* MODAL KONFIRMASI KELUAR */}
          {isExitConfirmOpen && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            >
              <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-xl max-w-sm w-full p-5 text-center animate-scale-up">
                <div className="w-10 h-10 rounded-full bg-[#eff6ff] text-[#0d6efd] flex items-center justify-center mx-auto mb-3 text-[18px]">
                  <i className="bi bi-door-open-fill"></i>
                </div>
                <h3 className="text-[15px] font-bold text-[#1e293b] mb-1">Akhiri Sesi Belajar?</h3>
                <p className="text-[12px] text-[#64748b] mb-4">
                  Hasil penilaian yang telah kamu berikan akan disimpan pada ringkasan evaluasi deck ini.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExitConfirmOpen(false)}
                    className="px-3 py-1.5 bg-white border border-[#cbd5e1] text-[#475569] rounded-[6px] text-[12px] font-medium"
                  >
                    Lanjut Belajar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsExitConfirmOpen(false);
                      setCurrentView("summary");
                    }}
                    className="px-3.5 py-1.5 bg-[#0d6efd] text-white rounded-[6px] text-[12px] font-semibold shadow-xs"
                  >
                    Selesaikan Sesi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAMPILAN 3: RINGKASAN SESI BELAJAR */}
      {/* ========================================================= */}
      {currentView === "summary" && activeDeck && (
        <div className="max-w-3xl mx-auto space-y-5">
          {/* KARTU SKOR RINGKASAN */}
          <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-6 shadow-xs">
            <div className="text-center pb-5 border-b border-[#f1f5f9]">
              <div className="w-12 h-12 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center mx-auto mb-3 text-[22px]">
                <i className="bi bi-award-fill"></i>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#16a34a] bg-[#dcfce7] px-2.5 py-0.5 rounded-full">
                Sesi Belajar Selesai
              </span>
              <h1 className="text-[22px] font-bold text-[#1e293b] mt-2 mb-1">
                Ringkasan Evaluasi Hafalan
              </h1>
              <p className="text-[13px] text-[#64748b]">
                Deck: <strong>{activeDeck.title}</strong> · {sessionCards.length} Kartu Diulas
              </p>
            </div>

            {/* 3 KOTAK METRIK PENILAIAN */}
            <div className="grid grid-cols-3 gap-3 py-5">
              {/* Hafal */}
              <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[8px] text-center">
                <span className="text-[11px] font-bold text-[#166534] uppercase tracking-wide block mb-1">
                  Hafal
                </span>
                <strong className="text-[24px] font-bold text-[#16a34a] leading-none block">
                  {Object.values(sessionResults).filter((r) => r === "mastered").length}
                </strong>
                <span className="text-[11px] text-[#166534] mt-1 block">Kartu Dikuasai</span>
              </div>

              {/* Ragu-ragu */}
              <div className="p-3 bg-[#fffbeb] border border-[#fde68a] rounded-[8px] text-center">
                <span className="text-[11px] font-bold text-[#92400e] uppercase tracking-wide block mb-1">
                  Ragu-ragu
                </span>
                <strong className="text-[24px] font-bold text-[#d97706] leading-none block">
                  {Object.values(sessionResults).filter((r) => r === "hesitant").length}
                </strong>
                <span className="text-[11px] text-[#92400e] mt-1 block">Perlu Dipantapkan</span>
              </div>

              {/* Belum Hafal */}
              <div className="p-3 bg-[#fef2f2] border border-[#fecaca] rounded-[8px] text-center">
                <span className="text-[11px] font-bold text-[#991b1b] uppercase tracking-wide block mb-1">
                  Belum Hafal
                </span>
                <strong className="text-[24px] font-bold text-[#dc2626] leading-none block">
                  {Object.values(sessionResults).filter((r) => r === "unlearned").length}
                </strong>
                <span className="text-[11px] text-[#991b1b] mt-1 block">Perlu Pengulangan</span>
              </div>
            </div>

            {/* TOMBOL AKSI UTAMA RINGKASAN */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={handleRetryUnlearned}
                className="h-[36px] px-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[12.5px] font-semibold rounded-[6px] flex items-center gap-1.5 transition shadow-xs"
              >
                <i className="bi bi-arrow-repeat"></i>
                <span>Ulangi Kartu yang Belum Hafal</span>
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={`/latihan-materials?materi=${activeDeck.materialId || "mat-01"}`}
                  className="h-[36px] px-3.5 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#0d6efd] text-[12.5px] font-semibold rounded-[6px] flex items-center gap-1.5 transition"
                >
                  <i className="bi bi-ui-checks"></i>
                  <span>Latihan Soal dari Deck Ini</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setCurrentView("deck-list")}
                  className="h-[36px] px-3.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12.5px] font-semibold rounded-[6px] flex items-center gap-1.5 transition"
                >
                  <i className="bi bi-grid"></i>
                  <span>Kembali ke Daftar Deck</span>
                </button>
              </div>
            </div>
          </div>

          {/* DAFTAR KARTU YANG BELUM HAFAL / PERLU DIULANG */}
          <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-5 shadow-xs">
            <h3 className="text-[14px] font-bold text-[#1e293b] mb-3 flex items-center gap-2">
              <i className="bi bi-journal-x text-[#dc2626]"></i>
              <span>Daftar Istilah yang Belum Dikuasai</span>
            </h3>

            {sessionCards.filter(
              (c) => sessionResults[c.id] === "unlearned" || sessionResults[c.id] === "hesitant"
            ).length === 0 ? (
              <div className="p-6 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[6px] text-center text-[13px] text-[#166534]">
                <i className="bi bi-check-circle-fill text-[24px] text-[#16a34a] block mb-1"></i>
                Hebat! Seluruh istilah dalam sesi ini telah kamu kuasai dengan baik.
              </div>
            ) : (
              <div className="space-y-3">
                {sessionCards
                  .filter(
                    (c) =>
                      sessionResults[c.id] === "unlearned" || sessionResults[c.id] === "hesitant"
                  )
                  .map((card, idx) => (
                    <div
                      key={card.id}
                      className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="w-5 h-5 rounded-full bg-[#fee2e2] text-[#dc2626] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <strong className="text-[13.5px] font-bold text-[#1e293b]">
                            {card.front}
                          </strong>
                          <span className="text-[12px] text-[#0d6efd] italic">
                            ({card.latin})
                          </span>
                        </div>
                        <p className="text-[12px] text-[#475569] leading-relaxed pl-7">
                          {card.back}
                        </p>
                      </div>

                      <span
                        className={`text-[10.5px] font-bold px-2 py-0.5 rounded self-start sm:self-auto ${
                          sessionResults[card.id] === "hesitant"
                            ? "bg-[#fffbeb] text-[#92400e] border border-[#fde68a]"
                            : "bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]"
                        }`}
                      >
                        {sessionResults[card.id] === "hesitant" ? "Ragu-ragu" : "Belum Hafal"}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlashcardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-[#64748b] text-[13px]">
          <div className="w-6 h-6 border-2 border-[#0d6efd] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Memuat modul flashcard istilah...
        </div>
      }
    >
      <FlashcardContent />
    </Suspense>
  );
}
