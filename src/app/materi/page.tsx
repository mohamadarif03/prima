"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { mockMaterials, MaterialItem } from "@/lib/mock-data";
import { EmptyState } from "@/components/ui/EmptyState";

type RegionFilter = "Semua" | "Caput" | "Collum" | "Thorax" | "Abdomen" | "Pelvis" | "Membrum";
type StatusFilter = "Semua" | "ready" | "processing" | "failed";

export default function MateriListPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>(mockMaterials);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>("Semua");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("Semua");

  // Dropzone drag state & file input
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Simulasi Pemrosesan AI bertahap
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(1);
  const [processingPercent, setProcessingPercent] = useState<number>(0);
  const [processingFileName, setProcessingFileName] = useState<string>("");

  // Modal Tempel Teks Manual
  const [isPasteModalOpen, setIsPasteModalOpen] = useState<boolean>(false);
  const [manualTitle, setManualTitle] = useState<string>("");
  const [manualRegion, setManualRegion] = useState<"Caput" | "Collum" | "Thorax" | "Abdomen" | "Pelvis" | "Membrum">("Thorax");
  const [manualContent, setManualContent] = useState<string>("");

  // Modal Ubah Nama
  const [editingItem, setEditingItem] = useState<MaterialItem | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>("");

  // Modal Hapus Konfirmasi
  const [deletingItem, setDeletingItem] = useState<MaterialItem | null>(null);

  // Toast Notifikasi
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Helper untuk menjalankan simulasi pemrosesan AI bertahap
  const simulateAIProcessing = (
    fileName: string,
    title: string,
    region: "Caput" | "Collum" | "Thorax" | "Abdomen" | "Pelvis" | "Membrum",
    fileSizeStr = "12.5 MB",
    isRetryForId?: string
  ) => {
    setIsProcessing(true);
    setProcessingFileName(fileName);
    setProcessingStep(1);
    setProcessingPercent(15);

    // Step 1: Membaca dokumen
    const timer1 = setTimeout(() => {
      setProcessingStep(2);
      setProcessingPercent(55);
    }, 900);

    // Step 2: Merangkum isi
    const timer2 = setTimeout(() => {
      setProcessingStep(3);
      setProcessingPercent(88);
    }, 1800);

    // Step 3: Memecah per subtopik & Finalisasi
    const timer3 = setTimeout(() => {
      setProcessingPercent(100);

      setTimeout(() => {
        setIsProcessing(false);

        if (isRetryForId) {
          // Pulihkan materi yang gagal
          setMaterials((prev) =>
            prev.map((item) => {
              if (item.id === isRetryForId) {
                return {
                  ...item,
                  status: "ready",
                  processingProgress: 100,
                  aiSummaryOverview:
                    "Berhasil diproses ulang: Rangkuman komprehensif mengenai topografi kavum pelvis, diafragma pelvis (m. levator ani), dan persarafan pleksus sakralis.",
                  subtopics: [
                    {
                      id: `${isRetryForId}-sub1`,
                      title: "Dinding dan Diafragma Pelvis",
                      latinTerm: "Diaphragma Pelvis & M. Levator Ani",
                      overview: "Dasar pelvis dibentuk oleh m. levator ani dan m. coccygeus yang menopang organ visera pelvis.",
                      keyPoints: [
                        "M. levator ani terdiri atas m. puborectalis, m. pubococcygeus, dan m. iliococcygeus.",
                        "M. puborectalis membentuk sling di sekeliling taut anorektal untuk mempertahankan kontinensia feses.",
                      ],
                      keyTerms: [
                        {
                          term: "Diafragma Pelvis",
                          latin: "Diaphragma pelvis",
                          definition: "Lantai muskular penutup cavitas pelvis inferior.",
                        },
                      ],
                      clinicalCorrelation:
                        "Kelemahan m. levator ani pascapersalinan pervaginam dapat mencetuskan prolaps organ pelvis dan inkontinensia urin.",
                    },
                  ],
                };
              }
              return item;
            })
          );
          showToast(`Materi "${fileName}" berhasil diproses ulang!`);
        } else {
          // Buat item materi baru
          const newId = `mat-${Date.now().toString().slice(-4)}`;
          const newMaterial: MaterialItem = {
            id: newId,
            title: title || fileName.replace(/\.[^/.]+$/, ""),
            region: region,
            fileName: fileName,
            fileSize: fileSizeStr,
            fileType: fileName.toLowerCase().endsWith(".pptx") || fileName.toLowerCase().endsWith(".ppt") ? "ppt" : "pdf",
            pageCount: 24,
            uploadedAt: "Baru saja",
            status: "ready",
            processingProgress: 100,
            aiSummaryOverview: `Rangkuman AI otomatis untuk materi ${title || fileName}. Isi dokumen telah diekstraksi dan dibagi menjadi subtopik relevan.`,
            subtopics: [
              {
                id: `${newId}-sub1`,
                title: "Ringkasan Konsep Utama & Morfologi",
                latinTerm: `Structura Principalis Regio ${region}`,
                overview: `Analisis teks dari berkas ${fileName} yang merinci struktur anatomis penting pada regio ${region}.`,
                keyPoints: [
                  `Identifikasi kompartemen primer dan batas-batas anatomis regio ${region}.`,
                  "Vaskularisasi regional dan korelasi jaras inervasi motorik sensorik.",
                  "Struktur pelindung dan hubungan topografis dengan organ sekitar.",
                ],
                keyTerms: [
                  {
                    term: `Organ Primer ${region}`,
                    latin: `Organa Regionalis ${region}`,
                    definition: `Kumpulan struktur fungsional utama pada regio ${region}.`,
                  },
                ],
                clinicalCorrelation: "Pemeriksaan fisis dan pemahaman batas orientasi klinis esensial untuk diagnosis banding.",
              },
            ],
            previewPages: [
              {
                pageNumber: 1,
                sectionTitle: "Halaman 1: Dokumen Asli Mahasiswa",
                previewSnippet: `Cuplikan materi ${fileName} yang berhasil diekstraksi secara lokal oleh PRIMA AI.`,
              },
            ],
          };

          setMaterials((prev) => [newMaterial, ...prev]);
          showToast(`Materi "${newMaterial.title}" berhasil dirangkum oleh AI!`);
        }
      }, 400);
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  // Validasi Berkas
  const handleValidateAndUpload = (file: File) => {
    setUploadError(null);

    // Validasi tipe berkas
    const validExtensions = [".pdf", ".ppt", ".pptx"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      setUploadError("Format berkas tidak didukung. Mohon unggah berkas PDF atau presentasi PPT/PPTX.");
      return;
    }

    // Validasi ukuran berkas (maks 20 MB)
    const maxBytes = 20 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError(`Ukuran berkas (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimum 20 MB.`);
      return;
    }

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

    simulateAIProcessing(file.name, cleanTitle, "Thorax", sizeStr);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleValidateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleValidateAndUpload(e.target.files[0]);
    }
  };

  // Submit Tempel Teks Manual
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) {
      alert("Mohon masukkan judul materi");
      return;
    }
    if (!manualContent.trim() || manualContent.trim().length < 20) {
      alert("Mohon masukkan teks materi minimal 20 karakter agar AI dapat merangkumnya.");
      return;
    }

    setIsPasteModalOpen(false);
    simulateAIProcessing(`Catatan-${manualTitle.replace(/\s+/g, "-")}.pdf`, manualTitle, manualRegion, "1.2 MB");

    setManualTitle("");
    setManualContent("");
  };

  // Ubah Nama Submit
  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingTitle.trim()) return;

    setMaterials((prev) =>
      prev.map((item) => (item.id === editingItem.id ? { ...item, title: editingTitle.trim() } : item))
    );
    showToast(`Nama materi berhasil diperbarui menjadi "${editingTitle.trim()}".`);
    setEditingItem(null);
  };

  // Hapus Materi Submit
  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    setMaterials((prev) => prev.filter((item) => item.id !== deletingItem.id));
    showToast(`Materi "${deletingItem.title}" telah dihapus.`);
    setDeletingItem(null);
  };

  // Retry Pemrosesan Gagal
  const handleRetryProcessing = (item: MaterialItem) => {
    simulateAIProcessing(item.fileName, item.title, item.region, item.fileSize, item.id);
  };

  // Filtered Materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      // Filter search
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.region.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter region
      const matchesRegion = selectedRegion === "Semua" || item.region === selectedRegion;

      // Filter status
      const matchesStatus = selectedStatus === "Semua" || item.status === selectedStatus;

      return matchesSearch && matchesRegion && matchesStatus;
    });
  }, [materials, searchQuery, selectedRegion, selectedStatus]);

  // Status Counts
  const readyCount = materials.filter((m) => m.status === "ready").length;
  const processingCount = materials.filter((m) => m.status === "processing").length;
  const failedCount = materials.filter((m) => m.status === "failed").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-[#1e293b] text-white px-4 py-3 rounded-[8px] shadow-lg flex items-center gap-2.5 text-[13px] border border-[#334155] animate-fade-in"
        >
          <i className="bi bi-check-circle-fill text-[#10b981] text-[16px]"></i>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#94a3b8] hover:text-white"
            aria-label="Tutup notifikasi"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[12px] font-semibold text-[#64748b] uppercase tracking-wider">
              PRIMA · Kurikulum Anatomi
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#0d6efd] font-bold border border-[#bfdbfe]">
              Fitur AI (F3)
            </span>
          </div>
          <h1 className="text-[22px] sm:text-[26px] font-bold text-[#1e293b] tracking-tight">
            Materi Kuliah & Rangkuman AI
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#64748b] mt-0.5">
            Unggah slide atau diktat kedokteran; AI merangkum intisari, istilah Latin, dan membaginya per subtopik.
          </p>
        </div>

        {/* STAT MINI */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 bg-white border border-[#e2e8f0] rounded-[6px] text-center shadow-xs">
            <span className="text-[11px] text-[#64748b] block">Total Dokumen</span>
            <span className="text-[15px] font-bold text-[#1e293b]">{materials.length} Berkas</span>
          </div>
          <div className="px-3 py-1.5 bg-[#eff6ff] border border-[#bfdbfe] rounded-[6px] text-center shadow-xs">
            <span className="text-[11px] text-[#0d6efd] block font-medium">Siap Dipelajari</span>
            <span className="text-[15px] font-bold text-[#0d6efd]">{readyCount} Rangkuman</span>
          </div>
        </div>
      </div>

      {/* PRIVACY & DISCLAIMER BANNER */}
      <div className="mb-6 p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#eff6ff] text-[#0d6efd] flex items-center justify-center flex-shrink-0">
            <i className="bi bi-shield-check text-[16px]"></i>
          </div>
          <div>
            <div className="text-[12.5px] font-bold text-[#1e293b] flex items-center gap-1.5">
              <span>Materi hanya dapat diakses olehmu</span>
              <span className="text-[10.5px] text-[#64748b] font-normal">· Ruang Belajar Pribadi</span>
            </div>
            <p className="text-[11.5px] text-[#64748b]">
              PRIMA menjaga privasi diktat dan slide kuliahmu. Rangkuman dibuat oleh AI dan bisa mengandung kesalahan; selalu periksa dengan sumber utama.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] px-2 py-1 bg-white border border-[#cbd5e1] rounded text-[#475569] font-medium">
            <i className="bi bi-file-earmark-lock me-1 text-[#0d6efd]"></i>
            Terenkripsi Lokal
          </span>
        </div>
      </div>

      {/* DROPZONE UNGGAH & TEMPEL TEKS MANUAL */}
      <div className="mb-7 bg-white border border-[#e2e8f0] rounded-[8px] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-bold text-[#1e293b] flex items-center gap-2">
            <i className="bi bi-cloud-arrow-up text-[#0d6efd] text-[16px]"></i>
            <span>Unggah Materi Kuliah Baru</span>
          </h2>
          <button
            type="button"
            onClick={() => setIsPasteModalOpen(true)}
            className="text-[12.5px] font-medium text-[#0d6efd] hover:text-[#0b5ed7] flex items-center gap-1.5 px-3 py-1 rounded-[6px] hover:bg-[#eff6ff] border border-transparent hover:border-[#bfdbfe] transition"
          >
            <i className="bi bi-clipboard-plus"></i>
            <span>Tempel Teks Manual</span>
          </button>
        </div>

        {/* Area Drag and Drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`border-2 border-dashed rounded-[8px] p-6 sm:p-8 text-center cursor-pointer transition ${
            isDragging
              ? "border-[#0d6efd] bg-[#eff6ff]"
              : "border-[#cbd5e1] bg-[#f8fafc] hover:bg-[#f1f5f9] hover:border-[#94a3b8]"
          }`}
          aria-label="Zona unggah berkas: klik atau seret berkas PDF atau PPT ke sini"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.ppt,.pptx"
            className="hidden"
            onChange={handleFileInputChange}
          />
          <div className="w-12 h-12 rounded-full bg-white border border-[#e2e8f0] text-[#0d6efd] flex items-center justify-center mx-auto mb-3 shadow-xs text-[22px]">
            <i className="bi bi-file-earmark-arrow-up"></i>
          </div>
          <p className="text-[14px] font-bold text-[#1e293b] mb-1">
            Tarik & lepaskan berkas ke sini, atau <span className="text-[#0d6efd] underline">pilih berkas</span>
          </p>
          <p className="text-[12px] text-[#64748b]">
            Mendukung format <strong>PDF, PPT, PPTX</strong> (maksimum 20 MB per berkas)
          </p>
        </div>

        {/* Pesan Validasi Galat */}
        {uploadError && (
          <div
            role="alert"
            className="mt-3 p-3 bg-[#fef2f2] border border-[#fecaca] rounded-[6px] flex items-center gap-2.5 text-[12.5px] text-[#dc2626]"
          >
            <i className="bi bi-exclamation-triangle-fill flex-shrink-0 text-[15px]"></i>
            <span>{uploadError}</span>
            <button
              onClick={() => setUploadError(null)}
              className="ml-auto text-[#dc2626] hover:text-[#991b1b]"
              aria-label="Tutup pesan galat"
            >
              <i className="bi bi-x text-[16px]"></i>
            </button>
          </div>
        )}

        {/* SIMULASI PROSES BERTAPAP AI (Overlay / Inline Banner) */}
        {isProcessing && (
          <div className="mt-4 p-4 bg-[#eff6ff] border border-[#bfdbfe] rounded-[8px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 border-2 border-[#0d6efd] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[13px] font-bold text-[#1e293b]">
                  Memproses &ldquo;{processingFileName}&rdquo; dengan AI...
                </span>
              </div>
              <span className="text-[12px] font-bold text-[#0d6efd]">{processingPercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#dbeafe] h-2 rounded-full overflow-hidden mb-3">
              <div
                className="bg-[#0d6efd] h-2 rounded-full transition-all duration-300"
                style={{ width: `${processingPercent}%` }}
              ></div>
            </div>

            {/* 3 Step Indicator */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11.5px]">
              <div
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] ${
                  processingStep >= 1 ? "bg-white font-semibold text-[#0d6efd] shadow-xs" : "text-[#64748b]"
                }`}
              >
                <i
                  className={
                    processingStep > 1
                      ? "bi bi-check-circle-fill text-[#10b981]"
                      : "bi bi-1-circle-fill text-[#0d6efd]"
                  }
                ></i>
                <span>1. Membaca dokumen...</span>
              </div>
              <div
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] ${
                  processingStep >= 2 ? "bg-white font-semibold text-[#0d6efd] shadow-xs" : "text-[#64748b]"
                }`}
              >
                <i
                  className={
                    processingStep > 2
                      ? "bi bi-check-circle-fill text-[#10b981]"
                      : processingStep === 2
                      ? "bi bi-2-circle-fill text-[#0d6efd]"
                      : "bi bi-circle text-[#94a3b8]"
                  }
                ></i>
                <span>2. Merangkum isi...</span>
              </div>
              <div
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] ${
                  processingStep >= 3 ? "bg-white font-semibold text-[#0d6efd] shadow-xs" : "text-[#64748b]"
                }`}
              >
                <i
                  className={
                    processingStep === 3 ? "bi bi-3-circle-fill text-[#0d6efd]" : "bi bi-circle text-[#94a3b8]"
                  }
                ></i>
                <span>3. Memecah per subtopik...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FILTER & PENCARIAN */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Input Pencarian */}
        <div className="relative flex-1 max-w-md">
          <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[13px]"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi kuliah, topik, atau nama berkas..."
            className="w-full pl-9 pr-8 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd] focus:ring-1 focus:ring-[#0d6efd] placeholder-[#94a3b8]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
              aria-label="Bersihkan pencarian"
            >
              <i className="bi bi-x-circle-fill text-[13px]"></i>
            </button>
          )}
        </div>

        {/* Filter Regio Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
          <span className="text-[12px] text-[#64748b] font-medium mr-1 flex-shrink-0">Regio:</span>
          {(["Semua", "Caput", "Collum", "Thorax", "Abdomen", "Pelvis", "Membrum"] as RegionFilter[]).map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-2.5 py-1 text-[11.5px] rounded-[6px] font-medium transition flex-shrink-0 ${
                selectedRegion === reg
                  ? "bg-[#0d6efd] text-white shadow-xs"
                  : "bg-white text-[#475569] border border-[#cbd5e1] hover:bg-[#f8fafc]"
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-[12px] text-[#64748b] font-medium mr-1">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as StatusFilter)}
            className="px-2.5 py-1.5 bg-white border border-[#cbd5e1] rounded-[6px] text-[12px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd]"
          >
            <option value="Semua">Semua Status ({materials.length})</option>
            <option value="ready">Siap ({readyCount})</option>
            <option value="processing">Memproses ({processingCount})</option>
            <option value="failed">Gagal ({failedCount})</option>
          </select>
        </div>
      </div>

      {/* DAFTAR KARTU MATERI */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-8">
          <EmptyState
            title="Tidak Ada Materi Ditemukan"
            description="Tidak ada dokumen yang sesuai dengan pencarian atau filter yang dipilih. Coba reset filter atau unggah berkas materi baru."
            action={
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRegion("Semua");
                  setSelectedStatus("Semua");
                }}
                className="px-3.5 py-1.5 bg-[#0d6efd] text-white text-[12px] font-semibold rounded-[6px] hover:bg-[#0b5ed7] transition"
              >
                Reset Semua Filter
              </button>
            }
            icon={<i className="bi bi-file-earmark-x text-[28px] text-[#94a3b8]"></i>}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredMaterials.map((item) => {
            const isReady = item.status === "ready";
            const isProcessingItem = item.status === "processing";
            const isFailed = item.status === "failed";

            return (
              <div
                key={item.id}
                className="metis-card p-5 flex flex-col justify-between hover:border-[#cbd5e1] transition group relative bg-white"
              >
                <div>
                  {/* Top Bar Card: Regio + Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d6efd] bg-[#eff6ff] px-2 py-0.5 rounded-[4px] border border-[#bfdbfe]">
                      Regio {item.region}
                    </span>

                    {/* Status Badge */}
                    {isReady && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#166534] bg-[#dcfce7] px-2 py-0.5 rounded-full">
                        <i className="bi bi-check-circle-fill text-[11px]"></i>
                        <span>Siap ({item.subtopics.length} Subtopik)</span>
                      </span>
                    )}
                    {isProcessingItem && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1e40af] bg-[#dbeafe] px-2 py-0.5 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-ping"></span>
                        <span>Memproses AI ({item.processingProgress || 65}%)</span>
                      </span>
                    )}
                    {isFailed && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#991b1b] bg-[#fee2e2] px-2 py-0.5 rounded-full">
                        <i className="bi bi-exclamation-triangle-fill text-[11px]"></i>
                        <span>Gagal Diproses</span>
                      </span>
                    )}
                  </div>

                  {/* Judul Materi */}
                  <h3 className="text-[15px] font-bold text-[#1e293b] leading-snug mb-1.5 group-hover:text-[#0d6efd] transition">
                    {item.title}
                  </h3>

                  {/* Metadata Berkas */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-[11.5px] text-[#64748b] mb-3">
                    <span className="flex items-center gap-1">
                      <i
                        className={
                          item.fileType === "pdf"
                            ? "bi bi-file-earmark-pdf-fill text-[#dc2626]"
                            : "bi bi-file-earmark-ppt-fill text-[#ea580c]"
                        }
                      ></i>
                      <span className="truncate max-w-[140px]" title={item.fileName}>
                        {item.fileName}
                      </span>
                    </span>
                    <span>·</span>
                    <span>{item.pageCount} halaman</span>
                    <span>·</span>
                    <span>{item.fileSize}</span>
                    <span>·</span>
                    <span>{item.uploadedAt}</span>
                  </div>

                  {/* Ringkasan Singkat / Status Alert */}
                  {isReady && item.aiSummaryOverview && (
                    <p className="text-[12px] text-[#475569] line-clamp-2 mb-4 bg-[#f8fafc] p-2.5 rounded-[6px] border border-[#e2e8f0]">
                      {item.aiSummaryOverview}
                    </p>
                  )}

                  {isProcessingItem && (
                    <div className="mb-4 bg-[#eff6ff] p-2.5 rounded-[6px] border border-[#bfdbfe]">
                      <div className="text-[11.5px] text-[#1e40af] font-medium mb-1.5 flex items-center justify-between">
                        <span>Sedang mengekstrak istilah medis...</span>
                        <span>{item.processingProgress || 65}%</span>
                      </div>
                      <div className="w-full bg-[#bfdbfe] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2563eb] h-1.5 rounded-full"
                          style={{ width: `${item.processingProgress || 65}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {isFailed && (
                    <div className="mb-4 bg-[#fef2f2] p-2.5 rounded-[6px] border border-[#fecaca] text-[12px] text-[#991b1b] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <i className="bi bi-x-circle-fill text-[#dc2626]"></i>
                        <span>Ekstraksi gagal</span>
                      </div>
                      <button
                        onClick={() => handleRetryProcessing(item)}
                        className="px-2.5 py-1 bg-white hover:bg-[#fee2e2] text-[#dc2626] border border-[#fca5a5] rounded text-[11px] font-bold transition flex items-center gap-1"
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                        <span>Coba lagi</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="pt-3 border-t border-[#f1f5f9] flex flex-col gap-2">
                  {/* Primary actions if ready */}
                  {isReady ? (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/materi/${item.id}`}
                        className="flex-1 h-[32px] px-3 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12px] font-semibold rounded-[6px] flex items-center justify-center gap-1.5 transition shadow-xs"
                      >
                        <i className="bi bi-book-half"></i>
                        <span>Lihat Rangkuman</span>
                      </Link>
                      <Link
                        href={`/latihan-materials?materi=${item.id}`}
                        title="Buat Latihan Soal dari materi ini"
                        className="h-[32px] px-2.5 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#475569] text-[12px] font-medium rounded-[6px] flex items-center justify-center gap-1 transition"
                      >
                        <i className="bi bi-question-circle text-[#0d6efd]"></i>
                        <span className="hidden sm:inline">Buat Soal</span>
                      </Link>
                      <Link
                        href={`/flashcard?materi=${item.id}`}
                        title="Buat Flashcard dari istilah materi ini"
                        className="h-[32px] px-2.5 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#475569] text-[12px] font-medium rounded-[6px] flex items-center justify-center gap-1 transition"
                      >
                        <i className="bi bi-card-heading text-[#16a34a]"></i>
                        <span className="hidden sm:inline">Flashcard</span>
                      </Link>
                    </div>
                  ) : isProcessingItem ? (
                    <button
                      disabled
                      className="w-full h-[32px] bg-[#f1f5f9] text-[#94a3b8] text-[12px] font-medium rounded-[6px] flex items-center justify-center gap-1.5 cursor-not-allowed"
                    >
                      <span className="w-3.5 h-3.5 border-2 border-[#94a3b8] border-t-transparent rounded-full animate-spin"></span>
                      <span>Sedang Merangkum...</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRetryProcessing(item)}
                      className="w-full h-[32px] bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12px] font-semibold rounded-[6px] flex items-center justify-center gap-1.5 transition"
                    >
                      <i className="bi bi-arrow-clockwise"></i>
                      <span>Proses Ulang Dokumen</span>
                    </button>
                  )}

                  {/* Secondary Edit / Delete */}
                  <div className="flex items-center justify-end gap-3 text-[11.5px] text-[#64748b] pt-1">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setEditingTitle(item.title);
                      }}
                      className="hover:text-[#0d6efd] flex items-center gap-1 transition"
                    >
                      <i className="bi bi-pencil"></i>
                      <span>Ubah nama</span>
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="hover:text-[#dc2626] flex items-center gap-1 transition"
                    >
                      <i className="bi bi-trash"></i>
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL TEMPEL TEKS MANUAL */}
      {isPasteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-xl max-w-lg w-full p-5 sm:p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] mb-4">
              <div className="flex items-center gap-2">
                <i className="bi bi-clipboard-plus text-[#0d6efd] text-[18px]"></i>
                <h3 className="text-[15px] font-bold text-[#1e293b]">Tempel Catatan Kuliah Manual</h3>
              </div>
              <button
                onClick={() => setIsPasteModalOpen(false)}
                className="text-[#94a3b8] hover:text-[#475569]"
                aria-label="Tutup modal"
              >
                <i className="bi bi-x-lg text-[14px]"></i>
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#1e293b] mb-1">
                  Judul Materi / Topik Kuliah <span className="text-[#dc2626]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Contoh: Histologi Miokardium & Katup Jantung"
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1e293b] mb-1">
                  Regio Anatomi <span className="text-[#dc2626]">*</span>
                </label>
                <select
                  value={manualRegion}
                  onChange={(e) =>
                    setManualRegion(
                      e.target.value as "Caput" | "Collum" | "Thorax" | "Abdomen" | "Pelvis" | "Membrum"
                    )
                  }
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd]"
                >
                  <option value="Caput">Caput (Kepala)</option>
                  <option value="Collum">Collum (Leher)</option>
                  <option value="Thorax">Thorax (Dada)</option>
                  <option value="Abdomen">Abdomen (Perut)</option>
                  <option value="Pelvis">Pelvis (Panggul)</option>
                  <option value="Membrum">Membrum (Anggota Gerak)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1e293b] mb-1">
                  Teks Catatan / Slide Kuliah <span className="text-[#dc2626]">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder="Salin dan tempel catatan dosen, poin presentasi, atau rangkuman pribadi di sini..."
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd] placeholder-[#94a3b8]"
                />
                <span className="text-[11px] text-[#64748b] block mt-1">
                  Panjang karakter: {manualContent.length} (minimal 20 karakter)
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasteModalOpen(false)}
                  className="px-3.5 py-1.5 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#475569] rounded-[6px] text-[12.5px] font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded-[6px] text-[12.5px] font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <i className="bi bi-stars"></i>
                  <span>Rangkum dengan AI</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL UBAH NAMA */}
      {editingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-xl max-w-md w-full p-5 animate-scale-up">
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-3">Ubah Nama Materi</h3>
            <form onSubmit={handleSaveRename} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#64748b] mb-1">
                  Nama Dokumen / Judul Materi
                </label>
                <input
                  type="text"
                  required
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd]"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 bg-white border border-[#cbd5e1] text-[#475569] rounded-[6px] text-[12px] font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white rounded-[6px] text-[12px] font-semibold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS KONFIRMASI */}
      {deletingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-xl max-w-sm w-full p-5 text-center animate-scale-up">
            <div className="w-11 h-11 rounded-full bg-[#fee2e2] text-[#dc2626] flex items-center justify-center mx-auto mb-3 text-[18px]">
              <i className="bi bi-trash-fill"></i>
            </div>
            <h3 className="text-[15px] font-bold text-[#1e293b] mb-1">Hapus Materi Ini?</h3>
            <p className="text-[12.5px] text-[#64748b] mb-4">
              Materi &ldquo;<strong>{deletingItem.title}</strong>&rdquo; dan rangkuman AI-nya akan dihapus dari daftar lokal.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-3.5 py-1.5 bg-white border border-[#cbd5e1] text-[#475569] rounded-[6px] text-[12.5px] font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-[6px] text-[12.5px] font-semibold shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
