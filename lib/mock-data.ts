// Mock data terpusat untuk aplikasi PRIMA (Platform Review Interaktif Medis Adaptif)
// Seluruh data dummy didefinisikan di sini agar mudah diganti dengan backend di kemudian hari.

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  email: string;
  semester: number;
  avatarUrl: string;
  institution: string;
  targetExam: string;
  examDate: string; // ISO date string
  streakDays: number;
}

export interface DashboardStats {
  dueTodayCount: number;
  dueTodayDiffText: string;
  masteryPercentage: number;
  masteryDiffText: string;
  streakDays: number;
  streakSubText: string;
  daysUntilExam: number;
  examName: string;
}

export interface WeeklyStudyItem {
  day: string; // e.g. "Sen", "Sel"
  date: string; // e.g. "28 Okt"
  itemsReviewed: number;
  targetItems: number;
}

export interface AnatomyTopicWeakness {
  id: string;
  topicNameIndo: string;
  topicNameLatin: string;
  system: string;
  masteryScore: number; // 0 - 100
  totalItems: number;
  weakItemsCount: number;
  urgencyLevel: "kritis" | "sedang" | "baik" | "unggul";
}

export interface StudyRecommendation {
  id: string;
  title: string;
  latinName: string;
  reason: string;
  dueCount: number;
  estimatedMinutes: number;
  priority: "tinggi" | "sedang" | "rendah";
  category: string;
}

export interface DailyChecklistItem {
  id: string;
  label: string;
  latinTerm?: string;
  completed: boolean;
  itemCount: number;
  tag: string;
}

// 1. Data Profil Pengguna
export const mockUserProfile: UserProfile = {
  id: "usr-01",
  name: "dr. Rina Safitri (Kandidat)",
  title: "Mahasiswa Kedokteran Preklinik",
  email: "rina.safitri@mhs.medika.ac.id",
  semester: 2,
  avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250",
  institution: "Fakultas Kedokteran Universitas Medika",
  targetExam: "Ujian Blok Anatomi: Muskuloskeletal Ekstremitas",
  examDate: "2026-11-20",
  streakDays: 5,
};

// 2. Data Statistik Ringkasan Dashboard
export const mockDashboardStats: DashboardStats = {
  dueTodayCount: 12,
  dueTodayDiffText: "4 item kritis perlu review",
  masteryPercentage: 68,
  masteryDiffText: "+4.5% dari minggu lalu",
  streakDays: 5,
  streakSubText: "Rekor terpanjang: 8 hari",
  daysUntilExam: 17,
  examName: "Blok Muskuloskeletal",
};

// 3. Data Progres Latihan Mingguan (7 Hari Terakhir)
export const mockWeeklyProgress: WeeklyStudyItem[] = [
  { day: "Sen", date: "28 Okt", itemsReviewed: 16, targetItems: 20 },
  { day: "Sel", date: "29 Okt", itemsReviewed: 24, targetItems: 20 },
  { day: "Rab", date: "30 Okt", itemsReviewed: 18, targetItems: 20 },
  { day: "Kam", date: "31 Okt", itemsReviewed: 28, targetItems: 20 },
  { day: "Jum", date: "01 Nov", itemsReviewed: 12, targetItems: 20 },
  { day: "Sab", date: "02 Nov", itemsReviewed: 32, targetItems: 25 },
  { day: "Min", date: "03 Nov", itemsReviewed: 20, targetItems: 20 },
];

// 4. Data Peta Kelemahan per Topik Anatomi (Regio Extremitas Superior)
// Urut dari yang terlemah (paling kritis) ke yang paling dikuasai
export const mockAnatomyWeaknesses: AnatomyTopicWeakness[] = [
  {
    id: "top-01",
    topicNameIndo: "Pleksus Brakialis & Percabangan Saraf",
    topicNameLatin: "Plexus Brachialis & Nervi Peripherici",
    system: "Sistem Saraf Perifer",
    masteryScore: 38,
    totalItems: 24,
    weakItemsCount: 9,
    urgencyLevel: "kritis",
  },
  {
    id: "top-02",
    topicNameIndo: "Kompartemen Posterior Lengan Atas",
    topicNameLatin: "Regio Brachii Posterior (M. Triceps Brachii)",
    system: "Sistem Muskular",
    masteryScore: 54,
    totalItems: 18,
    weakItemsCount: 5,
    urgencyLevel: "sedang",
  },
  {
    id: "top-03",
    topicNameIndo: "Kompleks Sendi Bahu & Rotator Cuff",
    topicNameLatin: "Articulatio Humeri & Musculi Rotatores",
    system: "Sistem Skeletal & Artikular",
    masteryScore: 71,
    totalItems: 22,
    weakItemsCount: 3,
    urgencyLevel: "baik",
  },
  {
    id: "top-04",
    topicNameIndo: "Kompartemen Fleksor Lengan Bawah",
    topicNameLatin: "Regio Antebrachii Anterior",
    system: "Sistem Muskular & Vaskular",
    masteryScore: 84,
    totalItems: 26,
    weakItemsCount: 2,
    urgencyLevel: "unggul",
  },
  {
    id: "top-05",
    topicNameIndo: "Otot Intrinsik & Vaskularisasi Telapak Tangan",
    topicNameLatin: "Regio Palmaris Manus & Arcus Palmaris",
    system: "Sistem Vaskular & Muskular",
    masteryScore: 92,
    totalItems: 30,
    weakItemsCount: 1,
    urgencyLevel: "unggul",
  },
];

// 5. Rekomendasi Latihan Hari Ini (3 Kartu Topik Prioritas)
export const mockRecommendations: StudyRecommendation[] = [
  {
    id: "rec-01",
    title: "Percabangan Terminal Plexus Brachialis",
    latinName: "Fasciculus Lateralis, Medialis, Posterior",
    reason: "Sering salah di 3 sesi latihan terakhir (tingkat akurasi 33%)",
    dueCount: 6,
    estimatedMinutes: 8,
    priority: "tinggi",
    category: "Inervasi Saraf",
  },
  {
    id: "rec-02",
    title: "Insersio & Origo Musculi Rotator Cuff",
    latinName: "M. Supraspinatus, Infraspinatus, Teres Minor, Subscapularis",
    reason: "Jatuh tempo review interval 3 hari (spaced repetition)",
    dueCount: 4,
    estimatedMinutes: 6,
    priority: "sedang",
    category: "Kuis 3D Anatomi",
  },
  {
    id: "rec-03",
    title: "Canalis Carpi & Nervus Medianus",
    latinName: "Retinaculum Flexorum & N. Medianus",
    reason: "Penyegaran konsep klinis sebelum ujian blok",
    dueCount: 2,
    estimatedMinutes: 5,
    priority: "rendah",
    category: "Vignette Klinis",
  },
];

// 6. Checklist Target Harian
export const mockDailyChecklist: DailyChecklistItem[] = [
  {
    id: "chk-01",
    label: "Review 6 struktur kritis Pleksus Brakialis",
    latinTerm: "N. Radialis & N. Axillaris",
    completed: true,
    itemCount: 6,
    tag: "Spaced Repetition",
  },
  {
    id: "chk-02",
    label: "Kuis 3D Rotator Cuff: Identifikasi Origo & Insersio",
    latinTerm: "M. Subscapularis",
    completed: false,
    itemCount: 4,
    tag: "Model 3D",
  },
  {
    id: "chk-03",
    label: "Ulangi 3 struktur yang salah kemarin di Antebrachium",
    latinTerm: "M. Pronator Teres",
    completed: false,
    itemCount: 3,
    tag: "Koreksi",
  },
  {
    id: "chk-04",
    label: "Latihan pemahaman klinis: Sindrom Terowongan Karpal",
    latinTerm: "Carpal Tunnel Syndrome",
    completed: false,
    itemCount: 1,
    tag: "Klinis",
  },
];

// 7. Data Rencana Belajar (Study Plans)
export type StudyPlanStatus = "sesuai jadwal" | "sedikit tertinggal" | "tertinggal";

export interface StudyPlan {
  id: string;
  topicTitle: string;
  latinName: string;
  examDate: string; // YYYY-MM-DD
  daysUntilExam: number;
  targetPerDay: number;
  totalItems: number;
  masteredItems: number;
  status: StudyPlanStatus;
  studyDays: string[]; // e.g. ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
  notes?: string;
}

export const mockStudyPlans: StudyPlan[] = [
  {
    id: "plan-01",
    topicTitle: "Anggota Gerak Atas",
    latinName: "Extremitas Superior",
    examDate: "2026-11-20",
    daysUntilExam: 17,
    targetPerDay: 20,
    totalItems: 120,
    masteredItems: 82,
    status: "sesuai jadwal",
    studyDays: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
    notes: "Fokus regio pleksus brakialis & rotator cuff",
  },
  {
    id: "plan-02",
    topicTitle: "Anggota Gerak Bawah",
    latinName: "Extremitas Inferior",
    examDate: "2026-12-05",
    daysUntilExam: 32,
    targetPerDay: 15,
    totalItems: 140,
    masteredItems: 68,
    status: "sedikit tertinggal",
    studyDays: ["Sen", "Rab", "Jum", "Sab"],
    notes: "Kuasai trigonum femorale & fossa poplitea",
  },
  {
    id: "plan-03",
    topicTitle: "Kepala dan Leher",
    latinName: "Caput et Collum",
    examDate: "2026-12-22",
    daysUntilExam: 49,
    targetPerDay: 25,
    totalItems: 180,
    masteredItems: 42,
    status: "tertinggal",
    studyDays: ["Sel", "Kam", "Sab", "Min"],
    notes: "12 nervi craniales dan trigonum colli",
  },
];

// 8. Jadwal Target Harian 14 Hari ke Depan
export interface DayTargetItem {
  id: string;
  title: string;
  latinTerm?: string;
  category: string;
  itemCount: number;
  completed: boolean;
}

export interface DaySchedule {
  id: string;
  dateStr: string; // YYYY-MM-DD
  dayName: string; // e.g. "Selasa"
  shortDay: string; // e.g. "Sel"
  formattedDate: string; // e.g. "3 Nov"
  isToday: boolean;
  totalItems: number;
  isHeavyLoad: boolean;
  smartSuggestion?: string;
  targets: DayTargetItem[];
}

export const mock14DaySchedule: DaySchedule[] = [
  {
    id: "day-01",
    dateStr: "2026-11-03",
    dayName: "Selasa",
    shortDay: "Sel",
    formattedDate: "3 Nov",
    isToday: true,
    totalItems: 14,
    isHeavyLoad: false,
    targets: [
      {
        id: "t-01-1",
        title: "Review 6 struktur kritis Pleksus Brakialis",
        latinTerm: "N. Radialis & N. Axillaris",
        category: "Spaced Repetition",
        itemCount: 6,
        completed: true,
      },
      {
        id: "t-01-2",
        title: "Kuis 3D Rotator Cuff: Identifikasi Origo & Insersio",
        latinTerm: "M. Subscapularis",
        category: "Model 3D",
        itemCount: 4,
        completed: false,
      },
      {
        id: "t-01-3",
        title: "Ulangi 3 struktur salah kemarin di Antebrachium",
        latinTerm: "M. Pronator Teres",
        category: "Koreksi",
        itemCount: 3,
        completed: false,
      },
      {
        id: "t-01-4",
        title: "Pemahaman klinis: Sindrom Terowongan Karpal",
        latinTerm: "Carpal Tunnel Syndrome",
        category: "Klinis",
        itemCount: 1,
        completed: false,
      },
    ],
  },
  {
    id: "day-02",
    dateStr: "2026-11-04",
    dayName: "Rabu",
    shortDay: "Rab",
    formattedDate: "4 Nov",
    isToday: false,
    totalItems: 18,
    isHeavyLoad: false,
    targets: [
      {
        id: "t-02-1",
        title: "Ulangi 8 struktur inervasi lengan bawah",
        latinTerm: "N. Ulnaris & N. Medianus",
        category: "Spaced Repetition",
        itemCount: 8,
        completed: false,
      },
      {
        id: "t-02-2",
        title: "Identifikasi vaskularisasi arcus palmaris",
        latinTerm: "Arcus Palmaris Superficialis et Profundus",
        category: "Model 3D",
        itemCount: 6,
        completed: false,
      },
      {
        id: "t-02-3",
        title: "Kuis sendi siku & ligamentum collateral",
        latinTerm: "Articulatio Cubiti",
        category: "Kuis",
        itemCount: 4,
        completed: false,
      },
    ],
  },
  {
    id: "day-03",
    dateStr: "2026-11-05",
    dayName: "Kamis",
    shortDay: "Kam",
    formattedDate: "5 Nov",
    isToday: false,
    totalItems: 30,
    isHeavyLoad: true,
    smartSuggestion: "Hari Kamis cukup padat (30 item). Pertimbangkan memindahkan 6 item kuis ke hari Rabu.",
    targets: [
      {
        id: "t-03-1",
        title: "Evaluasi kumulatif otot kompartemen posterior brachium",
        latinTerm: "M. Triceps Brachii & M. Anconeus",
        category: "Spaced Repetition",
        itemCount: 12,
        completed: false,
      },
      {
        id: "t-03-2",
        title: "Latihan 3D tulang carpalia & articulationes",
        latinTerm: "Ossa Carpi (Scaphoideum, Lunatum, dll)",
        category: "Model 3D",
        itemCount: 10,
        completed: false,
      },
      {
        id: "t-03-3",
        title: "Kasus klinis: Fraktur Colles dan Smith",
        latinTerm: "Fractura Extremitas Distalis Radii",
        category: "Klinis",
        itemCount: 8,
        completed: false,
      },
    ],
  },
  {
    id: "day-04",
    dateStr: "2026-11-06",
    dayName: "Jumat",
    shortDay: "Jum",
    formattedDate: "6 Nov",
    isToday: false,
    totalItems: 15,
    isHeavyLoad: false,
    targets: [
      {
        id: "t-04-1",
        title: "Review interval 5 hari Pleksus Brakialis",
        latinTerm: "Truncus Superior, Medius, Inferior",
        category: "Spaced Repetition",
        itemCount: 8,
        completed: false,
      },
      {
        id: "t-04-2",
        title: "Identifikasi otot thenar dan hypothenar",
        latinTerm: "Mm. Thenar et Hypothenar",
        category: "Model 3D",
        itemCount: 7,
        completed: false,
      },
    ],
  },
  {
    id: "day-05",
    dateStr: "2026-11-07",
    dayName: "Sabtu",
    shortDay: "Sab",
    formattedDate: "7 Nov",
    isToday: false,
    totalItems: 24,
    isHeavyLoad: false,
    targets: [
      {
        id: "t-05-1",
        title: "Simulasi Ujian Mandiri Regio Bahu & Lengan",
        latinTerm: "Articulatio Humeri & Regio Brachii",
        category: "Tryout",
        itemCount: 16,
        completed: false,
      },
      {
        id: "t-05-2",
        title: "Koreksi cepat item berstatus salah",
        latinTerm: "Repetisi Adaptif",
        category: "Koreksi",
        itemCount: 8,
        completed: false,
      },
    ],
  },
  {
    id: "day-06",
    dateStr: "2026-11-08",
    dayName: "Minggu",
    shortDay: "Min",
    formattedDate: "8 Nov",
    isToday: false,
    totalItems: 10,
    isHeavyLoad: false,
    targets: [
      {
        id: "t-06-1",
        title: "Sesi konsolidasi ringan: Flashcard inervasi kutan",
        latinTerm: "Dermatoma Extremitas Superior",
        category: "Spaced Repetition",
        itemCount: 10,
        completed: false,
      },
    ],
  },
  {
    id: "day-07",
    dateStr: "2026-11-09",
    dayName: "Senin",
    shortDay: "Sen",
    formattedDate: "9 Nov",
    isToday: false,
    totalItems: 20,
    isHeavyLoad: false,
    targets: [
      {
        id: "t-07-1",
        title: "Pengenalan regio panggul dan paha anterior",
        latinTerm: "Trigonum Femorale & M. Quadriceps",
        category: "Materi Baru",
        itemCount: 12,
        completed: false,
      },
      {
        id: "t-07-2",
        title: "Repetisi terjadwal rotatores bahu",
        latinTerm: "M. Teres Minor & Infraspinatus",
        category: "Spaced Repetition",
        itemCount: 8,
        completed: false,
      },
    ],
  },
  {
    id: "day-08",
    dateStr: "2026-11-10",
    dayName: "Selasa",
    shortDay: "Sel",
    formattedDate: "10 Nov",
    isToday: false,
    totalItems: 22,
    isHeavyLoad: false,
    targets: [
      {
        id: "t-08-1",
        title: "Vaskularisasi ekstremitas inferior",
        latinTerm: "A. Femoralis & A. Poplitea",
        category: "Model 3D",
        itemCount: 12,
        completed: false,
      },
      {
        id: "t-08-2",
        title: "Review fosa cubiti dan isinya",
        latinTerm: "Fossa Cubitalis",
        category: "Spaced Repetition",
        itemCount: 10,
        completed: false,
      },
    ],
  },
  {
    id: "day-09",
    dateStr: "2026-11-11",
    dayName: "Rabu",
    shortDay: "Rab",
    formattedDate: "11 Nov",
    isToday: false,
    totalItems: 18,
    isHeavyLoad: false,
    targets: [
      {
        id: "t-09-1",
        title: "Inervasi Nervus Ischiadicus & percabangannya",
        latinTerm: "N. Tibialis & N. Fibularis Communis",
        category: "Materi Baru",
        itemCount: 10,
        completed: false,
      },
      {
        id: "t-09-2",
        title: "Kuis kilat pleksus brakialis terminal",
        latinTerm: "Percabangan Saraf",
        category: "Kuis",
        itemCount: 8,
        completed: false,
      },
    ],
  },
  {
    id: "day-10",
    dateStr: "2026-11-12",
    dayName: "Kamis",
    shortDay: "Kam",
    formattedDate: "12 Nov",
    isToday: false,
    totalItems: 28,
    isHeavyLoad: true,
    smartSuggestion: "Target Kamis padat (28 item) menjelang minggu ujian. Sisihkan waktu ekstra 20 menit.",
    targets: [
      {
        id: "t-10-1",
        title: "Kompartemen kruris anterior dan lateral",
        latinTerm: "M. Tibialis Anterior & Mm. Fibulares",
        category: "Model 3D",
        itemCount: 14,
        completed: false,
      },
      {
        id: "t-10-2",
        title: "Review klinis Drop Foot dan Sindrom Kompartemen",
        latinTerm: "Syndroma Compartimenti",
        category: "Klinis",
        itemCount: 14,
        completed: false,
      },
    ],
  },
  {
    id: "day-11",
    dateStr: "2026-11-13",
    dayName: "Jumat",
    shortDay: "Jum",
    formattedDate: "13 Nov",
    isToday: false,
    totalItems: 16,
    isHeavyLoad: false,
    targets: [
      {
        id: "t-11-1",
        title: "Articulatio genus dan ligamenta cruciata",
        latinTerm: "Lig. Cruciatum Anterius & Posterius (ACL/PCL)",
        category: "Model 3D",
        itemCount: 10,
        completed: false,
      },
      {
        id: "t-11-2",
        title: "Review terpadu extremitas superior",
        latinTerm: "Spaced Repetition H-7",
        category: "Spaced Repetition",
        itemCount: 6,
        completed: false,
      },
    ],
  },
  {
    id: "day-12",
    dateStr: "2026-11-14",
    dayName: "Sabtu",
    shortDay: "Sab",
    formattedDate: "14 Nov",
    isToday: false,
    totalItems: 20,
    isHeavyLoad: false,
    targets: [
      {
        id: "t-12-1",
        title: "Simulasi Ujian Blok Lengkap (40 Soal Pilihan)",
        latinTerm: "Tryout Blok Muskuloskeletal",
        category: "Tryout",
        itemCount: 20,
        completed: false,
      },
    ],
  },
  {
    id: "day-13",
    dateStr: "2026-11-15",
    dayName: "Minggu",
    shortDay: "Min",
    formattedDate: "15 Nov",
    isToday: false,
    totalItems: 8,
    isHeavyLoad: false,
    targets: [
      {
        id: "t-13-1",
        title: "Review santai struktur yang masih ragu",
        latinTerm: "Penyegaran Mental",
        category: "Koreksi",
        itemCount: 8,
        completed: false,
      },
    ],
  },
  {
    id: "day-14",
    dateStr: "2026-11-16",
    dayName: "Senin",
    shortDay: "Sen",
    formattedDate: "16 Nov",
    isToday: false,
    totalItems: 16,
    isHeavyLoad: false,
    targets: [
      {
        id: "t-14-1",
        title: "Final Check: 16 Struktur Vital Extremitas Superior",
        latinTerm: "Struktur Kunci Ujian Blok",
        category: "Spaced Repetition",
        itemCount: 16,
        completed: false,
      },
    ],
  },
];

// 9. Data Lengkap Peta Kelemahan (Weakness Map)
export type MasteryLevel = "lemah" | "sedang" | "kuat";

export interface ErrorProneStructure {
  id: string;
  nameIndo: string;
  nameLatin: string;
  errorCount: number;
  lastErrorDate: string; // e.g. "02 Nov 2026"
  clinicalNote?: string;
}

export interface DetailedAnatomyTopic {
  id: string;
  nameIndo: string;
  nameLatin: string;
  regio: string; // "Extremitas Superior" | "Extremitas Inferior" | "Caput et Collum" | "Thorax"
  masteryScore: number; // 0 - 100
  level: MasteryLevel; // lemah (<50), sedang (50-74), kuat (>=75)
  totalItems: number;
  frequentErrorCount: number;
  lastPracticedDate: string; // e.g. "02 Nov 2026"
  trend6Weeks: number[]; // e.g. [20, 24, 28, 30, 35, 38]
  recommendation: string;
  errorStructures: ErrorProneStructure[];
}

export const mockDetailedAnatomyTopics: DetailedAnatomyTopic[] = [
  {
    id: "top-01",
    nameIndo: "Pleksus Brakialis & Saraf Perifer",
    nameLatin: "Plexus Brachialis & Nervi Peripherici",
    regio: "Extremitas Superior",
    masteryScore: 38,
    level: "lemah",
    totalItems: 24,
    frequentErrorCount: 9,
    lastPracticedDate: "02 Nov 2026",
    trend6Weeks: [20, 24, 28, 30, 35, 38],
    recommendation: "Ulangi 8 struktur inervasi dan cabang terminal Pleksus Brakialis selama 3 hari berturut-turut.",
    errorStructures: [
      {
        id: "err-01-1",
        nameIndo: "Fasikulus Posterior",
        nameLatin: "Fasciculus Posterior Plexus Brachialis",
        errorCount: 14,
        lastErrorDate: "02 Nov 2026",
        clinicalNote: "Sering tertukar dengan Fasciculus Lateralis pada potongan transversal axilla.",
      },
      {
        id: "err-01-2",
        nameIndo: "Nervus Axillaris",
        nameLatin: "N. Axillaris",
        errorCount: 11,
        lastErrorDate: "01 Nov 2026",
        clinicalNote: "Kerap salah diidentifikasi saat melintasi Spatium Axillare Mediale vs Laterale.",
      },
      {
        id: "err-01-3",
        nameIndo: "Nervus Musculocutaneus",
        nameLatin: "N. Musculocutaneus",
        errorCount: 9,
        lastErrorDate: "31 Okt 2026",
        clinicalNote: "Perhatikan penetrasi saraf ini menembus M. Coracobrachialis.",
      },
      {
        id: "err-01-4",
        nameIndo: "Truncus Medius",
        nameLatin: "Truncus Medius Plexus Brachialis",
        errorCount: 7,
        lastErrorDate: "30 Okt 2026",
      },
    ],
  },
  {
    id: "top-02",
    nameIndo: "Fossa Poplitea & Regio Genu Posterior",
    nameLatin: "Fossa Poplitea & Regio Genu Posterior",
    regio: "Extremitas Inferior",
    masteryScore: 44,
    level: "lemah",
    totalItems: 20,
    frequentErrorCount: 8,
    lastPracticedDate: "30 Okt 2026",
    trend6Weeks: [28, 30, 34, 38, 40, 44],
    recommendation: "Fokuskan identifikasi urutan struktur neurovaskular dari medial ke lateral di fossa poplitea.",
    errorStructures: [
      {
        id: "err-02-1",
        nameIndo: "Nervus Tibialis",
        nameLatin: "N. Tibialis",
        errorCount: 12,
        lastErrorDate: "30 Okt 2026",
        clinicalNote: "Perhatikan posisinya yang paling superfisial dibanding pembuluh poplitea.",
      },
      {
        id: "err-02-2",
        nameIndo: "Vena Poplitea",
        nameLatin: "V. Poplitea",
        errorCount: 10,
        lastErrorDate: "29 Okt 2026",
      },
      {
        id: "err-02-3",
        nameIndo: "Arteria Poplitea",
        nameLatin: "A. Poplitea",
        errorCount: 8,
        lastErrorDate: "28 Okt 2026",
      },
    ],
  },
  {
    id: "top-03",
    nameIndo: "Trigonum Colli (Segitiga Leher)",
    nameLatin: "Trigona Cervicalia (Colli)",
    regio: "Caput et Collum",
    masteryScore: 47,
    level: "lemah",
    totalItems: 26,
    frequentErrorCount: 7,
    lastPracticedDate: "28 Okt 2026",
    trend6Weeks: [30, 35, 38, 40, 42, 47],
    recommendation: "Bagi latihan batas Trigonum Caroticum dan Trigonum Submandibulare secara bertahap.",
    errorStructures: [
      {
        id: "err-03-1",
        nameIndo: "Trigonum Caroticum",
        nameLatin: "Trigonum Caroticum",
        errorCount: 11,
        lastErrorDate: "28 Okt 2026",
        clinicalNote: "Batas penting: Venter superior M. omohyoideus, M. SCM, dan venter posterior M. digastricus.",
      },
      {
        id: "err-03-2",
        nameIndo: "Venter Superior M. Omohyoideus",
        nameLatin: "Venter Superior M. Omohyoidei",
        errorCount: 9,
        lastErrorDate: "27 Okt 2026",
      },
      {
        id: "err-03-3",
        nameIndo: "Venter Posterior M. Digastricus",
        nameLatin: "Venter Posterior M. Digastrici",
        errorCount: 8,
        lastErrorDate: "26 Okt 2026",
      },
    ],
  },
  {
    id: "top-04",
    nameIndo: "Kompartemen Posterior Lengan Atas",
    nameLatin: "Regio Brachii Posterior (M. Triceps)",
    regio: "Extremitas Superior",
    masteryScore: 54,
    level: "sedang",
    totalItems: 18,
    frequentErrorCount: 5,
    lastPracticedDate: "01 Nov 2026",
    trend6Weeks: [36, 40, 42, 46, 50, 54],
    recommendation: "Perkuat origo caput mediale dan caput laterale triceps brachii pada model 3D.",
    errorStructures: [
      {
        id: "err-04-1",
        nameIndo: "Caput Mediale M. Triceps Brachii",
        nameLatin: "Caput Mediale M. Tricipitis Brachii",
        errorCount: 8,
        lastErrorDate: "01 Nov 2026",
      },
      {
        id: "err-04-2",
        nameIndo: "Nervus Radialis di Sulcus Radialis",
        nameLatin: "N. Radialis in Sulco N. Radialis",
        errorCount: 7,
        lastErrorDate: "31 Okt 2026",
        clinicalNote: "Rentan cedera pada fraktur corpus humeri sepertiga tengah.",
      },
      {
        id: "err-04-3",
        nameIndo: "Musculus Anconeus",
        nameLatin: "M. Anconeus",
        errorCount: 5,
        lastErrorDate: "30 Okt 2026",
      },
    ],
  },
  {
    id: "top-05",
    nameIndo: "Trigonum Femorale & Canalis Adductorius",
    nameLatin: "Trigonum Femorale & Canalis Adductorius",
    regio: "Extremitas Inferior",
    masteryScore: 62,
    level: "sedang",
    totalItems: 22,
    frequentErrorCount: 4,
    lastPracticedDate: "01 Nov 2026",
    trend6Weeks: [44, 48, 52, 55, 58, 62],
    recommendation: "Latih kembali batas mnemonik NAVEL di trigonum femorale untuk menghindari kekeliruan vaskular.",
    errorStructures: [
      {
        id: "err-05-1",
        nameIndo: "Anulus Femoralis",
        nameLatin: "Anulus Femoralis",
        errorCount: 7,
        lastErrorDate: "01 Nov 2026",
        clinicalNote: "Pintu masuk hernia femoralis; medial terhadap vena femoralis.",
      },
      {
        id: "err-05-2",
        nameIndo: "Nervus Saphenus",
        nameLatin: "N. Saphenus",
        errorCount: 6,
        lastErrorDate: "30 Okt 2026",
      },
      {
        id: "err-05-3",
        nameIndo: "Hiatus Adductorius",
        nameLatin: "Hiatus Adductorius (Hunter)",
        errorCount: 5,
        lastErrorDate: "29 Okt 2026",
      },
    ],
  },
  {
    id: "top-06",
    nameIndo: "Kompartemen Cruris & Tarsus",
    nameLatin: "Regio Cruris & Articulatio Talocruralis",
    regio: "Extremitas Inferior",
    masteryScore: 68,
    level: "sedang",
    totalItems: 24,
    frequentErrorCount: 4,
    lastPracticedDate: "31 Okt 2026",
    trend6Weeks: [50, 54, 58, 60, 64, 68],
    recommendation: "Ulangi inervasi kutan dorsum pedis dan cabang terminal nervus fibularis profundus.",
    errorStructures: [
      {
        id: "err-06-1",
        nameIndo: "Nervus Fibularis Profundus",
        nameLatin: "N. Fibularis Profundus",
        errorCount: 7,
        lastErrorDate: "31 Okt 2026",
      },
      {
        id: "err-06-2",
        nameIndo: "Retinaculum Extensorum Inferius",
        nameLatin: "Retinaculum Mm. Extensorum Inferius",
        errorCount: 6,
        lastErrorDate: "30 Okt 2026",
      },
      {
        id: "err-06-3",
        nameIndo: "Musculus Tibialis Posterior",
        nameLatin: "M. Tibialis Posterior",
        errorCount: 4,
        lastErrorDate: "28 Okt 2026",
      },
    ],
  },
  {
    id: "top-07",
    nameIndo: "Kompleks Sendi Bahu & Rotator Cuff",
    nameLatin: "Articulatio Humeri & Musculi Rotatores",
    regio: "Extremitas Superior",
    masteryScore: 72,
    level: "sedang",
    totalItems: 22,
    frequentErrorCount: 3,
    lastPracticedDate: "02 Nov 2026",
    trend6Weeks: [52, 56, 60, 64, 68, 72],
    recommendation: "Tingkatkan ketelitian insersio M. Subscapularis vs M. Supraspinatus pada tuberculum humeri.",
    errorStructures: [
      {
        id: "err-07-1",
        nameIndo: "Musculus Subscapularis",
        nameLatin: "M. Subscapularis",
        errorCount: 6,
        lastErrorDate: "02 Nov 2026",
        clinicalNote: "Satu-satunya otot rotator cuff yang berinsersio di Tuberculum Minus.",
      },
      {
        id: "err-07-2",
        nameIndo: "Ligamentum Coracoacromiale",
        nameLatin: "Lig. Coracoacromiale",
        errorCount: 5,
        lastErrorDate: "01 Nov 2026",
      },
      {
        id: "err-07-3",
        nameIndo: "Labrum Glenoidale",
        nameLatin: "Labrum Glenoidale",
        errorCount: 4,
        lastErrorDate: "31 Okt 2026",
      },
    ],
  },
  {
    id: "top-08",
    nameIndo: "Mediastinum & Cor (Jantung & Pembuluh)",
    nameLatin: "Mediastinum & Cor",
    regio: "Thorax",
    masteryScore: 78,
    level: "kuat",
    totalItems: 28,
    frequentErrorCount: 2,
    lastPracticedDate: "27 Okt 2026",
    trend6Weeks: [65, 68, 70, 72, 75, 78],
    recommendation: "Pertahankan jadwal spaced repetition 10 hari sekali untuk vaskularisasi arteri koronaria.",
    errorStructures: [
      {
        id: "err-08-1",
        nameIndo: "Ramus Circumflexus A. Coronaria Sinistra",
        nameLatin: "R. Circumflexus A. Coronariae Sinistrae",
        errorCount: 4,
        lastErrorDate: "27 Okt 2026",
      },
      {
        id: "err-08-2",
        nameIndo: "Sinus Coronarius",
        nameLatin: "Sinus Coronarius",
        errorCount: 3,
        lastErrorDate: "26 Okt 2026",
      },
      {
        id: "err-08-3",
        nameIndo: "Nervus Phrenicus Sinister",
        nameLatin: "N. Phrenicus Sinister",
        errorCount: 3,
        lastErrorDate: "24 Okt 2026",
      },
    ],
  },
  {
    id: "top-09",
    nameIndo: "Kompartemen Fleksor Lengan Bawah",
    nameLatin: "Regio Antebrachii Anterior",
    regio: "Extremitas Superior",
    masteryScore: 84,
    level: "kuat",
    totalItems: 26,
    frequentErrorCount: 2,
    lastPracticedDate: "01 Nov 2026",
    trend6Weeks: [70, 74, 76, 79, 82, 84],
    recommendation: "Pemahaman sangat baik. Lakukan review periodik singkat untuk insersio fleksor lapis profunda.",
    errorStructures: [
      {
        id: "err-09-1",
        nameIndo: "Musculus Flexor Pollicis Longus",
        nameLatin: "M. Flexor Pollicis Longus",
        errorCount: 3,
        lastErrorDate: "01 Nov 2026",
      },
      {
        id: "err-09-2",
        nameIndo: "Musculus Pronator Quadratus",
        nameLatin: "M. Pronator Quadratus",
        errorCount: 3,
        lastErrorDate: "30 Okt 2026",
      },
      {
        id: "err-09-3",
        nameIndo: "Nervus Interosseus Anterior",
        nameLatin: "N. Interosseus Anterior",
        errorCount: 2,
        lastErrorDate: "28 Okt 2026",
      },
    ],
  },
  {
    id: "top-10",
    nameIndo: "Otot Intrinsik & Vaskularisasi Tangan",
    nameLatin: "Regio Palmaris Manus",
    regio: "Extremitas Superior",
    masteryScore: 92,
    level: "kuat",
    totalItems: 30,
    frequentErrorCount: 1,
    lastPracticedDate: "03 Nov 2026",
    trend6Weeks: [80, 82, 85, 88, 90, 92],
    recommendation: "Topik telah dikuasai dengan matang. Lakukan sesi kuis pemeliharaan 14 hari sekali.",
    errorStructures: [
      {
        id: "err-10-1",
        nameIndo: "Musculi Lumbricales III-IV",
        nameLatin: "Mm. Lumbricales III et IV",
        errorCount: 2,
        lastErrorDate: "03 Nov 2026",
        clinicalNote: "Diinervasi oleh N. Ulnaris, berbeda dari I-II yang diinervasi N. Medianus.",
      },
      {
        id: "err-10-2",
        nameIndo: "Ramus Profundus N. Ulnaris",
        nameLatin: "R. Profundus N. Ulnaris",
        errorCount: 2,
        lastErrorDate: "01 Nov 2026",
      },
      {
        id: "err-10-3",
        nameIndo: "Arcus Palmaris Profundus",
        nameLatin: "Arcus Palmaris Profundus",
        errorCount: 1,
        lastErrorDate: "28 Okt 2026",
      },
    ],
  },
];

// 10. Data Latihan Anatomi 3D & Kuis Interaktif
export interface Anatomy3DStructure {
  id: string;
  nameIndo: string;
  nameLatin: string;
  meshId: string;
  category: "otot" | "tulang" | "saraf" | "vaskular" | "organ";
  description: string;
  clinicalNote?: string;
  difficulty: "mudah" | "sedang" | "sulit";
  masteryStatus: "dikuasai" | "berkembang" | "perlu_diulang";
  geometryType: "cylinder" | "sphere" | "box";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  baseColor: string;
}

export type QuizMode = "klik-struktur" | "sebutkan-nama";

export interface QuizQuestionItem {
  id: string;
  mode: QuizMode;
  targetStructureId: string;
  promptText: string;
  latinName: string;
  options?: {
    structureId: string;
    nameIndo: string;
    nameLatin: string;
  }[];
  explanation: string;
  hint: string;
}

export interface AnatomyPracticeRegion {
  id: string;
  name: string;
  latinName: string;
  structuresCount: number;
  modelUrl?: string;
}

export const mockAnatomyRegions: AnatomyPracticeRegion[] = [
  {
    id: "reg-04",
    name: "Dada dan Organ Toraks (Jantung)",
    latinName: "Thorax - Cor",
    structuresCount: 11,
    modelUrl: "/models/heart.glb",
  },
  {
    id: "reg-01",
    name: "Anggota Gerak Atas",
    latinName: "Extremitas Superior",
    structuresCount: 8,
  },
  {
    id: "reg-02",
    name: "Anggota Gerak Bawah",
    latinName: "Extremitas Inferior",
    structuresCount: 8,
  },
  {
    id: "reg-03",
    name: "Kepala dan Leher",
    latinName: "Caput et Collum",
    structuresCount: 6,
  },
];

// Model Nyata 3D Jantung (BodyParts3D GLB Model)
export const mockHeart3DStructures: Anatomy3DStructure[] = [
  {
    id: "struct-h-01",
    nameIndo: "Arkus Aorta",
    nameLatin: "Arcus Aortae",
    meshId: "aortic-arch",
    category: "vaskular",
    description: "Lengkungan aorta utama yang mempercabangkan arteri brakiosefalika, karotis komunis kiri, dan subklavia kiri.",
    clinicalNote: "Lokasi umum terjadinya diseksi aorta tipe Stanford A dan koarktasio aorta.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#e11d48",
  },
  {
    id: "struct-h-02",
    nameIndo: "Aorta Asendens",
    nameLatin: "Aorta Ascendens",
    meshId: "ascending-aorta",
    category: "vaskular",
    description: "Bagian aorta pertama yang keluar dari ventrikel kiri jantung; mempercabangkan arteri koronaria.",
    clinicalNote: "Tempat asal dari arteri koronaria dekstra dan sinistra pada sinus Valsalva.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#f43f5e",
  },
  {
    id: "struct-h-03",
    nameIndo: "Trunkus Pulmonalis",
    nameLatin: "Truncus Pulmonalis",
    meshId: "pulmonary-trunk",
    category: "vaskular",
    description: "Pembuluh darah besar pembawa darah vena miskin oksigen dari ventrikel kanan menuju ke paru-paru.",
    clinicalNote: "Bercabang menjadi Arteria Pulmonalis Dextra dan Sinistra; lokasi penting emboli paru masif (saddle embolus).",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#0284c7",
  },
  {
    id: "struct-h-04",
    nameIndo: "Vena Kava Superior",
    nameLatin: "Vena Cava Superior",
    meshId: "superior-vena-cava",
    category: "vaskular",
    description: "Vena besar pembawa aliran darah balik dari kepala, leher, anggota gerak atas, dan rongga dada ke atrium kanan.",
    clinicalNote: "Kompresi tumor paru dapat memicu Vena Cava Superior Syndrome.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#2563eb",
  },
  {
    id: "struct-h-05",
    nameIndo: "Dinding Ventrikel (Miokardium)",
    nameLatin: "Myocardium Ventriculorum",
    meshId: "ventricular-wall",
    category: "otot",
    description: "Lapisan otot tebal bilik jantung yang bertugas memompa darah ke seluruh tubuh (ventrikel kiri) dan sirkulasi paru (kanan).",
    clinicalNote: "Ketebalan dinding ventrikel kiri 3x lebih tebal dari ventrikel kanan; target iskemia pada infark miokard akut.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#be123c",
  },
  {
    id: "struct-h-06",
    nameIndo: "Rongga Ventrikel Kanan",
    nameLatin: "Ventriculus Dexter",
    meshId: "right-ventricle",
    category: "organ",
    description: "Bilik jantung kanan yang menerima darah dari atrium kanan melalui katup trikuspidalis dan memompanya ke trunkus pulmonalis.",
    clinicalNote: "Bentuk bulan sabit (crescent-shaped) dengan tekanan fisiologis yang jauh lebih rendah daripada ventrikel kiri.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#9f1239",
  },
  {
    id: "struct-h-07",
    nameIndo: "Rongga Ventrikel Kiri",
    nameLatin: "Ventriculus Sinister",
    meshId: "left-ventricle",
    category: "organ",
    description: "Bilik jantung kiri berdinding tebal yang memompa darah beroksigen tinggi menuju sirkulasi sistemik lewat katup aorta.",
    clinicalNote: "Fungsi ejeksi ventrikel kiri (LVEF) merupakan parameter hemodinamik sentral pada evaluasi gagal jantung.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#881337",
  },
  {
    id: "struct-h-08",
    nameIndo: "Atrium Kanan",
    nameLatin: "Atrium Dextrum",
    meshId: "right-atrium",
    category: "organ",
    description: "Serambi kanan jantung penerima darah deoksigenasi dari vena kava superior, vena kava inferior, dan sinus koronarius.",
    clinicalNote: "Terdapat nodus sinoatrialis (SA node / pacemaker alami jantung) pada taut vena kava superior dengan atrium kanan.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "sphere",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#c2410c",
  },
  {
    id: "struct-h-09",
    nameIndo: "Atrium Kiri",
    nameLatin: "Atrium Sinistrum",
    meshId: "left-atrium",
    category: "organ",
    description: "Serambi kiri jantung yang menerima darah bersih beroksigen dari paru melalui empat muara vena pulmonalis.",
    clinicalNote: "Apendiks atrium kiri (auricula sinistra) merupakan sumber tersering terbentuknya trombus pada fibrilasi atrium.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "sphere",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#ea580c",
  },
  {
    id: "struct-h-10",
    nameIndo: "Arteri Koronaria Kiri (LCA)",
    nameLatin: "Arteria Coronaria Sinistra",
    meshId: "left-coronary",
    category: "vaskular",
    description: "Arteri penyuplai darah kaya oksigen untuk otot jantung anterior dan ventrikel kiri melalui cabang LAD dan LCx.",
    clinicalNote: "Oklusi cabang LAD (Left Anterior Descending) sering disebut 'widow-maker' karena menyebabkan infark miokard luas.",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#f59e0b",
  },
  {
    id: "struct-h-11",
    nameIndo: "Arteri Koronaria Kanan (RCA)",
    nameLatin: "Arteria Coronaria Dextra",
    meshId: "right-coronary",
    category: "vaskular",
    description: "Arteri yang berjalan di sulkus koroner kanan untuk memperdarahi atrium kanan, ventrikel kanan, dan nodus AV.",
    clinicalNote: "Oklusi RCA memicu infark dinding inferior jantung dan sering disertai gangguan konduksi (AV block).",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#eab308",
  },
];

export const mock3DStructures: Anatomy3DStructure[] = [
  {
    id: "struct-01",
    nameIndo: "Musculus Biceps Brachii",
    nameLatin: "M. Biceps Brachii",
    meshId: "mesh-biceps",
    category: "otot",
    description: "Otot berkepala dua di kompartemen anterior lengan atas; fleksor siku dan supinator lengan bawah yang kuat.",
    clinicalNote: "Refleks tendon biseps menguji integritas radiks saraf C5-C6.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.32, 0.35, 0.28],
    rotation: [0, 0, 0.08],
    scale: [0.26, 1.25, 0.26],
    baseColor: "#c25953",
  },
  {
    id: "struct-02",
    nameIndo: "Musculus Triceps Brachii",
    nameLatin: "M. Triceps Brachii",
    meshId: "mesh-triceps",
    category: "otot",
    description: "Otot berkepala tiga di kompartemen posterior lengan atas; ekstensor utama persendian siku.",
    clinicalNote: "Diinervasi oleh Nervus Radialis; menguji integritas radiks saraf C7-C8.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [-0.32, 0.32, -0.28],
    rotation: [0, 0, -0.08],
    scale: [0.28, 1.35, 0.28],
    baseColor: "#b24d47",
  },
  {
    id: "struct-03",
    nameIndo: "Musculus Deltoideus",
    nameLatin: "M. Deltoideus",
    meshId: "mesh-deltoideus",
    category: "otot",
    description: "Otot segitiga penutup sendi bahu; abduktor utama lengan atas setelah 15 derajat pertama diinisiasi supraspinatus.",
    clinicalNote: "Lokasi standar injeksi intramuskular; diinervasi oleh Nervus Axillaris (C5-C6).",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "sphere",
    position: [0, 1.35, 0],
    rotation: [0, 0, 0],
    scale: [0.65, 0.52, 0.6],
    baseColor: "#d9655e",
  },
  {
    id: "struct-04",
    nameIndo: "Musculus Supraspinatus",
    nameLatin: "M. Supraspinatus (Rotator Cuff)",
    meshId: "mesh-supraspinatus",
    category: "otot",
    description: "Bagian dari manset rotator cuff; menginisiasi abduksi lengan atas 0-15 derajat dan menstabilkan caput humeri.",
    clinicalNote: "Tendon yang paling sering mengalami robekan (rotator cuff tear) dan sindrom pelampiasan bahu.",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "box",
    position: [-0.38, 1.15, 0.16],
    rotation: [0.2, 0.3, -0.2],
    scale: [0.55, 0.22, 0.32],
    baseColor: "#ba554f",
  },
  {
    id: "struct-05",
    nameIndo: "Musculus Brachioradialis",
    nameLatin: "M. Brachioradialis",
    meshId: "mesh-brachioradialis",
    category: "otot",
    description: "Otot fleksor siku di sisi lateral lengan bawah; bekerja maksimal saat lengan bawah dalam posisi semipronasi.",
    clinicalNote: "Membentuk batas lateral dari fossa cubiti.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0.48, -0.92, 0.16],
    rotation: [0, 0, 0.14],
    scale: [0.22, 1.15, 0.22],
    baseColor: "#c7625c",
  },
  {
    id: "struct-06",
    nameIndo: "Corpus Humeri",
    nameLatin: "Corpus Humeri (Os Humerus)",
    meshId: "mesh-humerus",
    category: "tulang",
    description: "Batang tulang panjang utama lengan atas; tempat perlekatan banyak otot fleksor dan ekstensor.",
    clinicalNote: "Fraktur pada pertengahan humerus dapat mencederai N. Radialis di sulcus radialis.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0.2, 0],
    rotation: [0, 0, 0],
    scale: [0.2, 1.75, 0.2],
    baseColor: "#e6decb",
  },
  {
    id: "struct-07",
    nameIndo: "Nervus Radialis",
    nameLatin: "N. Radialis",
    meshId: "mesh-n-radialis",
    category: "saraf",
    description: "Saraf utama dari fasikulus posterior pleksus brakialis yang melintasi sulcus nervi radialis di posterior humerus.",
    clinicalNote: "Cedera saraf ini menyebabkan hilangnya kemampuan ekstensi pergelangan tangan (wrist drop).",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "cylinder",
    position: [-0.14, 0.12, -0.22],
    rotation: [0.4, 0.2, 0.6],
    scale: [0.065, 1.45, 0.065],
    baseColor: "#eab308",
  },
  {
    id: "struct-08",
    nameIndo: "Arteria Brachialis",
    nameLatin: "A. Brachialis",
    meshId: "mesh-a-brachialis",
    category: "vaskular",
    description: "Pembuluh nadi utama lengan atas, lanjutan dari A. Axillaris di bawah batas inferior M. Teres Major.",
    clinicalNote: "Titik auskultasi bunyi Korotkoff pada pemeriksaan tekanan darah dengan sfigmomanometer.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.18, 0.28, 0.14],
    rotation: [0, 0, 0.04],
    scale: [0.075, 1.55, 0.075],
    baseColor: "#dc2626",
  },
];

// Soal Kuis Interaktif (Mode Klik Struktur dan Mode Sebutkan Nama)
export const mockQuizQuestions: QuizQuestionItem[] = [
  // Soal 1 (Mode Klik Struktur)
  {
    id: "q-01",
    mode: "klik-struktur",
    targetStructureId: "struct-01",
    promptText: "Klik pada model 3D struktur berikut:",
    latinName: "M. Biceps Brachii",
    hint: "Cari otot lonjong di bagian depan (anterior) lengan atas di depan tulang humerus.",
    explanation: "Benar! Musculus Biceps Brachii terletak di kompartemen anterior lengan atas dan berfungsi sebagai fleksor sendi siku serta supinator lengan bawah yang kuat.",
  },
  // Soal 2 (Mode Sebutkan Nama)
  {
    id: "q-02",
    mode: "sebutkan-nama",
    targetStructureId: "struct-04",
    promptText: "Perhatikan struktur yang disorot pada model. Apa nama struktur tersebut?",
    latinName: "Struktur Bahu Superior",
    options: [
      {
        structureId: "struct-04",
        nameIndo: "Musculus Supraspinatus",
        nameLatin: "M. Supraspinatus (Rotator Cuff)",
      },
      {
        structureId: "struct-03",
        nameIndo: "Musculus Deltoideus",
        nameLatin: "M. Deltoideus",
      },
      {
        structureId: "struct-01",
        nameIndo: "Musculus Biceps Brachii",
        nameLatin: "M. Biceps Brachii",
      },
      {
        structureId: "struct-02",
        nameIndo: "Musculus Triceps Brachii",
        nameLatin: "M. Triceps Brachii",
      },
    ],
    hint: "Struktur ini berada di atas spina scapulae dan merupakan bagian dari manset rotator cuff.",
    explanation: "Tepat sekali! Musculus Supraspinatus adalah inisiator abduksi bahu (0-15 derajat). Struktur ini paling sering mengalami robekan pada cedera rotator cuff.",
  },
  // Soal 3 (Mode Klik Struktur)
  {
    id: "q-03",
    mode: "klik-struktur",
    targetStructureId: "struct-07",
    promptText: "Temukan dan klik saraf berikut pada model:",
    latinName: "Nervus Radialis",
    hint: "Cari struktur saraf silinder berwarna kuning yang melintasi sisi belakang (posterior) batang humerus.",
    explanation: "Bagus! Nervus Radialis berjalan di sulcus nervi radialis humeri. Cedera pada saraf ini dapat menimbulkan gejala klinis wrist drop.",
  },
  // Soal 4 (Mode Sebutkan Nama)
  {
    id: "q-04",
    mode: "sebutkan-nama",
    targetStructureId: "struct-03",
    promptText: "Identifikasi otot berbentuk segitiga yang disorot pada bagian superior bahu:",
    latinName: "Musculus Regio Deltoidea",
    options: [
      {
        structureId: "struct-03",
        nameIndo: "Musculus Deltoideus",
        nameLatin: "M. Deltoideus",
      },
      {
        structureId: "struct-04",
        nameIndo: "Musculus Supraspinatus",
        nameLatin: "M. Supraspinatus",
      },
      {
        structureId: "struct-05",
        nameIndo: "Musculus Brachioradialis",
        nameLatin: "M. Brachioradialis",
      },
      {
        structureId: "struct-06",
        nameIndo: "Corpus Humeri",
        nameLatin: "Os Humerus",
      },
    ],
    hint: "Otot besar yang membentuk kontur membulat bahu dan menjadi lokasi suntikan intramuskular.",
    explanation: "Tepat! Musculus Deltoideus diinervasi oleh Nervus Axillaris dan bertanggung jawab untuk abduksi lengan atas dari 15 hingga 90 derajat.",
  },
  // Soal 5 (Mode Klik Struktur)
  {
    id: "q-05",
    mode: "klik-struktur",
    targetStructureId: "struct-08",
    promptText: "Klik pembuluh darah utama berikut pada model:",
    latinName: "Arteria Brachialis",
    hint: "Cari pembuluh darah silinder merah di kompartemen anteromedial lengan atas.",
    explanation: "Tepat! Arteria Brachialis merupakan sumber vaskularisasi utama lengan atas dan lokasi penting pengukuran tekanan darah rutin.",
  },
  // Soal 6 (Mode Sebutkan Nama)
  {
    id: "q-06",
    mode: "sebutkan-nama",
    targetStructureId: "struct-02",
    promptText: "Apa nama otot kompartemen posterior lengan atas yang disorot ini?",
    latinName: "Musculus Kompartemen Ekstensor",
    options: [
      {
        structureId: "struct-02",
        nameIndo: "Musculus Triceps Brachii",
        nameLatin: "M. Triceps Brachii",
      },
      {
        structureId: "struct-01",
        nameIndo: "Musculus Biceps Brachii",
        nameLatin: "M. Biceps Brachii",
      },
      {
        structureId: "struct-05",
        nameIndo: "Musculus Brachioradialis",
        nameLatin: "M. Brachioradialis",
      },
      {
        structureId: "struct-07",
        nameIndo: "Nervus Radialis",
        nameLatin: "N. Radialis",
      },
    ],
    hint: "Otot berkepala tiga yang berfungsi mengekstensikan lengan bawah pada persendian siku.",
    explanation: "Benar! Musculus Triceps Brachii memiliki caput longum, laterale, dan mediale yang berinsersio pada olecranon ulnae.",
  },
  // Soal 7 (Mode Klik Struktur)
  {
    id: "q-07",
    mode: "klik-struktur",
    targetStructureId: "struct-05",
    promptText: "Temukan dan klik otot lengan bawah lateral berikut:",
    latinName: "M. Brachioradialis",
    hint: "Cari otot di bagian bawah lateral siku yang memanjang ke arah pergelangan tangan.",
    explanation: "Hebat! M. Brachioradialis berorigo pada margo lateralis humeri dan membantu fleksi siku saat posisi lengan semipronasi.",
  },
  // Soal 8 (Mode Sebutkan Nama)
  {
    id: "q-08",
    mode: "sebutkan-nama",
    targetStructureId: "struct-06",
    promptText: "Pilih nama tulang aksial lengan atas yang disorot putih gading di tengah model:",
    latinName: "Os Longum Extremitas Superior",
    options: [
      {
        structureId: "struct-06",
        nameIndo: "Corpus Humeri",
        nameLatin: "Corpus Humeri (Os Humerus)",
      },
      {
        structureId: "struct-05",
        nameIndo: "Radius",
        nameLatin: "Os Radius",
      },
      {
        structureId: "struct-02",
        nameIndo: "Ulna",
        nameLatin: "Os Ulna",
      },
      {
        structureId: "struct-03",
        nameIndo: "Clavicula",
        nameLatin: "Os Clavicula",
      },
    ],
    hint: "Tulang pipa panjang yang membentuk kerangka utama lengan atas.",
    explanation: "Sangat tepat! Humerus adalah tulang panjang tunggal di lengan atas yang bersendi proksimal dengan scapula dan distal dengan radius serta ulna.",
  },
];

// Soal Kuis Khusus Model 3D Jantung (BodyParts3D)
export const mockHeartQuizQuestions: QuizQuestionItem[] = [
  {
    id: "qh-01",
    mode: "klik-struktur",
    targetStructureId: "struct-h-01",
    promptText: "Temukan dan klik struktur pembuluh darah besar berikut:",
    latinName: "Arcus Aortae (Arkus Aorta)",
    hint: "Cari lengkungan arteri besar berwarna merah paling atas yang mempercabangkan arteri untuk kepala dan lengan.",
    explanation: "Tepat sekali! Arkus Aorta adalah segmen lengkung aorta yang mempercabangkan Truncus Brachiocephalicus, A. Carotis Communis Sinistra, dan A. Subclavia Sinistra.",
  },
  {
    id: "qh-02",
    mode: "klik-struktur",
    targetStructureId: "struct-h-03",
    promptText: "Klik pada model 3D pembuluh pembawa darah ke pulmo berikut:",
    latinName: "Truncus Pulmonalis",
    hint: "Cari pembuluh darah besar kebiruan di anterior aorta asendens yang mengalirkan darah vena dari ventrikel kanan.",
    explanation: "Benar! Trunkus Pulmonalis mengalirkan darah deoksigenasi dari bilik kanan jantung menuju kedua paru-paru.",
  },
  {
    id: "qh-03",
    mode: "klik-struktur",
    targetStructureId: "struct-h-04",
    promptText: "Temukan pembuluh balik utama dari tubuh bagian atas:",
    latinName: "Vena Cava Superior",
    hint: "Saluran vena vertikal besar berwarna biru di sisi kanan atas yang bermuara langsung ke atrium kanan.",
    explanation: "Hebat! Vena Kava Superior mengumpulkan darah dari kepala, leher, dada, dan ekstremitas atas menuju atrium kanan jantung.",
  },
  {
    id: "qh-04",
    mode: "klik-struktur",
    targetStructureId: "struct-h-05",
    promptText: "Klik pada lapisan otot pemompa utama bilik jantung:",
    latinName: "Myocardium Ventriculorum",
    hint: "Dinding otot tebal berwarna merah tua yang membentuk massa utama bilik bawah jantung.",
    explanation: "Sangat tepat! Miokardium ventrikel terdiri dari serabut otot jantung yang sangat tebal, terutama pada ventrikel kiri untuk memompa darah ke seluruh tubuh.",
  },
  {
    id: "qh-05",
    mode: "sebutkan-nama",
    targetStructureId: "struct-h-01",
    promptText: "Perhatikan struktur pembuluh darah yang disorot pada puncak jantung. Apa nama struktur tersebut?",
    latinName: "Pembuluh Darah Utama Toraks",
    options: [
      {
        structureId: "struct-h-01",
        nameIndo: "Arkus Aorta",
        nameLatin: "Arcus Aortae",
      },
      {
        structureId: "struct-h-03",
        nameIndo: "Trunkus Pulmonalis",
        nameLatin: "Truncus Pulmonalis",
      },
      {
        structureId: "struct-h-04",
        nameIndo: "Vena Kava Superior",
        nameLatin: "Vena Cava Superior",
      },
      {
        structureId: "struct-h-02",
        nameIndo: "Aorta Asendens",
        nameLatin: "Aorta Ascendens",
      },
    ],
    hint: "Bagian melengkung yang menghubungkan aorta asendens dengan aorta desendens torakalis.",
    explanation: "Benar! Arkus aorta melengkung ke posterior dan ke kiri di atas bifurkasio trunkus pulmonalis.",
  },
  {
    id: "qh-06",
    mode: "sebutkan-nama",
    targetStructureId: "struct-h-04",
    promptText: "Pilih nama pembuluh darah balik vertikal yang disorot biru di sisi kranial atrium kanan:",
    latinName: "Pembuluh Balik Toraks",
    options: [
      {
        structureId: "struct-h-04",
        nameIndo: "Vena Kava Superior",
        nameLatin: "Vena Cava Superior",
      },
      {
        structureId: "struct-h-03",
        nameIndo: "Trunkus Pulmonalis",
        nameLatin: "Truncus Pulmonalis",
      },
      {
        structureId: "struct-h-08",
        nameIndo: "Atrium Kanan",
        nameLatin: "Atrium Dextrum",
      },
      {
        structureId: "struct-h-01",
        nameIndo: "Arkus Aorta",
        nameLatin: "Arcus Aortae",
      },
    ],
    hint: "Vena besar tak berkatup yang bermuara di dinding posterosuperior serambi kanan.",
    explanation: "Tepat sekali! Vena Cava Superior terbentuk dari penyatuan vena brakiosefalika dekstra dan sinistra.",
  },
  {
    id: "qh-07",
    mode: "sebutkan-nama",
    targetStructureId: "struct-h-10",
    promptText: "Struktur arteri vaskular nutrisi jantung yang disorot kuning di sulkus anterior adalah:",
    latinName: "Vaskularisasi Miokardium",
    options: [
      {
        structureId: "struct-h-10",
        nameIndo: "Arteri Koronaria Kiri (LCA)",
        nameLatin: "Arteria Coronaria Sinistra",
      },
      {
        structureId: "struct-h-11",
        nameIndo: "Arteri Koronaria Kanan (RCA)",
        nameLatin: "Arteria Coronaria Dextra",
      },
      {
        structureId: "struct-h-01",
        nameIndo: "Arkus Aorta",
        nameLatin: "Arcus Aortae",
      },
      {
        structureId: "struct-h-03",
        nameIndo: "Trunkus Pulmonalis",
        nameLatin: "Truncus Pulmonalis",
      },
    ],
    hint: "Arteri penyuplai miokardium ventrikel kiri yang mempercabangkan LAD (Left Anterior Descending).",
    explanation: "Hebat! LCA memperdarahi sebagian besar ventrikel kiri, atrium kiri, dan septum interventrikular.",
  },
];

// Helper untuk mengambil struktur dan soal berdasarkan regio yang dipilih
export function getStructuresByRegion(regionId: string): Anatomy3DStructure[] {
  if (regionId === "reg-04") {
    return mockHeart3DStructures;
  }
  return mock3DStructures;
}

export function getQuizQuestionsByRegion(regionId: string): QuizQuestionItem[] {
  if (regionId === "reg-04") {
    return mockHeartQuizQuestions;
  }
  return mockQuizQuestions;
}



