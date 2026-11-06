"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import ChartJS from "chart.js/auto";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  mockDetailedAnatomyTopics,
  DetailedAnatomyTopic,
  MasteryLevel,
} from "@/lib/mock-data";

export default function KelemahanPage() {
  const [topics] = useState<DetailedAnatomyTopic[]>(mockDetailedAnatomyTopics);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("top-01");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegio, setSelectedRegio] = useState("Semua");
  const [selectedLevel, setSelectedLevel] = useState<"Semua" | MasteryLevel>("Semua");
  const [sortBy, setSortBy] = useState<"skor-terendah" | "terakhir-dilatih" | "sering-salah">("skor-terendah");

  const trendChartRef = useRef<HTMLCanvasElement | null>(null);

  // Selected Topic
  const selectedTopic =
    topics.find((t) => t.id === selectedTopicId) || topics[0];

  // Toast feedback
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Find lowest score topic
  const lowestScoreTopic = useMemo(() => {
    return [...topics].sort((a, b) => a.masteryScore - b.masteryScore)[0];
  }, [topics]);

  // Regio options (Urutan 6 Regio Tubuh Standar Anatomis)
  const regioOptions = useMemo(() => {
    return [
      "Semua",
      "Regio Caput",
      "Regio Collum",
      "Regio Thorax",
      "Regio Abdomen",
      "Regio Pelvis",
      "Regio Membrum",
    ];
  }, []);

  // Filtered & Sorted Topics
  const filteredTopics = useMemo(() => {
    let result = [...topics];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.nameIndo.toLowerCase().includes(q) ||
          t.nameLatin.toLowerCase().includes(q) ||
          t.regio.toLowerCase().includes(q)
      );
    }

    // Filter Regio
    if (selectedRegio !== "Semua") {
      result = result.filter((t) => t.regio === selectedRegio);
    }

    // Filter Level
    if (selectedLevel !== "Semua") {
      result = result.filter((t) => t.level === selectedLevel);
    }

    // Sort
    if (sortBy === "skor-terendah") {
      result.sort((a, b) => a.masteryScore - b.masteryScore);
    } else if (sortBy === "terakhir-dilatih") {
      result.sort(
        (a, b) =>
          new Date(b.lastPracticedDate).getTime() -
          new Date(a.lastPracticedDate).getTime()
      );
    } else if (sortBy === "sering-salah") {
      result.sort((a, b) => b.frequentErrorCount - a.frequentErrorCount);
    }

    return result;
  }, [topics, searchQuery, selectedRegio, selectedLevel, sortBy]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRegio("Semua");
    setSelectedLevel("Semua");
    setSortBy("skor-terendah");
    showToast("Filter berhasil diatur ulang");
  };

  // Select topic helper
  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    if (window.innerWidth < 1024) {
      setMobileDrawerOpen(true);
    }
  };

  // Trend 6-Weeks Chart
  useEffect(() => {
    if (!trendChartRef.current || !selectedTopic) return;
    const ctx = trendChartRef.current.getContext("2d");
    if (!ctx) return;

    const blueGrad = ctx.createLinearGradient(0, 0, 0, 160);
    blueGrad.addColorStop(0, "rgba(13, 110, 253, 0.16)");
    blueGrad.addColorStop(1, "rgba(13, 110, 253, 0.01)");

    const chartInstance = new ChartJS(ctx, {
      type: "line",
      data: {
        labels: ["M-5", "M-4", "M-3", "M-2", "M-1", "Minggu Ini"],
        datasets: [
          {
            label: "Penguasaan",
            data: selectedTopic.trend6Weeks,
            borderColor: "#0d6efd",
            backgroundColor: blueGrad,
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: [
              "#0d6efd",
              "#0d6efd",
              "#0d6efd",
              "#0d6efd",
              "#0d6efd",
              "#dc2626", // Last point highlighted
            ],
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: [3, 3, 3, 3, 3, 6],
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e293b",
            titleFont: { size: 11, family: "'Inter', sans-serif" },
            bodyFont: { size: 11, family: "'Inter', sans-serif" },
            padding: 8,
            cornerRadius: 4,
            callbacks: {
              label: (context) => ` Skor: ${context.parsed.y}%`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: "#e2e8f0" },
            ticks: {
              font: { size: 10.5, family: "'Inter', sans-serif" },
              color: "#64748b",
            },
          },
          y: {
            min: 0,
            max: 100,
            border: { display: false },
            grid: { color: "#f1f5f9" },
            ticks: {
              stepSize: 25,
              font: { size: 10.5, family: "'Inter', sans-serif" },
              color: "#64748b",
              callback: (val) => `${val}%`,
            },
          },
        },
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, [selectedTopic, mobileDrawerOpen]);

  // Overall Statistics
  const weakTopicsCount = topics.filter((t) => t.level === "lemah").length;
  const avgMastery = Math.round(
    topics.reduce((acc, t) => acc + t.masteryScore, 0) / topics.length
  );
  const totalErrorStructures = topics.reduce(
    (acc, t) => acc + t.errorStructures.length,
    0
  );

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

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="text-[21px] font-medium text-[#1e293b] leading-tight">
            Peta Kelemahan
          </h1>
          <p className="text-[12.5px] text-[#64748b] mt-0.5">
            Analisis diagnostik topik dan struktur anatomi yang memerlukan repetisi adaptif
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href={`/latihan?topic=${lowestScoreTopic.id}`}
            className="h-[34px] px-3.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[13px] font-medium rounded-[6px] flex items-center gap-1.5 shadow-sm transition"
          >
            <i className="bi bi-play-fill text-[16px]"></i>
            <span>Latih Topik Terlemah ({lowestScoreTopic.masteryScore}%)</span>
          </Link>
        </div>
      </div>

      {/* ROW 1: 4 STATCARDS RINGKASAN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
          {/* Card 1: Topik Lemah */}
          <div className="metis-card p-[18px] flex items-center gap-4">
            <div className="w-[44px] h-[44px] rounded-[8px] bg-[#fff5f5] border border-[#fed7d7] flex items-center justify-center text-[#dc2626] flex-shrink-0 text-[18px]">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">
                TOPIK PERLU DIULANG
              </div>
              <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">
                {weakTopicsCount} Topik
              </div>
              <div className="text-[11.5px] mt-0.5 text-[#dc2626] font-semibold">
                Skor di bawah 50%
              </div>
            </div>
          </div>

          {/* Card 2: Rata-rata Penguasaan */}
          <div className="metis-card p-[18px] flex items-center gap-4">
            <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#198754] flex-shrink-0 text-[18px]">
              <i className="bi bi-graph-up"></i>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">
                RATA-RATA PENGUASAAN
              </div>
              <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">
                {avgMastery}%
              </div>
              <div className="text-[11.5px] mt-0.5 text-[#198754] font-semibold">
                ↑ +6.2% dari bulan lalu
              </div>
            </div>
          </div>

          {/* Card 3: Paling Membaik */}
          <div className="metis-card p-[18px] flex items-center gap-4">
            <div className="w-[44px] h-[44px] rounded-[8px] bg-[#fff8e1] border border-[#ffe082] flex items-center justify-center text-[#cc7a00] flex-shrink-0 text-[18px]">
              <i className="bi bi-trophy"></i>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">
                PALING MEMBAIK
              </div>
              <div className="text-[18px] font-bold text-[#0f172a] leading-snug mt-0.5 truncate max-w-[170px]">
                Rotator Cuff
              </div>
              <div className="text-[11.5px] mt-0.5 text-[#cc7a00] font-semibold">
                +20% dalam 6 minggu
              </div>
            </div>
          </div>

          {/* Card 4: Struktur Sering Salah */}
          <div className="metis-card p-[18px] flex items-center gap-4">
            <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#087990] flex-shrink-0 text-[18px]">
              <i className="bi bi-bullseye"></i>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">
                STRUKTUR SERING SALAH
              </div>
              <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">
                {totalErrorStructures} Struktur
              </div>
              <div className="text-[11.5px] mt-0.5 text-[#64748b]">
                Dari 10 topik aktif
              </div>
            </div>
          </div>
        </div>

      {/* ROW 2: DUA KOLOM (HEATMAP GRID & PANEL DETAIL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* KOLOM KIRI: HEATMAP PETA PENGUASAAN (7 Kolom di Laptop) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="metis-card flex-1 flex flex-col">
            <div className="metis-card-header">
              <div>
                <h2 className="metis-card-title flex items-center gap-2">
                  <i className="bi bi-grid-3x3-gap text-[#0d6efd]"></i>
                  <span>Peta Penguasaan Anatomi</span>
                </h2>
                <p className="text-[12px] text-[#64748b] mt-0.5">
                  Klik kartu topik untuk melihat tren performa dan struktur yang sering keliru
                </p>
              </div>
              <span className="badge-shipped">{filteredTopics.length} Topik Ditampilkan</span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              {filteredTopics.length === 0 ? (
                <EmptyState
                  icon={<i className="bi bi-funnel"></i>}
                  title="Tidak Ada Topik yang Cocok"
                  description="Coba ubah kata kunci pencarian atau reset filter di bawah."
                  action={
                    <button
                      onClick={handleResetFilters}
                      className="h-[32px] px-3 bg-[#0d6efd] text-white text-[12px] font-semibold rounded-[5px]"
                    >
                      Atur Ulang Filter
                    </button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredTopics.map((topic) => {
                    const isSelected = topic.id === selectedTopic.id;
                    const isWeakest = topic.id === lowestScoreTopic.id;

                    // Level styles
                    let badgeClass = "badge-completed";
                    let levelLabel = "Kuat";
                    let cardBorder = "border-[#e2e8f0]";
                    let cardBg = "bg-white hover:border-[#cbd5e1]";

                    if (topic.level === "lemah") {
                      badgeClass =
                        "bg-[#dc2626] text-white text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px]";
                      levelLabel = "Perlu Diulang";
                      cardBorder = "border-[#fca5a5]";
                      cardBg = "bg-[#fff5f5]/70 hover:bg-[#fff5f5]";
                    } else if (topic.level === "sedang") {
                      badgeClass = "badge-pending";
                      levelLabel = "Berkembang";
                      cardBorder = "border-[#fde68a]";
                      cardBg = "bg-[#fffbeb]/60 hover:bg-[#fffbeb]";
                    }

                    if (isSelected) {
                      cardBorder = "border-[#0d6efd] ring-2 ring-[#0d6efd]/30 shadow-sm";
                    }

                    return (
                      <div
                        key={topic.id}
                        onClick={() => handleSelectTopic(topic.id)}
                        className={`p-3.5 border rounded-[8px] transition cursor-pointer flex flex-col justify-between ${cardBorder} ${cardBg}`}
                        title={`${topic.nameIndo} (${topic.masteryScore}%) · Terakhir dilatih: ${topic.lastPracticedDate}`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1.5 mb-1.5">
                            <span className="text-[10px] uppercase font-bold text-[#64748b] tracking-wider truncate">
                              {topic.regio}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              {isWeakest && (
                                <span className="text-[10px] font-bold bg-[#dc2626] text-white px-1.5 py-0.2 rounded-[3px] animate-pulse">
                                  Paling Kritis
                                </span>
                              )}
                              <span className={badgeClass}>{levelLabel}</span>
                            </div>
                          </div>

                          <h3 className="text-[13.5px] font-bold text-[#1e293b] leading-snug line-clamp-1">
                            {topic.nameIndo}
                          </h3>
                          <p className="text-[11px] italic text-[#64748b] truncate mt-0.5">
                            {topic.nameLatin}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-[11.5px]">
                          <div className="flex items-center gap-2 flex-1 mr-2">
                            <ProgressBar
                              value={topic.masteryScore}
                              color={
                                topic.level === "lemah"
                                  ? "red"
                                  : topic.level === "sedang"
                                  ? "yellow"
                                  : "green"
                              }
                              size="sm"
                            />
                          </div>
                          <span className="font-bold text-[#0f172a] text-[13px] shrink-0">
                            {topic.masteryScore}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Legenda & Penjelasan Cara Membaca */}
              <div className="mt-5 pt-4 border-t border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[12px]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-[#dc2626]"></span>
                    <span className="text-[#475569]">&lt; 50% (Perlu Diulang)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-[#cc7a00]"></span>
                    <span className="text-[#475569]">50-74% (Berkembang)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-[2px] bg-[#198754]"></span>
                    <span className="text-[#475569]">≥ 75% (Dikuasai)</span>
                  </div>
                </div>

                <span className="text-[11.5px] text-[#64748b] italic">
                  💡 Peta kelemahan membantu memfokuskan repetisi pada topik dengan retensi paling rentan.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: PANEL DETAIL TOPIK TERPILIH (Desktop) */}
        <div className="lg:col-span-5 hidden lg:flex flex-col">
          <TopicDetailContent selectedTopic={selectedTopic} trendChartRef={trendChartRef} />
        </div>
      </div>

      {/* MOBILE DRAWER: PANEL DETAIL TOPIK (Hanya di layar ponsel saat topik diklik) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative z-50 bg-white rounded-t-[14px] shadow-2xl max-h-[85vh] overflow-y-auto p-4 border-t border-[#e2e8f0] animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-3">
              <span className="text-[12px] font-bold text-[#64748b] uppercase">Detail Materi Anatomi</span>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded text-[#64748b] hover:text-[#0f172a] text-[16px]"
              >
                ✕
              </button>
            </div>
            <TopicDetailContent selectedTopic={selectedTopic} trendChartRef={trendChartRef} />
          </div>
        </div>
      )}

      {/* ROW 3: TABEL SEMUA TOPIK + FILTER DAN PENGURUTAN */}
      <div className="metis-card mb-5">
        <div className="metis-card-header flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="metis-card-title">Daftar Analisis Seluruh Topik</h2>
            <p className="text-[12px] text-[#64748b] mt-0.5">
              Gunakan filter dan pengurutan untuk menganalisis beban belajar spesifik
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-[260px] relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik anatomi..."
              className="w-full h-[32px] bg-[#f8f9fa] border border-[#cbd5e1] rounded-[6px] pl-3 pr-8 text-[12.5px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] text-[12px]"
              >
                ✕
              </button>
            ) : (
              <i className="bi bi-search absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] text-[12px]"></i>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-5 py-3 bg-[#f8f9fa] border-b border-[#eef2f6] flex flex-wrap items-center justify-between gap-3 text-[12.5px]">
          {/* Left: Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#475569]">Regio:</span>
            <select
              value={selectedRegio}
              onChange={(e) => setSelectedRegio(e.target.value)}
              className="h-[30px] px-2.5 bg-white border border-[#cbd5e1] rounded-[5px] text-[12px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
            >
              {regioOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <span className="font-semibold text-[#475569] ml-2">Level:</span>
            <div className="btn-group-period">
              {(["Semua", "lemah", "sedang", "kuat"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`btn-period ${selectedLevel === lvl ? "active" : ""}`}
                >
                  {lvl === "Semua"
                    ? "Semua"
                    : lvl === "lemah"
                    ? "Perlu Diulang"
                    : lvl === "sedang"
                    ? "Berkembang"
                    : "Dikuasai"}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Sort By */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#475569]">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "skor-terendah" | "terakhir-dilatih" | "sering-salah"
                )
              }
              className="h-[30px] px-2.5 bg-white border border-[#cbd5e1] rounded-[5px] text-[12px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
            >
              <option value="skor-terendah">Skor Terendah (Prioritas)</option>
              <option value="terakhir-dilatih">Terakhir Dilatih</option>
              <option value="sering-salah">Jumlah Sering Salah</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-0 overflow-x-auto">
          {filteredTopics.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[13px] text-[#64748b]">
                Tidak ada topik yang sesuai dengan kombinasi filter saat ini.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 text-[#0d6efd] font-semibold text-[12.5px] hover:underline"
              >
                Atur Ulang Filter
              </button>
            </div>
          ) : (
            <table className="w-full orders-table border-collapse">
              <thead>
                <tr>
                  <th className="w-[30%]">TOPIK ANATOMI</th>
                  <th className="w-[18%]">REGIO</th>
                  <th className="w-[22%]">PENGUASAAN</th>
                  <th className="w-[12%]">STATUS</th>
                  <th className="w-[10%]">SERING SALAH</th>
                  <th className="w-[8%] text-right">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {filteredTopics.map((topic) => {
                  const isSelected = topic.id === selectedTopic.id;

                  let badgeClass = "badge-completed";
                  let statusText = "Dikuasai";
                  let barColor: "red" | "yellow" | "green" = "green";

                  if (topic.level === "lemah") {
                    badgeClass =
                      "bg-[#dc2626] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[4px]";
                    statusText = "Perlu Diulang";
                    barColor = "red";
                  } else if (topic.level === "sedang") {
                    badgeClass = "badge-pending";
                    statusText = "Berkembang";
                    barColor = "yellow";
                  }

                  return (
                    <tr
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic.id)}
                      className={`cursor-pointer transition hover:bg-[#f8fafc] ${
                        isSelected ? "bg-[#f1f5f9]" : ""
                      }`}
                    >
                      <td>
                        <div className="font-semibold text-[#0f172a]">
                          {topic.nameIndo}
                        </div>
                        <div className="text-[11.5px] italic text-[#64748b]">
                          {topic.nameLatin}
                        </div>
                      </td>
                      <td className="text-[#475569]">{topic.regio}</td>
                      <td>
                        <div className="flex items-center gap-2 max-w-[180px]">
                          <ProgressBar
                            value={topic.masteryScore}
                            color={barColor}
                            size="sm"
                          />
                          <span className="text-[12px] font-bold text-[#1e293b] min-w-[34px]">
                            {topic.masteryScore}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={badgeClass}>{statusText}</span>
                      </td>
                      <td className="text-[#dc2626] font-semibold">
                        {topic.frequentErrorCount} item
                      </td>
                      <td className="text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTopic(topic.id);
                          }}
                          className="h-[28px] px-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1e293b] text-[11.5px] font-semibold rounded-[4px] transition"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

// Subcomponent: Panel Detail Topik Terpilih
interface TopicDetailContentProps {
  selectedTopic: DetailedAnatomyTopic;
  trendChartRef: React.RefObject<HTMLCanvasElement | null>;
}

function TopicDetailContent({ selectedTopic, trendChartRef }: TopicDetailContentProps) {
  let badgeClass = "badge-completed";
  let statusText = "Dikuasai (Solid)";
  let barColor: "red" | "yellow" | "green" = "green";

  if (selectedTopic.level === "lemah") {
    badgeClass =
      "bg-[#dc2626] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[4px]";
    statusText = "Perlu Diulang";
    barColor = "red";
  } else if (selectedTopic.level === "sedang") {
    badgeClass = "badge-pending";
    statusText = "Berkembang";
    barColor = "yellow";
  }

  return (
    <div className="metis-card flex-1 flex flex-col justify-between">
      <div className="metis-card-header">
        <div>
          <h2 className="metis-card-title">Detail Penguasaan Materi</h2>
          <p className="text-[12px] text-[#64748b] mt-0.5">{selectedTopic.regio}</p>
        </div>
        <span className={badgeClass}>{statusText}</span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Top: Score & Big Progress */}
        <div>
          <h3 className="text-[16px] font-bold text-[#1e293b]">
            {selectedTopic.nameIndo}
          </h3>
          <p className="text-[12px] italic text-[#64748b] mt-0.5">
            {selectedTopic.nameLatin}
          </p>

          <div className="mt-3 p-3 bg-[#f8f9fa] border border-[#eef2f6] rounded-[6px]">
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-[12px] text-[#64748b] font-medium">Skor Retensi Spaced Repetition</span>
              <span className="text-[20px] font-bold text-[#0f172a]">
                {selectedTopic.masteryScore}%
              </span>
            </div>
            <ProgressBar
              value={selectedTopic.masteryScore}
              color={barColor}
              size="md"
            />
            <div className="flex justify-between text-[11px] text-[#64748b] mt-2">
              <span>Total: {selectedTopic.totalItems} struktur</span>
              <span>Terakhir dilatih: {selectedTopic.lastPracticedDate}</span>
            </div>
          </div>
        </div>

        {/* 6-Week Trend Chart */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[12.5px] font-semibold text-[#1e293b]">
              Tren Retensi 6 Minggu
            </span>
            <span className="text-[11px] text-[#0d6efd] font-semibold">
              Titik akhir: {selectedTopic.masteryScore}%
            </span>
          </div>
          <div className="w-full h-[130px] relative border border-[#eef2f6] rounded-[6px] p-2 bg-white">
            <canvas ref={trendChartRef}></canvas>
          </div>
        </div>

        {/* Daftar Struktur yang Sering Salah */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[12.5px] font-semibold text-[#1e293b]">
              Struktur Sering Salah ({selectedTopic.errorStructures.length})
            </span>
            <span className="text-[11px] text-[#dc2626] font-semibold">
              Prioritas Review
            </span>
          </div>

          <div className="border border-[#e2e8f0] rounded-[6px] divide-y divide-[#e2e8f0] bg-white max-h-[160px] overflow-y-auto scrollbar-thin">
            {selectedTopic.errorStructures.map((item) => (
              <div key={item.id} className="p-2.5 text-[12px]">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-semibold text-[#1e293b] block truncate">
                      {item.nameIndo}
                    </span>
                    <span className="text-[11px] italic text-[#64748b] block truncate">
                      {item.nameLatin}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[#dc2626] font-bold block text-[11.5px]">
                      {item.errorCount}x salah
                    </span>
                    <span className="text-[10px] text-[#64748b] block">
                      {item.lastErrorDate}
                    </span>
                  </div>
                </div>
                {item.clinicalNote && (
                  <p className="mt-1 text-[11px] text-[#475569] bg-[#f8f9fa] p-1.5 rounded-[4px] leading-relaxed">
                    💡 {item.clinicalNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rekomendasi Adaptif */}
        <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-[6px] text-[#166534] text-[12px]">
          <strong className="block text-[#14532d] mb-0.5 font-semibold">
            Rekomendasi Spaced Repetition:
          </strong>
          <p className="leading-relaxed">{selectedTopic.recommendation}</p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#f1f5f9] grid grid-cols-2 gap-2">
          <Link
            href={`/latihan?topic=${selectedTopic.id}`}
            className="h-[34px] bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12.5px] font-semibold rounded-[6px] flex items-center justify-center gap-1.5 shadow-2xs transition"
          >
            <i className="bi bi-play-fill text-[15px]"></i>
            <span>Latih di 3D ({selectedTopic.regio})</span>
          </Link>

          <Link
            href="/perencana"
            className="h-[34px] bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#334155] text-[12.5px] font-semibold rounded-[6px] flex items-center justify-center gap-1.5 transition"
          >
            <i className="bi bi-calendar-plus text-[13px]"></i>
            <span>Tambah ke Rencana</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
