"use client";

import React, { useState, Suspense, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  mockAnatomyRegions,
  getStructuresByRegion,
  Anatomy3DStructure,
} from "@/lib/mock-data";

// Dynamic Client Component Loader for Three.js (No SSR)
const AnatomyViewer = dynamic(
  () =>
    import("@/components/anatomy/AnatomyViewer").then(
      (mod) => mod.AnatomyViewer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] sm:h-[520px] lg:h-full min-h-[420px] flex flex-col items-center justify-center bg-[#f8f9fa] border border-[#e2e8f0] rounded-[8px] p-6 text-center">
        <div className="w-9 h-9 border-3 border-[#0d6efd] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-[13.5px] font-semibold text-[#1e293b]">
          Memuat Model 3D Anatomi...
        </p>
        <p className="text-[12px] text-[#64748b] mt-0.5">
          Menyiapkan grafis WebGL dan koordinat struktur regio
        </p>
      </div>
    ),
  }
);

export default function LatihanPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#64748b]">
          Memuat modul latihan anatomi...
        </div>
      }
    >
      <LatihanContent />
    </Suspense>
  );
}

function LatihanContent() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic") || searchParams.get("topik");

  // Default to Regio Thorax (features real 3D heart model)
  const [selectedRegionId, setSelectedRegionId] = useState("reg-thorax");
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle URL search params mapping to regions
  useEffect(() => {
    if (!topicParam) return;
    const lower = topicParam.toLowerCase();
    if (lower.includes("caput") || lower.includes("kepala")) {
      setSelectedRegionId("reg-caput");
    } else if (lower.includes("collum") || lower.includes("leher")) {
      setSelectedRegionId("reg-collum");
    } else if (
      lower.includes("thorax") ||
      lower.includes("dada") ||
      lower.includes("jantung")
    ) {
      setSelectedRegionId("reg-thorax");
    } else if (lower.includes("abdomen") || lower.includes("perut")) {
      setSelectedRegionId("reg-abdomen");
    } else if (lower.includes("pelvis") || lower.includes("pinggul")) {
      setSelectedRegionId("reg-pelvis");
    } else if (
      lower.includes("membrum") ||
      lower.includes("lengan") ||
      lower.includes("gerak")
    ) {
      setSelectedRegionId("reg-membrum");
    }
  }, [topicParam]);

  // Selected Region Object
  const selectedRegion = useMemo(() => {
    return (
      mockAnatomyRegions.find((r) => r.id === selectedRegionId) ||
      mockAnatomyRegions[2] // Fallback to Thorax
    );
  }, [selectedRegionId]);

  // Structures for active region
  const structures = useMemo(() => {
    return getStructuresByRegion(selectedRegionId);
  }, [selectedRegionId]);

  // Auto-select first structure when region changes if none selected
  useEffect(() => {
    if (structures.length > 0) {
      setSelectedStructureId(structures[0].id);
    } else {
      setSelectedStructureId(null);
    }
  }, [selectedRegionId, structures]);

  // Currently active/inspected structure
  const activeStructure: Anatomy3DStructure | undefined = useMemo(() => {
    if (!selectedStructureId) return structures[0];
    return (
      structures.find(
        (s) => s.id === selectedStructureId || s.meshId === selectedStructureId
      ) || structures[0]
    );
  }, [selectedStructureId, structures]);

  // Filtered structures for the right-hand browser
  const filteredStructures = useMemo(() => {
    return structures.filter((s) => {
      const matchSearch =
        searchQuery === "" ||
        s.nameIndo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nameLatin.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        selectedCategory === "Semua" || s.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [structures, searchQuery, selectedCategory]);

  // Handle Region Change
  const handleRegionChange = (newRegionId: string) => {
    setSelectedRegionId(newRegionId);
    setSearchQuery("");
    setSelectedCategory("Semua");
  };

  // Handle 3D mesh click
  const handleMeshClick = (meshId: string) => {
    setSelectedStructureId(meshId);
  };

  return (
    <div className="space-y-5">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[21px] font-medium text-[#1e293b] leading-tight">
              Eksplorasi Anatomi 3D Berbasis Regio
            </h1>
            {topicParam && (
              <span className="badge-shipped flex items-center gap-1">
                <span>Filter: {topicParam}</span>
                <Link
                  href="/latihan"
                  className="hover:text-white/80 ml-1 font-bold"
                  title="Hapus filter"
                >
                  ✕
                </Link>
              </span>
            )}
          </div>
          <p className="text-[12.5px] text-[#64748b] mt-0.5">
            Eksplorasi spasial model 3D anatomi tubuh manusia interaktif tanpa batas
            soal per regio
          </p>
        </div>

        {/* Header Right: Fullscreen / Layout Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullWidth(!isFullWidth)}
            className={`h-[34px] px-3 border text-[12.5px] font-medium rounded-[6px] transition flex items-center gap-1.5 ${
              isFullWidth
                ? "bg-[#0d6efd] text-white border-[#0d6efd]"
                : "bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f8fafc]"
            }`}
            title="Ubah lebar canvas 3D"
          >
            <i
              className={`bi ${
                isFullWidth ? "bi-layout-sidebar" : "bi-arrows-fullscreen"
              }`}
            ></i>
            <span>{isFullWidth ? "Buka Panel Detail" : "Layar Lebar"}</span>
          </button>

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
        </div>
      </div>

      {/* 6 REGIO SELECTION ARENA (Interactive Cards Grid) */}
      <div className="metis-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0d6efd]"></span>
            <h2 className="text-[13.5px] font-bold text-[#1e293b]">
              Pilih Fokus Regio Tubuh
            </h2>
            <span className="text-[11.5px] text-[#64748b] hidden sm:inline">
              · Klik regio untuk memuat model 3D dan memeriksa anatomi terkait
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#0d6efd] bg-[#eff6ff] px-2.5 py-0.5 rounded-full border border-[#bfdbfe]">
            6 Regio Tubuh
          </span>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {mockAnatomyRegions.map((reg) => {
            const isSelected = selectedRegionId === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => handleRegionChange(reg.id)}
                className={`text-left p-3 rounded-[7px] border transition relative flex flex-col justify-between h-[125px] group ${
                  isSelected
                    ? "bg-[#eff6ff] border-[#0d6efd] ring-2 ring-[#0d6efd]/30 shadow-xs"
                    : "bg-white border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                }`}
              >
                {/* Top: Number & 3D Badge */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded-[4px] ${
                      isSelected
                        ? "bg-[#0d6efd] text-white"
                        : "bg-[#f1f5f9] text-[#475569] group-hover:bg-[#e2e8f0]"
                    }`}
                  >
                    #{reg.number}
                  </span>

                  {reg.modelUrl && (
                    <span className="bg-[#10b981]/10 text-[#047857] border border-[#10b981]/30 text-[9.5px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                      <span>3D Asli</span>
                    </span>
                  )}
                </div>

                {/* Middle: Icon & Titles */}
                <div className="my-1">
                  <div className="flex items-center gap-1.5">
                    <i
                      className={`${reg.icon} text-[15px] ${
                        isSelected ? "text-[#0d6efd]" : "text-[#64748b]"
                      }`}
                    ></i>
                    <h3
                      className={`text-[13px] font-bold leading-tight ${
                        isSelected ? "text-[#0d6efd]" : "text-[#1e293b]"
                      }`}
                    >
                      {reg.subName}
                    </h3>
                  </div>
                  <span className="text-[10.5px] text-[#64748b] block truncate mt-0.5 font-medium">
                    {reg.name}
                  </span>
                </div>

                {/* Bottom: Mastery & Structures count */}
                <div className="flex items-center justify-between w-full pt-1.5 border-t border-[#f1f5f9] text-[10.5px]">
                  <span
                    className={`font-semibold ${
                      reg.masteryScore >= 75
                        ? "text-[#047857]"
                        : reg.masteryScore >= 55
                        ? "text-[#b45309]"
                        : "text-[#b91c1c]"
                    }`}
                  >
                    {reg.masteryScore}% Kuat
                  </span>
                  <span className="text-[#64748b]">
                    {reg.structuresCount} Bagian
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE REGION BANNER */}
      <div className="metis-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#eff6ff] border border-[#bfdbfe] text-[#0d6efd] flex items-center justify-center text-[20px] flex-shrink-0">
              <i className={selectedRegion.icon}></i>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[14.5px] text-[#1e293b]">
                  {selectedRegion.name} ({selectedRegion.subName})
                </span>
                <span className="text-[11px] font-medium text-[#475569] italic bg-[#f8fafc] px-2 py-0.5 rounded-[4px] border border-[#e2e8f0]">
                  {selectedRegion.latinName}
                </span>
                <span className="badge-shipped text-[10.5px]">
                  {selectedRegion.structuresCount} Struktur
                </span>
                {selectedRegion.modelUrl && (
                  <span className="bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] text-[10.5px] font-semibold px-2 py-0.5 rounded-full">
                    Model 3D Nyata (BodyParts3D)
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-[#64748b] mt-0.5">
                {selectedRegion.description}
              </p>
            </div>
          </div>

          <div className="text-right sm:text-right text-[11.5px] text-[#64748b]">
            <span className="block font-semibold text-[#1e293b]">
              Navigasi Model 3D:
            </span>
            <span>Putar (Klik Kiri) · Zoom (Scroll) · Geser (Klik Kanan)</span>
          </div>
        </div>
      </div>

      {/* MAIN 3D EXPLORER & ANATOMY INSPECTOR */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-8 metis-card p-6 flex flex-col justify-center items-center min-h-[460px]">
            <Skeleton className="w-12 h-12 rounded-full mb-3" />
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="lg:col-span-4 metis-card p-6 space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* 3D ANATOMY VIEWER (8 Kolom atau 12 Kolom saat Layar Lebar) */}
          <div
            className={`metis-card flex flex-col overflow-hidden transition-all duration-300 ${
              isFullWidth ? "lg:col-span-12" : "lg:col-span-8"
            }`}
          >
            <div className="metis-card-header">
              <div className="flex items-center gap-2">
                <i className="bi bi-box text-[#0d6efd] text-[15px]"></i>
                <h2 className="metis-card-title">
                  Visualisasi 3D: {selectedRegion.name} ({selectedRegion.subName})
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {activeStructure && (
                  <span className="bg-[#eff6ff] text-[#0d6efd] border border-[#bfdbfe] text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0d6efd] animate-pulse"></span>
                    <span>Terpilih: {activeStructure.nameIndo}</span>
                  </span>
                )}
              </div>
            </div>

            {/* 3D Canvas Container */}
            <div className="p-3 flex-1 flex flex-col min-h-[440px] sm:min-h-[500px] lg:min-h-[540px]">
              <AnatomyViewer
                structures={structures}
                selectedStructureId={selectedStructureId}
                highlightedStructureId={selectedStructureId}
                correctStructureId={null}
                incorrectStructureId={null}
                hintStructureId={null}
                onMeshClick={handleMeshClick}
                modelUrl={selectedRegion.modelUrl}
                className="flex-1"
              />
            </div>
          </div>

          {/* INSPECTOR & DAFTAR STRUKTUR ANATOMI (4 Kolom di Laptop, tersembunyi saat Layar Lebar) */}
          {!isFullWidth && (
            <div className="lg:col-span-4 metis-card flex flex-col justify-between overflow-hidden">
              <div className="metis-card-header">
                <div>
                  <h2 className="metis-card-title flex items-center gap-2">
                    <i className="bi bi-info-circle text-[#0d6efd]"></i>
                    <span>Detail & Pemeriksa Struktur</span>
                  </h2>
                  <span className="text-[11.5px] text-[#64748b]">
                    Informasi morfologis dan signifikansi klinis
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-4 overflow-y-auto">
                {activeStructure ? (
                  <div className="space-y-3.5">
                    {/* Header Detail Struktur Terpilih */}
                    <div className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[7px] space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="badge-pending text-[10px] uppercase font-bold tracking-wider">
                          {activeStructure.category}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            activeStructure.masteryStatus === "dikuasai"
                              ? "bg-[#dcfce7] text-[#166534]"
                              : activeStructure.masteryStatus === "berkembang"
                              ? "bg-[#fffbeb] text-[#b45309]"
                              : "bg-[#fee2e2] text-[#b91c1c]"
                          }`}
                        >
                          Status: {activeStructure.masteryStatus.replace("_", " ")}
                        </span>
                      </div>

                      <h3 className="text-[16px] font-bold text-[#1e293b] leading-snug">
                        {activeStructure.nameIndo}
                      </h3>
                      <p className="text-[12.5px] text-[#0d6efd] italic font-medium">
                        {activeStructure.nameLatin}
                      </p>

                      <p className="text-[12px] text-[#475569] leading-relaxed pt-1.5 border-t border-[#e2e8f0]">
                        {activeStructure.description}
                      </p>
                    </div>

                    {/* Kotak Korelasi Klinis */}
                    {activeStructure.clinicalNote && (
                      <div className="p-3.5 bg-[#eff6ff] border border-[#bfdbfe] rounded-[7px] space-y-1">
                        <div className="flex items-center gap-1.5 text-[#1e40af] font-bold text-[11.5px]">
                          <i className="bi bi-stethoscope"></i>
                          <span>Korelasi Klinis & Kasus Kedokteran:</span>
                        </div>
                        <p className="text-[12px] text-[#1e3a8a] leading-relaxed">
                          {activeStructure.clinicalNote}
                        </p>
                      </div>
                    )}

                    {/* Filter & Daftar Struktur di Regio Ini */}
                    <div className="space-y-2 pt-2 border-t border-[#f1f5f9]">
                      <div className="flex items-center justify-between">
                        <label className="text-[12px] font-bold text-[#1e293b]">
                          Struktur di {selectedRegion.subName} ({filteredStructures.length}):
                        </label>
                        <span className="text-[11px] text-[#64748b]">
                          Klik untuk menyorot
                        </span>
                      </div>

                      {/* Pencarian Struktur Cepat */}
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari struktur di regio ini..."
                          className="w-full h-[32px] px-2.5 pl-8 bg-[#f8fafc] border border-[#cbd5e1] rounded-[5px] text-[12px] text-[#1e293b] placeholder-[#64748b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
                        />
                        <i className="bi bi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748b] text-[11px]"></i>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] text-[11px]"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Kategori Filter Chips */}
                      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                        {["Semua", "organ", "vaskular", "otot", "tulang", "saraf"].map(
                          (cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-2 py-0.5 rounded-[4px] font-medium whitespace-nowrap transition capitalize ${
                                selectedCategory === cat
                                  ? "bg-[#0d6efd] text-white"
                                  : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                              }`}
                            >
                              {cat}
                            </button>
                          )
                        )}
                      </div>

                      {/* List of structures */}
                      <div className="max-h-[170px] overflow-y-auto space-y-1 pr-1">
                        {filteredStructures.map((struct) => {
                          const isSelected =
                            selectedStructureId === struct.id ||
                            selectedStructureId === struct.meshId;
                          return (
                            <button
                              key={struct.id}
                              type="button"
                              onClick={() => setSelectedStructureId(struct.id)}
                              className={`w-full text-left p-2 rounded-[5px] border transition flex items-center justify-between text-[11.5px] ${
                                isSelected
                                  ? "bg-[#eff6ff] border-[#0d6efd] text-[#0d6efd] font-semibold"
                                  : "bg-white border-[#e2e8f0] text-[#334155] hover:bg-[#f8fafc]"
                              }`}
                            >
                              <div className="min-w-0 flex-1 truncate">
                                <span className="block truncate">
                                  {struct.nameIndo}
                                </span>
                                <span className="text-[10px] text-[#64748b] italic block truncate">
                                  {struct.nameLatin}
                                </span>
                              </div>
                              <span
                                className="w-2.5 h-2.5 rounded-full ml-2 flex-shrink-0"
                                style={{ backgroundColor: struct.baseColor }}
                                title={`Warna: ${struct.category}`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#64748b] text-[12px]">
                    <i className="bi bi-hand-index text-[24px] text-[#cbd5e1] block mb-2"></i>
                    <span>Klik pada model 3D untuk melihat detail anatomi</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
