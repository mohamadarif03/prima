"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/ui/SectionCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function PerencanaPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="text-[21px] font-medium text-[#1e293b] leading-tight">
              Perencana Belajar
            </h1>
            <p className="text-[12.5px] text-[#64748b] mt-0.5">
              Pembagian target harian adaptif menuju tanggal ujian blok
            </p>
          </div>
        </div>

        <SectionCard
          title="Jadwal Target Harian"
          subtitle="Sistem membagi materi ujian ke dalam rencana harian otomatis"
        >
          <EmptyState
            icon={<i className="bi bi-calendar-event"></i>}
            title="Perencana Belajar"
            description="Halaman ini membantu membagi beban belajar dan menyusun target latihan harian menuju tanggal ujian blok."
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
