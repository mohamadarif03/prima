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
