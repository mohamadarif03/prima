"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getStructuresByRegion } from "@/lib/mock-data";
import "./landing.css";

// Dynamic Client Component Loader for Three.js (No SSR)
const AnatomyViewer = dynamic(
  () =>
    import("@/components/anatomy/AnatomyViewer").then(
      (mod) => mod.AnatomyViewer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[240px] flex flex-col items-center justify-center bg-[#f8fafc] rounded-2xl border border-white/80 p-6 text-center">
        <div className="w-8 h-8 border-3 border-[#1169dc] border-t-transparent rounded-full animate-spin mb-2.5"></div>
        <p className="text-xs font-semibold text-[#06192f]">
          Memuat Model 3D Anatomi...
        </p>
        <p className="text-[11px] text-[#77899c]">
          Menyiapkan grafis WebGL interaktif
        </p>
      </div>
    ),
  }
);

const HERO_FRONT = "/assets/images/hero_front.png";
const HERO_BACK = "/assets/images/hero_back.png";
const MATERIAL = "/assets/images/material_tissue.jpg";
const AVATAR_URLS = [
  "/assets/images/avatar_skeletal.jpg",
  "/assets/images/avatar_muscular.jpg",
  "/assets/images/avatar_nervous.jpg",
  "/assets/images/avatar_cardiovascular.jpg",
  "/assets/images/avatar_digestive.jpg",
];

const SYSTEM_NAMES = [
  "Sistem Rangka & Sendi",
  "Sistem Otot & Jaringan",
  "Sistem Saraf Pusat",
  "Sistem Kardiovaskular",
  "Sistem Pencernaan & Viseral",
];


interface KurikulumStructure {
  name: string;
  latin: string;
  role: string;
}

interface KurikulumRegion {
  id: string;
  num: string;
  name: string;
  subName: string;
  latin: string;
  structuresCount: number;
  examBlock: string;
  masteryScore: number;
  level: string;
  dueCount: number;
  description: string;
  structures: KurikulumStructure[];
  clinicalCorrelation: string;
  topicParam: string;
}


interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Apakah materi anatomi di PRIMA sesuai dengan kurikulum Fakultas Kedokteran di Indonesia?",
    answer:
      "Ya. Seluruh materi mengacu pada standar Terminologia Anatomica internasional dan silabus blok anatomi kurikulum kedokteran preklinik di Indonesia. Cakupan materi terbagi atas 6 regio tubuh standar: Caput, Collum, Thorax, Abdomen, Pelvis, dan Membrum lengkap dengan istilah Latin resmi.",
  },
  {
    id: "faq-2",
    question: "Bagaimana cara kerja algoritma Spaced Repetition dalam menentukan jadwal review saya?",
    answer:
      "PRIMA menggunakan algoritma spaced repetition terkalibrasi (FSR/SM-2) yang mencatat riwayat jawaban Anda. Struktur yang sering salah atau dinilai kritis otomatis dijadwalkan ulang lebih cepat (interval 1 hari atau 3 hari), sedangkan struktur yang stabil diingat diberi interval lebih panjang (7 hingga 14 hari) agar waktu belajar efisien.",
  },
  {
    id: "faq-3",
    question: "Apakah model 3D anatomi membutuhkan laptop atau HP berspesifikasi tinggi?",
    answer:
      "Tidak. Mesin WebGL dioptimasi ringan berbasis browser dengan kompresi mesh modern dan rendering client-side. Anda dapat memutar 360°, melakukan zoom, dan mengidentifikasi struktur secara lancar di laptop biasa maupun smartphone tanpa perlu menginstal aplikasi tambahan.",
  },
  {
    id: "faq-4",
    question: "Bagaimana fitur Perencana Belajar membagi beban materi menjelang ujian blok?",
    answer:
      "Cukup masukkan tanggal ujian blok Anda. Sistem secara otomatis menghitung selisih hari tersisa dan membagi total struktur menjadi target harian yang terukur (rata-rata 15–20 struktur per hari) lengkap dengan sesi evaluasi berkala, sehingga mencegah kram belajar semalam sebelum ujian.",
  },
  {
    id: "faq-5",
    question: "Apakah data kelemahan dan progres belajar saya tersimpan dengan aman?",
    answer:
      "Ya. PRIMA menyimpan analitik perkembangan belajar dan peta kelemahan secara terstruktur agar Anda dapat selalu memantau regio mana yang membutuhkan perhatian lebih sebelum menghadapi ujian blok atau praktikum anatomi.",
  },
  {
    id: "faq-6",
    question: "Apakah PRIMA dapat digunakan sebagai rujukan diagnosis atau penanganan klinis?",
    answer:
      "Tidak. PRIMA secara tegas dirancang khusus sebagai alat bantu belajar (edukasi) dan media review materi mahasiswa kedokteran. Platform ini tidak boleh digunakan untuk keperluan diagnosis pasien, keputusan klinis, maupun saran medis profesional.",
  },
];

const KURIKULUM_REGIONS: KurikulumRegion[] = [
  {
    id: "reg-caput",
    num: "/01",
    name: "Regio Caput",
    subName: "Kepala & Wajah",
    latin: "Musculi Capitis & Faciei",
    structuresCount: 15,
    examBlock: "Blok Neuropsikiatri & Kepala Leher",
    masteryScore: 78,
    level: "Kuat",
    dueCount: 4,
    description:
      "Sistem miologi kraniofasial mencakup 15 struktur otot ekspresi wajah dan mastikasi. Menekankan distingsi inervasi motorik Nervus Facialis (CN VII) untuk mimik wajah dan Nervus Trigeminus cabang mandibularis (CN V3) untuk otot pengunyah.",
    structures: [
      { name: "M. Frontalis", latin: "Venter Frontalis", role: "Mengangkat alis & kerutan dahi horizontal (N. VII)" },
      { name: "M. Temporalis", latin: "M. Temporalis", role: "Elevasi & retraksi mandibula (N. V3)" },
      { name: "M. Masseter", latin: "M. Masseter", role: "Otot kunyah utama berkekuatan oklusi gigitan tinggi" },
      { name: "M. Orbicularis Oculi", latin: "M. Orbicularis Oculi", role: "Sfingter penutup rima palpebrarum mata" },
      { name: "M. Orbicularis Oris", latin: "M. Orbicularis Oris", role: "Sfingter bibir & artikulasi fonasi bicara" },
      { name: "Galea Aponeurotica", latin: "Aponeurosis Epicranialis", role: "Lembaran tendon penghubung skalp dahi-oksipital" },
    ],
    clinicalCorrelation:
      "Ujian OSCE & MCQ: Paresis N. VII perifer (Bell's Palsy) melumpuhkan seluruh hemifasial termasuk dahi ipsilateral. Sebaliknya, stroke kortikal (lesi UMN) mempertahankan fungsi dahi karena inervasi bilateral nukleus fasialis bagian atas.",
    topicParam: "reg-caput",
  },
  {
    id: "reg-collum",
    num: "/02",
    name: "Regio Collum",
    subName: "Leher & Servikal",
    latin: "Musculi Colli & Cervicis",
    structuresCount: 15,
    examBlock: "Blok Bedah Leher & Aerodigestif",
    masteryScore: 68,
    level: "Sedang",
    dueCount: 4,
    description:
      "Topografi servikal terbagi atas trigonum colli anterior dan posterior oleh M. Sternocleidomastoideus. Berisi pembuluh darah vital (A. Carotis, V. Jugularis) dan otot-otot laringeal pengatur fonasi serta mekanisme menelan.",
    structures: [
      { name: "M. Sternocleidomastoideus", latin: "M. SCM", role: "Rotasi kepala kontralateral & fleksi servikal (N. XI)" },
      { name: "M. Platysma", latin: "M. Platysma", role: "Otot mimik leher superfisial penegang kulit servikal" },
      { name: "M. Digastricus", latin: "Venter Ant. & Post.", role: "Depresi mandibula & elevasi os hyoid saat menelan" },
      { name: "M. Omohyoideus", latin: "M. Omohyoideus", role: "Strap muscle penurun os hyoid dan kartilago laring" },
      { name: "M. Scalenus Anterior", latin: "M. Scalenus Anterior", role: "Batas apertura thoracis superior & elevator costa I" },
      { name: "M. Trapezius", latin: "Pars Descendens", role: "Elevasi scapula & ekstensi leher (N. Accessorius)" },
    ],
    clinicalCorrelation:
      "Ujian Bedah & Anatomi Terapan: Celah di antara M. Scalenus Anterior dan Medius (Hiatus Scalenus) dilewati Pleksus Brakialis dan A. Subclavia; kompresi di area ini menimbulkan sindrom Thoracic Outlet Syndrome (TOS).",
    topicParam: "reg-collum",
  },
  {
    id: "reg-thorax",
    num: "/03",
    name: "Regio Thorax",
    subName: "Dada & Dinding Toraks",
    latin: "Musculi Thoracis & Diaphragma",
    structuresCount: 12,
    examBlock: "Blok Kardiorespirasi & Toraks",
    masteryScore: 82,
    level: "Kuat",
    dueCount: 3,
    description:
      "Dinding sangkar toraks melindungi organ vital mediastinum dan paru. Meliputi otot pektoral penggerak gelang bahu, interkostalis pengatur dinamika rongga dada, serta diafragma sebagai pompa pernapasan utama tubuh.",
    structures: [
      { name: "M. Pectoralis Major", latin: "M. Pectoralis Major", role: "Adduksi & rotasi medial humerus pada sendi bahu" },
      { name: "M. Pectoralis Minor", latin: "M. Pectoralis Minor", role: "Depresi angulus anterior scapula & stabilisator" },
      { name: "M. Serratus Anterior", latin: "M. Serratus Anterior", role: "Protraktor scapula menempel dada (N. Thoracicus Longus)" },
      { name: "Mm. Intercostales Externi", latin: "Intercostales Externi", role: "Elevasi kosta memperbesar diameter toraks (inspirasi)" },
      { name: "Mm. Intercostales Interni", latin: "Intercostales Interni", role: "Depresi kosta memperkecil rongga toraks (ekspirasi)" },
      { name: "Diaphragma", latin: "Centrum Tendineum", role: "Otot pernapasan utama tubuh (inervasi N. Phrenicus C3-C5)" },
    ],
    clinicalCorrelation:
      "Prosedur Klinis: Pungsi pleura (torakosentesis) dan pemasangan chest tube (WSD) wajib dilakukan menempel pada tepi atas costa (kosta bawah) untuk menghindari bundle neurovaskular interkostal (V-A-N) di sulcus costae.",
    topicParam: "reg-thorax",
  },
  {
    id: "reg-abdomen",
    num: "/04",
    name: "Regio Abdomen",
    subName: "Dinding Perut & Viseral",
    latin: "Musculi Abdominis Anterolateralis",
    structuresCount: 10,
    examBlock: "Blok Digestif & Dinding Abdomen",
    masteryScore: 66,
    level: "Sedang",
    dueCount: 5,
    description:
      "Arsitektur multilapis dinding anterolateral melindungi rongga peritoneum dan menjaga tekanan intraabdominal. Pembentukan sarung rektus (vagina musculi recti) dan kanalis inguinalis menjadi fokus krusial ujian bedah umum.",
    structures: [
      { name: "M. Rectus Abdominis", latin: "M. Rectus Abdominis", role: "Fleksi kolumna vertebralis & kompresi visera abdomen" },
      { name: "M. Obliquus Externus", latin: "Obliquus Externus", role: "Rotasi trunkus kontralateral & kompresi abdominal" },
      { name: "M. Obliquus Internus", latin: "Obliquus Internus", role: "Rotasi trunkus ipsilateral bersama oblikus eksterna" },
      { name: "M. Transversus Abdominis", latin: "Transversus Abdominis", role: "Stabilisator korset inti (core stability) terdalam" },
      { name: "Linea Alba", latin: "Linea Alba", role: "Fusi serat aponeurosis linea mediana bebas vaskular" },
      { name: "M. Psoas Major", latin: "M. Psoas Major", role: "Fleksor kuat sendi panggul & postural lumbar lordosis" },
    ],
    clinicalCorrelation:
      "Korelasi Bedah: Trigonum Hesselbach dibatasi oleh Plica Epigastrica Inferior, Tepi Lateral M. Rectus, dan Ligamentum Inguinale; kelemahan fasia transversalis di sini menimbulkan Hernia Inguinalis Medialis (Directa).",
    topicParam: "reg-abdomen",
  },
  {
    id: "reg-pelvis",
    num: "/05",
    name: "Regio Pelvis",
    subName: "Panggul & Perineum",
    latin: "Musculi Pelvis, Glutei & Perinei",
    structuresCount: 15,
    examBlock: "Blok Urogenital & Dasar Panggul",
    masteryScore: 62,
    level: "Sedang",
    dueCount: 4,
    description:
      "Regio kompleks mencakup kelompok gluteal ekstensor panggul, rotator lateral femoris profunda, serta diafragma pelvis (dasar panggul) yang menopang visera pelvis dan mengontrol kontinensia volunter.",
    structures: [
      { name: "M. Gluteus Maximus", latin: "M. Gluteus Maximus", role: "Ekstensor terkuat sendi panggul (inervasi N. Gluteus Inf.)" },
      { name: "M. Gluteus Medius", latin: "M. Gluteus Medius", role: "Abduktor utama & penstabil pelvis saat fase menumpu jalan" },
      { name: "M. Piriformis", latin: "M. Piriformis", role: "Rotasi lateral panggul & landmark foramen ischiadicum majus" },
      { name: "M. Obturator Internus", latin: "M. Obturator Internus", role: "Rotator lateral panggul profunda bersama mm. gemelli" },
      { name: "M. Levator Ani", latin: "Diaphragma Pelvis", role: "Penyangga dasar visera panggul & pengatur sudut anorektal" },
      { name: "M. Sphincter Ani Ext.", latin: "Sphincter Ani Externus", role: "Kontinensia fekal volunter (inervasi N. Pudendus S2-S4)" },
    ],
    clinicalCorrelation:
      "Tanda Klinis Trendelenburg: Kelemahan M. Gluteus Medius (lesi N. Gluteus Superior) menyebabkan panggul sisi kontralateral jatuh saat menumpu satu kaki, memicu gaya berjalan Trendelenburg Gait khas.",
    topicParam: "reg-pelvis",
  },
  {
    id: "reg-membrum",
    num: "/06",
    name: "Regio Membrum",
    subName: "Anggota Gerak (Ekstremitas)",
    latin: "Musculi Membri Superioris & Inferioris",
    structuresCount: 18,
    examBlock: "Blok Muskuloskeletal & Lokomosi",
    masteryScore: 74,
    level: "Kuat",
    dueCount: 4,
    description:
      "Regio dengan jumlah struktur 3D terbanyak (18 otot). Meliputi gelang bahu, lengan atas fleksor/ekstensor, lengan bawah, serta kelompok paha anterior (kuadriseps), paha posterior (hamstring), dan tungkai bawah (kruris).",
    structures: [
      { name: "M. Deltoideus", latin: "M. Deltoideus", role: "Abduktor utama lengan 15°-90° (inervasi N. Axillaris C5-C6)" },
      { name: "M. Supraspinatus", latin: "Rotator Cuff Superior", role: "Inisiasi abduksi 0°-15° sendi bahu & stabilisator kaput" },
      { name: "M. Biceps Brachii", latin: "M. Biceps Brachii", role: "Fleksi siku & supinator kuat lengan bawah (N. Musculocutaneus)" },
      { name: "M. Triceps Brachii", latin: "M. Triceps Brachii", role: "Ekstensor tunggal sendi siku (inervasi N. Radialis)" },
      { name: "M. Quadriceps Femoris", latin: "M. Rectus Femoris", role: "Ekstensor sendi lutut utama (inervasi N. Femoralis L2-L4)" },
      { name: "Tendo Calcaneus", latin: "Tendo Achillis", role: "Insersio tendo terkuat tubuh untuk plantar fleksi (N. Tibialis)" },
    ],
    clinicalCorrelation:
      "Ujian Ortopedi OSCE: Tes Drop-Arm positif mengindikasikan robekan (tear) pada tendo M. Supraspinatus; sedangkan hilangnya refleks tendon Achilles (S1-S2) khas pada kompresi radiks saraf skiatika.",
    topicParam: "reg-membrum",
  },
];

export default function LandingPage() {
  // Navigation & Interactive States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Atlas 3D");
  const [isJoined, setIsJoined] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Cara Belajar Step States
  const [activeStep, setActiveStep] = useState(0);
  const [indicatorTop, setIndicatorTop] = useState(0);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<"correct" | "wrong" | null>(null);
  const caputStructures = useMemo(() => getStructuresByRegion("reg-caput"), []);
  const [highlightedStructureId, setHighlightedStructureId] = useState<string>("struct-c-01");
  const [activeRegionIdx, setActiveRegionIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [activeStructureIdx, setActiveStructureIdx] = useState<number | null>(null);

  const selectedKurikulumRegion = KURIKULUM_REGIONS[activeRegionIdx];

  // Planner Day State & Interactive Checklist (Panggung 01)
  const [plannerDayIdx, setPlannerDayIdx] = useState(3); // Kamis (Hari Ini)
  const [p1Checklist, setP1Checklist] = useState([
    {
      id: "p1-1",
      title: "M. Frontalis & M. Temporalis",
      category: "Miologi Kraniofasial",
      count: 8,
      completed: true,
    },
    {
      id: "p1-2",
      title: "Percabangan N. Facialis (CN VII) & N. V3",
      category: "Inervasi Motorik & Sensorik",
      count: 6,
      completed: true,
    },
    {
      id: "p1-3",
      title: "Foramina Kranium & A. Temporalis Sup.",
      category: "Repetisi Adaptif / Spaced",
      count: 6,
      completed: false,
    },
  ]);

  const toggleP1Checklist = useCallback((id: string) => {
    setUserHasInteracted(true);
    setP1Checklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }, []);

  const p1CompletedCount = p1Checklist
    .filter((c) => c.completed)
    .reduce((acc, c) => acc + c.count, 0);
  const p1TotalCount = 20;
  const p1Percent = Math.round((p1CompletedCount / p1TotalCount) * 100);

  // Spaced Repetition Interactive Simulator (Panggung 03)
  const [criticalInterval, setCriticalInterval] = useState("1 Hari");
  const [consolidatedInterval, setConsolidatedInterval] = useState("14 Hari");
  const [simulatedFeedback, setSimulatedFeedback] = useState<{
    type: "reset" | "boost";
    msg: string;
  } | null>(null);

  const handleSimulateRetention = useCallback((type: "reset" | "boost") => {
    setUserHasInteracted(true);
    if (type === "reset") {
      setCriticalInterval("Besok");
      setSimulatedFeedback({
        type: "reset",
        msg: "Algoritma FSR otomatis mereset interval ke 1 Hari agar struktur kritis diulang sebelum lupa.",
      });
    } else {
      setConsolidatedInterval("21 Hari");
      setSimulatedFeedback({
        type: "boost",
        msg: "Retensi kuat terdeteksi: Interval otomatis dinaikkan ke 21 Hari (konsolidasi jangka panjang)!",
      });
    }
  }, []);

  const handleMeshClick = useCallback((structureId: string) => {
    setUserHasInteracted(true);
    setHighlightedStructureId(structureId);
    if (structureId === "struct-c-01") {
      setQuizAnswer("correct");
    } else {
      setQuizAnswer("wrong");
    }
  }, []);

  const handleQuizChoice = useCallback((id: string, isCorrect: boolean) => {
    setUserHasInteracted(true);
    setHighlightedStructureId(id);
    setQuizAnswer(isCorrect ? "correct" : "wrong");
  }, []);

  // Refs for stage layout and canvas spotlight
  const stageRef = useRef<HTMLDivElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepBtnsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Toast Helper
  const say = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg(null);
    }, 1700);
  }, []);

  // Menu Handlers
  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
    say("Menu navigasi dibuka");
  }, [say]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    say("Menu navigasi ditutup");
  }, [say]);

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => {
      const next = !prev;
      say(next ? "Menu navigasi dibuka" : "Menu navigasi ditutup");
      return next;
    });
  }, [say]);

  // Gallery Avatar selection
  const chooseSystem = useCallback(
    (index: number) => {
      const nextIdx = ((index % 5) + 5) % 5;
      setCurrentIndex(nextIdx);
      say(SYSTEM_NAMES[nextIdx]);
    },
    [say]
  );

  // Play & Eye awake toggles
  const toggleAwake = useCallback(
    (source: "play" | "eye") => {
      setIsAwake((prev) => {
        const next = !prev;
        say(
          source === "play"
            ? next
              ? "Mode pemindaian aktif"
              : "Pemindaian dijeda"
            : next
            ? "Pratinjau visual anatomi"
            : "Pratinjau dijeda"
        );
        return next;
      });
    },
    [say]
  );

  // Join button toggle
  const toggleJoin = useCallback(() => {
    setIsJoined((prev) => {
      const next = !prev;
      say(next ? "Selamat datang di Atlas Anatomi" : "Sesi diakhiri");
      return next;
    });
  }, [say]);

  // Switch Cara Belajar Step
  const switchStep = useCallback(
    (index: number, isUserClick: boolean) => {
      const nextStep = ((index % 3) + 3) % 3;
      setActiveStep(nextStep);
      if (isUserClick) {
        setUserHasInteracted(true);
        if (autoRotateTimerRef.current) {
          clearInterval(autoRotateTimerRef.current);
          autoRotateTimerRef.current = null;
        }
      }
    },
    []
  );

  // Auto-rotate steps
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || userHasInteracted) return;

    autoRotateTimerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 6000);

    return () => {
      if (autoRotateTimerRef.current) clearInterval(autoRotateTimerRef.current);
    };
  }, [userHasInteracted]);

  // Scroll Reveal IntersectionObserver for buttery smooth entrance animations
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    const elements = document.querySelectorAll(".reveal-init");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Update dynamic indicator position based on active step button
  useEffect(() => {
    function updateIndicator() {
      const btn = stepBtnsRef.current[activeStep];
      if (btn) {
        setIndicatorTop(btn.offsetTop);
      }
    }
    updateIndicator();
    const timer = setTimeout(updateIndicator, 120);
    window.addEventListener("resize", updateIndicator, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeStep]);

  // Outside click listener for mobile menu
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (!isMenuOpen) return;
      if (
        menuPanelRef.current &&
        !menuPanelRef.current.contains(e.target as Node) &&
        burgerRef.current &&
        !burgerRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
        if (burgerRef.current) burgerRef.current.focus();
      }
    }

    window.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  // Core Stage Layout Model
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const PHONE = window.matchMedia("(max-width:520px) and (orientation:portrait)");

    function layout() {
      if (!stage) return;
      if (PHONE.matches) {
        stage.classList.remove("is-mobile", "is-fit");
        stage.classList.add("is-phone", "nav-compact");
        stage.style.width = "";
        stage.style.height = "";
        stage.style.transform = "";
        stage.style.removeProperty("--hf");
        stage.style.removeProperty("--fx");
        return;
      }

      stage.classList.remove("is-phone");
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w / h < 1.05;
      stage.classList.toggle("is-mobile", mobile);

      const bh = mobile ? 1366 : 1024;
      const ideal = Math.round((bh * w) / h);
      const lo = mobile ? 560 : 1060;
      const hi = mobile ? 1450 : 2600;
      const bw = Math.max(lo, Math.min(hi, ideal));
      const s = Math.min(w / bw, h / bh);

      stage.style.setProperty(
        "--hf",
        Math.min(79, (79 * (bw - 295)) / 965).toFixed(2) + "px"
      );
      const baseW = mobile ? 640 : 1536;
      const fx = Math.max(0, (bw - baseW) / 2);
      stage.style.setProperty("--fx", fx.toFixed(2) + "px");

      stage.classList.toggle("is-fit", Math.abs(ideal - bw) > 1);
      const compact = mobile || s < 0.52;
      stage.classList.toggle("nav-compact", compact);

      if (!compact && stage.classList.contains("menu-open")) {
        setIsMenuOpen(false);
      }

      stage.style.width = bw + "px";
      stage.style.height = bh + "px";
      stage.style.transform = "translate(-50%,-50%) scale(" + s + ")";
    }

    window.addEventListener("resize", layout, { passive: true });
    window.addEventListener("orientationchange", layout, { passive: true });
    layout();

    return () => {
      window.removeEventListener("resize", layout);
      window.removeEventListener("orientationchange", layout);
    };
  }, []);

  // Spotlight Reveal Canvas Mechanic
  useEffect(() => {
    const stack = stackRef.current;
    const back = backRef.current;
    const canvas = canvasRef.current;
    if (!stack || !back || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SPOTLIGHT_R = 185;
    const mouse = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };
    let animId: number;

    function resizeCanvas() {
      if (!stack || !canvas) return;
      canvas.width = stack.offsetWidth || 600;
      canvas.height = stack.offsetHeight || 759;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    function handlePointerMove(e: PointerEvent) {
      if (!stack) return;
      const r = stack.getBoundingClientRect();
      const sx = stack.offsetWidth / r.width;
      const sy = stack.offsetHeight / r.height;
      mouse.x = (e.clientX - r.left) * sx;
      mouse.y = (e.clientY - r.top) * sy;
    }

    function handlePointerLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function handleTouchMove(e: TouchEvent) {
      if (!stack || !e.touches || !e.touches[0]) return;
      const t = e.touches[0];
      const r = stack.getBoundingClientRect();
      const sx = stack.offsetWidth / r.width;
      const sy = stack.offsetHeight / r.height;
      mouse.x = (t.clientX - r.left) * sx;
      mouse.y = (t.clientY - r.top) * sy;
    }

    function handleTouchEnd() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    stack.addEventListener("pointermove", handlePointerMove);
    stack.addEventListener("pointerleave", handlePointerLeave);
    stack.addEventListener("touchmove", handleTouchMove, { passive: true });
    stack.addEventListener("touchend", handleTouchEnd);

    function render(x: number, y: number) {
      if (!canvas || !ctx || !back) return;
      if (canvas.width === 0 || canvas.height === 0) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, SPOTLIGHT_R);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.62, "rgba(255,255,255,1)");
      grad.addColorStop(0.8, "rgba(255,255,255,0.5)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.fill();
      const url = canvas.toDataURL();
      back.style.maskImage = "url(" + url + ")";
      back.style.webkitMaskImage = "url(" + url + ")";
    }

    function loop() {
      smooth.x += (mouse.x - smooth.x) * 0.1;
      smooth.y += (mouse.y - smooth.y) * 0.1;
      render(smooth.x, smooth.y);
      animId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
      if (stack) {
        stack.removeEventListener("pointermove", handlePointerMove);
        stack.removeEventListener("pointerleave", handlePointerLeave);
        stack.removeEventListener("touchmove", handleTouchMove);
        stack.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, []);

  // Web Animations API Entrance Animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || typeof Element.prototype.animate !== "function") {
      return;
    }

    document.documentElement.classList.add("intro");

    const near = window.innerWidth < 640 ? 0.6 : 1;
    function px(v: number) {
      return (v * near).toFixed(2) + "px";
    }
    const TYPE = "cubic-bezier(.16,1,.3,1)";
    const SOFT = "cubic-bezier(.22,.61,.36,1)";

    const anims: Animation[] = [];

    function run(
      els: Element | Element[] | NodeListOf<Element> | null,
      keyframes: Keyframe[],
      durSec: number,
      atSec: number,
      staggerSec = 0,
      easing = "ease"
    ) {
      if (!els) return;
      const list = Array.isArray(els)
        ? els
        : els instanceof NodeList
        ? Array.from(els)
        : [els];
      list.forEach((el, i) => {
        if (!el) return;
        const anim = el.animate(keyframes, {
          duration: durSec * 1000,
          delay: (atSec + i * staggerSec) * 1000,
          fill: "both",
          easing: easing,
        });
        anims.push(anim);
      });
    }

    function fade(from: string) {
      return [
        { opacity: 0, transform: from },
        { opacity: 1, transform: "none" },
      ];
    }

    // 1. Header elements
    run(document.querySelector(".brand"), fade("translateY(-10px)"), 0.5, 0.04, 0, SOFT);
    run(document.querySelector(".menu"), fade("translateY(-10px)"), 0.5, 0.09, 0, SOFT);
    run(document.querySelector(".nav"), fade("translateY(-10px)"), 0.55, 0.13, 0, SOFT);
    run(document.querySelector(".join"), fade("translateY(-10px)"), 0.55, 0.18, 0, SOFT);

    // 2. Headline lines
    const lines = document.querySelectorAll(".headline-line");
    lines.forEach((line, i) => {
      run(
        line,
        [
          { clipPath: "inset(0 -.12em 100% -.12em)" },
          { clipPath: "inset(-.34em -.12em -.34em -.12em)" },
        ],
        0.95,
        0.22 + i * 0.11,
        0,
        TYPE
      );

      Array.from(line.children).forEach((child) => {
        run(
          child,
          [{ transform: "translateY(.9em)" }, { transform: "none" }],
          0.95,
          0.22 + i * 0.11,
          0,
          TYPE
        );
      });
    });

    // 3. Hero
    run(
      document.querySelector(".hero"),
      [
        { opacity: 0, transform: "translateY(" + px(22) + ") scale(.99)" },
        { opacity: 1, transform: "none" },
      ],
      1.05,
      0.48,
      0,
      TYPE
    );

    // 4. Features
    run(
      document.querySelectorAll(".feature"),
      fade("translateX(" + px(12) + ")"),
      0.55,
      0.52,
      0.07,
      SOFT
    );

    // 5. Ghost & Robo-o-avatar
    run(document.querySelectorAll(".ghost"), [{ opacity: 0 }, { opacity: 1 }], 0.9, 0.62, 0.09, SOFT);
    run(document.querySelector(".robo-o-avatar"), fade("scale(.88)"), 0.62, 0.8, 0, TYPE);

    // 6. Glass card & Creator
    run(document.querySelector(".glass-card"), fade("translateY(" + px(18) + ")"), 0.78, 0.7, 0, TYPE);
    run(document.querySelector(".creator"), fade("translateY(" + px(10) + ")"), 0.6, 0.82, 0, SOFT);

    // 7. Material, avatars, socials
    run(document.querySelector(".material"), [{ opacity: 0 }, { opacity: 1 }], 0.72, 0.86, 0, SOFT);
    run(
      document.querySelector(".material-pill"),
      [{ transform: "translateX(" + px(16) + ")" }, { transform: "none" }],
      0.72,
      0.86,
      0,
      TYPE
    );
    run(document.querySelectorAll(".gallery .avatar"), fade("scale(.9)"), 0.55, 0.94, 0.06, TYPE);
    run(document.querySelectorAll(".social"), fade("translateY(" + px(9) + ")"), 0.5, 1.08, 0.05, SOFT);

    // Cleanup when done
    const timer = setTimeout(() => {
      document.documentElement.classList.remove("intro");
    }, 4500);

    return () => {
      clearTimeout(timer);
      document.documentElement.classList.remove("intro");
      anims.forEach((anim) => {
        try {
          anim.cancel();
        } catch {}
      });
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#d6e6f5] text-[#06192f] overflow-x-hidden">
      {/* =========================================================================
          VIEWPORT & RESPONSIVE SCALED STAGE (Hero Arena)
          ========================================================================= */}
      <main
        className="viewport"
        aria-label="PRIMA — Platform Review Interaktif Medis Adaptif"
      >
        <div
          ref={stageRef}
          className={`stage ${isMenuOpen ? "menu-open" : ""}`}
        >
          {/* Header */}
          <header className="header">
            <Link
              href="/"
              className="brand"
              aria-label="PRIMA — Platform Review Interaktif Medis Adaptif"
            >
              <div className="brand-badge">P</div>
              <span className="brand-text">PRIMA</span>
            </Link>

            

            <nav className="nav" aria-label="Main navigation">
              {[
                { label: "Atlas 3D", href: "#home" },
                { label: "Cara Belajar", href: "#cara-belajar" },
                { label: "Kurikulum FK", href: "#kurikulum" },
                { label: "Peta Kelemahan", href: "/kelemahan" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={activeNav === item.label ? "active" : ""}
                  onClick={() => {
                    setActiveNav(item.label);
                    say(item.label);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <Link href="/beranda" className="join" aria-label="Masuk ke aplikasi PRIMA">
              <span className="join-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.5 21c.4-5 3.1-7.3 7.5-7.3s7.1 2.3 7.5 7.3"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="join-label">Masuk Aplikasi</span>
            </Link>

            {/* Menu panel (for compact / mobile navigation) */}
            <div
              ref={menuPanelRef}
              className="menu-panel"
              aria-hidden={!isMenuOpen}
            >
              {[
                { label: "Atlas 3D", href: "#home" },
                { label: "Cara Belajar", href: "#cara-belajar" },
                { label: "Kurikulum FK", href: "#kurikulum" },
                { label: "Peta Kelemahan", href: "/kelemahan" },
                { label: "FAQ", href: "#faq" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={activeNav === item.label ? "active" : ""}
                  onClick={() => {
                    setActiveNav(item.label);
                    closeMenu();
                  }}
                >
                  {item.label}
                </a>
              ))}
              <Link href="/beranda" className="menu-join" onClick={closeMenu}>
                <span className="join-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="26" height="26">
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      fill="none"
                      stroke="var(--ink)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.5 21c.4-5 3.1-7.3 7.5-7.3s7.1 2.3 7.5 7.3"
                      fill="none"
                      stroke="var(--ink)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="join-label">Masuk Aplikasi PRIMA</span>
              </Link>
            </div>
          </header>

          {/* Headline */}
          <h1 className="headline" id="home">
            <span className="headline-line">
              <span className="hl-rv">Anatomi tubuh — manusia</span>
            </span>
            <span className="headline-line headline-line2">
              <svg className="chain" viewBox="0 0 151 48" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M22 6c-9.94 0-18 8.06-18 18s8.06 18 18 18h16c9.94 0 18-8.06 18-18s-8.06-18-18-18H22zm0 8h16c5.52 0 10 4.48 10 10s-4.48 10-10 10H22c-5.52 0-10-4.48-10-10s4.48-10 10-10zm45.5-8c-9.94 0-18 8.06-18 18s8.06 18 18 18h16c9.94 0 18-8.06 18-18s-8.06-18-18-18h-16zm0 8h16c5.52 0 10 4.48 10 10s-4.48 10-10 10h-16c-5.52 0-10-4.48-10-10s4.48-10 10-10zm45.5-8c-9.94 0-18 8.06-18 18s8.06 18 18 18h16c9.94 0 18-8.06 18-18s-8.06-18-18-18h-16zm0 8h16c5.52 0 10 4.48 10 10s-4.48 10-10 10h-16c-5.52 0-10-4.48-10-10s4.48-10 10-10z"
                />
              </svg>
              <span>jelajahi sistem organ</span>
            </span>
          </h1>

          {/* Features */}
          <div className="features">
            <div className="feature">
              <span>Atlas 3D</span> <b>/01</b>
            </div>
            <div className="feature">
              <span>Lapisan Organ</span> <b>/02</b>
            </div>
            <div className="feature">
              <span>Interaktif</span> <b>/03</b>
            </div>
          </div>

          {/* Creator */}
          <div className="creator">
            <div className="verified" aria-hidden="true">
              <svg viewBox="0 0 12 12" width="11" height="11">
                <path
                  d="M2.2 6.2 4.7 8.5 9.8 3"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="creator-copy">
              <div>PRIMA MedTech</div>
              <div className="series">Modul Anatomi Kedokteran</div>
            </div>
          </div>

          {/* Glass Card */}
          <div className="glass-card">
            <div className="card-top">
              <div className="count">
                <strong>+206</strong>
                <small>struktur organ</small>
              </div>
              <button
                className="eye"
                type="button"
                aria-label="Pratinjau visual anatomi"
                onClick={() => toggleAwake("eye")}
              >
                <svg
                  viewBox="0 0 32 22"
                  width="33"
                  height="23"
                  aria-hidden="true"
                >
                  <path
                    d="M1 11C4 4 11 1 16 1s12 3 15 10c-3 7-10 10-15 10S4 18 1 11z"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="16"
                    cy="11"
                    r="3.5"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            </div>
            <p className="card-copy">
              Eksplorasi anatomi manusia,
              <br />
              interaktif lapis demi lapis.
            </p>
            <div className="card-bottom">
              <div className="start">
                Mulai
                <br />
                <strong>belajar</strong>
              </div>
              <button
                className="shuffle"
                type="button"
                aria-label="Ganti sistem organ"
                onClick={() => chooseSystem(currentIndex + 1)}
              >
                <svg
                  viewBox="0 0 30 30"
                  width="27"
                  height="27"
                  aria-hidden="true"
                >
                  <path
                    d="M4 8h5l12 14h5M21 8h5v5M26 8l-6 6M4 22h5l3.5-4.1M17.5 12.1 21 8"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 22h5v-5"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className={`play ${isAwake ? "active" : ""}`}
                type="button"
                aria-label="Aktifkan mode pemindaian"
                aria-pressed={isAwake}
                onClick={() => toggleAwake("play")}
              >
                <svg
                  viewBox="0 0 24 28"
                  width="24"
                  height="26"
                  aria-hidden="true"
                >
                  <path d="m3 2 19 12L3 26z" fill="#fff" />
                </svg>
              </button>
            </div>
          </div>

          {/* Ghost typography behind the subject */}
          <div className="ghost ghost-one" aria-hidden="true">
            B<i className="o-gap"></i>DY
          </div>
          <div className="ghost ghost-two" aria-hidden="true">
            SCAN
          </div>

          {/* Robo-o-avatar */}
          <div className="robo-o-avatar" aria-hidden="true">
            <img src={HERO_FRONT} alt="" />
          </div>

          {/* Hero with Spotlight Reveal */}
          <div className={`hero ${isAwake ? "awake" : ""}`} id="hero">
            <div ref={stackRef} className="hero-stack">
              <img
                className="hero-front"
                alt="Model 3D kerangka tulang anatomi manusia"
                src={HERO_FRONT}
              />
              <img
                ref={backRef}
                className="hero-back"
                aria-hidden="true"
                alt="Lapisan kulit, otot, dan sistem saraf bercahaya"
                src={HERO_BACK}
              />
              <canvas
                ref={canvasRef}
                className="hero-mask-canvas"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Material */}
          <div className="material">
            <div className="material-pill">
              <div className="material-thumb">
                <img src={MATERIAL} alt="Lapisan jaringan organ tubuh" />
              </div>
              <div className="material-copy">
                Lapisan
                <br />
                jaringan
              </div>
              <button
                className="material-next"
                type="button"
                aria-label="Ganti lapisan jaringan"
                onClick={() => chooseSystem(currentIndex + 1)}
              >
                <svg
                  viewBox="0 0 32 32"
                  width="30"
                  height="30"
                  aria-hidden="true"
                >
                  <path
                    d="M7 8 24 25M12 25h12V13"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Gallery */}
          <div
            className="gallery"
            role="group"
            aria-label="Pilihan sistem organ tubuh"
          >
            {AVATAR_URLS.map((url, i) => (
              <button
                key={url}
                className={`avatar ${currentIndex === i ? "active" : ""}`}
                type="button"
                aria-label={SYSTEM_NAMES[i]}
                style={
                  {
                    "--iw": "94%",
                    "--il": "3%",
                    "--it": "3%",
                    background: "rgba(214,230,245,.45)",
                  } as React.CSSProperties
                }
                onClick={() => chooseSystem(i)}
              >
                <img src={url} alt={SYSTEM_NAMES[i]} />
              </button>
            ))}
          </div>

          {/* Socials */}
          <div className="socials" aria-label="Social links">
            <button
              className="social"
              type="button"
              aria-label="Instagram"
              data-name="Instagram"
              onClick={() => say("Instagram dipilih")}
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
                fill="var(--ink)"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </button>
            <button
              className="social"
              type="button"
              aria-label="Facebook"
              data-name="Facebook"
              onClick={() => say("Facebook dipilih")}
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
                fill="var(--ink)"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button
              className="social"
              type="button"
              aria-label="Telegram"
              data-name="Telegram"
              onClick={() => say("Telegram dipilih")}
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
                fill="var(--ink)"
              >
                <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.674c.458 0 .661-.21.917-.457l2.203-2.141 4.582 3.385c.845.466 1.453.226 1.664-.783l3.008-14.17c.308-1.236-.472-1.8-1.437-1.478z" />
              </svg>
            </button>
          </div>

          {/* Toast */}
          <div
            className={`toast ${toastMsg ? "show" : ""}`}
            role="status"
            aria-live="polite"
          >
            {toastMsg}
          </div>
        </div>
      </main>

            {/* =========================================================================
          SECTION: CARA BELAJAR (Asymmetrical 2-Column Medical Learning Engine)
          ========================================================================= */}
      <section
        id="cara-belajar"
        aria-label="Cara belajar anatomi interaktif"
        onMouseEnter={() => {
          if (autoRotateTimerRef.current) {
            clearInterval(autoRotateTimerRef.current);
            autoRotateTimerRef.current = null;
          }
        }}
        onMouseLeave={() => {
          if (!userHasInteracted) {
            autoRotateTimerRef.current = setInterval(() => {
              setActiveStep((prev) => (prev + 1) % 3);
            }, 6000);
          }
        }}
      >
        {/* Teks Bayangan Raksasa "LATIHAN" di Belakang */}
        <div className="cara-watermark" aria-hidden="true">
          <span>LATIHAN</span>
        </div>

        <div className="cara-container">
          {/* Layout Asimetris Dua Kolom: Kiri ~40%, Kanan ~60% di Desktop */}
          <div className="cara-grid">
            {/* KOLOM KIRI (~40%): Label, Headline, Daftar Tiga Langkah Tipografi Besar */}
            <div className="cara-col-left reveal-init">
              {/* Label kecil & Headline */}
              <div>
                <span className="cara-label">
                  <span className="slash">/</span> Cara belajar
                </span>
                <h2 className="cara-headline">
                  Latihan yang menyesuaikan{" "}
                  <strong>kelemahanmu</strong>
                </h2>
              </div>

              {/* Daftar Tiga Langkah (Tanpa Kotak, Tipografi Besar, Indeks /01 /02 /03) */}
              <div className="cara-steps-box">
                {/* Garis Vertikal Penanda Progres (Desktop) */}
                <div className="cara-indicator-track" aria-hidden="true">
                  <div
                    className="cara-indicator-thumb"
                    style={{
                      transform: `translateY(${indicatorTop}px)`,
                    }}
                  ></div>
                </div>

                {/* Tablist Langkah: Horizontal Scroll di HP, Vertikal di Desktop */}
                <div
                  role="tablist"
                  aria-label="Langkah cara belajar"
                  className="cara-tablist scrollbar-none"
                >
                  {/* LANGKAH /01 */}
                  <button
                    ref={(el) => {
                      stepBtnsRef.current[0] = el;
                    }}
                    type="button"
                    role="tab"
                    id="tab-0"
                    aria-selected={activeStep === 0}
                    aria-controls="panel-0"
                    tabIndex={activeStep === 0 ? 0 : -1}
                    className="cara-step-btn"
                    onClick={() => switchStep(0, true)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                        e.preventDefault();
                        switchStep(1, true);
                        stepBtnsRef.current[1]?.focus();
                      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        switchStep(2, true);
                        stepBtnsRef.current[2]?.focus();
                      }
                    }}
                  >
                    <div className="cara-step-head">
                      <span
                        className={`cara-step-num ${
                          activeStep === 0 ? "is-active" : "is-inactive"
                        }`}
                      >
                        /01
                      </span>
                      <span
                        className={`cara-step-title ${
                          activeStep === 0 ? "is-active" : "is-inactive"
                        }`}
                      >
                        Rencanakan
                      </span>
                    </div>
                    <div
                      className={`cara-step-desc ${
                        activeStep === 0 ? "is-active" : "is-inactive"
                      }`}
                    >
                      <p>
                        Isi tanggal ujianmu, pilih regio target, dan biarkan
                        sistem membagi beban materi jadi sasaran harian.
                      </p>
                    </div>
                  </button>

                  {/* LANGKAH /02 */}
                  <button
                    ref={(el) => {
                      stepBtnsRef.current[1] = el;
                    }}
                    type="button"
                    role="tab"
                    id="tab-1"
                    aria-selected={activeStep === 1}
                    aria-controls="panel-1"
                    tabIndex={activeStep === 1 ? 0 : -1}
                    className="cara-step-btn"
                    onClick={() => switchStep(1, true)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                        e.preventDefault();
                        switchStep(2, true);
                        stepBtnsRef.current[2]?.focus();
                      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        switchStep(0, true);
                        stepBtnsRef.current[0]?.focus();
                      }
                    }}
                  >
                    <div className="cara-step-head">
                      <span
                        className={`cara-step-num ${
                          activeStep === 1 ? "is-active" : "is-inactive"
                        }`}
                      >
                        /02
                      </span>
                      <span
                        className={`cara-step-title ${
                          activeStep === 1 ? "is-active" : "is-inactive"
                        }`}
                      >
                        Latihan di 3D
                      </span>
                    </div>
                    <div
                      className={`cara-step-desc ${
                        activeStep === 1 ? "is-active" : "is-inactive"
                      }`}
                    >
                      <p>
                        Klik struktur yang disorot langsung pada model atau
                        sebutkan namanya, kamu langsung dapat umpan balik.
                      </p>
                    </div>
                  </button>

                  {/* LANGKAH /03 */}
                  <button
                    ref={(el) => {
                      stepBtnsRef.current[2] = el;
                    }}
                    type="button"
                    role="tab"
                    id="tab-2"
                    aria-selected={activeStep === 2}
                    aria-controls="panel-2"
                    tabIndex={activeStep === 2 ? 0 : -1}
                    className="cara-step-btn"
                    onClick={() => switchStep(2, true)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                        e.preventDefault();
                        switchStep(0, true);
                        stepBtnsRef.current[0]?.focus();
                      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        switchStep(1, true);
                        stepBtnsRef.current[1]?.focus();
                      }
                    }}
                  >
                    <div className="cara-step-head">
                      <span
                        className={`cara-step-num ${
                          activeStep === 2 ? "is-active" : "is-inactive"
                        }`}
                      >
                        /03
                      </span>
                      <span
                        className={`cara-step-title ${
                          activeStep === 2 ? "is-active" : "is-inactive"
                        }`}
                      >
                        Diulang otomatis
                      </span>
                    </div>
                    <div
                      className={`cara-step-desc ${
                        activeStep === 2 ? "is-active" : "is-inactive"
                      }`}
                    >
                      <p>
                        Struktur yang sering salah otomatis dijadwalkan ulang
                        lebih sering dengan spaced repetition.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tombol Pill Navy & Tautan Teks di Bawah Daftar */}
              <div className="cara-actions">
                <Link
                  href="/latihan"
                  className="cara-btn-navy"
                >
                  Coba latihan 3D
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
                <Link
                  href="/beranda"
                  className="cara-link-dashboard"
                >
                  <span>Lihat contoh dashboard</span>
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* KOLOM KANAN (~60%): Satu Panggung Kaca Buram Besar Bersudut Membulat */}
            <div className="cara-col-right reveal-init scale-up reveal-delay-2">
              <div id="stage-viewport">
                {/* PANGGUNG 01: Rencanakan */}
                <div
                  id="panel-0"
                  role="tabpanel"
                  aria-labelledby="tab-0"
                  className={`cara-panel ${
                    activeStep === 0 ? "is-active" : "is-inactive"
                  }`}
                >
                  {/* Header Panggung 01 */}
                  <div className="cara-p1-header">
                    <div>
                      <span className="cara-target-tag">
                        Perencana Blok Kedokteran
                      </span>
                      <p className="cara-target-title">
                        Regio: Kepala &amp; Leher (Caput)
                      </p>
                    </div>
                    <div className="cara-badge-exam">
                      Ujian Blok: 24 Nov 2026 · <strong>H-18</strong>
                    </div>
                  </div>

                  {/* Kalender Baris Hari Aktif (Sen - Min) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="cara-cal-label" style={{ margin: 0 }}>
                        Jadwal Belajar Pekan Ini
                      </span>
                      <span className="text-[11px] font-semibold text-[#77899c]">
                        Target Harian: 20 Struktur
                      </span>
                    </div>
                    <div className="cara-cal-grid">
                      {[
                        { day: "Sen", date: "17", count: "16 str", done: true },
                        { day: "Sel", date: "18", count: "18 str", done: true },
                        { day: "Rab", date: "19", count: "18 str", done: true },
                        { day: "Kam", date: "20", count: "20 str", today: true },
                        { day: "Jum", date: "21", count: "16 str" },
                        { day: "Sab", date: "22", count: "Kuis" },
                        { day: "Min", date: "23", count: "Ulang" },
                      ].map((item, idx) => {
                        const isSelected = plannerDayIdx === idx;
                        return (
                          <button
                            key={item.day}
                            type="button"
                            onClick={() => {
                              setUserHasInteracted(true);
                              setPlannerDayIdx(idx);
                            }}
                            className={
                              item.today
                                ? "cara-day-today"
                                : isSelected
                                ? "cara-day-card"
                                : "cara-day-card"
                            }
                            style={
                              isSelected && !item.today
                                ? {
                                    borderColor: "#1169dc",
                                    background: "rgba(17,105,220,0.08)",
                                  }
                                : undefined
                            }
                          >
                            <span className="cara-day-name">{item.day}</span>
                            <span className="cara-day-num">{item.date}</span>
                            <span className="cara-day-pill">
                              {item.done ? "✓ Selesai" : item.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Checklist Target Interaktif Harian (Dari /perencana) */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11.5px] font-semibold text-[#06192f]">
                        Sasaran Belajar Hari Ini (Kamis, 20 Nov)
                      </span>
                      <span className="text-[11px] font-bold text-[#06192f]">
                        {p1CompletedCount} / {p1TotalCount} Selesai ({p1Percent}%)
                      </span>
                    </div>

                    <div className="cara-planner-checklist">
                      {p1Checklist.map((target) => (
                        <div
                          key={target.id}
                          onClick={() => toggleP1Checklist(target.id)}
                          className={`cara-check-item ${
                            target.completed ? "is-done" : ""
                          }`}
                        >
                          <div className="flex items-center min-w-0 flex-1">
                            <span className="cara-check-checkbox">
                              {target.completed && (
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </span>
                            <div className="cara-check-text truncate">
                              <p className="cara-check-title truncate">
                                {target.title}
                              </p>
                              <span className="cara-check-sub">
                                {target.category}
                              </span>
                            </div>
                          </div>
                          <span className="cara-check-badge">
                            {target.count} str
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar Pencapaian */}
                    <div className="mt-2.5">
                      <div className="w-full h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#06192f] transition-all duration-300 rounded-full"
                          style={{ width: `${p1Percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Smart Suggestion Hint Box */}
                  <div className="cara-smart-hint">
                    <span style={{ fontSize: "14px" }}>💡</span>
                    <div>
                      <strong>Beban Terbagi Otomatis:</strong> 20 struktur per
                      hari memastikan 15 otot kraniofasial tuntas diulang sebelum
                      H-7 ujian blok.
                    </div>
                  </div>
                </div>

                {/* PANGGUNG 02: Latihan di 3D */}
                <div
                  id="panel-1"
                  role="tabpanel"
                  aria-labelledby="tab-1"
                  className={`cara-panel ${
                    activeStep === 1 ? "is-active" : "is-inactive"
                  }`}
                >
                  {/* Header Panggung 02 */}
                  <div className="cara-p2-header">
                    <span className="cara-target-tag">
                      Identifikasi Anatomi 3D
                    </span>
                    <span className="cara-specimen-badge">
                      Model 3D Kepala &amp; Wajah (Caput)
                    </span>
                  </div>

                  {/* Real 3D Interactive WebGL Anatomy Canvas */}
                  <div className="cara-3d-box">
                    <AnatomyViewer
                      structures={caputStructures}
                      selectedStructureId={highlightedStructureId}
                      highlightedStructureId={highlightedStructureId}
                      correctStructureId={quizAnswer === "correct" ? "struct-c-01" : null}
                      incorrectStructureId={quizAnswer === "wrong" ? highlightedStructureId : null}
                      hintStructureId={null}
                      modelUrl="/models/muscles.glb"
                      onMeshClick={handleMeshClick}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Pertanyaan & Tiga Pilihan Pill */}
                  <div className="cara-quiz-box">
                    <div className="cara-quiz-row">
                      <p className="cara-quiz-title">
                        Struktur yang disorot?
                      </p>
                      <span className="cara-quiz-status">
                        {quizAnswer ? "Hasil kuis:" : "Klik model 3D atau pilih jawaban:"}
                      </span>
                    </div>

                    <div
                      className="cara-quiz-grid"
                      role="group"
                      aria-label="Pilihan struktur anatomi"
                    >
                      <button
                        type="button"
                        onClick={() => handleQuizChoice("struct-c-01", true)}
                        className={`cara-quiz-pill ${
                          highlightedStructureId === "struct-c-01" && quizAnswer === "correct"
                            ? "is-correct"
                            : ""
                        }`}
                      >
                        M. Frontalis
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuizChoice("struct-c-04", false)}
                        className={`cara-quiz-pill ${
                          highlightedStructureId === "struct-c-04" && quizAnswer === "wrong"
                            ? "is-wrong"
                            : ""
                        }`}
                      >
                        M. Temporalis
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuizChoice("struct-c-05", false)}
                        className={`cara-quiz-pill ${
                          highlightedStructureId === "struct-c-05" && quizAnswer === "wrong"
                            ? "is-wrong"
                            : ""
                        }`}
                      >
                        M. Masseter
                      </button>
                    </div>

                    {/* Umpan Balik Singkat */}
                    <div
                      className={`cara-feedback-box ${
                        quizAnswer === "correct"
                          ? "is-correct"
                          : quizAnswer === "wrong"
                          ? "is-wrong"
                          : "is-hidden"
                      }`}
                      aria-live="polite"
                    >
                      <span>
                        {quizAnswer === "correct"
                          ? "Benar! Musculus Frontalis berfungsi mengangkat alis dan mengerutkan kulit dahi (inervasi N. Facialis / CN VII)."
                          : quizAnswer === "wrong"
                          ? "Kurang tepat. Struktur yang disorot adalah Musculus Frontalis pada regio dahi."
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PANGGUNG 03: Diulang otomatis */}
                {/* PANGGUNG 03: Diulang otomatis */}
                <div
                  id="panel-2"
                  role="tabpanel"
                  aria-labelledby="tab-2"
                  className={`cara-panel ${
                    activeStep === 2 ? "is-active" : "is-inactive"
                  }`}
                >
                  {/* Header Panggung 03 */}
                  <div className="cara-p2-header">
                    <div>
                      <span className="cara-target-tag">
                        Mesin Spaced Repetition Adaptif
                      </span>
                      <p className="cara-target-title">
                        Peta Retensi &amp; Interval Memori
                      </p>
                    </div>
                    <span className="cara-interval-badge">
                      Algoritma FSR / SuperMemo SM-2
                    </span>
                  </div>

                  {/* Tiga Kartu Status Memori Nyata (Dari /kelemahan) */}
                  <div className="cara-retention-list">
                    {/* Item 1: Kritis (Interval 1 Hari) */}
                    <div className="cara-retention-card">
                      <div className="cara-ret-left truncate">
                        <div className="cara-ret-score red">
                          <span>38%</span>
                        </div>
                        <div className="truncate">
                          <p className="text-[12.5px] font-semibold text-[#06192f] truncate m-0">
                            N. Facialis (CN VII) - R. Temporalis &amp; Buccalis
                          </p>
                          <span className="text-[10.5px] text-[#64748b]">
                            Sering salah: 4x · Terakhir dilatih: Kemarin
                          </span>
                        </div>
                      </div>
                      <span className="cara-status-pill red">
                        ⚠️ Jatuh Tempo: {criticalInterval}
                      </span>
                    </div>

                    {/* Item 2: Konsolidasi (Interval 3 Hari) */}
                    <div className="cara-retention-card">
                      <div className="cara-ret-left truncate">
                        <div className="cara-ret-score amber">
                          <span>65%</span>
                        </div>
                        <div className="truncate">
                          <p className="text-[12.5px] font-semibold text-[#06192f] truncate m-0">
                            Musculus Masseter &amp; M. Temporalis
                          </p>
                          <span className="text-[10.5px] text-[#64748b]">
                            Sering salah: 1x · Retensi meningkat
                          </span>
                        </div>
                      </div>
                      <span className="cara-status-pill amber">
                        📅 Review: +3 Hari
                      </span>
                    </div>

                    {/* Item 3: Kuat (Interval 14 Hari) */}
                    <div className="cara-retention-card">
                      <div className="cara-ret-left truncate">
                        <div className="cara-ret-score green">
                          <span>94%</span>
                        </div>
                        <div className="truncate">
                          <p className="text-[12.5px] font-semibold text-[#06192f] truncate m-0">
                            Galea Aponeurotica &amp; Venter Frontalis
                          </p>
                          <span className="text-[10.5px] text-[#64748b]">
                            3x berturut-turut benar · Memori stabil
                          </span>
                        </div>
                      </div>
                      <span className="cara-status-pill green">
                        ✅ Interval: {consolidatedInterval}
                      </span>
                    </div>
                  </div>

                  {/* Widget Interaktif: Uji Respon Spaced Repetition */}
                  <div className="cara-sim-box">
                    <div className="cara-sim-row">
                      <span className="text-[11px] font-semibold text-[#06192f]">
                        Simulasi Kalibrasi Algoritma:
                      </span>
                      <span className="text-[10px] text-[#77899c]">
                        Klik untuk coba respon sistem
                      </span>
                    </div>

                    <div className="cara-sim-row">
                      <button
                        type="button"
                        onClick={() => handleSimulateRetention("reset")}
                        className="cara-sim-btn wrong"
                      >
                        <span>❌ Jawab Lupa / Sulit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimulateRetention("boost")}
                        className="cara-sim-btn correct"
                      >
                        <span>✅ Jawab Ingat / Tepat</span>
                      </button>
                    </div>

                    {simulatedFeedback && (
                      <div
                        className={`cara-sim-feedback ${
                          simulatedFeedback.type === "reset" ? "red" : "green"
                        }`}
                      >
                        {simulatedFeedback.msg}
                      </div>
                    )}
                  </div>

                  {/* Distribusi Retensi Seluruh Regio (Dari /beranda) */}
                  <div>
                    <div className="flex justify-between items-center text-[11px] text-[#64748b] mb-1">
                      <span>Distribusi 20 Struktur Regio Caput:</span>
                      <span className="font-semibold text-[#06192f]">
                        3 Kritis · 5 Konsolidasi · 12 Dikuasai
                      </span>
                    </div>
                    <div className="cara-retention-segmented-bar">
                      <div className="cara-seg-red" title="15% Kritis (Ulang Harian)"></div>
                      <div className="cara-seg-amber" title="25% Konsolidasi (3-7 Hari)"></div>
                      <div className="cara-seg-green" title="60% Dikuasai (14-21 Hari)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: KURIKULUM 6 REGIO (Interactive Master-Detail Anatomical Explorer)
          ========================================================================= */}
      <section
        id="kurikulum"
        aria-label="Cakupan kurikulum 6 regio tubuh standar kedokteran"
      >
        {/* Giant Watermark */}
        <div className="kuri-watermark" aria-hidden="true">
          <span>KURIKULUM</span>
        </div>

        <div className="kuri-container">
          {/* Section Header */}
          <div className="kuri-header reveal-init">
            <span className="cara-label">
              <span className="slash">/</span> Cakupan kurikulum FK
            </span>
            <h2 className="kuri-headline">
              6 Regio Anatomi Standar, <strong>Terpetakan Lengkap</strong>
            </h2>
            <p className="kuri-subhead">
              Bukan sekadar ringkasan sepotong — jelajahi seluruh 87 struktur miologi,
              inervasi saraf kranialis, dan korelasi klinis yang diujikan pada ujian blok kedokteran preklinik.
            </p>
          </div>

          {/* Master-Detail Split Stage (Interactive Inspector) */}
          <div className="kuri-stage">
            {/* KOLOM KIRI: Hirarki Anatomis Kranial-ke-Kaudal */}
            <div
              className="kuri-nav-column reveal-init reveal-delay-1"
              role="tablist"
              aria-label="Daftar regio tubuh kranial ke kaudal"
            >
              {KURIKULUM_REGIONS.map((region, idx) => {
                const isActive = activeRegionIdx === idx;
                return (
                  <button
                    key={region.id}
                    type="button"
                    role="tab"
                    id={`kuri-tab-${idx}`}
                    aria-selected={isActive}
                    aria-controls="kuri-dossier-panel"
                    onClick={() => {
                      setUserHasInteracted(true);
                      setActiveRegionIdx(idx);
                      setActiveStructureIdx(null);
                    }}
                    className={`kuri-nav-btn ${isActive ? "is-active" : ""}`}
                  >
                    <div className="kuri-nav-meta">
                      <span className="kuri-nav-num">{region.num}</span>
                      <div>
                        <p className="kuri-nav-title">{region.name}</p>
                        <p className="kuri-nav-latin">{region.latin}</p>
                      </div>
                    </div>
                    <span className="kuri-nav-badge">
                      {region.structuresCount} str
                    </span>
                  </button>
                );
              })}
            </div>

            {/* KOLOM KANAN: Berkas Kurikulum Medis (Live Clinical Dossier) */}
            <div
              id="kuri-dossier-panel"
              role="tabpanel"
              aria-labelledby={`kuri-tab-${activeRegionIdx}`}
              key={activeRegionIdx} className="kuri-dossier kuri-dossier-anim reveal-init scale-up reveal-delay-2"
            >
              {/* Header Berkas */}
              <div className="kuri-dossier-top">
                <div className="kuri-dossier-title-box">
                  <div className="flex items-center gap-2">
                    <span className="kuri-block-badge">
                      {selectedKurikulumRegion.examBlock}
                    </span>
                    <span className="kuri-score-pill">
                      ✓ Retensi Rata-rata {selectedKurikulumRegion.masteryScore}% ({selectedKurikulumRegion.level})
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#06192f] mt-1 mb-0">
                    {selectedKurikulumRegion.name}{" "}
                    <span className="font-normal text-[#77899c] text-lg sm:text-xl">
                      — {selectedKurikulumRegion.subName}
                    </span>
                  </h3>
                  <span className="text-xs italic text-[#64748b]">
                    Terminologia Anatomica: {selectedKurikulumRegion.latin}
                  </span>
                </div>
              </div>

              {/* Deskripsi Fokus Kurikulum */}
              <p className="kuri-dossier-desc">
                {selectedKurikulumRegion.description}
              </p>

              {/* Kluster Struktur Interaktif */}
              <div className="kuri-chips-container">
                <div className="flex items-center justify-between">
                  <span className="kuri-chips-label">
                    Struktur Utama Terpetakan ({selectedKurikulumRegion.structuresCount} Struktur 3D):
                  </span>
                  <span className="text-[11px] text-[#77899c]">
                    Klik struktur untuk melihat fungsi &amp; inervasi
                  </span>
                </div>

                <div className="kuri-chips-grid">
                  {selectedKurikulumRegion.structures.map((struct, sIdx) => {
                    const isSelected = activeStructureIdx === sIdx;
                    return (
                      <div
                        key={struct.name}
                        onClick={() => {
                          setUserHasInteracted(true);
                          setActiveStructureIdx(isSelected ? null : sIdx);
                        }}
                        className={`kuri-chip ${isSelected ? "is-active" : ""}`}
                        title="Klik untuk melihat catatan inervasi klinis"
                      >
                        <p className="kuri-chip-title">{struct.name}</p>
                        <span className="kuri-chip-latin">{struct.latin}</span>
                        {isSelected && (
                          <div className="kuri-chip-preview">
                            {struct.role}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kotak Korelasi Klinis Ujian Blok (High-Yield Clinical Pearls) */}
              <div className="kuri-clinical-box">
                <span className="kuri-clinical-icon" aria-hidden="true">
                  🩺
                </span>
                <div>
                  <h4 className="kuri-clinical-title">
                    Korelasi Klinis Ujian Blok &amp; OSCE:
                  </h4>
                  <p className="kuri-clinical-text">
                    {selectedKurikulumRegion.clinicalCorrelation}
                  </p>
                </div>
              </div>

              {/* Footer Tindakan Berkas */}
              <div className="kuri-dossier-footer">
                <div className="flex items-center gap-3">
                  <span className="kuri-metric-tag">
                    Total: <strong>{selectedKurikulumRegion.structuresCount} Model 3D</strong>
                  </span>
                  <span className="text-[#cbd5e1]">·</span>
                  <span className="kuri-metric-tag">
                    Jadwal Ulang: <strong>{selectedKurikulumRegion.dueCount} Butuh Review</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/latihan?topic=${selectedKurikulumRegion.topicParam}`}
                    className="kuri-btn-launch"
                  >
                    <span>Latihan 3D {selectedKurikulumRegion.name}</span>
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: FAQ (Pertanyaan yang Sering Ditanyakan)
          ========================================================================= */}
      <section
        id="faq"
        aria-label="Pertanyaan yang sering ditanyakan seputar PRIMA"
      >
        {/* Giant Watermark */}
        <div className="faq-watermark" aria-hidden="true">
          <span>PERTANYAAN</span>
        </div>

        <div className="faq-container">
          {/* Section Header */}
          <div className="faq-header reveal-init">
            <span className="cara-label">
              <span className="slash">/</span> Pertanyaan Umum
            </span>
            <h2 className="faq-headline">
              Hal yang Sering Ditanyakan <strong>seputar PRIMA</strong>
            </h2>
            <p className="faq-subhead">
              Jawaban seputar kurikulum blok kedokteran, algoritma spaced repetition, spesifikasi teknis 3D, dan tujuan platform.
            </p>
          </div>

          {/* 2-Column Grid Layout */}
          <div className="faq-grid">
            {/* Kolom Kiri: Ringkasan & Fakta Kunci */}
            <div className="faq-summary-card reveal-init reveal-delay-1">
              <div>
                <span className="cara-target-tag">Pusat Informasi</span>
                <h3 className="faq-summary-title mt-1">
                  Belajar Terstruktur, Bebas Kram Ujian
                </h3>
              </div>
              <p className="faq-summary-desc">
                PRIMA mendampingi mahasiswa kedokteran menguasai ratusan struktur anatomi dan terminologi medis secara adaptif melalui visualisasi 3D spasial.
              </p>

              <div className="faq-facts-list">
                <div className="faq-fact-item">
                  <span className="faq-fact-icon">✓</span>
                  <span>Standar Terminologia Anatomica</span>
                </div>
                <div className="faq-fact-item">
                  <span className="faq-fact-icon">✓</span>
                  <span>Algoritma FSR / SM-2 Otomatis</span>
                </div>
                <div className="faq-fact-item">
                  <span className="faq-fact-icon">✓</span>
                  <span>100% WebGL Tanpa Instalasi</span>
                </div>
                <div className="faq-fact-item">
                  <span className="faq-fact-icon">✓</span>
                  <span>Dukungan Responsif Laptop &amp; HP</span>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Daftar Accordion */}
            <div
              className="faq-accordion-list reveal-init reveal-delay-2"
              role="region"
              aria-label="Daftar accordion pertanyaan umum"
            >
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={item.id}
                    className={`faq-item ${isOpen ? "is-open" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setUserHasInteracted(true);
                        setOpenFaqIdx(isOpen ? null : idx);
                      }}
                      aria-expanded={isOpen}
                      className="faq-trigger"
                    >
                      <h4 className="faq-question">{item.question}</h4>
                      <span className="faq-chevron" aria-hidden="true">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </span>
                    </button>

                    {isOpen && (
                      <div className="faq-content">
                        <p className="faq-answer">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LANDING FOOTER
          ========================================================================= */}
      <footer className="landing-footer">
        <div className="landing-footer-container reveal-init">
          <div className="landing-footer-grid">
            {/* Brand Column */}
            <div className="landing-footer-brand">
              <h3>PRIMA</h3>
              <p>
                Platform Review Interaktif Medis Adaptif. Pendamping belajar terstruktur untuk mahasiswa kedokteran preklinik dengan visualisasi anatomi 3D spasial dan spaced repetition otomatis.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white/90">
                <span>🏆 Karya Software Development</span>
              </div>
            </div>

            {/* Quick Links Column 1 */}
            <div className="landing-footer-nav">
              <h4>Modul Belajar</h4>
              <ul>
                <li>
                  <Link href="/beranda">Dashboard Beranda</Link>
                </li>
                <li>
                  <Link href="/latihan">Latihan Anatomi 3D</Link>
                </li>
                <li>
                  <Link href="/perencana">Perencana Belajar Blok</Link>
                </li>
                <li>
                  <Link href="/kelemahan">Peta Kelemahan Topik</Link>
                </li>
              </ul>
            </div>

            {/* Quick Links Column 2 */}
            <div className="landing-footer-nav">
              <h4>Kurikulum 6 Regio</h4>
              <ul>
                <li>
                  <Link href="/latihan?topic=reg-caput">Regio Caput (Kepala &amp; Wajah)</Link>
                </li>
                <li>
                  <Link href="/latihan?topic=reg-collum">Regio Collum (Leher)</Link>
                </li>
                <li>
                  <Link href="/latihan?topic=reg-thorax">Regio Thorax (Toraks &amp; Dada)</Link>
                </li>
                <li>
                  <Link href="/latihan?topic=reg-abdomen">Regio Abdomen (Perut)</Link>
                </li>
                <li>
                  <Link href="/latihan?topic=reg-pelvis">Regio Pelvis (Panggul)</Link>
                </li>
                <li>
                  <Link href="/latihan?topic=reg-membrum">Regio Membrum (Ekstremitas)</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Row & Medical Disclaimer */}
          <div className="landing-footer-bottom">
            <p className="m-0">
              PRIMA adalah alat bantu belajar (edukasi), bukan merupakan alat diagnosis atau saran medis klinis.
            </p>
            <p className="m-0 text-[#94a3b8]">
              © 2026 PRIMA MedTech · Seluruh hak cipta dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
