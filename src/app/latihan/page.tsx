"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SectionCard } from "@/components/ui/SectionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Box } from "lucide-react";

export default function LatihanPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <SectionCard
          title="Latihan Anatomi 3D"
          subtitle="Modul latihan identifikasi struktur dan kuis klinis tiga dimensi"
        >
          <EmptyState
            icon={<Box className="h-7 w-7" />}
            title="Latihan Anatomi 3D"
            description="Halaman ini menyediakan latihan interaktif model 3D untuk menguji pemahaman struktur anatomi pada regio terpilih."
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
