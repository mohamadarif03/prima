"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { mockMaterials, MaterialItem, MaterialSubtopic } from "@/lib/mock-data";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MateriDetailPage() {
  const params = useParams();
  const materialId = params?.id as string;

  // Temukan materi dari mock data
  const material = useMemo(() => {
    return mockMaterials.find((m) => m.id === materialId) || null;
  }, [materialId]);

  // State Akordeon Subtopik (set id subtopik yang terbuka)
  const [openSubtopics, setOpenSubtopics] = useState<Record<string, boolean>>({
    "sub-01-1": true,
    "sub-01-2": true,
    "sub-02-1": true,
    "sub-02-2": true,
    "sub-03-1": true,
  });

  // State Halaman Pratinjau Dokumen
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState<number>(0);

  // State Dialog Laporkan Kesalahan
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportCategory, setReportCategory] = useState<string>("Fakta anatomi tidak akurat");
  const [reportNotes, setReportNotes] = useState<string>("");

  // Toast Notifikasi
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Toggle Subtopik Akordeon
  const toggleSubtopic = (subId: string) => {
    setOpenSubtopics((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  // Buka / Tutup Semua Subtopik
  const handleToggleAll = (expand: boolean) => {
    if (!material) return;
    const newState: Record<string, boolean> = {};
    material.subtopics.forEach((s) => {
      newState[s.id] = expand;
    });
    setOpenSubtopics(newState);
  };

  // Salin Rangkuman Subtopik
  const handleCopySubtopic = (sub: MaterialSubtopic) => {
    const textToCopy = `=== ${sub.title} (${sub.latinTerm}) ===\n\n${sub.overview}\n\nPoin Utama:\n${sub.keyPoints
      .map((p) => `• ${p}`)
      .join("\n")}\n\nIstilah Kunci:\n${sub.keyTerms
      .map((k) => `• ${k.term} (${k.latin}): ${k.definition}`)
      .join("\n")}${
      sub.clinicalCorrelation ? `\n\nKorelasi Klinis:\n${sub.clinicalCorrelation}` : ""
    }\n\n[Dibuat oleh PRIMA AI - Periksa dengan sumber utama]`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
      showToast(`Rangkuman "${sub.title}" berhasil disalin ke clipboard!`);
    } else {
      showToast(`Rangkuman disalin!`);
    }
  };

  // Submit Laporan Kesalahan
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsReportModalOpen(false);
    setReportNotes("");
    showToast("Terima kasih! Laporan kesalahan materi telah kami catat untuk validasi dokter.");
  };

  if (!material) {
    return (
      <div className="p-6 max-w-4xl mx-auto min-h-screen">
        <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-8 mt-6">
          <EmptyState
            title="Materi Tidak Ditemukan"
            description="Materi kuliah dengan ID tersebut tidak ditemukan di basis data lokal PRIMA."
            action={
              <Link
                href="/materi"
                className="px-3.5 py-1.5 bg-[#0d6efd] text-white text-[12px] font-semibold rounded-[6px] hover:bg-[#0b5ed7] transition inline-block"
              >
                Kembali ke Daftar Materi
              </Link>
            }
            icon={<i className="bi bi-file-earmark-x text-[28px] text-[#94a3b8]"></i>}
          />
        </div>
      </div>
    );
  }

  const previewPages = material.previewPages || [];
  const currentPreviewPage = previewPages[currentPreviewIndex] || null;

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

      {/* NAVIGASI KEMBALI & BREADCRUMB */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[12.5px] text-[#64748b]">
          <Link
            href="/materi"
            className="inline-flex items-center gap-1.5 text-[#0d6efd] hover:text-[#0b5ed7] font-medium transition"
          >
            <i className="bi bi-arrow-left"></i>
            <span>Kembali ke Daftar Materi</span>
          </Link>
          <span>/</span>
          <span>Regio {material.region}</span>
          <span>/</span>
          <span className="text-[#1e293b] font-medium truncate max-w-[220px]">{material.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="h-[30px] px-2.5 bg-white hover:bg-[#fef2f2] border border-[#cbd5e1] hover:border-[#fca5a5] text-[#64748b] hover:text-[#dc2626] text-[11.5px] font-medium rounded-[6px] flex items-center gap-1.5 transition"
            title="Laporkan ketidaksesuaian isi atau istilah Latin"
          >
            <i className="bi bi-flag"></i>
            <span>Laporkan Kesalahan</span>
          </button>
        </div>
      </div>

      {/* HEADER UTAMA MATERI */}
      <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-5 sm:p-6 mb-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d6efd] bg-[#eff6ff] px-2 py-0.5 rounded-[4px] border border-[#bfdbfe]">
                Regio {material.region}
              </span>
              <span className="text-[11px] font-bold text-[#166534] bg-[#dcfce7] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <i className="bi bi-stars text-[#16a34a]"></i>
                Rangkuman AI Terverifikasi
              </span>
              <span className="text-[11px] text-[#64748b]">· Diunggah {material.uploadedAt}</span>
            </div>

            <h1 className="text-[20px] sm:text-[24px] font-bold text-[#1e293b] tracking-tight mb-2">
              {material.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[12px] text-[#64748b]">
              <span className="flex items-center gap-1.5">
                <i
                  className={
                    material.fileType === "pdf"
                      ? "bi bi-file-earmark-pdf-fill text-[#dc2626]"
                      : "bi bi-file-earmark-ppt-fill text-[#ea580c]"
                  }
                ></i>
                <span className="font-medium text-[#1e293b]">{material.fileName}</span>
              </span>
              <span>·</span>
              <span>{material.pageCount} Halaman</span>
              <span>·</span>
              <span>{material.fileSize}</span>
              <span>·</span>
              <span className="text-[#0d6efd] font-medium">
                {material.subtopics.length} Subtopik Terstruktur
              </span>
            </div>
          </div>

          {/* AKSI PINTAS CEPAT (Header Right) */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Link
              href={`/latihan-materials?materi=${material.id}`}
              className="h-[36px] px-3.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12.5px] font-semibold rounded-[6px] flex items-center gap-1.5 shadow-xs transition"
            >
              <i className="bi bi-question-circle"></i>
              <span>Buat Latihan Soal</span>
            </Link>
            <Link
              href={`/flashcard?materi=${material.id}`}
              className="h-[36px] px-3.5 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#1e293b] text-[12.5px] font-semibold rounded-[6px] flex items-center gap-1.5 transition"
            >
              <i className="bi bi-card-heading text-[#16a34a]"></i>
              <span>Buat Flashcard</span>
            </Link>
            <Link
              href="/latihan"
              className="h-[36px] px-3 bg-[#f8fafc] hover:bg-[#eff6ff] border border-[#cbd5e1] text-[#0d6efd] text-[12.5px] font-semibold rounded-[6px] flex items-center gap-1.5 transition"
              title="Eksplorasi visualisasi 3D terkait"
            >
              <i className="bi bi-box-seam"></i>
              <span className="hidden sm:inline">Lihat di 3D</span>
            </Link>
          </div>
        </div>

        {/* OVERVIEW AI BOX */}
        {material.aiSummaryOverview && (
          <div className="mt-4 p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] flex items-start gap-2.5">
            <i className="bi bi-lightbulb-fill text-[#f59e0b] text-[16px] mt-0.5 flex-shrink-0"></i>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block mb-0.5">
                Intisari Materi oleh AI
              </span>
              <p className="text-[12.5px] text-[#334155] leading-relaxed">
                {material.aiSummaryOverview}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* KONTEN UTAMA: 2 KOLOM (Kiri Rangkuman Subtopik, Kanan Pratinjau Dokumen & Aksi) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ==================================================== */}
        {/* KOLOM KIRI (7/12 desktop): RANGKUMAN SUBTOPIK AKORDEON */}
        {/* ==================================================== */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Header Bar Akordeon */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-[8px] border border-[#e2e8f0]">
            <div className="flex items-center gap-2">
              <i className="bi bi-list-nested text-[#0d6efd] text-[16px]"></i>
              <h2 className="text-[14px] font-bold text-[#1e293b]">
                Rangkuman Per Subtopik ({material.subtopics.length})
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[11.5px]">
              <button
                onClick={() => handleToggleAll(true)}
                className="text-[#0d6efd] hover:underline font-medium"
              >
                Buka Semua
              </button>
              <span className="text-[#cbd5e1]">|</span>
              <button
                onClick={() => handleToggleAll(false)}
                className="text-[#64748b] hover:underline font-medium"
              >
                Tutup Semua
              </button>
            </div>
          </div>

          {/* List Subtopik Akordeon */}
          {material.subtopics.length === 0 ? (
            <div className="bg-white p-6 rounded-[8px] border border-[#e2e8f0] text-center text-[#64748b] text-[13px]">
              Belum ada subtopik yang diekstrak untuk materi ini.
            </div>
          ) : (
            material.subtopics.map((sub, idx) => {
              const isOpen = !!openSubtopics[sub.id];

              return (
                <div
                  key={sub.id}
                  className="bg-white border border-[#e2e8f0] rounded-[8px] overflow-hidden transition shadow-xs"
                >
                  {/* Header Subtopik Klik */}
                  <button
                    type="button"
                    onClick={() => toggleSubtopic(sub.id)}
                    aria-expanded={isOpen}
                    className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#f8fafc] transition border-b border-transparent focus:outline-none"
                    style={{ borderBottomColor: isOpen ? "#f1f5f9" : "transparent" }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#eff6ff] text-[#0d6efd] font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="text-[14.5px] font-bold text-[#1e293b] leading-snug">
                          {sub.title}
                        </h3>
                        <span className="text-[12px] text-[#64748b] italic block mt-0.5">
                          {sub.latinTerm}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <span className="text-[11px] text-[#64748b] hidden sm:inline">
                        {sub.keyPoints.length} poin
                      </span>
                      <i
                        className={`bi bi-chevron-down text-[#64748b] text-[13px] transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#0d6efd]" : ""
                        }`}
                      ></i>
                    </div>
                  </button>

                  {/* Isi Subtopik Terbuka */}
                  {isOpen && (
                    <div className="px-5 py-4 space-y-4 text-[13px] text-[#334155] animate-fade-in bg-white">
                      {/* Overview Singkat */}
                      <p className="text-[13px] text-[#475569] leading-relaxed bg-[#f8fafc] p-3 rounded-[6px] border border-[#e2e8f0]">
                        {sub.overview}
                      </p>

                      {/* Poin-poin Utama */}
                      <div>
                        <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#1e293b] mb-2 flex items-center gap-1.5">
                          <i className="bi bi-check2-circle text-[#0d6efd]"></i>
                          <span>Poin Pembahasan Utama</span>
                        </h4>
                        <ul className="space-y-2 pl-1">
                          {sub.keyPoints.map((pt, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2.5 leading-relaxed">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0d6efd] mt-2 flex-shrink-0"></span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Istilah Kunci Disorot */}
                      {sub.keyTerms && sub.keyTerms.length > 0 && (
                        <div>
                          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#1e293b] mb-2 flex items-center gap-1.5">
                            <i className="bi bi-bookmark-star text-[#f59e0b]"></i>
                            <span>Istilah Kunci Anatomi</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {sub.keyTerms.map((term, tIdx) => (
                              <div
                                key={tIdx}
                                className="p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] hover:border-[#cbd5e1] transition"
                              >
                                <div className="flex items-baseline justify-between gap-1 mb-1">
                                  <strong className="text-[12.5px] font-bold text-[#1e293b]">
                                    {term.term}
                                  </strong>
                                  <span className="text-[11px] text-[#0d6efd] italic font-medium">
                                    {term.latin}
                                  </span>
                                </div>
                                <p className="text-[11.5px] text-[#64748b] leading-snug">
                                  {term.definition}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Korelasi Klinis */}
                      {sub.clinicalCorrelation && (
                        <div className="p-3 bg-[#fffbeb] border border-[#fef3c7] rounded-[6px] flex items-start gap-2.5 text-[#92400e]">
                          <i className="bi bi-heart-pulse-fill text-[16px] text-[#d97706] mt-0.5 flex-shrink-0"></i>
                          <div>
                            <strong className="text-[11.5px] uppercase font-bold tracking-wide block mb-0.5">
                              Relevansi Klinis
                            </strong>
                            <p className="text-[12px] leading-relaxed">
                              {sub.clinicalCorrelation}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Tombol Aksi Subtopik */}
                      <div className="pt-3 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopySubtopic(sub)}
                          className="h-[30px] px-3 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#475569] text-[11.5px] font-medium rounded-[6px] flex items-center gap-1.5 transition"
                        >
                          <i className="bi bi-clipboard"></i>
                          <span>Salin Rangkuman Subtopik</span>
                        </button>

                        <Link
                          href={`/latihan-materials?materi=${material.id}&subtopic=${sub.id}`}
                          className="h-[30px] px-3 bg-[#eff6ff] hover:bg-[#dbeafe] text-[#0d6efd] text-[11.5px] font-semibold rounded-[6px] flex items-center gap-1.5 transition"
                        >
                          <i className="bi bi-question-circle-fill"></i>
                          <span>Buat Soal dari Bagian Ini</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* AI NOTE FOOTER */}
          <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] text-center text-[11.5px] text-[#64748b]">
            <i className="bi bi-info-circle me-1.5 text-[#0d6efd]"></i>
            Dibuat oleh AI dan bisa mengandung kesalahan. Periksa dengan sumber utama (buku teks dan materi kuliah dosen).
          </div>
        </div>

        {/* ==================================================== */}
        {/* KOLOM KANAN (5/12 desktop): PRATINJAU DOKUMEN & AKSI */}
        {/* ==================================================== */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* KARTU PRATINJAU DOKUMEN ASLI */}
          <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] mb-3">
              <div className="flex items-center gap-2">
                <i className="bi bi-file-earmark-text text-[#0d6efd] text-[16px]"></i>
                <h3 className="text-[13.5px] font-bold text-[#1e293b]">Pratinjau Dokumen Asli</h3>
              </div>
              <span className="text-[11px] font-semibold text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded">
                {previewPages.length > 0
                  ? `Hal ${currentPreviewPage?.pageNumber || 1} / ${material.pageCount}`
                  : `${material.pageCount} Hal`}
              </span>
            </div>

            {/* Viewer Placeholder Layar Dokumen */}
            <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-[6px] p-4 min-h-[260px] flex flex-col justify-between mb-3 relative overflow-hidden">
              {/* Header Dokumen Mock */}
              <div className="border-b border-[#e2e8f0] pb-2 mb-2 flex items-center justify-between text-[11px] text-[#64748b]">
                <span className="truncate max-w-[180px] font-medium text-[#1e293b]">
                  {currentPreviewPage?.sectionTitle || material.fileName}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#0d6efd]">
                  Slide / Hal {currentPreviewPage?.pageNumber || 1}
                </span>
              </div>

              {/* Teks Cuplikan Dokumen */}
              <div className="flex-1 text-[12px] text-[#334155] leading-relaxed py-2">
                <p>
                  {currentPreviewPage?.previewSnippet ||
                    "Memuat cuplikan dokumen kuliah dari arsip berkas mahasiswa..."}
                </p>
                <div className="mt-3 p-2 bg-white/70 border border-[#e2e8f0] rounded text-[11px] text-[#64748b] italic">
                  [Tampilan halaman disederhanakan untuk kebutuhan demo aplikasi PRIMA]
                </div>
              </div>

              {/* Footer Dokumen Mock */}
              <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-[10.5px] text-[#94a3b8]">
                <span>PRIMA Reader Engine v1.1</span>
                <span>{material.fileName}</span>
              </div>
            </div>

            {/* Navigasi Halaman Pratinjau */}
            {previewPages.length > 1 && (
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  disabled={currentPreviewIndex === 0}
                  onClick={() => setCurrentPreviewIndex((prev) => Math.max(0, prev - 1))}
                  className="px-2.5 py-1 bg-white hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed border border-[#cbd5e1] rounded-[6px] text-[11.5px] font-medium text-[#475569] flex items-center gap-1 transition"
                >
                  <i className="bi bi-chevron-left"></i>
                  <span>Sebelumnya</span>
                </button>

                <span className="text-[11.5px] text-[#64748b]">
                  {currentPreviewIndex + 1} dari {previewPages.length} cuplikan
                </span>

                <button
                  type="button"
                  disabled={currentPreviewIndex === previewPages.length - 1}
                  onClick={() =>
                    setCurrentPreviewIndex((prev) => Math.min(previewPages.length - 1, prev + 1))
                  }
                  className="px-2.5 py-1 bg-white hover:bg-[#f8fafc] disabled:opacity-40 disabled:cursor-not-allowed border border-[#cbd5e1] rounded-[6px] text-[11.5px] font-medium text-[#475569] flex items-center gap-1 transition"
                >
                  <span>Berikutnya</span>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            )}
          </div>

          {/* KARTU LANGKAH BELAJAR BERIKUTNYA */}
          <div className="bg-white border border-[#e2e8f0] rounded-[8px] p-5 shadow-xs">
            <h3 className="text-[13.5px] font-bold text-[#1e293b] mb-3 flex items-center gap-2">
              <i className="bi bi-signpost-split text-[#0d6efd]"></i>
              <span>Lanjutkan Belajar dari Materi Ini</span>
            </h3>

            <div className="space-y-2.5">
              <Link
                href={`/latihan-materials?materi=${material.id}`}
                className="w-full p-3 rounded-[6px] border border-[#bfdbfe] bg-[#eff6ff] hover:bg-[#dbeafe] flex items-center justify-between text-left transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0d6efd] text-white flex items-center justify-center flex-shrink-0 text-[14px]">
                    <i className="bi bi-ui-checks"></i>
                  </div>
                  <div>
                    <strong className="text-[12.5px] font-bold text-[#1e293b] block group-hover:text-[#0d6efd] transition">
                      Latihan 10 Soal AI
                    </strong>
                    <span className="text-[11px] text-[#64748b]">
                      Uji pemahaman dari subtopik materi ini
                    </span>
                  </div>
                </div>
                <i className="bi bi-arrow-right text-[#0d6efd]"></i>
              </Link>

              <Link
                href={`/flashcard?materi=${material.id}`}
                className="w-full p-3 rounded-[6px] border border-[#bbf7d0] bg-[#f0fdf4] hover:bg-[#dcfce7] flex items-center justify-between text-left transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center flex-shrink-0 text-[14px]">
                    <i className="bi bi-card-heading"></i>
                  </div>
                  <div>
                    <strong className="text-[12.5px] font-bold text-[#1e293b] block group-hover:text-[#16a34a] transition">
                      Hafalan Flashcard
                    </strong>
                    <span className="text-[11px] text-[#64748b]">
                      Kuasai istilah Latin dan definisinya
                    </span>
                  </div>
                </div>
                <i className="bi bi-arrow-right text-[#16a34a]"></i>
              </Link>

              <Link
                href="/latihan"
                className="w-full p-3 rounded-[6px] border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#f1f5f9] flex items-center justify-between text-left transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#334155] text-white flex items-center justify-center flex-shrink-0 text-[14px]">
                    <i className="bi bi-box-seam"></i>
                  </div>
                  <div>
                    <strong className="text-[12.5px] font-bold text-[#1e293b] block group-hover:text-[#0d6efd] transition">
                      Visualisasi Anatomi 3D
                    </strong>
                    <span className="text-[11px] text-[#64748b]">
                      Lihat posisi spasial struktur di model 3D
                    </span>
                  </div>
                </div>
                <i className="bi bi-arrow-right text-[#64748b]"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DIALOG SEDERHANA: LAPORKAN KESALAHAN */}
      {isReportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="bg-white rounded-[8px] border border-[#e2e8f0] shadow-xl max-w-md w-full p-5 sm:p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0] mb-4">
              <div className="flex items-center gap-2">
                <i className="bi bi-flag-fill text-[#dc2626] text-[16px]"></i>
                <h3 className="text-[15px] font-bold text-[#1e293b]">Laporkan Kesalahan Materi</h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-[#94a3b8] hover:text-[#475569]"
                aria-label="Tutup dialog"
              >
                <i className="bi bi-x-lg text-[14px]"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#1e293b] mb-1">
                  Kategori Kesalahan
                </label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd]"
                >
                  <option value="Fakta anatomi tidak akurat">Fakta anatomi tidak akurat</option>
                  <option value="Istilah Latin keliru / salah eja">Istilah Latin keliru / salah eja</option>
                  <option value="Poin rangkuman terpotong / hilang">Poin rangkuman terpotong / hilang</option>
                  <option value="Korelasi klinis kurang tepat">Korelasi klinis kurang tepat</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#1e293b] mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={4}
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Jelaskan bagian subtopik atau kalimat yang memerlukan revisi..."
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:border-[#0d6efd] placeholder-[#94a3b8]"
                />
              </div>

              <div className="p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] text-[11px] text-[#64748b]">
                Laporan ini akan ditinjau oleh tim kurikulum medis PRIMA dan dosen pembina untuk memperbarui model rangkuman AI.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-3.5 py-1.5 bg-white border border-[#cbd5e1] text-[#475569] rounded-[6px] text-[12px] font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-[6px] text-[12px] font-semibold transition shadow-xs"
                >
                  Kirim Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
