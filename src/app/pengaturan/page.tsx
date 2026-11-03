"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/ui/SectionCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function PengaturanPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="text-[21px] font-medium text-[#1e293b] leading-tight">
              Pengaturan
            </h1>
            <p className="text-[12.5px] text-[#64748b] mt-0.5">
              Preferensi akun mahasiswa, semester, dan konfigurasi spaced repetition
            </p>
          </div>
        </div>

        <SectionCard
          title="Preferensi Akun & Belajar"
          subtitle="Sesuaikan frekuensi pengingat dan interval waktu repetisi adaptif"
        >
          <EmptyState
            icon={<i className="bi bi-gear"></i>}
            title="Pengaturan"
            description="Halaman ini berisi preferensi akun, pilihan semester preklinik, dan konfigurasi algoritma pengulangan belajar."
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
