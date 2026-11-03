"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ChartJS from "chart.js/auto";
import { AppShell } from "@/components/layout/AppShell";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  mockUserProfile,
  mockDashboardStats,
  mockWeeklyProgress,
  mockAnatomyWeaknesses,
  mockRecommendations,
  mockDailyChecklist,
  DailyChecklistItem,
} from "@/lib/mock-data";

export default function BerandaPage() {
  const [checklist, setChecklist] = useState<DailyChecklistItem[]>(mockDailyChecklist);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const weeklyChartRef = useRef<HTMLCanvasElement | null>(null);
  const distributionChartRef = useRef<HTMLCanvasElement | null>(null);

  // Toggle checklist
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const completedCount = checklist.filter((i) => i.completed).length;
  const totalCount = checklist.length;
  const checklistPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Chart 1: Progres Latihan Mingguan (Bar Chart)
  useEffect(() => {
    if (!weeklyChartRef.current) return;
    const ctx = weeklyChartRef.current.getContext("2d");
    if (!ctx) return;

    const chartInstance = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: mockWeeklyProgress.map((p) => p.day),
        datasets: [
          {
            label: "Item Dilatih",
            data: mockWeeklyProgress.map((p) => p.itemsReviewed),
            backgroundColor: "#3b76e1",
            borderRadius: {
              topLeft: 4,
              topRight: 4,
              bottomLeft: 0,
              bottomRight: 0,
            },
            borderSkipped: false,
            barPercentage: 0.55,
            categoryPercentage: 0.8,
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
            titleFont: { size: 12, family: "'Inter', sans-serif" },
            bodyFont: { size: 12, family: "'Inter', sans-serif" },
            padding: 8,
            cornerRadius: 4,
            callbacks: {
              label: (context) => ` ${context.parsed.y} item dilatih (Target: 20)`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: "#e2e8f0" },
            ticks: {
              font: { size: 11.5, family: "'Inter', sans-serif" },
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
              font: { size: 11.5, family: "'Inter', sans-serif" },
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
  }, []);

  // Chart 2: Distribusi Retensi Materi (Doughnut Chart)
  useEffect(() => {
    if (!distributionChartRef.current) return;
    const ctx = distributionChartRef.current.getContext("2d");
    if (!ctx) return;

    const chartInstance = new ChartJS(ctx, {
      type: "doughnut",
      data: {
        labels: ["Dikuasai (>80%)", "Cukup Baik (70-80%)", "Perlu Latihan (50-70%)", "Kritis (<50%)"],
        datasets: [
          {
            data: [42, 28, 18, 12],
            backgroundColor: ["#198754", "#087990", "#cc7a00", "#dc2626"],
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1e293b",
            titleFont: { size: 12, family: "'Inter', sans-serif" },
            bodyFont: { size: 12, family: "'Inter', sans-serif" },
            padding: 8,
            cornerRadius: 4,
            callbacks: {
              label: (context) => ` ${context.label}: ${context.parsed}%`,
            },
          },
        },
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, []);

  return (
    <AppShell>
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
          <h1 className="text-[21px] font-medium text-[#1e293b] leading-tight">Beranda</h1>
          <p className="text-[12.5px] text-[#64748b] mt-0.5">
            Selamat datang kembali, <span className="font-semibold text-[#1e293b]">{mockUserProfile.name}</span> · Ada{" "}
            <strong className="text-[#0d6efd] font-semibold">{mockDashboardStats.dueTodayCount} item</strong> yang perlu diulang hari ini
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast("Memulai sesi latihan adaptif 10 menit...")}
            className="h-[34px] px-3.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[13px] font-medium rounded-[6px] flex items-center gap-1.5 shadow-sm transition"
          >
            <i className="bi bi-play-fill text-[16px]"></i>
            <span>Mulai Sesi Adaptif (10 Mnt)</span>
          </button>
          <Link
            href="/latihan"
            className="h-[34px] px-3 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#475569] text-[13px] font-medium rounded-[6px] flex items-center gap-1.5 transition"
            title="Buka Modul 3D"
          >
            <i className="bi bi-box-seam text-[13.5px]"></i>
            <span className="hidden sm:inline">Modul 3D</span>
          </Link>
        </div>
      </div>

      {/* ROW 1: 4 KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
        {/* Card 1: ITEM JATUH TEMPO HARI INI */}
        <div className="metis-card p-[18px] flex items-center gap-4">
          <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#dc2626] flex-shrink-0 text-[18px]">
            <i className="bi bi-bell"></i>
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">JATUH TEMPO HARI INI</div>
            <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">
              {mockDashboardStats.dueTodayCount} Item
            </div>
            <div className="text-[11.5px] mt-0.5 flex items-center gap-1">
              <span className="text-[#dc2626] font-semibold">4 item kritis</span>
              <span className="text-[#64748b]">· perlu repetisi</span>
            </div>
          </div>
        </div>

        {/* Card 2: RATA-RATA PENGUASAAN */}
        <div className="metis-card p-[18px] flex items-center gap-4">
          <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#198754] flex-shrink-0 text-[18px]">
            <i className="bi bi-graph-up"></i>
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">RATA-RATA PENGUASAAN</div>
            <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">
              {mockDashboardStats.masteryPercentage}%
            </div>
            <div className="text-[11.5px] mt-0.5 flex items-center gap-1">
              <span className="text-[#64748b]">↑</span>
              <span className="text-[#198754] font-semibold">+4.5%</span>
              <span className="text-[#64748b]">dari minggu lalu</span>
            </div>
          </div>
        </div>

        {/* Card 3: HARI BERUNTUN BELAJAR */}
        <div className="metis-card p-[18px] flex items-center gap-4">
          <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#cc7a00] flex-shrink-0 text-[18px]">
            <i className="bi bi-fire"></i>
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">HARI BERUNTUN</div>
            <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">
              {mockDashboardStats.streakDays} Hari
            </div>
            <div className="text-[11.5px] mt-0.5 flex items-center gap-1">
              <span className="text-[#198754] font-semibold">Konsisten</span>
              <span className="text-[#64748b]">· Rekor 8 hari</span>
            </div>
          </div>
        </div>

        {/* Card 4: HITUNG MUNDUR UJIAN */}
        <div className="metis-card p-[18px] flex items-center gap-4">
          <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#087990] flex-shrink-0 text-[18px]">
            <i className="bi bi-clock"></i>
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">HITUNG MUNDUR UJIAN</div>
            <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">
              {mockDashboardStats.daysUntilExam} Hari
            </div>
            <div className="text-[11.5px] mt-0.5 flex items-center gap-1">
              <span className="text-[#087990] font-semibold">20 Nov 2026</span>
              <span className="text-[#64748b]">· Blok Muskuloskeletal</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: PROGRES MINGGUAN & DISTRIBUSI STATUS RETENSI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Progres Latihan Mingguan (8 cols) */}
        <div className="metis-card lg:col-span-8 flex flex-col">
          <div className="metis-card-header">
            <div>
              <h2 className="metis-card-title">Progres Latihan Mingguan</h2>
              <p className="text-[12px] text-[#64748b] mt-0.5">
                Jumlah item anatomi yang dilatih 7 hari terakhir (Target: 20 item/hari)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-completed">Target Tercapai 5/7 Hari</span>
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="w-full h-[260px] relative">
              <canvas ref={weeklyChartRef}></canvas>
            </div>
            <div className="mt-3 pt-3 border-t border-[#f1f5f9] grid grid-cols-3 gap-2 text-center text-[12px]">
              <div>
                <span className="text-[#64748b] text-[11px] block">Total Item Dilatih</span>
                <strong className="text-[#0f172a] text-[15px] font-bold">142 Item</strong>
              </div>
              <div>
                <span className="text-[#64748b] text-[11px] block">Rata-rata Harian</span>
                <strong className="text-[#0d6efd] text-[15px] font-bold">20.2 / hari</strong>
              </div>
              <div>
                <span className="text-[#64748b] text-[11px] block">Akurasi Rerata</span>
                <strong className="text-[#198754] text-[15px] font-bold">86% Benar</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Distribusi Penguasaan Materi (4 cols) */}
        <div className="metis-card lg:col-span-4 flex flex-col">
          <div className="metis-card-header">
            <h2 className="metis-card-title">Distribusi Penguasaan Materi</h2>
          </div>
          <div className="p-5 flex-1 flex flex-col items-center justify-center">
            <div className="w-[190px] h-[190px] relative">
              <canvas ref={distributionChartRef}></canvas>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] text-[#64748b]">Rata-rata</span>
                <span className="text-[20px] font-bold text-[#0f172a] leading-tight">68%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full grid grid-cols-2 gap-2 mt-4 text-[11.5px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#198754]"></span>
                <span className="text-[#475569]">Dikuasai (42%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#087990]"></span>
                <span className="text-[#475569]">Cukup Baik (28%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#cc7a00]"></span>
                <span className="text-[#475569]">Perlu Latihan (18%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]"></span>
                <span className="text-[#475569]">Kritis (12%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: PETA KELEMAHAN PER TOPIK ANATOMI (TABLE FORMAT MATCHING TEMPLATE) */}
      <div className="metis-card mb-5">
        <div className="metis-card-header">
          <div>
            <h2 className="metis-card-title">Peta Kelemahan Topik Anatomi</h2>
            <p className="text-[12px] text-[#64748b] mt-0.5">
              Regio Extremitas Superior · Diurutkan dari topik yang paling membutuhkan repetisi
            </p>
          </div>
          <Link href="/kelemahan" className="text-[12.5px] font-semibold text-[#0d6efd] hover:underline">
            Lihat Analisis Detail →
          </Link>
        </div>

        <div className="p-0 overflow-x-auto">
          <table className="w-full orders-table border-collapse">
            <thead>
              <tr>
                <th className="w-[30%]">TOPIK ANATOMI</th>
                <th className="w-[20%]">SISTEM</th>
                <th className="w-[25%]">PENGUASAAN</th>
                <th className="w-[15%]">STATUS</th>
                <th className="w-[10%] text-right">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {mockAnatomyWeaknesses.map((topic, idx) => {
                let badgeClass = "badge-completed";
                let statusText = "Dikuasai";
                let progressColor: "red" | "yellow" | "teal" | "green" = "green";

                if (topic.urgencyLevel === "kritis") {
                  badgeClass = "bg-[#dc2626] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[4px]";
                  statusText = "Kritis (Prioritas)";
                  progressColor = "red";
                } else if (topic.urgencyLevel === "sedang") {
                  badgeClass = "badge-pending";
                  statusText = "Perlu Latihan";
                  progressColor = "yellow";
                } else if (topic.urgencyLevel === "baik") {
                  badgeClass = "badge-shipped";
                  statusText = "Cukup Baik";
                  progressColor = "teal";
                }

                return (
                  <tr key={topic.id} className={idx === 0 ? "bg-[#fff5f5]/50" : ""}>
                    <td>
                      <div className="font-semibold text-[#0f172a] flex items-center gap-1.5">
                        {topic.topicNameIndo}
                        {idx === 0 && (
                          <span className="text-[10px] font-bold bg-[#dc2626] text-white px-1.5 py-0.2 rounded-[3px]">
                            Terlemah
                          </span>
                        )}
                      </div>
                      <div className="text-[11.5px] italic text-[#64748b]">{topic.topicNameLatin}</div>
                    </td>
                    <td className="text-[#475569]">{topic.system}</td>
                    <td>
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <ProgressBar value={topic.masteryScore} color={progressColor} size="sm" />
                        <span className="text-[12px] font-bold text-[#1e293b] min-w-[32px]">
                          {topic.masteryScore}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={badgeClass}>{statusText}</span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => showToast(`Menyiapkan sesi latihan topik: ${topic.topicNameIndo}`)}
                        className="h-[28px] px-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1e293b] text-[11.5px] font-semibold rounded-[4px] transition"
                      >
                        Latih
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROW 4: REKOMENDASI LATIHAN HARI INI */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1e293b]">Rekomendasi Latihan Hari Ini</h2>
            <p className="text-[12px] text-[#64748b]">
              Topik pilihan algoritma Spaced Repetition untuk efisiensi belajar optimal
            </p>
          </div>
          <span className="badge-shipped">3 Sesi Direkomendasikan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {mockRecommendations.map((rec) => {
            let badgeClass = "badge-completed";
            if (rec.priority === "tinggi") badgeClass = "bg-[#dc2626] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[4px]";
            if (rec.priority === "sedang") badgeClass = "badge-pending";

            return (
              <div key={rec.id} className="metis-card p-5 flex flex-col justify-between hover:shadow-sm transition">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#64748b]">
                      {rec.category}
                    </span>
                    <span className={badgeClass}>
                      {rec.priority === "tinggi" ? "Prioritas Utama" : rec.priority === "sedang" ? "Jatuh Tempo" : "Penyegaran"}
                    </span>
                  </div>

                  <h3 className="text-[14px] font-bold text-[#1e293b] leading-snug">
                    {rec.title}
                  </h3>
                  <p className="text-[11.5px] italic text-[#64748b] mt-0.5">
                    {rec.latinName}
                  </p>

                  <div className="mt-3 p-3 bg-[#f8f9fa] border border-[#eef2f6] rounded-[6px] text-[12px] text-[#475569]">
                    <strong className="block text-[#1e293b] mb-0.5 font-semibold">Alasan Rekomendasi:</strong>
                    <span>{rec.reason}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
                  <div className="text-[11.5px] text-[#64748b]">
                    <span><strong className="text-[#0f172a]">{rec.dueCount}</strong> item</span> · ~{rec.estimatedMinutes} menit
                  </div>
                  <button
                    onClick={() => showToast(`Memulai modul: ${rec.title}`)}
                    className="h-[30px] px-3 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12px] font-semibold rounded-[5px] flex items-center gap-1 shadow-2xs transition"
                  >
                    <span>Mulai</span>
                    <i className="bi bi-chevron-right text-[11px]"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROW 5: CHECKLIST TARGET HARIAN */}
      <div className="metis-card mb-5">
        <div className="metis-card-header">
          <div>
            <h2 className="metis-card-title">Target Belajar Hari Ini</h2>
            <p className="text-[12px] text-[#64748b] mt-0.5">
              Centang target yang telah diselesaikan untuk memperbarui progres harian
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={checklistPercent === 100 ? "badge-completed" : "badge-shipped"}>
              {completedCount} dari {totalCount} Selesai ({checklistPercent}%)
            </span>
            <button
              onClick={() => {
                setChecklist(mockDailyChecklist);
                showToast("Target harian berhasil direset");
              }}
              className="text-[12px] text-[#64748b] hover:text-[#0f172a] p-1 flex items-center gap-1"
              title="Reset checklist"
            >
              <i className="bi bi-arrow-clockwise"></i>
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="p-5">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center text-[12px] text-[#475569] mb-1.5 font-medium">
              <span>Pencapaian Target Harian</span>
              <span className="font-bold text-[#0f172a]">{checklistPercent}%</span>
            </div>
            <ProgressBar
              value={checklistPercent}
              color={checklistPercent === 100 ? "green" : "blue"}
              size="md"
            />
          </div>

          {/* 100% Notice */}
          {checklistPercent === 100 && (
            <div className="mb-4 p-3 bg-[#e8f5e9] border border-[#c8e6c9] rounded-[6px] text-[#1b5e20] text-[12.5px] flex items-center gap-2 font-medium">
              <i className="bi bi-check-circle-fill text-[16px]"></i>
              <span>Luar biasa, seluruh target hari ini tuntas 100%! Retensi materi ujian semakin solid.</span>
            </div>
          )}

          {/* Checklist Items */}
          <div className="border border-[#e2e8f0] rounded-[6px] divide-y divide-[#e2e8f0] bg-white">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleChecklist(item.id)}
                className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition hover:bg-[#f8f9fa] ${
                  item.completed ? "bg-[#f8fafc]" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleChecklist(item.id)}
                    className="w-4 h-4 text-[#0d6efd] rounded border-[#cbd5e1] focus:ring-[#0d6efd] cursor-pointer"
                  />
                  <div className="min-w-0">
                    <span
                      className={`text-[13px] ${
                        item.completed ? "line-through text-[#94a3b8]" : "font-medium text-[#1e293b]"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.latinTerm && (
                      <span className="block text-[11px] italic text-[#64748b]">
                        {item.latinTerm}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-[4px] bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]">
                    {item.tag}
                  </span>
                  <span className="text-[11.5px] font-semibold text-[#64748b]">
                    {item.itemCount} item
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
