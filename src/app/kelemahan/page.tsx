"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/ui/SectionCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function KelemahanPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="text-[21px] font-medium text-[#1e293b] leading-tight">
              Peta Kelemahan
            </h1>
            <p className="text-[12.5px] text-[#64748b] mt-0.5">
              Analisis diagnostik struktur dan topik dengan tingkat kesalahan tertinggi
            </p>
          </div>
        </div>

        <SectionCard
          title="Distribusi Penguasaan Materi"
          subtitle="Identifikasi otomatis materi yang perlu pengulangan lebih sering"
        >
          <EmptyState
            icon={<i className="bi bi-graph-up"></i>}
            title="Peta Kelemahan"
            description="Halaman ini memetakan topik anatomi dari yang paling lemah hingga yang sudah dikuasai untuk mengoptimalkan repetisi belajar."
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
