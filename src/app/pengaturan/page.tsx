"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/ui/SectionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Settings } from "lucide-react";

export default function PengaturanPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <SectionCard
          title="Pengaturan"
          subtitle="Konfigurasi akun, preferensi spaced repetition, dan tema aplikasi"
        >
          <EmptyState
            icon={<Settings className="h-7 w-7" />}
            title="Pengaturan"
            description="Halaman ini berisi preferensi akun, pilihan semester preklinik, dan konfigurasi algoritma pengulangan belajar."
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
