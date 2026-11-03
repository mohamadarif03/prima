"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ui/StatCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  AlertCircle,
  TrendingUp,
  Flame,
  CalendarClock,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  BarChart3,
  Layers,
  Award,
  Info,
  Check,
} from "lucide-react";
import {
  mockUserProfile,
  mockDashboardStats,
  mockWeeklyProgress,
  mockAnatomyWeaknesses,
  mockRecommendations,
  mockDailyChecklist,
  DailyChecklistItem,
} from "@/lib/mock-data";

export default function DashboardPage() {
  // Local state for interactive daily checklist
  const [checklist, setChecklist] = useState<DailyChecklistItem[]>(mockDailyChecklist);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Demo controls for evaluator to inspect states
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [isEmptyState, setIsEmptyState] = useState(false);

  // Toggle checklist item
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Trigger feedback toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Calculate checklist progress
  const completedCount = checklist.filter((i) => i.completed).length;
  const totalCount = checklist.length;
  const checklistPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Max value for weekly chart
  const maxWeekly = Math.max(...mockWeeklyProgress.map((p) => p.itemsReviewed), 35);
  const totalWeeklyItems = mockWeeklyProgress.reduce((acc, curr) => acc + curr.itemsReviewed, 0);

  return (
    <AppShell>
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-xs sm:text-sm font-medium text-white shadow-xl dark:bg-teal-900 dark:text-teal-100 transition-all animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="h-4 w-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        {/* DEMO TOOLBAR: State switcher for judges / testing */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-100/80 px-4 py-2.5 text-xs text-slate-600 dark:bg-slate-900/60 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-1.5 font-medium">
            <Info className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span>Mode Uji Tampilan Juri:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLoadingState(!isLoadingState)}
              className={`px-2.5 py-1 rounded-lg border font-medium transition ${
                isLoadingState
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              }`}
            >
              {isLoadingState ? "Matikan Skeleton" : "Simulasi Loading"}
            </button>
            <button
              onClick={() => setIsEmptyState(!isEmptyState)}
              className={`px-2.5 py-1 rounded-lg border font-medium transition ${
                isEmptyState
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              }`}
            >
              {isEmptyState ? "Kembalikan Data" : "Simulasi State Kosong"}
            </button>
          </div>
        </div>

        {/* 1. SAPAAN SINGKAT & RINGKASAN HARI INI */}
        {isLoadingState ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-96 mb-4" />
            <Skeleton className="h-10 w-44 rounded-xl" />
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-teal-200/60 bg-gradient-to-br from-white via-teal-50/30 to-teal-100/20 p-5 sm:p-7 shadow-xs dark:border-teal-900/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-teal-950/40">
            {/* Background Medical Accent Glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-500/10" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-100/80 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300 dark:border dark:border-teal-800/80">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Sesi Latihan Spaced Repetition</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Selamat Datang, {mockUserProfile.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Ada <strong className="text-teal-700 dark:text-teal-300 font-semibold">{mockDashboardStats.dueTodayCount} item yang perlu diulang hari ini</strong> untuk memperkuat retensi memori sebelum{" "}
                  <span className="font-medium text-slate-800 dark:text-slate-200">{mockUserProfile.targetExam}</span>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => showToast("Memulai sesi latihan adaptif 10 menit...")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-teal-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:scale-95 dark:focus:ring-offset-slate-900"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Mulai Sesi Adaptif (10 Menit)</span>
                </button>
                <Link
                  href="/latihan"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <BookOpen className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <span>Modul 3D</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2. EMPAT KARTU RINGKASAN (KPI STATS) */}
        {isLoadingState ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <Skeleton className="h-4 w-28 mb-3" />
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Item Jatuh Tempo Hari Ini */}
            <StatCard
              label="Jatuh Tempo Hari Ini"
              value={`${mockDashboardStats.dueTodayCount} Item`}
              trend="down"
              trendText="Prioritas tinggi"
              subText="perlu repetisi"
              icon={<AlertCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />}
              iconBgColor="bg-rose-50 dark:bg-rose-950/70"
              badgeText="Spaced Repetition"
            />

            {/* Card 2: Rata-rata Penguasaan */}
            <StatCard
              label="Rata-rata Penguasaan"
              value={`${mockDashboardStats.masteryPercentage}%`}
              trend="up"
              trendText="+4.5%"
              subText="dari minggu lalu"
              icon={<TrendingUp className="h-6 w-6 text-teal-600 dark:text-teal-400" />}
              iconBgColor="bg-teal-50 dark:bg-teal-950/70"
              badgeText="Retensi"
            />

            {/* Card 3: Hari Beruntun Belajar */}
            <StatCard
              label="Hari Beruntun"
              value={`${mockDashboardStats.streakDays} Hari`}
              trend="up"
              trendText="Aktif"
              subText="Rekor terbaik: 8 hari"
              icon={<Flame className="h-6 w-6 text-amber-500 fill-amber-500" />}
              iconBgColor="bg-amber-50 dark:bg-amber-950/70"
              badgeText="Streak"
            />

            {/* Card 4: Hitung Mundur Ujian */}
            <StatCard
              label="Hitung Mundur Ujian"
              value={`${mockDashboardStats.daysUntilExam} Hari`}
              trend="neutral"
              trendText="20 Nov 2026"
              subText={mockDashboardStats.examName}
              icon={<CalendarClock className="h-6 w-6 text-sky-600 dark:text-sky-400" />}
              iconBgColor="bg-sky-50 dark:bg-sky-950/70"
              badgeText="Ujian Blok"
            />
          </div>
        )}

        {/* 3 & 4. DUA KOLOM: PROGRES MINGGUAN & PETA KELEMAHAN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3. GRAFIK PROGRES MINGGUAN (7 Hari Terakhir) */}
          <div className="lg:col-span-5 flex flex-col">
            <SectionCard
              title="Progres Latihan Mingguan"
              subtitle="Jumlah item anatomi yang dilatih 7 hari terakhir"
              badge={
                <Badge variant="default" size="sm">
                  {totalWeeklyItems} Total Item
                </Badge>
              }
              action={
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  <span>Target: 20/hari</span>
                </div>
              }
              className="flex-1 flex flex-col"
            >
              {isEmptyState ? (
                <EmptyState
                  icon={<BarChart3 className="h-7 w-7" />}
                  title="Belum Ada Riwayat Latihan"
                  description="Mulai satu sesi latihan kuis untuk melihat grafik progres mingguan kamu."
                />
              ) : isLoadingState ? (
                <div className="space-y-4 py-4">
                  <Skeleton className="h-44 w-full rounded-xl" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ) : (
                <div className="flex flex-col justify-between h-full pt-2">
                  {/* Visual Bar Chart */}
                  <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                    {mockWeeklyProgress.map((item, idx) => {
                      const barHeightPercent = Math.round((item.itemsReviewed / maxWeekly) * 100);
                      const isTargetMet = item.itemsReviewed >= item.targetItems;

                      return (
                        <div
                          key={idx}
                          className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer"
                          title={`${item.day} (${item.date}): ${item.itemsReviewed} item dilatih (Target: ${item.targetItems})`}
                          onClick={() =>
                            showToast(`${item.day} (${item.date}): ${item.itemsReviewed} item berhasil diulang!`)
                          }
                        >
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1.5 text-[11px] font-bold text-teal-700 dark:text-teal-300">
                            {item.itemsReviewed}
                          </div>

                          {/* Bar Column */}
                          <div className="w-full max-w-[28px] bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end h-36">
                            <div
                              className={`w-full rounded-t-md transition-all duration-700 ease-out group-hover:brightness-110 ${
                                isTargetMet
                                  ? "bg-teal-600 dark:bg-teal-500"
                                  : "bg-teal-400/80 dark:bg-teal-600/80"
                              }`}
                              style={{ height: `${barHeightPercent}%` }}
                            />
                          </div>

                          {/* Day Label */}
                          <span className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition">
                            {item.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Metric Footer */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 text-[10.5px] block">Rata-rata</span>
                      <strong className="text-slate-800 dark:text-slate-100 text-sm font-bold">20.2</strong>
                      <span className="text-[10px] text-slate-500 block">item/hari</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 text-[10.5px] block">Target Tercapai</span>
                      <strong className="text-teal-600 dark:text-teal-400 text-sm font-bold">5 / 7</strong>
                      <span className="text-[10px] text-slate-500 block">hari</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 text-[10.5px] block">Akurasi Rerata</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">86%</strong>
                      <span className="text-[10px] text-slate-500 block">jawaban benar</span>
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          {/* 4. PETA KELEMAHAN PER TOPIK ANATOMI */}
          <div className="lg:col-span-7 flex flex-col">
            <SectionCard
              title="Peta Kelemahan Topik Anatomi"
              subtitle="Diurutkan dari topik terlemah (kritis) yang membutuhkan repetisi prioritas"
              badge={
                <Badge variant="warning" size="sm">
                  Regio Extremitas Superior
                </Badge>
              }
              action={
                <Link
                  href="/kelemahan"
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 flex items-center gap-1"
                >
                  <span>Detail Lengkap</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
              className="flex-1 flex flex-col"
            >
              {isEmptyState ? (
                <EmptyState
                  icon={<Layers className="h-7 w-7" />}
                  title="Peta Kelemahan Kosong"
                  description="Belum ada riwayat kuis untuk menghitung indeks kelemahan topik."
                />
              ) : isLoadingState ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-3 border rounded-xl space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3.5">
                  {mockAnatomyWeaknesses.map((topic, index) => {
                    const isSelected = selectedTopicId === topic.id;

                    // Urgency styling definition
                    let badgeVariant: "danger" | "warning" | "default" | "success" = "default";
                    let progressColor: "rose" | "amber" | "teal" | "emerald" = "teal";
                    let statusLabel = "Cukup Baik";

                    if (topic.urgencyLevel === "kritis") {
                      badgeVariant = "danger";
                      progressColor = "rose";
                      statusLabel = "Kritis (Prioritas Tinggi)";
                    } else if (topic.urgencyLevel === "sedang") {
                      badgeVariant = "warning";
                      progressColor = "amber";
                      statusLabel = "Perlu Latihan";
                    } else if (topic.urgencyLevel === "unggul") {
                      badgeVariant = "success";
                      progressColor = "emerald";
                      statusLabel = "Dikuasai";
                    }

                    return (
                      <div
                        key={topic.id}
                        onClick={() => setSelectedTopicId(isSelected ? null : topic.id)}
                        className={`group relative rounded-xl border p-3.5 sm:p-4 transition-all cursor-pointer ${
                          index === 0
                            ? "border-rose-300/80 bg-rose-50/20 dark:border-rose-900/60 dark:bg-rose-950/10"
                            : "border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
                        } ${isSelected ? "ring-2 ring-teal-500 shadow-xs" : ""}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                {topic.topicNameIndo}
                              </span>
                              {index === 0 && (
                                <span className="rounded-md bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 animate-pulse">
                                  Terlemah
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] italic text-slate-500 dark:text-slate-400 block truncate">
                              {topic.topicNameLatin}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                            <Badge variant={badgeVariant} size="sm">
                              {statusLabel}
                            </Badge>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[34px] text-right">
                              {topic.masteryScore}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar with mastery color */}
                        <ProgressBar
                          value={topic.masteryScore}
                          color={progressColor}
                          size="md"
                          animate
                        />

                        {/* Interactive footer details when expanded */}
                        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                          <span>
                            {topic.weakItemsCount} dari {topic.totalItems} struktur sering keliru
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast(`Menyiapkan kuis adaptif untuk: ${topic.topicNameIndo}`);
                            }}
                            className="text-xs font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-400 hover:underline"
                          >
                            Latih Topik Ini →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          </div>
        </div>

        {/* 5. REKOMENDASI LATIHAN HARI INI (3 KARTU TOPIK) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Rekomendasi Latihan Hari Ini
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Disusun cerdas oleh algoritma Spaced Repetition berdasarkan riwayat kesalahanmu
              </p>
            </div>
            <Badge variant="default" size="sm" icon={<Sparkles className="h-3 w-3 text-teal-600 dark:text-teal-400" />}>
              Adaptif
            </Badge>
          </div>

          {isEmptyState ? (
            <EmptyState
              icon={<Award className="h-7 w-7" />}
              title="Semua Rekomendasi Selesai!"
              description="Kamu telah menyelesaikan seluruh rekomendasi latihan adaptif hari ini. Istirahatlah sejenak."
            />
          ) : isLoadingState ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border p-5 space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {mockRecommendations.map((rec) => {
                let badgeVariant: "danger" | "warning" | "default" = "default";
                if (rec.priority === "tinggi") badgeVariant = "danger";
                if (rec.priority === "sedang") badgeVariant = "warning";

                return (
                  <div
                    key={rec.id}
                    className="group relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {rec.category}
                        </span>
                        <Badge variant={badgeVariant} size="sm">
                          {rec.priority === "tinggi" ? "Prioritas Utama" : rec.priority === "sedang" ? "Jatuh Tempo" : "Penyegaran"}
                        </Badge>
                      </div>

                      {/* Title & Latin Name */}
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                        {rec.title}
                      </h3>
                      <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400 line-clamp-1">
                        {rec.latinName}
                      </p>

                      {/* Reason Pill */}
                      <div className="mt-3.5 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                        <strong className="text-slate-800 dark:text-slate-200 block mb-0.5 font-semibold">
                          Alasan Rekomendasi:
                        </strong>
                        <span className="leading-relaxed">{rec.reason}</span>
                      </div>
                    </div>

                    {/* Footer Details & Mulai Button */}
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                          <strong className="text-slate-700 dark:text-slate-200">{rec.dueCount}</strong> item
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          ~{rec.estimatedMinutes} mnt
                        </span>
                      </div>

                      <button
                        onClick={() => showToast(`Memulai latihan kuis: "${rec.title}"`)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-teal-700 active:scale-95"
                      >
                        <span>Mulai</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. CHECKLIST TARGET HARIAN (STATE LOKAL DENGAN PROGRESS BAR) */}
        <SectionCard
          title="Target Belajar Hari Ini"
          subtitle="Centang target yang telah kamu selesaikan untuk memperbarui progres harian"
          badge={
            <Badge variant={checklistPercent === 100 ? "success" : "default"} size="sm">
              {completedCount} dari {totalCount} Selesai ({checklistPercent}%)
            </Badge>
          }
          action={
            <button
              onClick={() => {
                setChecklist(mockDailyChecklist);
                showToast("Target harian direset ke pengaturan awal.");
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
              title="Reset checklist"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          }
        >
          {isLoadingState ? (
            <div className="space-y-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : (
            <div className="space-y-5">
              {/* Overall Checklist Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <span>Pencapaian Target Hari Ini</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {checklistPercent}%
                  </span>
                </div>
                <ProgressBar
                  value={checklistPercent}
                  color={checklistPercent === 100 ? "emerald" : "teal"}
                  size="md"
                  animate
                />
              </div>

              {/* Congratulatory banner if 100% complete */}
              {checklistPercent === 100 && (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 border border-emerald-200/80 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-200 animate-in fade-in duration-300">
                  <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <strong>Luar biasa, target hari ini tuntas 100%!</strong> Retensi memori untuk ujian blok muskuloskeletal semakin solid.
                  </div>
                </div>
              )}

              {/* Checklist items list */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/40">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(item.id)}
                    className={`flex items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 transition-colors cursor-pointer hover:bg-white dark:hover:bg-slate-800/60 ${
                      item.completed ? "bg-white/60 dark:bg-slate-900/60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Checkbox Icon */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleChecklist(item.id);
                        }}
                        className={`mt-0.5 sm:mt-0 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                          item.completed
                            ? "bg-teal-600 border-teal-600 text-white shadow-2xs"
                            : "border-slate-300 bg-white hover:border-teal-500 dark:border-slate-600 dark:bg-slate-800"
                        }`}
                        aria-checked={item.completed}
                        role="checkbox"
                      >
                        {item.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <span
                          className={`text-xs sm:text-sm font-medium transition ${
                            item.completed
                              ? "text-slate-400 line-through dark:text-slate-500"
                              : "text-slate-800 dark:text-slate-200 font-semibold"
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.latinTerm && (
                          <span className="block text-[11px] italic text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.latinTerm}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10.5px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {item.tag}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {item.itemCount} item
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
