"use client";

import React, { useState, useEffect, useRef } from "react";
import ChartJS from "chart.js/auto";
import { AppShell } from "@/components/layout/AppShell";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  mockStudyPlans,
  mock14DaySchedule,
  StudyPlan,
  DaySchedule,
  DayTargetItem,
} from "@/lib/mock-data";

export default function PerencanaPage() {
  // State for plans and schedule
  const [plans, setPlans] = useState<StudyPlan[]>(mockStudyPlans);
  const [schedule, setSchedule] = useState<DaySchedule[]>(mock14DaySchedule);
  const [selectedDayId, setSelectedDayId] = useState<string>("day-01");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [formTopic, setFormTopic] = useState("");
  const [formLatin, setFormLatin] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTarget, setFormTarget] = useState<number>(20);
  const [formDays, setFormDays] = useState<string[]>([
    "Sen",
    "Sel",
    "Rab",
    "Kam",
    "Jum",
    "Sab",
  ]);
  const [formNotes, setFormNotes] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Demo testing states
  const [isLoading, setIsLoading] = useState(false);

  const chartRef = useRef<HTMLCanvasElement | null>(null);

  // Selected Day data
  const selectedDay =
    schedule.find((d) => d.id === selectedDayId) || schedule[0];

  // Helper toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Toggle checklist target
  const handleToggleTarget = (dayId: string, targetId: string) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((day) => {
        if (day.id !== dayId) return day;
        const updatedTargets = day.targets.map((t) =>
          t.id === targetId ? { ...t, completed: !t.completed } : t
        );
        return { ...day, targets: updatedTargets };
      })
    );
  };

  // Open modal for new plan
  const handleOpenAddModal = () => {
    setEditingPlan(null);
    setFormTopic("");
    setFormLatin("");
    setFormDate("2026-11-25");
    setFormTarget(20);
    setFormDays(["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]);
    setFormNotes("");
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing plan
  const handleOpenEditModal = (plan: StudyPlan) => {
    setEditingPlan(plan);
    setFormTopic(plan.topicTitle);
    setFormLatin(plan.latinName);
    setFormDate(plan.examDate);
    setFormTarget(plan.targetPerDay);
    setFormDays(plan.studyDays);
    setFormNotes(plan.notes || "");
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Toggle study day selection in form
  const handleToggleDay = (day: string) => {
    if (formDays.includes(day)) {
      if (formDays.length > 1) {
        setFormDays(formDays.filter((d) => d !== day));
      }
    } else {
      setFormDays([...formDays, day]);
    }
  };

  // Form validation & submission
  const handleSubmitPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formTopic.trim()) {
      errors.topic = "Topik atau regio wajib dipilih/diisi.";
    }
    if (!formDate) {
      errors.date = "Tanggal ujian wajib diisi.";
    } else {
      const selectedTime = new Date(formDate).getTime();
      const todayTime = new Date("2026-11-03").getTime();
      if (selectedTime <= todayTime) {
        errors.date = "Tanggal ujian harus berupa tanggal yang akan datang.";
      }
    }
    if (formTarget <= 0) {
      errors.target = "Target harian minimal 1 item.";
    }
    if (formDays.length === 0) {
      errors.days = "Pilih minimal satu hari belajar aktif.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Calculate days remaining
    const diffTime = Math.max(
      new Date(formDate).getTime() - new Date("2026-11-03").getTime(),
      0
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (editingPlan) {
      // Edit existing plan
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id
            ? {
                ...p,
                topicTitle: formTopic,
                latinName: formLatin || formTopic,
                examDate: formDate,
                daysUntilExam: diffDays,
                targetPerDay: formTarget,
                studyDays: formDays,
                notes: formNotes,
              }
            : p
        )
      );
      showToast(`Rencana belajar "${formTopic}" berhasil diperbarui.`);
    } else {
      // Create new plan
      const newPlan: StudyPlan = {
        id: `plan-${Date.now()}`,
        topicTitle: formTopic,
        latinName: formLatin || formTopic,
        examDate: formDate,
        daysUntilExam: diffDays,
        targetPerDay: formTarget,
        totalItems: formTarget * 6,
        masteredItems: 0,
        status: "sesuai jadwal",
        studyDays: formDays,
        notes: formNotes,
      };
      setPlans((prev) => [newPlan, ...prev]);
      showToast(`Rencana baru "${formTopic}" berhasil ditambahkan ke jadwal.`);
    }

    setIsModalOpen(false);
  };

  // Delete plan handler
  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    const target = plans.find((p) => p.id === deleteTargetId);
    setPlans((prev) => prev.filter((p) => p.id !== deleteTargetId));
    setDeleteTargetId(null);
    showToast(`Rencana "${target?.topicTitle || "terpilih"}" telah dihapus.`);
  };

  // Summary Stat Calculations
  const activePlansCount = plans.length;
  const nearestExamPlan =
    plans.length > 0
      ? [...plans].sort((a, b) => a.daysUntilExam - b.daysUntilExam)[0]
      : null;

  const todaySchedule = schedule.find((d) => d.isToday) || schedule[0];
  const todayTotal = todaySchedule ? todaySchedule.targets.length : 0;
  const todayCompleted = todaySchedule
    ? todaySchedule.targets.filter((t) => t.completed).length
    : 0;

  const weeklyLoadTotal = schedule
    .slice(0, 7)
    .reduce((sum, d) => sum + d.totalItems, 0);

  // Selected Day checklist calculations
  const selectedDayTotal = selectedDay ? selectedDay.targets.length : 0;
  const selectedDayCompleted = selectedDay
    ? selectedDay.targets.filter((t) => t.completed).length
    : 0;
  const selectedDayPercent =
    selectedDayTotal > 0
      ? Math.round((selectedDayCompleted / selectedDayTotal) * 100)
      : 0;

  // Chart 14-Day Study Load (Chart.js)
  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Background colors: Highlight selected day and heavy load days
    const bgColors = schedule.map((item) => {
      if (item.id === selectedDayId) {
        return "#0d6efd"; // Dark active blue
      }
      if (item.isHeavyLoad) {
        return "#cc7a00"; // Amber for heavy load
      }
      return "#93c5fd"; // Soft blue for normal days
    });

    const chartInstance = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: schedule.map((d) => d.formattedDate),
        datasets: [
          {
            label: "Beban Item per Hari",
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
                return ` ${context.parsed.y} item target ${
                  isHeavy ? "(Beban Tinggi ⚠️)" : ""
                }`;
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
  }, [schedule, selectedDayId]);

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
          <h1 className="text-[21px] font-medium text-[#1e293b] leading-tight">
            Perencana Belajar
          </h1>
          <p className="text-[12.5px] text-[#64748b] mt-0.5">
            Kelola target repetisi harian dan jadwal persiapan ujian blok
            kedokteran
          </p>
        </div>

        {/* Action Button & Demo Toggle */}
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

          <button
            onClick={handleOpenAddModal}
            className="h-[34px] px-3.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[13px] font-medium rounded-[6px] flex items-center gap-1.5 shadow-sm transition"
          >
            <i className="bi bi-plus-lg text-[13px]"></i>
            <span>Tambah Rencana</span>
          </button>
        </div>
      </div>

      {/* ROW 1: 4 RINGKASAN STATCARD */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="metis-card p-[18px]">
              <Skeleton className="h-3 w-28 mb-3" />
              <Skeleton className="h-7 w-20 mb-2" />
              <Skeleton className="h-3 w-36" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
          {/* Card 1: Rencana Aktif */}
          <div className="metis-card p-[18px] flex items-center gap-4">
            <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#0d6efd] flex-shrink-0 text-[18px]">
              <i className="bi bi-journal-bookmark"></i>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">
                RENCANA AKTIF
              </div>
              <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">
                {activePlansCount} Rencana
              </div>
              <div className="text-[11.5px] mt-0.5 text-[#64748b]">
                Semua regio kurikulum
              </div>
            </div>
          </div>

          {/* Card 2: Ujian Terdekat */}
          <div className="metis-card p-[18px] flex items-center gap-4">
            <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#dc2626] flex-shrink-0 text-[18px]">
              <i className="bi bi-calendar-event"></i>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">
                UJIAN TERDEKAT
              </div>
              <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">
                {nearestExamPlan ? `${nearestExamPlan.daysUntilExam} Hari` : "-"}
              </div>
              <div className="text-[11.5px] mt-0.5 text-[#64748b] truncate max-w-[150px]">
                {nearestExamPlan
                  ? `${nearestExamPlan.topicTitle}`
                  : "Belum ada jadwal"}
              </div>
            </div>
          </div>

          {/* Card 3: Target Hari Ini */}
          <div className="metis-card p-[18px] flex items-center gap-4">
            <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#198754] flex-shrink-0 text-[18px]">
              <i className="bi bi-check2-circle"></i>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">
                TARGET HARI INI
              </div>
              <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">
                {todayCompleted} / {todayTotal} Selesai
              </div>
              <div className="text-[11.5px] mt-0.5 text-[#198754] font-semibold">
                {todayTotal > 0
                  ? `${Math.round((todayCompleted / todayTotal) * 100)}% tercapai`
                  : "Istirahat"}
              </div>
            </div>
          </div>

          {/* Card 4: Perkiraan Beban Minggu Ini */}
          <div className="metis-card p-[18px] flex items-center gap-4">
            <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#cc7a00] flex-shrink-0 text-[18px]">
              <i className="bi bi-lightning-charge"></i>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">
                BEBAN MINGGU INI
              </div>
              <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">
                {weeklyLoadTotal} Item
              </div>
              <div className="text-[11.5px] mt-0.5 text-[#64748b]">
                Rata-rata 18.4 item / hari
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROW 2: DUA KOLOM UTAMA (JADWAL 14 HARI & RENCANA AKTIF) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* KOLOM KIRI: TAMPILAN JADWAL (7 Kolom di Laptop) */}
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
                Geser untuk melihat tanggal berikutnya
              </span>
            </div>

            {/* Horizontal Scrollable Calendar Strip */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {schedule.map((day) => {
                const isSelected = day.id === selectedDayId;
                const completedCount = day.targets.filter(
                  (t) => t.completed
                ).length;
                const isAllDone =
                  day.targets.length > 0 &&
                  completedCount === day.targets.length;

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

                    {/* Small Status Dots */}
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
                    Saran Jadwal Adaptif:{" "}
                  </strong>
                  <span>{selectedDay.smartSuggestion}</span>
                </div>
              </div>
            )}
          </div>

          {/* CHECKLIST TARGET HARI TERPILIH */}
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
                  Centang target yang selesai untuk memperbarui progres harian
                </p>
              </div>

              <span
                className={
                  selectedDayPercent === 100
                    ? "badge-completed"
                    : "badge-shipped"
                }
              >
                {selectedDayCompleted} dari {selectedDayTotal} Selesai (
                {selectedDayPercent}%)
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center text-[12px] text-[#475569] mb-1.5 font-medium">
                    <span>Pencapaian Hari Ini</span>
                    <span className="font-bold text-[#0f172a]">
                      {selectedDayPercent}%
                    </span>
                  </div>
                  <ProgressBar
                    value={selectedDayPercent}
                    color={selectedDayPercent === 100 ? "green" : "blue"}
                    size="md"
                  />
                </div>

                {/* Target Items List */}
                {selectedDay.targets.length === 0 ? (
                  <EmptyState
                    title="Tidak Ada Target"
                    description="Tidak ada beban belajar terdaftar untuk tanggal ini."
                  />
                ) : (
                  <div className="border border-[#e2e8f0] rounded-[6px] divide-y divide-[#e2e8f0] bg-white">
                    {selectedDay.targets.map((target) => (
                      <div
                        key={target.id}
                        onClick={() =>
                          handleToggleTarget(selectedDay.id, target.id)
                        }
                        className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition hover:bg-[#f8f9fa] ${
                          target.completed ? "bg-[#f8fafc]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={target.completed}
                            onChange={() =>
                              handleToggleTarget(selectedDay.id, target.id)
                            }
                            className="w-4 h-4 text-[#0d6efd] rounded border-[#cbd5e1] focus:ring-[#0d6efd] cursor-pointer"
                          />
                          <div className="min-w-0">
                            <span
                              className={`text-[13px] ${
                                target.completed
                                  ? "line-through text-[#94a3b8]"
                                  : "font-medium text-[#1e293b]"
                              }`}
                            >
                              {target.title}
                            </span>
                            {target.latinTerm && (
                              <span className="block text-[11px] italic text-[#64748b]">
                                {target.latinTerm}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-[4px] bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]">
                            {target.category}
                          </span>
                          <span className="text-[11.5px] font-semibold text-[#64748b]">
                            {target.itemCount} item
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Quick Action */}
              <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[12px] text-[#64748b]">
                <span>
                  Total beban:{" "}
                  <strong className="text-[#1e293b]">
                    {selectedDay.totalItems} item
                  </strong>
                </span>
                <button
                  onClick={() =>
                    showToast(
                      `Membuka sesi latihan untuk hari: ${selectedDay.formattedDate}`
                    )
                  }
                  className="h-[30px] px-3 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12px] font-semibold rounded-[5px] flex items-center gap-1.5 transition"
                >
                  <i className="bi bi-play-fill text-[14px]"></i>
                  <span>Latih Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: DAFTAR RENCANA AKTIF (5 Kolom di Laptop) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="metis-card flex-1 flex flex-col">
            <div className="metis-card-header">
              <div>
                <h2 className="metis-card-title">Rencana Belajar Aktif</h2>
                <p className="text-[12px] text-[#64748b] mt-0.5">
                  Target persiapan blok anatomi yang sedang berjalan
                </p>
              </div>
              <span className="badge-completed">
                {plans.length} Regio Terdaftar
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              {plans.length === 0 ? (
                <EmptyState
                  icon={<i className="bi bi-journal-plus"></i>}
                  title="Belum Ada Rencana Belajar"
                  description="Buat rencana belajar pertamamu untuk mengatur jadwal harian menuju ujian."
                  action={
                    <button
                      onClick={handleOpenAddModal}
                      className="h-[32px] px-3 bg-[#0d6efd] text-white text-[12px] font-semibold rounded-[5px]"
                    >
                      Buat Rencana
                    </button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {plans.map((plan) => {
                    const progressPercent = Math.min(
                      Math.round(
                        (plan.masteredItems / (plan.totalItems || 1)) * 100
                      ),
                      100
                    );

                    // Status Badge definition
                    let badgeClass = "badge-completed";
                    let statusLabel = "Sesuai Jadwal";
                    let progressColor: "green" | "yellow" | "red" = "green";

                    if (plan.status === "sedikit tertinggal") {
                      badgeClass = "badge-pending";
                      statusLabel = "Sedikit Tertinggal";
                      progressColor = "yellow";
                    } else if (plan.status === "tertinggal") {
                      badgeClass =
                        "bg-[#dc2626] text-white text-[11px] font-semibold px-2 py-0.5 rounded-[4px]";
                      statusLabel = "Tertinggal";
                      progressColor = "red";
                    }

                    return (
                      <div
                        key={plan.id}
                        className="p-4 border border-[#e2e8f0] rounded-[7px] bg-[#ffffff] hover:border-[#cbd5e1] transition shadow-2xs"
                      >
                        {/* Top: Title & Status */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <h3 className="text-[14.5px] font-bold text-[#1e293b] truncate">
                              {plan.topicTitle}
                            </h3>
                            <span className="text-[11.5px] italic text-[#64748b] block truncate">
                              {plan.latinName}
                            </span>
                          </div>
                          <span className={badgeClass}>{statusLabel}</span>
                        </div>

                        {/* Exam Date & Days remaining */}
                        <div className="flex items-center gap-2 text-[12px] text-[#475569] mb-3">
                          <i className="bi bi-calendar-event text-[13px] text-[#0d6efd]"></i>
                          <span>
                            Ujian: <strong>{plan.examDate}</strong> (
                            {plan.daysUntilExam} hari lagi)
                          </span>
                        </div>

                        {/* Mastery Progress Bar */}
                        <div className="space-y-1 mb-3">
                          <div className="flex justify-between items-center text-[11.5px]">
                            <span className="text-[#64748b]">
                              Penguasaan Materi:
                            </span>
                            <span className="font-bold text-[#1e293b]">
                              {plan.masteredItems} / {plan.totalItems} item (
                              {progressPercent}%)
                            </span>
                          </div>
                          <ProgressBar
                            value={progressPercent}
                            color={progressColor}
                            size="sm"
                          />
                        </div>

                        {/* Study Days and Action Menu */}
                        <div className="pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-[11.5px]">
                          <div className="text-[#64748b]">
                            <span>
                              Target:{" "}
                              <strong className="text-[#1e293b]">
                                {plan.targetPerDay}
                              </strong>{" "}
                              item/hari
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(plan)}
                              className="h-[26px] px-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1e293b] font-medium rounded-[4px] transition text-[11.5px] flex items-center gap-1"
                            >
                              <i className="bi bi-pencil text-[10.5px]"></i>
                              <span>Ubah</span>
                            </button>
                            <button
                              onClick={() => setDeleteTargetId(plan.id)}
                              className="h-[26px] px-2 bg-[#fff1f2] hover:bg-[#ffe4e6] text-[#e11d48] font-medium rounded-[4px] transition text-[11.5px] flex items-center gap-1"
                              title="Hapus Rencana"
                            >
                              <i className="bi bi-trash text-[11px]"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Info Note */}
              <div className="mt-4 pt-3 border-t border-[#f1f5f9] text-[11.5px] text-[#64748b] flex items-center justify-between">
                <span>Algoritma Spaced Repetition otomatis mengadaptasi beban.</span>
                <button
                  onClick={handleOpenAddModal}
                  className="text-[#0d6efd] font-semibold hover:underline"
                >
                  + Tambah Baru
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: GRAFIK BEBAN BELAJAR 14 HARI (BAR CHART CHART.JS) */}
      <div className="metis-card mb-5">
        <div className="metis-card-header">
          <div>
            <h2 className="metis-card-title">
              Grafik Beban Belajar per Hari (14 Hari ke Depan)
            </h2>
            <p className="text-[12px] text-[#64748b] mt-0.5">
              Klik pada batang tanggal untuk melihat dan mengatur target harian
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11.5px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0d6efd]"></span>
              <span className="text-[#475569]">Hari Terpilih</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#cc7a00]"></span>
              <span className="text-[#475569]">Beban Tinggi (&gt;25 item)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#93c5fd]"></span>
              <span className="text-[#475569]">Beban Normal</span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="w-full h-[250px] relative">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>

      {/* MODAL DIALOG: TAMBAH / UBAH RENCANA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Dialog Container */}
          <div className="relative w-full max-w-lg bg-white border border-[#e2e8f0] rounded-[8px] shadow-xl z-50 overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="metis-card-header bg-[#f8f9fa]">
              <h2 className="metis-card-title flex items-center gap-2">
                <i className="bi bi-journal-plus text-[#0d6efd]"></i>
                <span>
                  {editingPlan
                    ? "Ubah Rencana Belajar"
                    : "Tambah Rencana Belajar Baru"}
                </span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748b] hover:text-[#0f172a] text-[18px] leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitPlan} className="p-5 space-y-4 text-[13px]">
              {/* Field 1: Topik / Regio */}
              <div>
                <label className="block font-semibold text-[#1e293b] mb-1">
                  Pilih Topik atau Regio Anatomi *
                </label>
                <input
                  type="text"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="Contoh: Anggota Gerak Atas"
                  className="w-full h-[36px] bg-[#f8f9fa] border border-[#cbd5e1] rounded-[6px] px-3 text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
                />
                {formErrors.topic && (
                  <p className="text-[11.5px] text-[#dc2626] mt-1 font-medium">
                    {formErrors.topic}
                  </p>
                )}
              </div>

              {/* Field 2: Nama Latin / Istilah Medis */}
              <div>
                <label className="block font-semibold text-[#1e293b] mb-1">
                  Istilah Latin (Opsional)
                </label>
                <input
                  type="text"
                  value={formLatin}
                  onChange={(e) => setFormLatin(e.target.value)}
                  placeholder="Contoh: Extremitas Superior"
                  className="w-full h-[36px] bg-[#f8f9fa] border border-[#cbd5e1] rounded-[6px] px-3 text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
                />
              </div>

              {/* Field 3: Tanggal Ujian Blok */}
              <div>
                <label className="block font-semibold text-[#1e293b] mb-1">
                  Tanggal Ujian Blok (Target) *
                </label>
                <input
                  type="date"
                  min="2026-11-04"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full h-[36px] bg-[#f8f9fa] border border-[#cbd5e1] rounded-[6px] px-3 text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
                />
                {formErrors.date && (
                  <p className="text-[11.5px] text-[#dc2626] mt-1 font-medium">
                    {formErrors.date}
                  </p>
                )}
              </div>

              {/* Field 4: Target Item per Hari */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-[#1e293b]">
                    Target Item per Hari *
                  </label>
                  <span className="font-bold text-[#0d6efd]">
                    {formTarget} item / hari
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={formTarget}
                  onChange={(e) => setFormTarget(Number(e.target.value))}
                  className="w-full h-2 bg-[#e2e8f0] rounded-lg appearance-none cursor-pointer accent-[#0d6efd]"
                />
                <div className="flex justify-between text-[11px] text-[#64748b] mt-1">
                  <span>Santai (5 item)</span>
                  <span>Standar (20 item)</span>
                  <span>Intensif (50 item)</span>
                </div>
                {formErrors.target && (
                  <p className="text-[11.5px] text-[#dc2626] mt-1 font-medium">
                    {formErrors.target}
                  </p>
                )}
              </div>

              {/* Field 5: Hari Belajar yang Dipilih */}
              <div>
                <label className="block font-semibold text-[#1e293b] mb-1.5">
                  Hari Belajar Aktif *
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
                    (day) => {
                      const isSelected = formDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleToggleDay(day)}
                          className={`h-[30px] px-3 rounded-[5px] text-[12px] font-semibold border transition ${
                            isSelected
                              ? "bg-[#0d6efd] text-white border-[#0d6efd]"
                              : "bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f8fafc]"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    }
                  )}
                </div>
                {formErrors.days && (
                  <p className="text-[11.5px] text-[#dc2626] mt-1 font-medium">
                    {formErrors.days}
                  </p>
                )}
              </div>

              {/* Field 6: Catatan Fokus */}
              <div>
                <label className="block font-semibold text-[#1e293b] mb-1">
                  Catatan Fokus Belajar (Opsional)
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Contoh: Fokus pleksus brakialis & rotator cuff"
                  className="w-full h-[36px] bg-[#f8f9fa] border border-[#cbd5e1] rounded-[6px] px-3 text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-[34px] px-3.5 bg-white border border-[#cbd5e1] text-[#475569] rounded-[6px] font-medium hover:bg-[#f8fafc] transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-[34px] px-4 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded-[6px] font-semibold shadow-sm transition"
                >
                  {editingPlan ? "Simpan Perubahan" : "Tambahkan ke Jadwal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: HAPUS RENCANA */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setDeleteTargetId(null)}
          />
          <div className="relative w-full max-w-sm bg-white border border-[#e2e8f0] rounded-[8px] shadow-xl z-50 p-5 text-[13px] animate-in fade-in duration-150">
            <div className="w-[42px] h-[42px] rounded-full bg-[#fee2e2] text-[#dc2626] flex items-center justify-center text-[20px] mb-3">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-1">
              Hapus Rencana Belajar?
            </h3>
            <p className="text-[#64748b] text-[12.5px] mb-4 leading-relaxed">
              Tindakan ini akan menghapus target repetisi terkait dari jadwal 14
              hari ke depan.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="h-[32px] px-3 bg-white border border-[#cbd5e1] text-[#475569] rounded-[5px] font-medium hover:bg-[#f8fafc]"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="h-[32px] px-3.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-[5px] font-semibold"
              >
                Ya, Hapus Rencana
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
