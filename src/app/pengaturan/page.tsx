"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  mockUserProfile,
  mockStudyPreferences,
  mockNotificationSettings,
  mockAppearanceSettings,
  mockAppInfoSettings,
  UserStudyPreferences,
  UserNotificationSettings,
  UserAppearanceSettings,
} from "@/lib/mock-data";

type SettingsTabId =
  | "profil"
  | "preferensi"
  | "tampilan"
  | "notifikasi"
  | "privasi"
  | "tentang";

interface SettingsTabItem {
  id: SettingsTabId;
  name: string;
  hash: string;
  icon: string;
  desc: string;
}

const SETTINGS_TABS: SettingsTabItem[] = [
  {
    id: "profil",
    name: "Profil Pengguna",
    hash: "#profil",
    icon: "bi bi-person-circle",
    desc: "Informasi identitas dan institusi akademik",
  },
  {
    id: "preferensi",
    name: "Preferensi Belajar",
    hash: "#preferensi",
    icon: "bi bi-sliders",
    desc: "Target item harian, hari belajar, dan mode kuis",
  },
  {
    id: "tampilan",
    name: "Tampilan & Tema",
    hash: "#tampilan",
    icon: "bi bi-palette",
    desc: "Tema terang/gelap dan ukuran font aplikasi",
  },
  {
    id: "notifikasi",
    name: "Notifikasi",
    hash: "#notifikasi",
    icon: "bi bi-bell",
    desc: "Pengingat latihan harian dan jadwal ujian",
  },
  {
    id: "privasi",
    name: "Privasi & Data",
    hash: "#privasi",
    icon: "bi bi-shield-lock",
    desc: "Ekspor data belajar dan bersihkan riwayat",
  },
  {
    id: "tentang",
    name: "Tentang & Kredit",
    hash: "#tentang",
    icon: "bi bi-info-circle",
    desc: "Versi PRIMA, atribusi 3D, dan lisensi medis",
  },
];

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("profil");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State: Profil
  const [profileForm, setProfileForm] = useState({
    name: mockUserProfile.name,
    email: mockUserProfile.email,
    institution: mockUserProfile.institution,
    semester: mockUserProfile.semester,
    title: mockUserProfile.title,
    avatarUrl: mockUserProfile.avatarUrl,
  });
  const [profileErrors, setProfileErrors] = useState<{
    name?: string;
    email?: string;
  }>({});
  const [initialProfile, setInitialProfile] = useState(profileForm);

  // Form State: Preferensi Belajar
  const [prefForm, setPrefForm] = useState<UserStudyPreferences>(
    mockStudyPreferences
  );
  const [initialPref, setInitialPref] = useState(prefForm);

  // Form State: Tampilan
  const [appearanceForm, setAppearanceForm] = useState<UserAppearanceSettings>(
    mockAppearanceSettings
  );
  const [initialAppearance, setInitialAppearance] = useState(appearanceForm);

  // Form State: Notifikasi
  const [notifForm, setNotifForm] = useState<UserNotificationSettings>(
    mockNotificationSettings
  );
  const [initialNotif, setInitialNotif] = useState(notifForm);

  // Modal State: Hapus Riwayat
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Unsaved Changes Confirmation Modal
  const [pendingTabSwitch, setPendingTabSwitch] =
    useState<SettingsTabId | null>(null);

  // Sync hash from URL on mount and popstate
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (
        [
          "profil",
          "preferensi",
          "tampilan",
          "notifikasi",
          "privasi",
          "tentang",
        ].includes(hash)
      ) {
        setActiveTab(hash as SettingsTabId);
      }
    };

    handleHashChange();
    window.addEventListener("popstate", handleHashChange);
    return () => window.removeEventListener("popstate", handleHashChange);
  }, []);

  // Update hash when activeTab changes
  const switchTab = (tabId: SettingsTabId) => {
    if (hasCurrentTabUnsavedChanges(activeTab)) {
      setPendingTabSwitch(tabId);
      return;
    }
    setActiveTab(tabId);
    window.location.hash = `#${tabId}`;
  };

  const confirmPendingTabSwitch = () => {
    if (pendingTabSwitch) {
      // Revert dirty changes of the active tab
      handleCancelCurrentTab(activeTab);
      setActiveTab(pendingTabSwitch);
      window.location.hash = `#${pendingTabSwitch}`;
      setPendingTabSwitch(null);
    }
  };

  // Check if current active tab has unsaved changes
  function hasCurrentTabUnsavedChanges(tab: SettingsTabId) {
    if (tab === "profil") {
      return JSON.stringify(profileForm) !== JSON.stringify(initialProfile);
    }
    if (tab === "preferensi") {
      return JSON.stringify(prefForm) !== JSON.stringify(initialPref);
    }
    if (tab === "tampilan") {
      return (
        JSON.stringify(appearanceForm) !== JSON.stringify(initialAppearance)
      );
    }
    if (tab === "notifikasi") {
      return JSON.stringify(notifForm) !== JSON.stringify(initialNotif);
    }
    return false;
  }

  function handleCancelCurrentTab(tab: SettingsTabId) {
    if (tab === "profil") {
      setProfileForm(initialProfile);
      setProfileErrors({});
    } else if (tab === "preferensi") {
      setPrefForm(initialPref);
    } else if (tab === "tampilan") {
      applyAppearance(initialAppearance);
      setAppearanceForm(initialAppearance);
    } else if (tab === "notifikasi") {
      setNotifForm(initialNotif);
    }
  }

  // Apply Appearance live
  const applyAppearance = (settings: UserAppearanceSettings) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    // Apply Dark mode
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else if (settings.theme === "light") {
      root.classList.remove("dark");
    } else {
      // Follow system
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    // Apply Font size
    root.classList.remove(
      "font-size-small",
      "font-size-normal",
      "font-size-large"
    );
    root.classList.add(`font-size-${settings.fontSize}`);
  };

  // Profile Validation
  const validateProfile = () => {
    const errors: { name?: string; email?: string } = {};
    if (!profileForm.name.trim()) {
      errors.name = "Nama lengkap mahasiswa wajib diisi.";
    }
    if (!profileForm.email.trim()) {
      errors.email = "Alamat email wajib diisi.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(profileForm.email)
    ) {
      errors.email = "Format email tidak valid (contoh: rina@medika.ac.id).";
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;
    setInitialProfile(profileForm);
    setToastMessage("Profil berhasil disimpan");
  };

  const handleSavePref = () => {
    setInitialPref(prefForm);
    setToastMessage("Preferensi belajar berhasil disimpan");
  };

  const handleSaveAppearance = () => {
    applyAppearance(appearanceForm);
    setInitialAppearance(appearanceForm);
    setToastMessage("Pengaturan tampilan berhasil diterapkan");
  };

  const handleSaveNotif = () => {
    setInitialNotif(notifForm);
    setToastMessage("Pengaturan notifikasi berhasil diperbarui");
  };

  // Export Data JSON
  const handleExportData = () => {
    const dataToExport = {
      profile: profileForm,
      preferences: prefForm,
      notifications: notifForm,
      exportDate: new Date().toISOString(),
      app: mockAppInfoSettings.name,
      version: mockAppInfoSettings.version,
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prima_data_studi_${profileForm.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setToastMessage("Data studi berhasil diunduh sebagai file JSON");
  };

  // Confirm Delete History
  const handleConfirmDelete = () => {
    if (deleteConfirmText !== "HAPUS") return;
    setIsDeleteModalOpen(false);
    setDeleteConfirmText("");
    setToastMessage("Riwayat latihan dan catatan repetisi berhasil dibersihkan");
  };

  // Days list for study schedule
  const DAYS_LIST = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const activeTabDetails = useMemo(() => {
    return SETTINGS_TABS.find((t) => t.id === activeTab) || SETTINGS_TABS[0];
  }, [activeTab]);

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[6px] bg-[#1e293b] px-4 py-3 text-[13px] text-white shadow-lg animate-in fade-in duration-200">
          <i className="bi bi-check-circle-fill text-[#10b981]"></i>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#94a3b8] hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-[21px] font-medium text-[#1e293b] leading-tight">
            Pengaturan
          </h1>
          <p className="text-[12.5px] text-[#64748b] mt-0.5">
            Kelola preferensi akun mahasiswa, algoritma repetisi, tampilan, dan
            privasi data
          </p>
        </div>
      </div>

      {/* MOBILE NAVIGATION TABS (Horizontal Scrollable Strip) */}
      <div className="lg:hidden flex overflow-x-auto pb-2 scrollbar-none gap-1.5 border-b border-[#e2e8f0]">
        {SETTINGS_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-[12.5px] font-medium whitespace-nowrap transition flex-shrink-0 ${
                isActive
                  ? "bg-[#0d6efd] text-white font-semibold shadow-xs"
                  : "bg-white text-[#475569] border border-[#e2e8f0] hover:bg-[#f8fafc]"
              }`}
            >
              <i className={tab.icon}></i>
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN TWO-COLUMN LAYOUT (Laptop: Left Nav, Right Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* DESKTOP SIDE NAVIGATION (4 Kolom) */}
        <div className="hidden lg:block lg:col-span-4 metis-card overflow-hidden sticky top-[80px]">
          <div className="metis-card-header bg-[#f8fafc]">
            <h2 className="metis-card-title text-[13.5px]">Navigasi Pengaturan</h2>
            <span className="text-[11px] text-[#64748b]">6 Bagian</span>
          </div>

          <div className="p-2 space-y-1">
            {SETTINGS_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const isDirty = hasCurrentTabUnsavedChanges(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-[6px] transition flex items-start gap-3 ${
                    isActive
                      ? "bg-[#eff6ff] text-[#0d6efd] font-semibold border-l-3 border-[#0d6efd]"
                      : "text-[#334155] hover:bg-[#f8fafc] hover:text-[#0f172a]"
                  }`}
                >
                  <i
                    className={`${tab.icon} text-[16px] mt-0.5 ${
                      isActive ? "text-[#0d6efd]" : "text-[#64748b]"
                    }`}
                  ></i>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] leading-snug">{tab.name}</span>
                      {isDirty && (
                        <span
                          className="w-2 h-2 rounded-full bg-[#f59e0b]"
                          title="Perubahan belum disimpan"
                        ></span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748b] truncate mt-0.5 font-normal">
                      {tab.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Help Tip */}
          <div className="p-3.5 m-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] text-[11.5px] text-[#64748b] leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-[#1e293b] mb-1">
              <i className="bi bi-lightbulb text-[#f59e0b]"></i>
              <span>Tips Belajar PRIMA</span>
            </div>
            Ubah target harian secara bertahap. Konsistensi 20 item per hari lebih
            efektif daripada 100 item menjelang ujian blok.
          </div>
        </div>

        {/* SETTINGS CONTENT SECTION (8 Kolom di Laptop) */}
        <div className="lg:col-span-8">
          <div className="metis-card overflow-hidden">
              {/* Card Header with active tab title */}
              <div className="metis-card-header">
                <div>
                  <h2 className="metis-card-title flex items-center gap-2">
                    <i className={`${activeTabDetails.icon} text-[#0d6efd]`}></i>
                    <span>{activeTabDetails.name}</span>
                  </h2>
                  <span className="text-[11.5px] text-[#64748b]">
                    {activeTabDetails.desc}
                  </span>
                </div>
                {hasCurrentTabUnsavedChanges(activeTab) && (
                  <span className="bg-[#fffbeb] text-[#b45309] border border-[#fde68a] text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-ping"></span>
                    <span>Ada Perubahan Belum Disimpan</span>
                  </span>
                )}
              </div>

              {/* CARD BODY: RENDER ACTIVE TAB */}
              <div className="p-6">
                {/* 1. TAB PROFIL */}
                {activeTab === "profil" && (
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* Avatar Upload Mock */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-[#f1f5f9]">
                      <div className="w-[72px] h-[72px] rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-[24px] shadow-sm border-2 border-white ring-2 ring-[#e2e8f0]">
                        RS
                      </div>
                      <div className="text-center sm:text-left">
                        <h4 className="text-[14px] font-bold text-[#1e293b]">
                          Foto Profil Mahasiswa
                        </h4>
                        <p className="text-[11.5px] text-[#64748b] mt-0.5 mb-2.5">
                          Format PNG, JPG, atau WEBP hingga 2MB (Tampilan simulasi)
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setToastMessage("Fitur ganti foto profil aktif")
                            }
                            className="h-[30px] px-3 bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#334155] text-[11.5px] font-semibold rounded-[5px] transition flex items-center gap-1.5"
                          >
                            <i className="bi bi-camera"></i>
                            <span>Ubah Foto</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setToastMessage("Foto profil dikembalikan ke inisial")
                            }
                            className="h-[30px] px-2.5 text-[#ef4444] hover:bg-[#fef2f2] text-[11.5px] font-medium rounded-[5px] transition"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Nama Lengkap */}
                      <div className="sm:col-span-2">
                        <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1">
                          Nama Lengkap <span className="text-[#ef4444]">*</span>
                        </label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, name: e.target.value })
                          }
                          className={`w-full h-[38px] px-3 bg-white border rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 ${
                            profileErrors.name
                              ? "border-[#ef4444] focus:ring-[#ef4444]"
                              : "border-[#cbd5e1] focus:ring-[#0d6efd]"
                          }`}
                          placeholder="Masukkan nama lengkap..."
                        />
                        {profileErrors.name && (
                          <p className="text-[11px] text-[#ef4444] mt-1 flex items-center gap-1">
                            <i className="bi bi-exclamation-circle"></i>
                            <span>{profileErrors.name}</span>
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="sm:col-span-2">
                        <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1">
                          Email Kampus / Akun <span className="text-[#ef4444]">*</span>
                        </label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, email: e.target.value })
                          }
                          className={`w-full h-[38px] px-3 bg-white border rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 ${
                            profileErrors.email
                              ? "border-[#ef4444] focus:ring-[#ef4444]"
                              : "border-[#cbd5e1] focus:ring-[#0d6efd]"
                          }`}
                          placeholder="nama@mhs.medika.ac.id"
                        />
                        {profileErrors.email && (
                          <p className="text-[11px] text-[#ef4444] mt-1 flex items-center gap-1">
                            <i className="bi bi-exclamation-circle"></i>
                            <span>{profileErrors.email}</span>
                          </p>
                        )}
                      </div>

                      {/* Institusi */}
                      <div>
                        <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1">
                          Institusi / Fakultas Kedokteran
                        </label>
                        <input
                          type="text"
                          value={profileForm.institution}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              institution: e.target.value,
                            })
                          }
                          className="w-full h-[38px] px-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
                          placeholder="Fakultas Kedokteran..."
                        />
                      </div>

                      {/* Semester */}
                      <div>
                        <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1">
                          Semester / Tahap Akademik
                        </label>
                        <select
                          value={profileForm.semester}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              semester: Number(e.target.value),
                            })
                          }
                          className="w-full h-[38px] px-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
                        >
                          <option value={1}>Semester 1 (Tahun Pertama)</option>
                          <option value={2}>Semester 2 (Tahun Pertama)</option>
                          <option value={3}>Semester 3 (Tahun Kedua)</option>
                          <option value={4}>Semester 4 (Tahun Kedua)</option>
                          <option value={5}>Semester 5 (Tahun Ketiga)</option>
                          <option value={6}>Semester 6 (Tahun Ketiga)</option>
                        </select>
                      </div>
                    </div>

                    {/* Form Action Buttons */}
                    <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleCancelCurrentTab("profil")}
                        disabled={
                          JSON.stringify(profileForm) ===
                          JSON.stringify(initialProfile)
                        }
                        className="h-[34px] px-3.5 bg-white border border-[#cbd5e1] text-[#475569] text-[12.5px] font-medium rounded-[5px] hover:bg-[#f8fafc] disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Batalkan
                      </button>
                      <button
                        type="submit"
                        disabled={
                          JSON.stringify(profileForm) ===
                          JSON.stringify(initialProfile)
                        }
                        className="h-[34px] px-4 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12.5px] font-semibold rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-2xs"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                )}

                {/* 2. TAB PREFERENSI BELAJAR */}
                {activeTab === "preferensi" && (
                  <div className="space-y-6">
                    {/* Target Item Per Hari (Slider & Number) */}
                    <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-[13px] font-bold text-[#1e293b]">
                            Target Item Per Hari
                          </label>
                          <p className="text-[11.5px] text-[#64748b]">
                            Jumlah struktur anatomi yang dijadwalkan ulang per sesi
                          </p>
                        </div>
                        <span className="text-[16px] font-bold text-[#0d6efd] bg-white px-3 py-1 rounded-[5px] border border-[#cbd5e1]">
                          {prefForm.targetItemsPerDay} item
                        </span>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-[11px] text-[#64748b]">10</span>
                        <input
                          type="range"
                          min="10"
                          max="60"
                          step="5"
                          value={prefForm.targetItemsPerDay}
                          onChange={(e) =>
                            setPrefForm({
                              ...prefForm,
                              targetItemsPerDay: Number(e.target.value),
                            })
                          }
                          className="w-full accent-[#0d6efd] cursor-pointer"
                        />
                        <span className="text-[11px] text-[#64748b]">60</span>
                      </div>

                      {/* Live Calculation Preview Banner */}
                      <div className="mt-2 text-[12px] bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] rounded-[5px] px-3 py-2 flex items-center gap-2">
                        <i className="bi bi-calculator text-[14px]"></i>
                        <span>
                          Dengan target ini, kamu berlatih sekitar{" "}
                          <strong>
                            {prefForm.targetItemsPerDay * prefForm.studyDays.length}{" "}
                            item per minggu
                          </strong>{" "}
                          (
                          {prefForm.targetItemsPerDay *
                            prefForm.studyDays.length *
                            4}{" "}
                          item per bulan).
                        </span>
                      </div>
                    </div>

                    {/* Hari Belajar yang Dipilih (Chips) */}
                    <div>
                      <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1">
                        Hari Belajar Aktif Mingguan
                      </label>
                      <p className="text-[11.5px] text-[#64748b] mb-2.5">
                        Pilih hari di mana PRIMA akan menyusun target harian
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {DAYS_LIST.map((day) => {
                          const isSelected = prefForm.studyDays.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                const newDays = isSelected
                                  ? prefForm.studyDays.filter((d) => d !== day)
                                  : [...prefForm.studyDays, day];
                                if (newDays.length > 0) {
                                  setPrefForm({ ...prefForm, studyDays: newDays });
                                }
                              }}
                              className={`h-[32px] px-3.5 rounded-full text-[12px] font-medium border transition flex items-center gap-1.5 ${
                                isSelected
                                  ? "bg-[#0d6efd] text-white border-[#0d6efd]"
                                  : "bg-white text-[#475569] border-[#cbd5e1] hover:bg-[#f8fafc]"
                              }`}
                            >
                              {isSelected && <i className="bi bi-check2"></i>}
                              <span>{day}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Jam Pengingat & Mode Default */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {/* Jam Pengingat */}
                      <div>
                        <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1">
                          Jam Pengingat Latihan Harian
                        </label>
                        <input
                          type="time"
                          value={prefForm.reminderTime}
                          onChange={(e) =>
                            setPrefForm({
                              ...prefForm,
                              reminderTime: e.target.value,
                            })
                          }
                          className="w-full h-[38px] px-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
                        />
                        <p className="text-[11px] text-[#64748b] mt-1">
                          Notifikasi push akan muncul pada jam ini di browser
                        </p>
                      </div>

                      {/* Mode Kuis Default */}
                      <div>
                        <label className="block text-[12.5px] font-semibold text-[#1e293b] mb-1">
                          Mode Kuis Anatomi Default
                        </label>
                        <select
                          value={prefForm.defaultQuizMode}
                          onChange={(e) =>
                            setPrefForm({
                              ...prefForm,
                              defaultQuizMode: e.target.value as any,
                            })
                          }
                          className="w-full h-[38px] px-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#0d6efd]"
                        >
                          <option value="klik-struktur">
                            Klik Struktur pada Model 3D
                          </option>
                          <option value="sebutkan-nama">
                            Sebutkan Nama (Pilihan Ganda)
                          </option>
                        </select>
                        <p className="text-[11px] text-[#64748b] mt-1">
                          Dapat diganti kapan saja saat sesi latihan berlangsung
                        </p>
                      </div>
                    </div>

                    {/* Form Action Buttons */}
                    <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleCancelCurrentTab("preferensi")}
                        disabled={
                          JSON.stringify(prefForm) === JSON.stringify(initialPref)
                        }
                        className="h-[34px] px-3.5 bg-white border border-[#cbd5e1] text-[#475569] text-[12.5px] font-medium rounded-[5px] hover:bg-[#f8fafc] disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Batalkan
                      </button>
                      <button
                        type="button"
                        onClick={handleSavePref}
                        disabled={
                          JSON.stringify(prefForm) === JSON.stringify(initialPref)
                        }
                        className="h-[34px] px-4 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12.5px] font-semibold rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-2xs"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. TAB TAMPILAN & TEMA */}
                {activeTab === "tampilan" && (
                  <div className="space-y-6">
                    {/* Pilihan Tema (Terang, Gelap, Sistem) */}
                    <div>
                      <label className="block text-[13px] font-bold text-[#1e293b] mb-1">
                        Pilihan Tema Aplikasi
                      </label>
                      <p className="text-[11.5px] text-[#64748b] mb-3">
                        Pilih tema tampilan yang nyaman untuk belajar di siang atau
                        malam hari
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Terang */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = {
                              ...appearanceForm,
                              theme: "light" as const,
                            };
                            setAppearanceForm(updated);
                            applyAppearance(updated);
                          }}
                          className={`p-4 rounded-[6px] border text-left transition flex flex-col justify-between h-[105px] ${
                            appearanceForm.theme === "light"
                              ? "border-[#0d6efd] bg-[#eff6ff] ring-2 ring-[#0d6efd]/20"
                              : "border-[#e2e8f0] bg-white hover:bg-[#f8fafc]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <i className="bi bi-sun-fill text-[20px] text-[#f59e0b]"></i>
                            {appearanceForm.theme === "light" && (
                              <i className="bi bi-check-circle-fill text-[#0d6efd] text-[16px]"></i>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-[13px] text-[#1e293b] block">
                              Terang (Light)
                            </span>
                            <span className="text-[11px] text-[#64748b]">
                              Latar putih bersih
                            </span>
                          </div>
                        </button>

                        {/* Gelap */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = {
                              ...appearanceForm,
                              theme: "dark" as const,
                            };
                            setAppearanceForm(updated);
                            applyAppearance(updated);
                          }}
                          className={`p-4 rounded-[6px] border text-left transition flex flex-col justify-between h-[105px] ${
                            appearanceForm.theme === "dark"
                              ? "border-[#0d6efd] bg-[#1e293b] ring-2 ring-[#0d6efd]/20"
                              : "border-[#e2e8f0] bg-white hover:bg-[#f8fafc]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <i className="bi bi-moon-stars-fill text-[19px] text-[#38bdf8]"></i>
                            {appearanceForm.theme === "dark" && (
                              <i className="bi bi-check-circle-fill text-[#38bdf8] text-[16px]"></i>
                            )}
                          </div>
                          <div>
                            <span
                              className={`font-bold text-[13px] block ${
                                appearanceForm.theme === "dark"
                                  ? "text-white"
                                  : "text-[#1e293b]"
                              }`}
                            >
                              Gelap (Dark)
                            </span>
                            <span className="text-[11px] text-[#64748b]">
                              Mereduksi silau mata
                            </span>
                          </div>
                        </button>

                        {/* Ikuti Sistem */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = {
                              ...appearanceForm,
                              theme: "system" as const,
                            };
                            setAppearanceForm(updated);
                            applyAppearance(updated);
                          }}
                          className={`p-4 rounded-[6px] border text-left transition flex flex-col justify-between h-[105px] ${
                            appearanceForm.theme === "system"
                              ? "border-[#0d6efd] bg-[#eff6ff] ring-2 ring-[#0d6efd]/20"
                              : "border-[#e2e8f0] bg-white hover:bg-[#f8fafc]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <i className="bi bi-display text-[20px] text-[#64748b]"></i>
                            {appearanceForm.theme === "system" && (
                              <i className="bi bi-check-circle-fill text-[#0d6efd] text-[16px]"></i>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-[13px] text-[#1e293b] block">
                              Ikuti Sistem
                            </span>
                            <span className="text-[11px] text-[#64748b]">
                              Otomatis OS / Browser
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Ukuran Font */}
                    <div className="pt-2">
                      <label className="block text-[13px] font-bold text-[#1e293b] mb-1">
                        Ukuran Tipografi Aplikasi
                      </label>
                      <p className="text-[11.5px] text-[#64748b] mb-3">
                        Sesuaikan keterbacaan istilah medis Latin dan penjelasan klinis
                      </p>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "small", label: "Kecil", px: "13px" },
                          { id: "normal", label: "Normal (Default)", px: "14.5px" },
                          { id: "large", label: "Besar", px: "16px" },
                        ].map((f) => {
                          const isSelected = appearanceForm.fontSize === f.id;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => {
                                const updated = {
                                  ...appearanceForm,
                                  fontSize: f.id as any,
                                };
                                setAppearanceForm(updated);
                                applyAppearance(updated);
                              }}
                              className={`p-3 rounded-[6px] border text-center transition ${
                                isSelected
                                  ? "border-[#0d6efd] bg-[#eff6ff] text-[#0d6efd] font-bold ring-1 ring-[#0d6efd]"
                                  : "border-[#cbd5e1] bg-white text-[#334155] hover:bg-[#f8fafc]"
                              }`}
                            >
                              <span className="block text-[13px]">{f.label}</span>
                              <span className="text-[10.5px] text-[#64748b]">
                                {f.px}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Live Text Preview Box */}
                      <div className="mt-3.5 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] space-y-1">
                        <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#64748b]">
                          Pratinjau Keterbacaan Materi:
                        </span>
                        <p className="text-[13px] text-[#1e293b] leading-relaxed">
                          <strong>Nervus Radialis (C5-T1)</strong> melintasi{" "}
                          <em>sulcus nervi radialis</em> pada aspek posterior
                          corpus humeri. Cedera saraf pada area ini memicu
                          manifestasi klinis berupa <strong>wrist drop</strong>{" "}
                          akibat parese kelompok otot ekstensor lengan bawah.
                        </p>
                      </div>
                    </div>

                    {/* Form Action Buttons */}
                    <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleCancelCurrentTab("tampilan")}
                        disabled={
                          JSON.stringify(appearanceForm) ===
                          JSON.stringify(initialAppearance)
                        }
                        className="h-[34px] px-3.5 bg-white border border-[#cbd5e1] text-[#475569] text-[12.5px] font-medium rounded-[5px] hover:bg-[#f8fafc] disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Batalkan
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAppearance}
                        disabled={
                          JSON.stringify(appearanceForm) ===
                          JSON.stringify(initialAppearance)
                        }
                        className="h-[34px] px-4 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12.5px] font-semibold rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-2xs"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. TAB NOTIFIKASI */}
                {activeTab === "notifikasi" && (
                  <div className="space-y-4">
                    {/* Toggle Item 1: Pengingat Latihan Harian */}
                    <div className="p-4 bg-white border border-[#e2e8f0] rounded-[6px] flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[13px] text-[#1e293b]">
                            Pengingat Latihan Harian (Spaced Repetition)
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              notifForm.dailyReminder
                                ? "bg-[#dcfce7] text-[#166534]"
                                : "bg-[#f1f5f9] text-[#64748b]"
                            }`}
                          >
                            {notifForm.dailyReminder ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-[#64748b] leading-relaxed">
                          Mengirimkan pemberitahuan browser saat ada item review
                          anatomi yang jatuh tempo berdasarkan kurva kelupaan.
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={notifForm.dailyReminder}
                        onClick={() =>
                          setNotifForm({
                            ...notifForm,
                            dailyReminder: !notifForm.dailyReminder,
                          })
                        }
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer flex-shrink-0 ${
                          notifForm.dailyReminder ? "bg-[#0d6efd]" : "bg-[#cbd5e1]"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                            notifForm.dailyReminder ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle Item 2: Peringatan Ujian Mendekat */}
                    <div className="p-4 bg-white border border-[#e2e8f0] rounded-[6px] flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[13px] text-[#1e293b]">
                            Peringatan Ujian Blok Mendekat
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              notifForm.examAlert
                                ? "bg-[#dcfce7] text-[#166534]"
                                : "bg-[#f1f5f9] text-[#64748b]"
                            }`}
                          >
                            {notifForm.examAlert ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-[#64748b] leading-relaxed">
                          Pengingat hitung mundur ujian (H-14, H-7, H-3, H-1)
                          beserta rekomendasi fokus pada regio yang masih lemah.
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={notifForm.examAlert}
                        onClick={() =>
                          setNotifForm({
                            ...notifForm,
                            examAlert: !notifForm.examAlert,
                          })
                        }
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer flex-shrink-0 ${
                          notifForm.examAlert ? "bg-[#0d6efd]" : "bg-[#cbd5e1]"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                            notifForm.examAlert ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Toggle Item 3: Ringkasan Mingguan */}
                    <div className="p-4 bg-white border border-[#e2e8f0] rounded-[6px] flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[13px] text-[#1e293b]">
                            Laporan Ringkasan Mingguan
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              notifForm.weeklySummary
                                ? "bg-[#dcfce7] text-[#166534]"
                                : "bg-[#f1f5f9] text-[#64748b]"
                            }`}
                          >
                            {notifForm.weeklySummary ? "Aktif" : "Nonaktif"}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-[#64748b] leading-relaxed">
                          Rekap mingguan berisi struktur yang telah dikuasai,
                          perkembangan akurasi kuis 3D, dan target minggu depan.
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={notifForm.weeklySummary}
                        onClick={() =>
                          setNotifForm({
                            ...notifForm,
                            weeklySummary: !notifForm.weeklySummary,
                          })
                        }
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer flex-shrink-0 ${
                          notifForm.weeklySummary ? "bg-[#0d6efd]" : "bg-[#cbd5e1]"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                            notifForm.weeklySummary ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Form Action Buttons */}
                    <div className="pt-4 border-t border-[#f1f5f9] flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleCancelCurrentTab("notifikasi")}
                        disabled={
                          JSON.stringify(notifForm) === JSON.stringify(initialNotif)
                        }
                        className="h-[34px] px-3.5 bg-white border border-[#cbd5e1] text-[#475569] text-[12.5px] font-medium rounded-[5px] hover:bg-[#f8fafc] disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Batalkan
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveNotif}
                        disabled={
                          JSON.stringify(notifForm) === JSON.stringify(initialNotif)
                        }
                        className="h-[34px] px-4 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[12.5px] font-semibold rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-2xs"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. TAB PRIVASI & DATA */}
                {activeTab === "privasi" && (
                  <div className="space-y-6">
                    {/* Privacy Explanation Card */}
                    <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[6px] space-y-2">
                      <div className="flex items-center gap-2 text-[#0f766e]">
                        <i className="bi bi-shield-check text-[18px]"></i>
                        <span className="font-bold text-[13.5px]">
                          Komitmen Keamanan & Privasi Akademik
                        </span>
                      </div>
                      <p className="text-[12px] text-[#475569] leading-relaxed">
                        PRIMA dirancang khusus untuk kenyamanan belajar mandiri
                        mahasiswa kedokteran. Seluruh catatan performa kuis, peta
                        kelemahan, dan target repetisi disimpan pada media lokal
                        peramban Anda. Aplikasi ini tidak mengumpulkan data pribadi
                        atau rekam medis klinis apa pun.
                      </p>
                    </div>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Unduh Data */}
                      <div className="p-4 bg-white border border-[#e2e8f0] rounded-[6px] flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <i className="bi bi-download text-[#0d6efd] text-[16px]"></i>
                            <h4 className="text-[13px] font-bold text-[#1e293b]">
                              Cadangkan Data Belajar
                            </h4>
                          </div>
                          <p className="text-[11.5px] text-[#64748b] leading-relaxed">
                            Ekspor seluruh pengaturan, profil, dan daftar jadwal
                            latihan ke dalam format file JSON standar.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleExportData}
                          className="h-[34px] px-3 bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#334155] text-[12px] font-semibold rounded-[5px] transition flex items-center justify-center gap-1.5 self-start"
                        >
                          <i className="bi bi-file-earmark-code"></i>
                          <span>Unduh Data Saya (JSON)</span>
                        </button>
                      </div>

                      {/* Hapus Riwayat Latihan */}
                      <div className="p-4 bg-[#fff5f5] border border-[#fecaca] rounded-[6px] flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <i className="bi bi-trash3 text-[#ef4444] text-[16px]"></i>
                            <h4 className="text-[13px] font-bold text-[#991b1b]">
                              Bersihkan Riwayat Latihan
                            </h4>
                          </div>
                          <p className="text-[11.5px] text-[#b91c1c] leading-relaxed">
                            Menghapus seluruh skor penguasaan kuis 3D dan riwayat
                            kesalahan. Pengaturan akun tidak akan terhapus.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirmText("");
                            setIsDeleteModalOpen(true);
                          }}
                          className="h-[34px] px-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[12px] font-semibold rounded-[5px] transition flex items-center justify-center gap-1.5 self-start shadow-2xs"
                        >
                          <i className="bi bi-exclamation-triangle"></i>
                          <span>Hapus Riwayat Latihan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. TAB TENTANG & KREDIT */}
                {activeTab === "tentang" && (
                  <div className="space-y-6">
                    {/* App Header & Bio */}
                    <div className="flex items-start gap-4 pb-5 border-b border-[#f1f5f9]">
                      <div className="w-[52px] h-[52px] rounded-[10px] bg-[#2563eb] text-white flex items-center justify-center font-bold text-[28px] shadow-sm flex-shrink-0">
                        P
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[16px] font-bold text-[#1e293b]">
                            {mockAppInfoSettings.name}
                          </h3>
                          <span className="bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] text-[11px] font-semibold px-2 py-0.5 rounded-full">
                            v{mockAppInfoSettings.version}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#475569] mt-1 leading-relaxed">
                          PRIMA adalah aplikasi web pendamping belajar anatomi dan
                          persiapan ujian preklinik mahasiswa kedokteran dengan
                          metode repetisi terdistribusi (*spaced repetition*) dan
                          eksplorasi model organ 3D interaktif.
                        </p>
                        <span className="text-[11px] text-[#64748b] block mt-1">
                          Pembaruan Terakhir: {mockAppInfoSettings.lastUpdated}
                        </span>
                      </div>
                    </div>

                    {/* Pernyataan Penting (Batas Medis) */}
                    <div className="p-4 bg-[#f8fafc] border-l-4 border-[#0d6efd] rounded-r-[6px] space-y-1">
                      <span className="text-[11px] uppercase font-bold tracking-wider text-[#0d6efd]">
                        Pernyataan Penting & Disclaimer
                      </span>
                      <p className="text-[12.5px] font-medium text-[#1e293b] leading-relaxed">
                        {mockAppInfoSettings.disclaimer}
                      </p>
                    </div>

                    {/* ATRIBUSI MODEL 3D (Exact Text per PRD) */}
                    <div className="p-4 bg-white border border-[#e2e8f0] rounded-[6px] space-y-2.5">
                      <div className="flex items-center gap-2">
                        <i className="bi bi-box text-[#0d6efd] text-[16px]"></i>
                        <h4 className="text-[13px] font-bold text-[#1e293b]">
                          Atribusi Sumber Model 3D
                        </h4>
                      </div>

                      {/* Exact sentence as required */}
                      <p className="text-[12px] text-[#334155] leading-relaxed bg-[#f8fafc] p-3 rounded-[5px] border border-[#e2e8f0]">
                        &quot;Model anatomi 3D diadaptasi dari &apos;Z-Anatomy,
                        The libre 3D atlas of anatomy&apos; (CC BY-SA 4.0) dan
                        &apos;BodyParts3D, The Database Center for Life
                        Science&apos; (CC BY-SA 2.1 Japan). Model telah
                        disederhanakan dan dipotong untuk keperluan aplikasi ini.&quot;
                      </p>

                      {/* External Attribution Links */}
                      <div className="flex flex-wrap items-center gap-4 pt-1 text-[11.5px]">
                        <a
                          href="https://creativecommons.org/licenses/by-sa/4.0/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0d6efd] hover:underline flex items-center gap-1 font-medium"
                        >
                          <i className="bi bi-box-arrow-up-right text-[11px]"></i>
                          <span>Lisensi CC BY-SA 4.0</span>
                        </a>
                        <a
                          href="https://www.z-anatomy.com/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0d6efd] hover:underline flex items-center gap-1 font-medium"
                        >
                          <i className="bi bi-box-arrow-up-right text-[11px]"></i>
                          <span>Z-Anatomy Atlas</span>
                        </a>
                        <a
                          href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0d6efd] hover:underline flex items-center gap-1 font-medium"
                        >
                          <i className="bi bi-box-arrow-up-right text-[11px]"></i>
                          <span>BodyParts3D (DBCLS Japan)</span>
                        </a>
                      </div>
                    </div>

                    {/* Tech Stack Badges */}
                    <div>
                      <h4 className="text-[12.5px] font-bold text-[#1e293b] mb-2.5">
                        Teknologi Pengembang
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {mockAppInfoSettings.techStack.map((tech) => (
                          <span
                            key={tech.name}
                            className="bg-[#f1f5f9] text-[#334155] border border-[#cbd5e1] text-[11.5px] px-2.5 py-1 rounded-[5px] font-medium flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0d6efd]"></span>
                            <span>{tech.name}</span>
                            <span className="text-[10px] text-[#64748b]">
                              ({tech.category})
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>

      {/* DIALOG KONFIRMASI HAPUS RIWAYAT */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-[8px] max-w-md w-full p-5 border border-[#e2e8f0] shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-[#dc2626]">
              <div className="w-9 h-9 rounded-full bg-[#fee2e2] flex items-center justify-center text-[18px]">
                <i className="bi bi-exclamation-triangle-fill"></i>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[#1e293b]">
                  Konfirmasi Hapus Riwayat
                </h3>
                <span className="text-[11.5px] text-[#64748b]">
                  Tindakan ini tidak dapat dibatalkan
                </span>
              </div>
            </div>

            <p className="text-[12.5px] text-[#475569] leading-relaxed">
              Seluruh riwayat latihan anatomi 3D, catatan spaced repetition, dan
              peta kelemahan Anda akan diatur ulang ke kondisi awal.
            </p>

            <div className="space-y-1.5 bg-[#f8fafc] p-3 rounded-[6px] border border-[#e2e8f0]">
              <label className="block text-[11.5px] font-semibold text-[#1e293b]">
                Ketik kata <strong className="text-[#dc2626]">HAPUS</strong> untuk
                mengonfirmasi:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Ketik HAPUS..."
                className="w-full h-[36px] px-3 bg-white border border-[#cbd5e1] rounded-[5px] text-[13px] text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#dc2626]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="h-[34px] px-3.5 bg-white border border-[#cbd5e1] text-[#475569] text-[12px] font-medium rounded-[5px] hover:bg-[#f8fafc]"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== "HAPUS"}
                onClick={handleConfirmDelete}
                className="h-[34px] px-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[12px] font-semibold rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-2xs"
              >
                Hapus Selamanya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG PERINGATAN UNSAVED CHANGES */}
      {pendingTabSwitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-[8px] max-w-sm w-full p-5 border border-[#e2e8f0] shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-[#f59e0b]">
              <i className="bi bi-exclamation-triangle-fill text-[20px]"></i>
              <h3 className="text-[14px] font-bold text-[#1e293b]">
                Perubahan Belum Disimpan
              </h3>
            </div>
            <p className="text-[12px] text-[#64748b] leading-relaxed">
              Kamu memiliki perubahan pada bagian ini yang belum disimpan. Yakin
              ingin berpindah ke bagian lain? Perubahan yang belum disimpan akan
              dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
              <button
                type="button"
                onClick={() => setPendingTabSwitch(null)}
                className="h-[32px] px-3 bg-white border border-[#cbd5e1] text-[#475569] text-[11.5px] font-medium rounded-[5px] hover:bg-[#f8fafc]"
              >
                Tetap di Sini
              </button>
              <button
                type="button"
                onClick={confirmPendingTabSwitch}
                className="h-[32px] px-3.5 bg-[#f59e0b] hover:bg-[#d97706] text-white text-[11.5px] font-semibold rounded-[5px] transition shadow-2xs"
              >
                Tinggalkan Bagian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
