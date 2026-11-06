"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Komponen utama dengan useSearchParams dibungkus Suspense untuk standar Next.js App Router
function MasukContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state: "masuk" | "daftar"
  const urlTab = searchParams.get("tab") === "daftar" ? "daftar" : "masuk";
  const [activeTab, setActiveTab] = useState<"masuk" | "daftar">(urlTab);

  // Sinkronkan state saat URL query param berubah
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") === "daftar" ? "daftar" : "masuk";
    setActiveTab(tabFromUrl);
  }, [searchParams]);

  // Shared form fields (dipertahankan saat berganti tab)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Tab "Masuk" specific fields
  const [rememberMe, setRememberMe] = useState(false);

  // Tab "Daftar" specific fields
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formGeneralError, setFormGeneralError] = useState<string | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // "Lupa Kata Sandi" modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailSent, setForgotEmailSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Terms modal state
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Refs for auto-focusing on first invalid field
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const agreeTermsRef = useRef<HTMLInputElement>(null);
  const forgotEmailRef = useRef<HTMLInputElement>(null);

  // Switch tab and update URL
  const switchTab = (tab: "masuk" | "daftar") => {
    setActiveTab(tab);
    setErrors({});
    setFormGeneralError(null);
    router.replace(`/masuk?tab=${tab}`, { scroll: false });
  };

  // Password requirements calculation
  const hasMinLength = password.length >= 8;
  const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const passedRequirementsCount = [hasMinLength, hasUpperAndLower, hasNumber].filter(Boolean).length;

  let strengthLabel = "Belum diisi";
  let strengthColor = "bg-slate-200 text-slate-500";
  let strengthBars = [false, false, false];

  if (password.length > 0) {
    if (passedRequirementsCount === 1) {
      strengthLabel = "Lemah";
      strengthColor = "bg-rose-500 text-rose-600";
      strengthBars = [true, false, false];
    } else if (passedRequirementsCount === 2) {
      strengthLabel = "Sedang";
      strengthColor = "bg-amber-500 text-amber-600";
      strengthBars = [true, true, false];
    } else if (passedRequirementsCount === 3) {
      strengthLabel = "Kuat";
      strengthColor = "bg-emerald-500 text-emerald-600";
      strengthBars = [true, true, true];
    }
  }

  // Handle Form Submit: Masuk
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormGeneralError(null);
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Format email tidak valid (contoh: nama@univ.ac.id)";
    }

    if (!password) {
      newErrors.password = "Kata sandi wajib diisi";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto focus first invalid input
      if (newErrors.email) {
        emailRef.current?.focus();
      } else if (newErrors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    setErrors({});

    // Sesuai aturan: Simulasi galat jika email salah@contoh.com
    if (email.trim().toLowerCase() === "salah@contoh.com") {
      setIsLoading(true);
      setLoadingMessage("Memverifikasi kredensial...");
      setTimeout(() => {
        setIsLoading(false);
        setFormGeneralError("Email atau kata sandi tidak cocok. Silakan coba lagi.");
        passwordRef.current?.focus();
      }, 1200);
      return;
    }

    // Simulasi loading 1.5 detik lalu arahkan ke /beranda
    setIsLoading(true);
    setLoadingMessage("Masuk ke akun Anda...");
    setTimeout(() => {
      setIsLoading(false);
      router.push("/beranda");
    }, 1500);
  };

  // Handle Form Submit: Daftar
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormGeneralError(null);
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Nama lengkap wajib diisi";
    }

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Format email tidak valid (contoh: nama@univ.ac.id)";
    }

    if (!password) {
      newErrors.password = "Kata sandi wajib diisi";
    } else if (password.length < 8) {
      newErrors.password = "Kata sandi minimal 8 karakter";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi kata sandi wajib diisi";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Kata sandi dan konfirmasi tidak cocok";
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = "Anda harus menyetujui Ketentuan Layanan dan Kebijakan Privasi";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto-focus first invalid field
      if (newErrors.fullName) {
        fullNameRef.current?.focus();
      } else if (newErrors.email) {
        emailRef.current?.focus();
      } else if (newErrors.password) {
        passwordRef.current?.focus();
      } else if (newErrors.confirmPassword) {
        confirmPasswordRef.current?.focus();
      } else if (newErrors.agreeTerms) {
        agreeTermsRef.current?.focus();
      }
      return;
    }

    setErrors({});

    // Simulasi pendaftaran 1.5 detik lalu arahkan ke /onboarding
    setIsLoading(true);
    setLoadingMessage("Mempersiapkan profil belajarmu...");
    setTimeout(() => {
      setIsLoading(false);
      router.push("/onboarding");
    }, 1500);
  };

  // Handle Forgot Password modal submission
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    if (!forgotEmail.trim()) {
      setForgotError("Email wajib diisi");
      forgotEmailRef.current?.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) {
      setForgotError("Format email tidak valid");
      forgotEmailRef.current?.focus();
      return;
    }

    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotEmailSent(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] flex flex-col justify-between">
      {/* Background Decorative Blur */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-100/60 blur-[100px]" />
        <div className="absolute top-[60%] -right-[10%] w-[550px] h-[550px] rounded-full bg-indigo-50/70 blur-[120px]" />
      </div>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ========================================================= */}
          {/* KOLOM KIRI (Laptop): Panel Merek & Nilai Tambah PRIMA       */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center space-y-8">
            
            {/* Header Merek */}
            <div>
              <Link href="/" className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#0d6efd] rounded-lg">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0d6efd] to-[#2563eb] flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                  P
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-2xl tracking-tight text-[#0f172a]">PRIMA</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#0d6efd] border border-blue-200/60">
                      Preklinik
                    </span>
                  </div>
                  <p className="text-xs text-[#64748b] font-medium">Platform Review Interaktif Medis Adaptif</p>
                </div>
              </Link>

              <h1 className="mt-6 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f172a] leading-tight tracking-tight">
                Pendamping belajar cerdas untuk mahasiswa kedokteran.
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl">
                Bantu persiapan ujian blok, OSCE, dan pemahaman anatomi klinis dengan bantuan kecerdasan buatan terarah dan visual 3D spasial.
              </p>
            </div>

            {/* 3 Poin Manfaat PRIMA */}
            <div className="space-y-4">
              {/* Fitur 1 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0d6efd] shrink-0 text-lg">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1e293b]">Rencana Belajar Adaptif oleh AI</h2>
                  <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">
                    Menyusun jadwal target harian otomatis berdasarkan topik regio, sisa hari menuju ujian blok, dan jam belajarmu.
                  </p>
                </div>
              </div>

              {/* Fitur 2 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 text-lg">
                  <i className="bi bi-file-earmark-medical"></i>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1e293b]">Rangkuman & Soal dari Materi Kuliahmu</h2>
                  <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">
                    Ekstrak slide kuliah PDF/PPT menjadi ringkasan poin kunci ber-nomenklatur Latin, bank soal vignete, dan flashcard instan.
                  </p>
                </div>
              </div>

              {/* Fitur 3 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 text-lg">
                  <i className="bi bi-box-seam"></i>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1e293b]">Visualisasi 3D Anatomi 6 Regio</h2>
                  <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">
                    Eksplorasi hubungan spasial organ, tulang, otot, vaskular, dan saraf secara interaktif dengan kontrol sudut pandang penuh.
                  </p>
                </div>
              </div>
            </div>

            {/* Testimoni Singkat / Trust Badge */}
            <div className="hidden sm:flex items-center gap-3 pt-2 text-xs text-[#64748b]">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
                  FK
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
                  UI
                </div>
                <div className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
                  UGM
                </div>
              </div>
              <span>Dirancang khusus sesuai kurikulum kedokteran preklinik Indonesia.</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* KOLOM KANAN: Kartu Formulir Masuk / Daftar                 */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-5 w-full">
            <div className="metis-card bg-white border border-[#e2e8f0] rounded-2xl shadow-xl shadow-slate-200/40 p-6 sm:p-8 relative">
              
              {/* Header Tab Pilihan */}
              <div className="flex items-center p-1 bg-slate-100/90 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => switchTab("masuk")}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-150 ${
                    activeTab === "masuk"
                      ? "bg-white text-[#0d6efd] shadow-xs"
                      : "text-[#64748b] hover:text-[#1e293b]"
                  }`}
                  aria-selected={activeTab === "masuk"}
                  role="tab"
                >
                  Masuk ke Akun
                </button>
                <button
                  type="button"
                  onClick={() => switchTab("daftar")}
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-150 ${
                    activeTab === "daftar"
                      ? "bg-white text-[#0d6efd] shadow-xs"
                      : "text-[#64748b] hover:text-[#1e293b]"
                  }`}
                  aria-selected={activeTab === "daftar"}
                  role="tab"
                >
                  Daftar Akun Baru
                </button>
              </div>

              {/* Status Banner untuk Pembaca Layar dan Feedback */}
              <div aria-live="polite" className="sr-only">
                {isLoading ? loadingMessage : formGeneralError ? formGeneralError : ""}
              </div>

              {/* General Form Error Alert */}
              {formGeneralError && (
                <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
                  <i className="bi bi-exclamation-circle-fill text-rose-600 shrink-0 text-base mt-0.5"></i>
                  <div className="flex-1">
                    <p className="font-semibold">Autentikasi Tidak Berhasil</p>
                    <p className="text-xs text-rose-600 mt-0.5">{formGeneralError}</p>
                  </div>
                </div>
              )}

              {/* ===================================================== */}
              {/* FORMULIR 1: MASUK (LOGIN)                             */}
              {/* ===================================================== */}
              {activeTab === "masuk" && (
                <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#0f172a]">Selamat Datang Kembali</h2>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      Masuk untuk melanjutkan rencana dan progres belajarmu.
                    </p>
                  </div>

                  {/* Input Email */}
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-xs font-semibold text-[#334155] mb-1.5"
                    >
                      Alamat Email Mahasiswa <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <i className="bi bi-envelope"></i>
                      </div>
                      <input
                        ref={emailRef}
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) {
                            setErrors((prev) => ({ ...prev, email: "" }));
                          }
                        }}
                        placeholder="nama@mahasiswa.ac.id"
                        className={`w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.email
                            ? "border-rose-400 focus:ring-rose-200 bg-rose-50/20"
                            : "border-slate-300 focus:ring-blue-100 focus:border-[#0d6efd]"
                        }`}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "login-email-error" : undefined}
                      />
                    </div>
                    {errors.email && (
                      <p id="login-email-error" className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle"></i>
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Input Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="login-password"
                        className="block text-xs font-semibold text-[#334155]"
                      >
                        Kata Sandi <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotModal(true);
                          setForgotEmailSent(false);
                          setForgotEmail(email);
                          setForgotError(null);
                        }}
                        className="text-[11px] font-semibold text-[#0d6efd] hover:underline hover:text-blue-700"
                      >
                        Lupa kata sandi?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <i className="bi bi-lock"></i>
                      </div>
                      <input
                        ref={passwordRef}
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) {
                            setErrors((prev) => ({ ...prev, password: "" }));
                          }
                        }}
                        placeholder="Masukkan kata sandi"
                        className={`w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.password
                            ? "border-rose-400 focus:ring-rose-200 bg-rose-50/20"
                            : "border-slate-300 focus:ring-blue-100 focus:border-[#0d6efd]"
                        }`}
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "login-password-error" : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                    {errors.password && (
                      <p id="login-password-error" className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle"></i>
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Ingat Saya Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-[#0d6efd] border-slate-300 focus:ring-[#0d6efd]"
                      />
                      <span className="text-xs text-[#475569]">Ingat saya di perangkat ini</span>
                    </label>
                  </div>

                  {/* Tombol Masuk */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 bg-[#0d6efd] hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          <span>{loadingMessage}</span>
                        </>
                      ) : (
                        <>
                          <span>Masuk Sekarang</span>
                          <i className="bi bi-arrow-right"></i>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Hint demo */}
                  <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg text-[11px] text-[#64748b]">
                    <span className="font-semibold text-[#334155]">Tips Uji Coba:</span> Kamu dapat memasukkan email sembarang untuk masuk langsung ke <strong>/beranda</strong>, atau coba gunakan <code>salah@contoh.com</code> untuk melihat simulasi galat.
                  </div>
                </form>
              )}

              {/* ===================================================== */}
              {/* FORMULIR 2: DAFTAR (REGISTRATION)                     */}
              {/* ===================================================== */}
              {activeTab === "daftar" && (
                <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#0f172a]">Mulai Belajar di PRIMA</h2>
                    <p className="text-xs text-[#64748b] mt-0.5">
                      Daftar gratis untuk mulai membuat rencana belajar adaptifmu.
                    </p>
                  </div>

                  {/* Input Nama Lengkap */}
                  <div>
                    <label
                      htmlFor="register-fullname"
                      className="block text-xs font-semibold text-[#334155] mb-1.5"
                    >
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <i className="bi bi-person"></i>
                      </div>
                      <input
                        ref={fullNameRef}
                        id="register-fullname"
                        type="text"
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) {
                            setErrors((prev) => ({ ...prev, fullName: "" }));
                          }
                        }}
                        placeholder="Contoh: dr. Arif Rahman / Ahmad"
                        className={`w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.fullName
                            ? "border-rose-400 focus:ring-rose-200 bg-rose-50/20"
                            : "border-slate-300 focus:ring-blue-100 focus:border-[#0d6efd]"
                        }`}
                        aria-invalid={!!errors.fullName}
                        aria-describedby={errors.fullName ? "register-name-error" : undefined}
                      />
                    </div>
                    {errors.fullName && (
                      <p id="register-name-error" className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle"></i>
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Input Email */}
                  <div>
                    <label
                      htmlFor="register-email"
                      className="block text-xs font-semibold text-[#334155] mb-1.5"
                    >
                      Alamat Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <i className="bi bi-envelope"></i>
                      </div>
                      <input
                        ref={emailRef}
                        id="register-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) {
                            setErrors((prev) => ({ ...prev, email: "" }));
                          }
                        }}
                        placeholder="nama@mahasiswa.ac.id"
                        className={`w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.email
                            ? "border-rose-400 focus:ring-rose-200 bg-rose-50/20"
                            : "border-slate-300 focus:ring-blue-100 focus:border-[#0d6efd]"
                        }`}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "register-email-error" : undefined}
                      />
                    </div>
                    {errors.email && (
                      <p id="register-email-error" className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle"></i>
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Input Kata Sandi */}
                  <div>
                    <label
                      htmlFor="register-password"
                      className="block text-xs font-semibold text-[#334155] mb-1.5"
                    >
                      Kata Sandi <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <i className="bi bi-lock"></i>
                      </div>
                      <input
                        ref={passwordRef}
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) {
                            setErrors((prev) => ({ ...prev, password: "" }));
                          }
                        }}
                        placeholder="Minimal 8 karakter"
                        className={`w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.password
                            ? "border-rose-400 focus:ring-rose-200 bg-rose-50/20"
                            : "border-slate-300 focus:ring-blue-100 focus:border-[#0d6efd]"
                        }`}
                        aria-invalid={!!errors.password}
                        aria-describedby="register-password-strength"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                        aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>

                    {/* Indikator Kekuatan Kata Sandi */}
                    <div id="register-password-strength" className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Kekuatan Sandi:</span>
                        <span className={`font-semibold ${strengthColor.split(" ")[1]}`}>
                          {strengthLabel}
                        </span>
                      </div>
                      {/* 3 Progress Bars */}
                      <div className="grid grid-cols-3 gap-1.5 h-1.5">
                        <div
                          className={`rounded-full transition-all ${
                            strengthBars[0]
                              ? passedRequirementsCount === 1
                                ? "bg-rose-500"
                                : passedRequirementsCount === 2
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                              : "bg-slate-200"
                          }`}
                        />
                        <div
                          className={`rounded-full transition-all ${
                            strengthBars[1]
                              ? passedRequirementsCount === 2
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                              : "bg-slate-200"
                          }`}
                        />
                        <div
                          className={`rounded-full transition-all ${
                            strengthBars[2] ? "bg-emerald-500" : "bg-slate-200"
                          }`}
                        />
                      </div>

                      {/* Checklist Syarat */}
                      <div className="pt-1 space-y-1 text-[11px] text-slate-600">
                        <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                          <i className={`bi ${hasMinLength ? "bi-check-circle-fill text-emerald-500" : "bi-circle"}`}></i>
                          <span>Minimal 8 karakter</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasUpperAndLower ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                          <i className={`bi ${hasUpperAndLower ? "bi-check-circle-fill text-emerald-500" : "bi-circle"}`}></i>
                          <span>Huruf besar dan huruf kecil</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                          <i className={`bi ${hasNumber ? "bi-check-circle-fill text-emerald-500" : "bi-circle"}`}></i>
                          <span>Mengandung minimal 1 angka</span>
                        </div>
                      </div>
                    </div>

                    {errors.password && (
                      <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle"></i>
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Input Konfirmasi Kata Sandi */}
                  <div>
                    <label
                      htmlFor="register-confirm-password"
                      className="block text-xs font-semibold text-[#334155] mb-1.5"
                    >
                      Konfirmasi Kata Sandi <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <i className="bi bi-shield-check"></i>
                      </div>
                      <input
                        ref={confirmPasswordRef}
                        id="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) {
                            setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                          }
                        }}
                        placeholder="Ketik ulang kata sandi"
                        className={`w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors.confirmPassword
                            ? "border-rose-400 focus:ring-rose-200 bg-rose-50/20"
                            : "border-slate-300 focus:ring-blue-100 focus:border-[#0d6efd]"
                        }`}
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                        aria-label={showConfirmPassword ? "Sembunyikan konfirmasi sandi" : "Tampilkan konfirmasi sandi"}
                      >
                        <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p id="register-confirm-error" className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle"></i>
                        <span>{errors.confirmPassword}</span>
                      </p>
                    )}
                  </div>

                  {/* Persetujuan Ketentuan Layanan */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        ref={agreeTermsRef}
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => {
                          setAgreeTerms(e.target.checked);
                          if (errors.agreeTerms) {
                            setErrors((prev) => ({ ...prev, agreeTerms: "" }));
                          }
                        }}
                        className="mt-0.5 w-4 h-4 rounded text-[#0d6efd] border-slate-300 focus:ring-[#0d6efd]"
                      />
                      <span className="text-xs text-[#475569] leading-snug">
                        Saya menyetujui{" "}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="font-semibold text-[#0d6efd] hover:underline"
                        >
                          Ketentuan Layanan
                        </button>{" "}
                        dan{" "}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="font-semibold text-[#0d6efd] hover:underline"
                        >
                          Kebijakan Privasi
                        </button>{" "}
                        PRIMA.
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                        <i className="bi bi-exclamation-circle"></i>
                        <span>{errors.agreeTerms}</span>
                      </p>
                    )}
                  </div>

                  {/* Tombol Buat Akun */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 bg-[#0d6efd] hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          <span>{loadingMessage}</span>
                        </>
                      ) : (
                        <>
                          <span>Buat Akun & Mulai Onboarding</span>
                          <i className="bi bi-arrow-right"></i>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Catatan Privasi & Keamanan di Bawah Kartu */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-[#64748b]">
                <i className="bi bi-shield-check text-emerald-600"></i>
                <span>Materi dan data belajarmu bersifat pribadi.</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Sederhana */}
      <footer className="relative z-10 py-4 px-6 border-t border-slate-200/60 bg-white/50 backdrop-blur-xs text-center text-xs text-[#64748b]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} PRIMA &mdash; Platform Review Interaktif Medis Adaptif.</span>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/" className="hover:text-blue-600 transition">Halaman Awal</Link>
            <span>&bull;</span>
            <Link href="/onboarding" className="hover:text-blue-600 transition">Panduan Onboarding</Link>
            <span>&bull;</span>
            <Link href="/beranda" className="hover:text-blue-600 transition">Mode Tamu / Langsung Masuk</Link>
          </div>
        </div>
      </footer>

      {/* ============================================================= */}
      {/* MODAL: LUPA KATA SANDI (SIMULASI)                             */}
      {/* ============================================================= */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-md"
              aria-label="Tutup jendela"
            >
              <i className="bi bi-x-lg text-base"></i>
            </button>

            {!forgotEmailSent ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0d6efd] flex items-center justify-center text-xl mb-1">
                  <i className="bi bi-key"></i>
                </div>
                <div>
                  <h3 id="forgot-modal-title" className="text-base font-bold text-[#0f172a]">
                    Atur Ulang Kata Sandi
                  </h3>
                  <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                    Masukkan alamat email akunmu. Kami akan mengirimkan tautan simulasi untuk membuat kata sandi baru.
                  </p>
                </div>

                <div>
                  <label htmlFor="forgot-email" className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Email Akun Mahasiswa
                  </label>
                  <input
                    ref={forgotEmailRef}
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (forgotError) setForgotError(null);
                    }}
                    placeholder="nama@mahasiswa.ac.id"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#0d6efd]"
                  />
                  {forgotError && (
                    <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                      <i className="bi bi-exclamation-circle"></i>
                      <span>{forgotError}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 bg-[#0d6efd] hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-2 disabled:opacity-60"
                  >
                    {forgotLoading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Mengirim...</span>
                      </>
                    ) : (
                      "Kirim Tautan Reset"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl">
                  <i className="bi bi-check2-circle"></i>
                </div>
                <h3 className="text-base font-bold text-[#0f172a]">Email Pengaturan Ulang Terkirim!</h3>
                <p className="text-xs text-[#64748b] leading-relaxed max-w-sm mx-auto">
                  Petunjuk pengaturan ulang kata sandi telah dikirimkan ke <strong>{forgotEmail}</strong> (simulasi). Silakan periksa folder kotak masuk atau spam Anda.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition"
                  >
                    Kembali ke Halaman Masuk
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: KETENTUAN LAYANAN & KEBIJAKAN PRIVASI                   */}
      {/* ============================================================= */}
      {showTermsModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl relative max-h-[85vh] flex flex-col">
            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-md"
              aria-label="Tutup jendela"
            >
              <i className="bi bi-x-lg text-base"></i>
            </button>

            <div className="mb-4">
              <h3 id="terms-modal-title" className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                <i className="bi bi-shield-check text-[#0d6efd]"></i>
                Ketentuan Layanan & Kebijakan Privasi
              </h3>
              <p className="text-xs text-[#64748b] mt-0.5">PRIMA &mdash; Ringkasan Kebijakan Belajar Medis</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 text-xs text-[#475569] leading-relaxed border-y border-slate-100 py-3">
              <div>
                <h4 className="font-bold text-[#1e293b] mb-1">1. Tujuan Pendidikan</h4>
                <p>
                  PRIMA dirancang semata-mata sebagai platform pendamping belajar mandiri bagi mahasiswa kedokteran preklinik. Aplikasi ini bukan alat diagnostik medis dan tidak ditujukan untuk pengambilan keputusan klinis pada pasien nyata.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#1e293b] mb-1">2. Privasi Materi Unggahan</h4>
                <p>
                  Materi slide kuliah (PDF/PPT) yang diunggah diproses semata-mata untuk kebutuhan belajar individual Anda dan tidak dibagikan kepada pengguna lain atau dipublikasikan secara terbuka.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#1e293b] mb-1">3. Hasil Buatan Kecerdasan Buatan (AI)</h4>
                <p>
                  Rangkuman, flashcard, dan bank soal dihasilkan oleh modul asistensi AI dan dapat mengandung ketidaktepatan. Mahasiswa senantiasa dianjurkan memvalidasi materi dengan buku ajar rujukan standar (Sobotta, Moore, Guyton, dsb.).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#1e293b] mb-1">4. Hak Kekayaan Intelektual 3D</h4>
                <p>
                  Model visualisasi anatomi 3D diadaptasi dari Z-Anatomy (CC BY-SA 4.0) dan BodyParts3D (CC BY-SA 2.1 Japan) untuk keperluan edukasi non-komersial.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowTermsModal(false);
                  setAgreeTerms(true);
                  if (errors.agreeTerms) {
                    setErrors((prev) => ({ ...prev, agreeTerms: "" }));
                  }
                }}
                className="px-4 py-2 bg-[#0d6efd] hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition"
              >
                Saya Mengerti & Setuju
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Default export dibungkus Suspense agar lolos build Next.js (prerendering useSearchParams)
export default function MasukPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <svg className="animate-spin h-5 w-5 text-[#0d6efd]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Memuat halaman autentikasi...</span>
          </div>
        </div>
      }
    >
      <MasukContent />
    </Suspense>
  );
}
