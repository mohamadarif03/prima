"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/ui/SectionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CalendarDays } from "lucide-react";

export default function PerencanaPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <SectionCard
          title="Perencana Belajar"
          subtitle="Pengaturan jadwal harian adaptif berdasarkan target tanggal ujian"
        >
          <EmptyState
            icon={<CalendarDays className="h-7 w-7" />}
            title="Perencana Belajar"
            description="Halaman ini membantu membagi beban belajar dan menyusun target latihan harian menuju tanggal ujian blok."
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
