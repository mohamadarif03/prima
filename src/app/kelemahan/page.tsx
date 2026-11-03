"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/ui/SectionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Activity } from "lucide-react";

export default function KelemahanPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <SectionCard
          title="Peta Kelemahan"
          subtitle="Analisis terperinci tingkat penguasaan dan riwayat kesalahan per struktur"
        >
          <EmptyState
            icon={<Activity className="h-7 w-7" />}
            title="Peta Kelemahan"
            description="Halaman ini memetakan topik anatomi dari yang paling lemah hingga yang sudah dikuasai untuk mengoptimalkan repetisi belajar."
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
