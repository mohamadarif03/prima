"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/ui/SectionCard";
import { EmptyState } from "@/components/ui/EmptyState";

export default function LatihanPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <div>
            <h1 className="text-[21px] font-medium text-[#1e293b] leading-tight">
              Latihan Anatomi 3D
            </h1>
            <p className="text-[12.5px] text-[#64748b] mt-0.5">
              Modul latihan identifikasi struktur anatomi tiga dimensi
            </p>
          </div>
        </div>

        <SectionCard
          title="Modul Latihan 3D"
          subtitle="Kuis interaktif klik struktur dan sebutkan nama pada model 3D"
        >
          <EmptyState
            icon={<i className="bi bi-box-seam"></i>}
            title="Latihan Anatomi 3D"
            description="Halaman ini menyediakan latihan interaktif model 3D untuk menguji pemahaman struktur anatomi pada regio terpilih."
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
