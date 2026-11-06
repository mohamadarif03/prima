// Mock data terpusat untuk aplikasi PRIMA (Platform Review Interaktif Medis Adaptif)
// Seluruh materi diselaraskan dengan silabus Buku Petunjuk Praktikum Anatomi FK ULM
// yang mencakup 3 Modul Utama (Muskuloskeletal, Respirasi, Kardiovaskuler) dan 6 Regio Tubuh.

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

// 1. Data Profil Pengguna (Sesuai Konteks Mahasiswa Kedokteran Preklinik)
export const mockUserProfile: UserProfile = {
  id: "usr-01",
  name: "dr. Rina Safitri (Kandidat)",
  title: "Mahasiswa Kedokteran Preklinik",
  email: "rina.safitri@mhs.medika.ac.id",
  semester: 2,
  avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250",
  institution: "Fakultas Kedokteran (Buku Petunjuk Praktikum Anatomi FK ULM)",
  targetExam: "Ujian Blok Anatomi: Regio Caput (Kranium, Otot Mimik & Saraf Kranial)",
  examDate: "2026-11-20",
  streakDays: 5,
};

// 2. Data Statistik Ringkasan Dashboard
export const mockDashboardStats: DashboardStats = {
  dueTodayCount: 16,
  dueTodayDiffText: "6 struktur kritis kranium & saraf perlu review",
  masteryPercentage: 74,
  masteryDiffText: "+6.5% dari minggu lalu",
  streakDays: 5,
  streakSubText: "Rekor terpanjang: 8 hari",
  daysUntilExam: 17,
  examName: "Blok Anatomi Kepala & Kranium",
};

// 3. Data Progres Latihan Mingguan (7 Hari Terakhir)
export const mockWeeklyProgress: WeeklyStudyItem[] = [
  { day: "Sen", date: "28 Okt", itemsReviewed: 18, targetItems: 20 },
  { day: "Sel", date: "29 Okt", itemsReviewed: 25, targetItems: 20 },
  { day: "Rab", date: "30 Okt", itemsReviewed: 22, targetItems: 20 },
  { day: "Kam", date: "31 Okt", itemsReviewed: 28, targetItems: 20 },
  { day: "Jum", date: "01 Nov", itemsReviewed: 15, targetItems: 20 },
  { day: "Sab", date: "02 Nov", itemsReviewed: 34, targetItems: 25 },
  { day: "Min", date: "03 Nov", itemsReviewed: 20, targetItems: 20 },
];

// 4. Data Peta Kelemahan per Regio Tubuh (Selaras 6 Regio Latihan 3D)
export const mockAnatomyWeaknesses: AnatomyTopicWeakness[] = [
  {
    id: "top-01",
    topicNameIndo: "Regio Caput (Otot Kepala & Wajah)",
    topicNameLatin: "Regio Capitis · Musculi Capitis & Faciei",
    system: "Regio Caput",
    masteryScore: 78,
    totalItems: 15,
    weakItemsCount: 3,
    urgencyLevel: "baik",
  },
  {
    id: "top-02",
    topicNameIndo: "Regio Collum (Otot Leher & Cervix)",
    topicNameLatin: "Regio Colli · Musculi Colli & Cervicis",
    system: "Regio Collum",
    masteryScore: 68,
    totalItems: 15,
    weakItemsCount: 5,
    urgencyLevel: "sedang",
  },
  {
    id: "top-03",
    topicNameIndo: "Regio Thorax (Otot Dinding Dada & Toraks)",
    topicNameLatin: "Regio Thoracis · Musculi Thoracis",
    system: "Regio Thorax",
    masteryScore: 82,
    totalItems: 12,
    weakItemsCount: 2,
    urgencyLevel: "unggul",
  },
  {
    id: "top-04",
    topicNameIndo: "Regio Abdomen (Otot Dinding Perut & Abdomen)",
    topicNameLatin: "Regio Abdominis · Musculi Abdominis",
    system: "Regio Abdomen",
    masteryScore: 66,
    totalItems: 10,
    weakItemsCount: 4,
    urgencyLevel: "sedang",
  },
  {
    id: "top-05",
    topicNameIndo: "Regio Pelvis (Otot Panggul & Dasar Panggul)",
    topicNameLatin: "Regio Pelvis · Musculi Pelvis & Perinei",
    system: "Regio Pelvis",
    masteryScore: 48,
    totalItems: 15,
    weakItemsCount: 8,
    urgencyLevel: "kritis",
  },
  {
    id: "top-06",
    topicNameIndo: "Regio Membrum (Otot Anggota Gerak)",
    topicNameLatin: "Regio Membri · Musculi Membri Superioris & Inferioris",
    system: "Regio Membrum",
    masteryScore: 54,
    totalItems: 18,
    weakItemsCount: 7,
    urgencyLevel: "kritis",
  },
];

// 5. Rekomendasi Latihan Hari Ini (3 Kartu Topik Prioritas)
export const mockRecommendations: StudyRecommendation[] = [
  {
    id: "rec-01",
    title: "Pterion & Arteria Meningea Media",
    latinName: "Pterion & A. Meningea Media in Sulco Arterioso",
    reason: "Lokus fraktur terlemah calvaria; risiko tinggi Epidural Hematoma (EDH)",
    dueCount: 6,
    estimatedMinutes: 8,
    priority: "tinggi",
    category: "Osteologi Kranial",
  },
  {
    id: "rec-02",
    title: "Percabangan Nervus Facialis (CN VII) & Otot Mimik",
    latinName: "Pes Anserinus N. Facialis & Mm. Faciei",
    reason: "Sering keliru membedakan paresis Bell's Palsy (LMN) vs stroke sentral (UMN)",
    dueCount: 5,
    estimatedMinutes: 7,
    priority: "tinggi",
    category: "Miologi & Saraf",
  },
  {
    id: "rec-03",
    title: "Pleksus Kiesselbach & Sinus Maxillaris Highmore",
    latinName: "Plexus Kiesselbachi & Sinus Paranasales",
    reason: "Penyegaran konsep epistaksis anterior dan sinusitis maksilaris odontogenik",
    dueCount: 4,
    estimatedMinutes: 6,
    priority: "sedang",
    category: "Vaskular & Sinus",
  },
];

// 6. Checklist Target Harian
export const mockDailyChecklist: DailyChecklistItem[] = [
  {
    id: "chk-01",
    label: "Review 6 tulang pembentuk neurokranium & sella turcica",
    latinTerm: "Ossa Neurocranii & Sella Turcica",
    completed: true,
    itemCount: 6,
    tag: "Spaced Repetition",
  },
  {
    id: "chk-02",
    label: "Kuis 3D Pterion: Identifikasi lokus fraktur A. Meningea Media",
    latinTerm: "Pterion & Epidural Hematoma",
    completed: false,
    itemCount: 4,
    tag: "Model 3D",
  },
  {
    id: "chk-03",
    label: "Analisis klinis: Paresis N. VII perifer (Bell's Palsy) vs stroke sentral",
    latinTerm: "N. Facialis in Foramine Stylomastoideo",
    completed: false,
    itemCount: 3,
    tag: "Klinis",
  },
  {
    id: "chk-04",
    label: "Latihan mastikasi: M. masseter, temporalis & pterygoideus (trismus)",
    latinTerm: "Musculi Masticatorii (N. V3)",
    completed: false,
    itemCount: 4,
    tag: "Miologi 3D",
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
    topicTitle: "BAB I: Muskuloskeletal Ekstremitas & Gelang Sendi",
    latinName: "Skeleton Appendiculare & Musculi Extremitatum",
    examDate: "2026-11-20",
    daysUntilExam: 17,
    targetPerDay: 20,
    totalItems: 120,
    masteredItems: 84,
    status: "sesuai jadwal",
    studyDays: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
    notes: "Fokus regio pleksus brakialis, rotatores bahu, dan kompartemen femorale",
  },
  {
    id: "plan-02",
    topicTitle: "BAB II: Sistem Respirasi & Saluran Napas",
    latinName: "Systema Respiratorium (Nasus, Larynx, Pulmo)",
    examDate: "2026-11-28",
    daysUntilExam: 25,
    targetPerDay: 15,
    totalItems: 90,
    masteredItems: 52,
    status: "sedikit tertinggal",
    studyDays: ["Sen", "Rab", "Jum", "Sab"],
    notes: "Kuasai kartilago laring, carina tracheae, dan 10 segmen bronkopulmonal",
  },
  {
    id: "plan-03",
    topicTitle: "BAB III: Sistem Kardiovaskuler & Sirkulasi",
    latinName: "Systema Cardiovasculare (Cor & Vasa Sanguinea)",
    examDate: "2026-12-08",
    daysUntilExam: 35,
    targetPerDay: 18,
    totalItems: 110,
    masteredItems: 72,
    status: "sesuai jadwal",
    studyDays: ["Sel", "Kam", "Sab", "Min"],
    notes: "Vaskularisasi arteri koronaria, sistem konduksi SA-AV node, dan 4 katup",
  },
  {
    id: "plan-04",
    topicTitle: "Regio Caput & Collum (Kepala dan Leher)",
    latinName: "Regio Caput, Collum & 12 Nervi Craniales",
    examDate: "2026-12-22",
    daysUntilExam: 49,
    targetPerDay: 22,
    totalItems: 140,
    masteredItems: 48,
    status: "tertinggal",
    studyDays: ["Sen", "Sel", "Kam", "Sab"],
    notes: "Neurocranium, viscerocranium, otot mimik-mastikasi, dan trigonum colli",
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
  activityType?: "materi" | "soal" | "flashcard" | "3d";
  durationMinutes?: number;
  actionUrl?: string;
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
        title: "Baca rangkuman Thorax: Jantung & Mediastinum",
        latinTerm: "Cor & Mediastinum Posterius",
        category: "Rangkuman AI",
        activityType: "materi",
        durationMinutes: 20,
        actionUrl: "/materi",
        itemCount: 4,
        completed: true,
      },
      {
        id: "t-01-2",
        title: "Latihan 10 soal Thorax: Katup & Vaskularisasi",
        latinTerm: "Valva Atrioventricularis & Aorta",
        category: "Latihan Soal",
        activityType: "soal",
        durationMinutes: 25,
        actionUrl: "/latihan-materials?materi=mat-01",
        itemCount: 10,
        completed: false,
      },
      {
        id: "t-01-3",
        title: "Ulang 15 flashcard Membrum: Pleksus Brakialis",
        latinTerm: "Plexus Brachialis & N. Radialis",
        category: "Flashcard",
        activityType: "flashcard",
        durationMinutes: 15,
        actionUrl: "/flashcard",
        itemCount: 15,
        completed: false,
      },
      {
        id: "t-01-4",
        title: "Jelajahi model 3D Arcus aortae & percabangannya",
        latinTerm: "Arcus Aortae & Truncus Brachiocephalicus",
        category: "Anatomi 3D",
        activityType: "3d",
        durationMinutes: 15,
        actionUrl: "/latihan",
        itemCount: 6,
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
        title: "Baca rangkuman Caput: Basis Cranii & Foramina",
        latinTerm: "Basis Cranii Interna & Foramen Jugulare",
        category: "Rangkuman AI",
        activityType: "materi",
        durationMinutes: 20,
        actionUrl: "/materi",
        itemCount: 6,
        completed: false,
      },
      {
        id: "t-02-2",
        title: "Latihan 8 soal inervasi lengan bawah",
        latinTerm: "N. Ulnaris & N. Medianus",
        category: "Latihan Soal",
        activityType: "soal",
        durationMinutes: 20,
        actionUrl: "/latihan-materials?materi=mat-02",
        itemCount: 8,
        completed: false,
      },
      {
        id: "t-02-3",
        title: "Ulang 12 flashcard vaskularisasi arcus palmaris",
        latinTerm: "Arcus Palmaris Superficialis et Profundus",
        category: "Flashcard",
        activityType: "flashcard",
        durationMinutes: 15,
        actionUrl: "/flashcard",
        itemCount: 12,
        completed: false,
      },
      {
        id: "t-02-4",
        title: "Jelajahi model 3D artikulasi sendi siku",
        latinTerm: "Articulatio Cubiti & Lig. Collaterale",
        category: "Anatomi 3D",
        activityType: "3d",
        durationMinutes: 15,
        actionUrl: "/latihan",
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
  regio: string; // "Regio Caput" | "Regio Collum" | "Regio Thorax" | "Regio Abdomen" | "Regio Pelvis" | "Regio Membrum"
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
    regio: "Regio Membrum",
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
        clinicalNote: "Kerap salah diidentifikasi saat melintasi Spatium Axillare Laterale (quadrangular space).",
      },
      {
        id: "err-01-3",
        nameIndo: "Nervus Radialis di Sulcus Radialis",
        nameLatin: "N. Radialis in Sulco N. Radialis",
        errorCount: 9,
        lastErrorDate: "31 Okt 2026",
        clinicalNote: "Rentan cedera pada fraktur corpus humeri sepertiga tengah (memicu wrist drop).",
      },
      {
        id: "err-01-4",
        nameIndo: "Nervus Musculocutaneus",
        nameLatin: "N. Musculocutaneus",
        errorCount: 7,
        lastErrorDate: "30 Okt 2026",
        clinicalNote: "Perhatikan penetrasi saraf ini menembus M. Coracobrachialis.",
      },
    ],
  },
  {
    id: "top-02",
    nameIndo: "Percabangan Trakeobronkial & Hilum Pulmonis",
    nameLatin: "Arbor Tracheobronchialis & Hilum Pulmonis",
    regio: "Regio Thorax",
    masteryScore: 42,
    level: "lemah",
    totalItems: 20,
    frequentErrorCount: 7,
    lastPracticedDate: "01 Nov 2026",
    trend6Weeks: [26, 30, 32, 36, 39, 42],
    recommendation: "Perhatikan perbedaan bronkus utama kanan (lebih pendek & vertikal) vs kiri serta 10 segmen bronkopulmonal.",
    errorStructures: [
      {
        id: "err-02-1",
        nameIndo: "Bifurcatio Tracheae (Carina)",
        nameLatin: "Carina Tracheae",
        errorCount: 12,
        lastErrorDate: "01 Nov 2026",
        clinicalNote: "Titik bifurkasio setinggi angulus sterni Ludovici (Th4-Th5); mukosa paling sensitif refleks batuk.",
      },
      {
        id: "err-02-2",
        nameIndo: "Bronchus Principalis Dexter",
        nameLatin: "Bronchus Principalis Dexter",
        errorCount: 10,
        lastErrorDate: "31 Okt 2026",
        clinicalNote: "Lebih vertikal, lebih lebar, dan lebih pendek (2,5 cm) sehingga benda asing tersering masuk ke sini.",
      },
      {
        id: "err-02-3",
        nameIndo: "Recessus Costodiaphragmaticus",
        nameLatin: "Recessus Costodiaphragmaticus Pleurae",
        errorCount: 8,
        lastErrorDate: "29 Okt 2026",
        clinicalNote: "Ruang pleura terendah tempat terkumpulnya cairan pada efusi pleura.",
      },
    ],
  },
  {
    id: "top-03",
    nameIndo: "Sirkulasi Koroner & Sistem Konduksi Jantung",
    nameLatin: "Arteriae Coronariae & Systema Conducens Cordis",
    regio: "Regio Thorax",
    masteryScore: 48,
    level: "lemah",
    totalItems: 22,
    frequentErrorCount: 6,
    lastPracticedDate: "31 Okt 2026",
    trend6Weeks: [32, 35, 38, 42, 45, 48],
    recommendation: "Kuasai cabang arteri LAD vs LCx dan lokasi SA node (krista terminalis) vs AV node (trigonum Koch).",
    errorStructures: [
      {
        id: "err-03-1",
        nameIndo: "Ramus Interventricularis Anterior (LAD)",
        nameLatin: "Ramus Interventricularis Anterior A. Coronaria Sinistra",
        errorCount: 11,
        lastErrorDate: "31 Okt 2026",
        clinicalNote: "Arteri tersering mengalami oklusi pada infark miokard akut anterior.",
      },
      {
        id: "err-03-2",
        nameIndo: "Nodus Atrioventricularis (AV Node)",
        nameLatin: "Nodus Atrioventricularis (Aschoff-Tawara)",
        errorCount: 9,
        lastErrorDate: "30 Okt 2026",
        clinicalNote: "Terletak di trigonum Koch dekat ostium sinus coronarius pada atrium kanan.",
      },
      {
        id: "err-03-3",
        nameIndo: "Sinus Coronarius",
        nameLatin: "Sinus Coronarius Cordis",
        errorCount: 7,
        lastErrorDate: "28 Okt 2026",
        clinicalNote: "Muara utama vena jantung pembawa darah kembali ke atrium kanan.",
      },
    ],
  },
  {
    id: "top-04",
    nameIndo: "Trigonum Colli & Kartilago Laring",
    nameLatin: "Trigona Cervicalia & Cartilagines Laryngis",
    regio: "Regio Collum",
    masteryScore: 54,
    level: "sedang",
    totalItems: 18,
    frequentErrorCount: 5,
    lastPracticedDate: "01 Nov 2026",
    trend6Weeks: [38, 42, 45, 48, 51, 54],
    recommendation: "Fokus pada struktur kartilago krikoid (cincin utuh setinggi C6) dan batas trigonum karotikum.",
    errorStructures: [
      {
        id: "err-04-1",
        nameIndo: "Cartilago Cricoidea",
        nameLatin: "Cartilago Cricoidea",
        errorCount: 9,
        lastErrorDate: "01 Nov 2026",
        clinicalNote: "Satu-satunya cincin kartilago utuh melingkar (signet ring) di jalan napas setinggi C6.",
      },
      {
        id: "err-04-2",
        nameIndo: "Nervus Laryngeus Recurrens",
        nameLatin: "N. Laryngeus Recurrens",
        errorCount: 8,
        lastErrorDate: "31 Okt 2026",
        clinicalNote: "Rentan cedera pada operasi tiroidektomi yang memicu disfonia / suara parau.",
      },
      {
        id: "err-04-3",
        nameIndo: "Trigonum Caroticum",
        nameLatin: "Trigonum Caroticum",
        errorCount: 6,
        lastErrorDate: "29 Okt 2026",
        clinicalNote: "Batas penting: Venter superior M. omohyoideus, M. SCM, dan venter posterior M. digastricus.",
      },
    ],
  },
  {
    id: "top-05",
    nameIndo: "Neurocranium & Otot Mimik-Mastikasi",
    nameLatin: "Neurocranium & Musculi Faciei-Masticatorii",
    regio: "Regio Caput",
    masteryScore: 62,
    level: "sedang",
    totalItems: 26,
    frequentErrorCount: 4,
    lastPracticedDate: "02 Nov 2026",
    trend6Weeks: [44, 48, 52, 55, 58, 62],
    recommendation: "Pahami perbedaan inervasi N. Facialis (CN VII untuk mimik) vs N. Mandibularis (CN V3 untuk mastikasi).",
    errorStructures: [
      {
        id: "err-05-1",
        nameIndo: "Pleksus Kiesselbach (Little's Area)",
        nameLatin: "Plexus Kiesselbachi",
        errorCount: 8,
        lastErrorDate: "02 Nov 2026",
        clinicalNote: "Anastomosis arteri di septum anterior; lokasi 90% epistaksis anterior.",
      },
      {
        id: "err-05-2",
        nameIndo: "Nervus Facialis di Foramen Stylomastoideum",
        nameLatin: "N. Facialis in Foramine Stylomastoideo",
        errorCount: 7,
        lastErrorDate: "30 Okt 2026",
        clinicalNote: "Titik keluarnya N. VII sebelum menembus glandula parotis; situs lesi Bell's Palsy.",
      },
      {
        id: "err-05-3",
        nameIndo: "Musculus Pterygoideus Lateralis",
        nameLatin: "M. Pterygoideus Lateralis",
        errorCount: 5,
        lastErrorDate: "28 Okt 2026",
        clinicalNote: "Satu-satunya otot mastikasi yang berperan membuka mulut (depresi mandibula).",
      },
    ],
  },
  {
    id: "top-06",
    nameIndo: "Trigonum Femorale & Canalis Adductorius",
    nameLatin: "Trigonum Femorale & Canalis Adductorius",
    regio: "Regio Membrum",
    masteryScore: 66,
    level: "sedang",
    totalItems: 22,
    frequentErrorCount: 4,
    lastPracticedDate: "01 Nov 2026",
    trend6Weeks: [48, 52, 56, 60, 63, 66],
    recommendation: "Latih kembali mnemonik NAVEL dari lateral ke medial di trigonum femorale.",
    errorStructures: [
      {
        id: "err-06-1",
        nameIndo: "Anulus Femoralis",
        nameLatin: "Anulus Femoralis",
        errorCount: 7,
        lastErrorDate: "01 Nov 2026",
        clinicalNote: "Pintu masuk hernia femoralis; medial terhadap vena femoralis.",
      },
      {
        id: "err-06-2",
        nameIndo: "Nervus Saphenus di Canalis Adductorius",
        nameLatin: "N. Saphenus in Canale Adductorio",
        errorCount: 6,
        lastErrorDate: "30 Okt 2026",
      },
      {
        id: "err-06-3",
        nameIndo: "Hiatus Adductorius (Hunter)",
        nameLatin: "Hiatus Adductorius",
        errorCount: 5,
        lastErrorDate: "29 Okt 2026",
      },
    ],
  },
  {
    id: "top-07",
    nameIndo: "Kompartemen Kruris & Articulatio Genus",
    nameLatin: "Regio Cruris & Articulatio Genus",
    regio: "Regio Membrum",
    masteryScore: 71,
    level: "sedang",
    totalItems: 24,
    frequentErrorCount: 3,
    lastPracticedDate: "31 Okt 2026",
    trend6Weeks: [52, 56, 60, 64, 68, 71],
    recommendation: "Ulangi inervasi nervus peroneus profundus (dorsofleksi) dan integritas tendo Achillis.",
    errorStructures: [
      {
        id: "err-07-1",
        nameIndo: "Nervus Peroneus Profundus",
        nameLatin: "N. Peroneus (Fibularis) Profundus",
        errorCount: 7,
        lastErrorDate: "31 Okt 2026",
        clinicalNote: "Kelemahan atau cedera saraf ini memicu hilangnya dorsofleksi kaki (drop foot).",
      },
      {
        id: "err-07-2",
        nameIndo: "Ligamentum Cruciatum Anterius (ACL)",
        nameLatin: "Lig. Cruciatum Anterius",
        errorCount: 5,
        lastErrorDate: "30 Okt 2026",
        clinicalNote: "Mencegah translasi anterior tibia terhadap femur; diuji dengan tes Lachman.",
      },
      {
        id: "err-07-3",
        nameIndo: "Tendo Calcaneus (Achillis)",
        nameLatin: "Tendo Calcaneus",
        errorCount: 4,
        lastErrorDate: "28 Okt 2026",
        clinicalNote: "Tendon terbesar tubuh; ruptur diidentifikasi dengan tes Simmonds-Thompson positif.",
      },
    ],
  },
  {
    id: "top-08",
    nameIndo: "Rongga Abdomen, Peritoneum & Vaskularisasi Viseral",
    nameLatin: "Cavitas Abdominalis & Vasa Splanchnica",
    regio: "Regio Abdomen",
    masteryScore: 76,
    level: "kuat",
    totalItems: 28,
    frequentErrorCount: 2,
    lastPracticedDate: "27 Okt 2026",
    trend6Weeks: [62, 65, 68, 70, 73, 76],
    recommendation: "Pertahankan jadwal spaced repetition 10 hari sekali untuk cabang truncus coeliacus dan foramen Winslow.",
    errorStructures: [
      {
        id: "err-08-1",
        nameIndo: "Foramen Epiploicum (Winslow)",
        nameLatin: "Foramen Omentale (Epiploicum)",
        errorCount: 5,
        lastErrorDate: "27 Okt 2026",
        clinicalNote: "Pintu masuk antara kavitas peritonealis mayor dengan bursa omentalis.",
      },
      {
        id: "err-08-2",
        nameIndo: "Truncus Coeliacus",
        nameLatin: "Truncus Coeliacus",
        errorCount: 4,
        lastErrorDate: "26 Okt 2026",
        clinicalNote: "Cabang arteri aorta abdominalis setinggi Th12 (mempercabangkan A. gastrica sinistra, hepatica communis, lienalis).",
      },
    ],
  },
  {
    id: "top-09",
    nameIndo: "Gelang Panggul & Canalis Inguinalis",
    nameLatin: "Cingulum Pelvicum & Canalis Inguinalis",
    regio: "Regio Pelvis",
    masteryScore: 80,
    level: "kuat",
    totalItems: 22,
    frequentErrorCount: 2,
    lastPracticedDate: "01 Nov 2026",
    trend6Weeks: [68, 71, 74, 76, 78, 80],
    recommendation: "Pemahaman sangat baik. Ulangi batas foramen infrapiriforme dan anulus inguinalis profundus.",
    errorStructures: [
      {
        id: "err-09-1",
        nameIndo: "Anulus Inguinalis Profundus",
        nameLatin: "Anulus Inguinalis Profundus",
        errorCount: 4,
        lastErrorDate: "01 Nov 2026",
        clinicalNote: "Lokus keluarnya hernia inguinalis lateralis / indirek.",
      },
      {
        id: "err-09-2",
        nameIndo: "Foramen Infrapiriforme",
        nameLatin: "Foramen Infrapiriforme",
        errorCount: 3,
        lastErrorDate: "30 Okt 2026",
        clinicalNote: "Dilewati oleh N. Ischiadicus, N. Gluteus Inferior, dan Vasa Pudenda Interna.",
      },
    ],
  },
  {
    id: "top-10",
    nameIndo: "Kompartemen Fleksor Lengan Bawah & Canalis Carpi",
    nameLatin: "Regio Antebrachii Anterior & Canalis Carpi",
    regio: "Regio Membrum",
    masteryScore: 88,
    level: "kuat",
    totalItems: 26,
    frequentErrorCount: 1,
    lastPracticedDate: "03 Nov 2026",
    trend6Weeks: [76, 79, 82, 84, 86, 88],
    recommendation: "Topik telah dikuasai dengan matang. Lakukan sesi review ringan 14 hari sekali.",
    errorStructures: [
      {
        id: "err-10-1",
        nameIndo: "Retinaculum Flexorum (Canalis Carpi)",
        nameLatin: "Retinaculum Musculorum Flexorum",
        errorCount: 3,
        lastErrorDate: "03 Nov 2026",
        clinicalNote: "Atap terowongan karpal; kompresi N. Medianus menyebabkan Carpal Tunnel Syndrome (CTS).",
      },
      {
        id: "err-10-2",
        nameIndo: "Musculus Pronator Quadratus",
        nameLatin: "M. Pronator Quadratus",
        errorCount: 2,
        lastErrorDate: "01 Nov 2026",
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
  number: number;
  name: string;
  subName: string;
  latinName: string;
  structuresCount: number;
  modelUrl?: string;
  icon: string;
  description: string;
  masteryScore: number;
  dueCount: number;
  level: "Lemah" | "Sedang" | "Kuat";
}

// 6 Regio Tubuh Manusia (Sesuai Silabus FK ULM Halaman 4)
export const mockAnatomyRegions: AnatomyPracticeRegion[] = [
  {
    id: "reg-caput",
    number: 1,
    name: "Regio Caput",
    subName: "Otot Kepala & Wajah",
    latinName: "Musculi Capitis & Faciei",
    structuresCount: 15,
    modelUrl: "/models/muscles.glb",
    icon: "bi bi-person",
    description: "Visualisasi 3D sistem miologi kepala: otot mimik ekspresi wajah (inervasi N. VII), otot pengunyah mastikasi (inervasi N. V3), dan aponeurosis epikranialis.",
    masteryScore: 78,
    dueCount: 4,
    level: "Kuat",
  },
  {
    id: "reg-collum",
    number: 2,
    name: "Regio Collum",
    subName: "Otot Leher & Cervix",
    latinName: "Musculi Colli & Cervicis",
    structuresCount: 15,
    modelUrl: "/models/muscles.glb",
    icon: "bi bi-arrows-vertical",
    description: "Visualisasi 3D sistem miologi leher: trigonum colli anterior & posterior, M. sternocleidomastoideus, kelompok suprahyoid, infrahyoid (strap muscles), kelompok scaleni, dan posterior leher.",
    masteryScore: 68,
    dueCount: 4,
    level: "Sedang",
  },
  {
    id: "reg-thorax",
    number: 3,
    name: "Regio Thorax",
    subName: "Otot Dinding Dada & Toraks",
    latinName: "Musculi Thoracis",
    structuresCount: 12,
    modelUrl: "/models/muscles.glb",
    icon: "bi bi-shield-shaded",
    description: "Visualisasi 3D sistem miologi dinding dada: M. pectoralis major & minor, serratus anterior, kelompok interkostal (externus, internus, intimus), transversus thoracis, serratus posterior, dan diafragma.",
    masteryScore: 82,
    dueCount: 3,
    level: "Kuat",
  },
  {
    id: "reg-abdomen",
    number: 4,
    name: "Regio Abdomen",
    subName: "Otot Dinding & Kavitas Abdomen",
    latinName: "Musculi Abdominis",
    structuresCount: 10,
    modelUrl: "/models/muscles.glb",
    icon: "bi bi-grid-3x3-gap",
    description: "Visualisasi 3D sistem miologi dinding abdomen anterolateral (rectus, obliquus, transversus), linea alba, dinding posterior (quadratus lumborum, psoas major, iliacus), dan kubah diafragma.",
    masteryScore: 66,
    dueCount: 5,
    level: "Sedang",
  },
  {
    id: "reg-pelvis",
    number: 5,
    name: "Regio Pelvis",
    subName: "Otot Panggul & Dasar Panggul",
    latinName: "Musculi Pelvis, Glutei & Perinei",
    structuresCount: 15,
    modelUrl: "/models/muscles.glb",
    icon: "bi bi-bounding-box",
    description: "Visualisasi 3D sistem miologi panggul: kelompok gluteal superfisial (maximus, medius, minimus), otot rotator eksternal profunda (piriformis, obturator, gemelli, quadratus femoris), dan diafragma pelvis dasar panggul (levator ani & sfingter ani).",
    masteryScore: 62,
    dueCount: 4,
    level: "Sedang",
  },
  {
    id: "reg-membrum",
    number: 6,
    name: "Regio Membrum",
    subName: "Otot Anggota Gerak (Ekstremitas)",
    latinName: "Musculi Membri Superioris & Inferioris",
    structuresCount: 18,
    modelUrl: "/models/muscles.glb",
    icon: "bi bi-person-walking",
    description: "Visualisasi 3D miologi anggota gerak atas (deltoid, rotator cuff, biseps, brakialis, triseps, brakioradialis, pronator) dan anggota gerak bawah (kuadriseps, sartorius, gracilis, hamstring, tibialis anterior, gastrocnemius, soleus, tendo Achillis).",
    masteryScore: 74,
    dueCount: 4,
    level: "Kuat",
  },
];

// ============================================================================
// STRUKTUR 3D LENGKAP UNTUK KE-6 REGIO TUBUH (SILABUS ANATOMI FK ULM)
// ============================================================================

// Data Struktur Lengkap & Detail untuk Regio Caput (15 Otot Kepala & Wajah 3D)
export const mockCaput3DStructures: Anatomy3DStructure[] = [
  {
    id: "struct-c-01",
    nameIndo: "Musculus Frontalis (Venter Frontalis)",
    nameLatin: "Venter Frontalis M. Occipitofrontalis",
    meshId: "frontalis",
    category: "otot",
    description: "Otot pipih di dahi melekat pada galea aponeurotica; mengangkat alis dan mengerutkan kulit dahi secara horizontal (ekspresi terkejut/penasaran).",
    clinicalNote: "Diinervasi oleh ramus temporalis N. VII; tidak bisa mengangkat alis pada Bell's palsy (lesi LMN), namun utuh pada stroke kortikal UMN.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 1.15, 0.52],
    rotation: [0, 0, 0],
    scale: [0.75, 0.45, 0.1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-c-02",
    nameIndo: "Musculus Occipitalis (Venter Occipitalis)",
    nameLatin: "Venter Occipitalis M. Occipitofrontalis",
    meshId: "occipitalis",
    category: "otot",
    description: "Otot di bagian posterior tengkorak berorigo pada linea nuchalis suprema os occipitale; menarik kulit kepala ke posterior.",
    clinicalNote: "Bersama venter frontalis dihubungkan oleh Galea Aponeurotica; diinervasi oleh N. auricularis posterior (cabang N. VII).",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0.8, -0.75],
    rotation: [0, 0, 0],
    scale: [0.7, 0.4, 0.1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-c-03",
    nameIndo: "Galea Aponeurotica (Aponeurosis Epicranialis)",
    nameLatin: "Galea Aponeurotica",
    meshId: "epicranial-aponeurosis",
    category: "otot",
    description: "Lembaran tendon fibrosa kuat berwarna putih yang menutupi kubah tengkorak; menghubungkan venter frontalis dan venter occipitalis.",
    clinicalNote: "Lapisan ke-3 dari kulit kepala (SCALP: Skin, Connective tissue, Aponeurosis, Loose tissue, Pericranium); laserasi melintang galea menyebabkan luka menganga lebar.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "sphere",
    position: [0, 1.35, -0.1],
    rotation: [0, 0, 0],
    scale: [0.85, 0.55, 0.75],
    baseColor: "#e2e8f0",
  },
  {
    id: "struct-c-04",
    nameIndo: "Musculus Temporalis (Otot Pelipis)",
    nameLatin: "M. Temporalis",
    meshId: "temporalis",
    category: "otot",
    description: "Otot pengunyah berbentuk kipas lebar mengisi seluruh fossa temporalis; berinsersio kuat pada processus coronoideus mandibulae.",
    clinicalNote: "Melakukan elevasi kuat mandibula dan retraksi rahang bawah; diinervasi oleh nervi temporales profundi (cabang N. V3 Mandibularis).",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "sphere",
    position: [0.68, 0.65, 0.1],
    rotation: [0, 0, 0],
    scale: [0.25, 0.6, 0.55],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-c-05",
    nameIndo: "Musculus Masseter (Otot Pengunyah Utama)",
    nameLatin: "M. Masseter",
    meshId: "masseter",
    category: "otot",
    description: "Otot berkekuatan gigitan sangat besar; origo di arcus zygomaticus dan insersio di tuberositas masseterica angulus mandibulae.",
    clinicalNote: "Diinervasi N. massetericus (N. V3); spasme tonik hebat menghasilkan trismus (lockjaw) patognomonik pada infeksi tetanus.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.6, -0.25, 0.25],
    rotation: [0.2, 0, 0],
    scale: [0.2, 0.6, 0.2],
    baseColor: "#dc2626",
  },
  {
    id: "struct-c-06",
    nameIndo: "Musculus Orbicularis Oculi",
    nameLatin: "M. Orbicularis Oculi",
    meshId: "orbicularis-oculi",
    category: "otot",
    description: "Otot sfingter melingkar kelopak mata; pars palpebralis untuk kedipan lembut spontan, pars orbitalis untuk memejamkan mata kuat.",
    clinicalNote: "Paresis N. VII menyebabkan lagoftalmus (kelopak mata tidak dapat menutup sempurna), memicu keratitis pajanan dan ulkus kornea.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "sphere",
    position: [0.38, 0.38, 0.52],
    rotation: [0, 0, 0],
    scale: [0.28, 0.28, 0.12],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-c-07",
    nameIndo: "Musculus Procerus (Pangkal Hidung)",
    nameLatin: "M. Procerus",
    meshId: "procerus",
    category: "otot",
    description: "Otot piramida kecil di atas os nasale; menarik tepi medial alis ke bawah dan mengerutkan kulit pangkal hidung (marah/jijik).",
    clinicalNote: "Bekerja sinergis dengan M. corrugator supercilii; diinervasi oleh cabang bukal N. facialis.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "box",
    position: [0, 0.55, 0.56],
    rotation: [0, 0, 0],
    scale: [0.12, 0.22, 0.08],
    baseColor: "#991b1b",
  },
  {
    id: "struct-c-08",
    nameIndo: "Musculus Nasalis (Batang Hidung)",
    nameLatin: "M. Nasalis",
    meshId: "nasalis",
    category: "otot",
    description: "Terdiri dari pars transversa (mengompresi apertura hidung) dan pars alaris (melebarkan nares / cuping hidung saat inspirasi dalam).",
    clinicalNote: "Pernapasan cuping hidung (flaring nares) adalah tanda kardinal distres pernapasan akut pada bayi dan balita.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0.16, 0.25, 0.62],
    rotation: [0, 0, 0],
    scale: [0.15, 0.18, 0.1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-c-09",
    nameIndo: "Musculus Zygomaticus Major (Otot Senyum)",
    nameLatin: "M. Zygomaticus Major",
    meshId: "zygomaticus-major",
    category: "otot",
    description: "Pita otot diagonal dari os zygomaticum ke modiolus sudut mulut; menarik sudut bibir ke atas dan belakang (senyum tulus Duchenne).",
    clinicalNote: "Uji fungsi motorik ramus zygomaticus N. VII paling mudah: minta pasien tersenyum memperlihatkan gigi.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.38, -0.08, 0.52],
    rotation: [0.3, 0.2, -0.4],
    scale: [0.1, 0.55, 0.1],
    baseColor: "#dc2626",
  },
  {
    id: "struct-c-10",
    nameIndo: "Musculus Zygomaticus Minor",
    nameLatin: "M. Zygomaticus Minor",
    meshId: "zygomaticus-minor",
    category: "otot",
    description: "Berorigo pada facies malaris os zygomaticum medial; menarik bibir atas ke superior dan sedikit lateral.",
    clinicalNote: "Terletak tepat di antero-medial M. Zygomaticus Major; berkontribusi pada ekspresi senyum dan dinamika bibir atas.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0.32, 0.02, 0.55],
    rotation: [0.2, 0.1, -0.3],
    scale: [0.08, 0.42, 0.08],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-c-11",
    nameIndo: "Musculus Risorius (Sudut Mulut)",
    nameLatin: "M. Risorius",
    meshId: "risorius",
    category: "otot",
    description: "Pita otot tipis horizontal penarik sudut mulut ke lateral murni (senyum datar, cengiran, atau seringai sinis).",
    clinicalNote: "Spasme tonik involunter otot ini bersama masseter memicu 'risus sardonicus' klasik pada intoksikasi tetanus.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.45, -0.28, 0.48],
    rotation: [0, 0, Math.PI / 2],
    scale: [0.08, 0.35, 0.08],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-c-12",
    nameIndo: "Musculus Orbicularis Oris (Sfingter Mulut)",
    nameLatin: "M. Orbicularis Oris",
    meshId: "orbicularis-oris",
    category: "otot",
    description: "Otot sfingter sirkular kompleks pembentuk bibir; menutup rima oris, menekan bibir ke gigi, dan memoncongkan bibir saat bersiul.",
    clinicalNote: "Inervasi motorik oleh rami buccales N. VII; kelumpuhan menyebabkan inkompetensi oral (cairan menetes keluar dari sudut mulut saat minum).",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "sphere",
    position: [0, -0.32, 0.65],
    rotation: [0, 0, 0],
    scale: [0.42, 0.22, 0.14],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-c-13",
    nameIndo: "Musculus Buccinator (Otot Pipi Dalam)",
    nameLatin: "M. Buccinator",
    meshId: "buccinator",
    category: "otot",
    description: "Otot dinding lateral pipi lapis profunda; menahan bolus makanan di antara gigi saat mengunyah dan menahan tekanan saat meniup terompet.",
    clinicalNote: "Ditembus oleh Ductus Stenon (parotis) setinggi molar 2 atas; kelemahan otot membuat makanan tertimbun di sulkus pipi.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.45, -0.22, 0.42],
    rotation: [0, 0.5, 0],
    scale: [0.18, 0.35, 0.18],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-c-14",
    nameIndo: "Musculus Depressor Anguli Oris",
    nameLatin: "M. Depressor Anguli Oris",
    meshId: "depressor-anguli-oris",
    category: "otot",
    description: "Otot segitiga berorigo di basis mandibulae dan berinsersio di modiolus sudut mulut; mendepresi sudut bibir (ekspresi murung/sedih).",
    clinicalNote: "Diinervasi oleh ramus marginalis mandibulae N. VII; cedera iatrogenik saat operasi leher submandibular menyebabkan mulut miring.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0.28, -0.48, 0.55],
    rotation: [0, 0, 0.1],
    scale: [0.15, 0.25, 0.1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-c-15",
    nameIndo: "Musculus Mentalis (Otot Dagu)",
    nameLatin: "M. Mentalis",
    meshId: "mentalis",
    category: "otot",
    description: "Sepasang otot kerucut di dagu; mengangkat dan memoncongkan bibir bawah serta mengerutkan kulit dagu (ekspresi merajuk).",
    clinicalNote: "Hiperaktivitas M. mentalis dapat menyebabkan kerutan dagu 'kulit jeruk' (peau d'orange) yang responsif terhadap terapi Botox.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.08, -0.62, 0.52],
    rotation: [0, 0, 0],
    scale: [0.1, 0.18, 0.1],
    baseColor: "#b91c1c",
  },
];

// 2. REGIO COLLUM (LEHER) - 15 STRUKTUR OTOT 3D NYATA (SESUAI SILABUS ANATOMI FK ULM)
export const mockCollum3DStructures: Anatomy3DStructure[] = [
  {
    id: "struct-col-01",
    nameIndo: "Musculus Platysma",
    nameLatin: "M. Platysma",
    meshId: "platysma",
    category: "otot",
    description: "Lembaran otot tipis superfisial di fascia cervicalis superficialis; berorigo di fascia pektoralis/deltoidea dan berinsersio di basis mandibula serta sudut mulut.",
    clinicalNote: "Diinervasi oleh Ramus Colli N. Facialis (CN VII). Menegangkan kulit leher dan mendepresi sudut bibir bawah (ekspresi tegang/ngeri). Harus disatukan rapi pada insisi bedah leher.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#c2410c",
  },
  {
    id: "struct-col-02",
    nameIndo: "Musculus Sternocleidomastoideus (SCM)",
    nameLatin: "M. Sternocleidomastoideus",
    meshId: "sternocleidomastoid",
    category: "otot",
    description: "Landmark anatomis utama leher dengan caput sternale & claviculare; berinsersio pada processus mastoideus ossis temporalis dan linea nuchalis superior.",
    clinicalNote: "Diinervasi oleh N. Accessorius (CN XI) & rami sensorik C2-C3. Pembagi utama trigonum anterior dan posterior. Kontraksi spasmodik unilateral memicu tortikolis kongenital.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-col-03",
    nameIndo: "Musculus Digastricus",
    nameLatin: "M. Digastricus",
    meshId: "digastric",
    category: "otot",
    description: "Otot suprahioid berurat ganda; venter anterior berorigo di fossa digastrica mandibulae, venter posterior di incisura mastoidea, dihubungkan tendo intermedius pada os hyoid.",
    clinicalNote: "Inervasi ganda: venter anterior oleh N. Mylohyoideus (CN V3), venter posterior oleh N. Facialis (CN VII). Membatasi Trigonum Submentale dan Submandibulare.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#b4342d",
  },
  {
    id: "struct-col-04",
    nameIndo: "Musculus Mylohyoideus (Diaphragma Oris)",
    nameLatin: "M. Mylohyoideus",
    meshId: "mylohyoid",
    category: "otot",
    description: "Otot pipih berbentuk sling pembentuk lantai rongga mulut (diaphragma oris); berorigo di linea mylohyoidea mandibulae dan berinsersio di corpus ossis hyoidei & raphe medianus.",
    clinicalNote: "Diinervasi oleh N. Mylohyoideus (cabang N. Alveolaris Inferior, CN V3). Elevasi dasar mulut saat menelan; menjadi batas penyebaran selulitis submandibular (Angina Ludwig).",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#a82b27",
  },
  {
    id: "struct-col-05",
    nameIndo: "Musculus Stylohyoideus",
    nameLatin: "M. Stylohyoideus",
    meshId: "stylohyoid",
    category: "otot",
    description: "Otot ramping suprahioid dari proc. styloideus ke cornu majus ossis hyoidei; tendo insersionya terbelah dilewati tendo intermedius M. digastricus.",
    clinicalNote: "Diinervasi oleh Ramus Stylohyoideus N. Facialis (CN VII). Menarik os hyoideum ke posterosuperior saat proses menelan untuk melindungi jalan napas.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#c0392b",
  },
  {
    id: "struct-col-06",
    nameIndo: "Musculus Geniohyoideus",
    nameLatin: "M. Geniohyoideus",
    meshId: "geniohyoid",
    category: "otot",
    description: "Otot pita sempit di atas M. mylohyoideus dekat garis tengah; membentang dari spina mentalis mandibulae menuju facies anterior corpus ossis hyoidei.",
    clinicalNote: "Diinervasi oleh serabut ventral C1 melalui N. Hypoglossus (CN XII). Berfungsi menarik os hyoideum ke anterior dan superior saat membuka mulut.",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#991b1b",
  },
  {
    id: "struct-col-07",
    nameIndo: "Musculus Sternohyoideus",
    nameLatin: "M. Sternohyoideus",
    meshId: "sternohyoid",
    category: "otot",
    description: "Otot infrahioid (strap muscle) superfisial dari manubrium sterni dan klavikula medial menuju corpus ossis hyoidei.",
    clinicalNote: "Diinervasi oleh Ansa Cervicalis (C1-C3). Mendepresi os hyoideum setelah elevasi deglutisi; disisihkan pada midline incision trakeostomi.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-col-08",
    nameIndo: "Musculus Omohyoideus",
    nameLatin: "M. Omohyoideus",
    meshId: "omohyoid",
    category: "otot",
    description: "Otot berurat ganda panjang; venter inferior berorigo di margo superior scapulae, venter superior berinsersio di corpus ossis hyoidei, disatukan tendo perantara berfascia.",
    clinicalNote: "Diinervasi oleh Ansa Cervicalis. Venter superior memisahkan Trigonum Caroticum dari Trigonum Musculare; venter inferior memisahkan Trigonum Occipitale dari Trigonum Supraclaviculare.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#c2410c",
  },
  {
    id: "struct-col-09",
    nameIndo: "Musculus Sternothyroideus",
    nameLatin: "M. Sternothyroideus",
    meshId: "sternothyroid",
    category: "otot",
    description: "Otot infrahioid lapis profunda tepat di belakang M. sternohyoideus; membentang dari manubrium sterni ke linea obliqua cartilaginis thyroideae.",
    clinicalNote: "Diinervasi oleh Ansa Cervicalis (C2-C3). Menutupi langsung lobus lateralis glandula thyroidea; dipreservasi pada operasi tiroidektomi.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#991b1b",
  },
  {
    id: "struct-col-10",
    nameIndo: "Musculus Thyrohyoideus",
    nameLatin: "M. Thyrohyoideus",
    meshId: "thyrohyoid",
    category: "otot",
    description: "Lanjutan superior dari M. sternothyroideus; membentang dari linea obliqua cartilaginis thyroideae ke corpus dan cornu majus ossis hyoidei.",
    clinicalNote: "Diinervasi oleh serabut ventral C1 via N. Hypoglossus (CN XII), bukan oleh ansa cervicalis. Berfungsi mengangkat laring atau menurunkan os hyoideum.",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#a82b27",
  },
  {
    id: "struct-col-11",
    nameIndo: "Musculus Scalenus Anterior",
    nameLatin: "M. Scalenus Anterior",
    meshId: "scalenus-anterior",
    category: "otot",
    description: "Otot leher lateral profunda dari proc. transversus C3-C6 menuju tuberculum musculi scaleni anterioris (Lisfranc) pada Costa I.",
    clinicalNote: "Diinervasi rami ventrales C4-C6. Disilang N. Phrenicus di anteriornya. Bersama scalenus medius membentuk celah hiatus scalenus tempat melintasnya Pleksus Brakialis dan A. Subclavia.",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#be123c",
  },
  {
    id: "struct-col-12",
    nameIndo: "Musculus Scalenus Medius",
    nameLatin: "M. Scalenus Medius",
    meshId: "scalenus-medius",
    category: "otot",
    description: "Otot scalenus terbesar dan terpanjang; berorigo di proc. transversus C2-C7 dan berinsersio pada facies superior Costa I di belakang sulcus A. subclaviae.",
    clinicalNote: "Diinervasi rami ventrales C3-C8. Membentuk batas posterior hiatus scalenus; spasme atau kompresi anatomis memicu Thoracic Outlet Syndrome (TOS) dengan gejala iskemia dan nyeri lengan.",
    difficulty: "sulit",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#9f1239",
  },
  {
    id: "struct-col-13",
    nameIndo: "Musculus Scalenus Posterior",
    nameLatin: "M. Scalenus Posterior",
    meshId: "scalenus-posterior",
    category: "otot",
    description: "Otot scalenus terkecil; berorigo di proc. transversus C4-C6 dan berjalan melintas ke bawah untuk berinsersio pada facies externa Costa II.",
    clinicalNote: "Diinervasi rami ventrales C6-C8. Berfungsi mengangkat Costa II saat inspirasi paksa dan memiringkan columna vertebralis servikalis ke arah ipsilateral.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#881337",
  },
  {
    id: "struct-col-14",
    nameIndo: "Musculus Splenius Capitis",
    nameLatin: "M. Splenius Capitis",
    meshId: "splenius-capitis",
    category: "otot",
    description: "Otot tebal posterior leher berbentuk pita lebar; berorigo di ligamentum nuchae & proc. spinosus C7-T3, berinsersio di proc. mastoideus dan linea nuchalis superior.",
    clinicalNote: "Diinervasi oleh rami posteriores nervorum cervicalium (C2-C3). Berfungsi mengekstensikan kepala/leher (bilateral) serta rotasi kepala ke sisi ipsilateral (unilateral).",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-col-15",
    nameIndo: "Musculus Levator Scapulae",
    nameLatin: "M. Levator Scapulae",
    meshId: "levator-scapulae",
    category: "otot",
    description: "Otot posterolateral leher dari proc. transversus C1-C4 menuju angulus superior dan margo medialis scapulae; membentuk dasar trigonum colli posterior.",
    clinicalNote: "Diinervasi oleh N. Dorsalis Scapulae (C5) dan rami spinales C3-C4. Spasme otot ini sering menimbulkan keluhan klinis leher kaku (stiff neck / cervical myofascial pain).",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#a82b27",
  },
];

// 3. REGIO THORAX (DADA - KARDIOVASKULER & RESPIRASI) - 19 STRUKTUR
// Termasuk 11 struktur model 3D nyata GLB Jantung (BodyParts3D) + 8 struktur respirasi & dinding
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
    description: "Bagian aorta pertama yang keluar dari ventrikel kiri jantung; mempercabangkan arteri koronaria pada sinus Valsalva.",
    clinicalNote: "Tempat asal dari arteri koronaria dekstra dan sinistra; rentan aneurisma pada sindrom Marfan.",
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
    description: "Pembuluh darah besar pembawa darah vena miskin oksigen dari ventrikel kanan menuju bifurkasio arteria pulmonalis.",
    clinicalNote: "Bercabang menjadi A. Pulmonalis Dextra dan Sinistra; lokasi penting emboli paru masif (saddle embolus).",
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
    clinicalNote: "Kompresi tumor paru (massa bronkogenik) dapat memicu Superior Vena Cava Syndrome (edema leher dan muka).",
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
    description: "Lapisan otot tebal bilik jantung yang bertugas memompa darah ke sirkulasi sistemik (ventrikel kiri) dan paru (ventrikel kanan).",
    clinicalNote: "Dinding ventrikel kiri 3x lebih tebal dari ventrikel kanan; target iskemia utama pada infark miokard akut.",
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
    description: "Bilik jantung kanan yang menerima darah dari atrium kanan via katup trikuspid dan memompanya ke trunkus pulmonalis.",
    clinicalNote: "Bentuk bulan sabit (crescent) dengan tekanan sistolik fisiologis jauh lebih rendah (~25 mmHg) dari bilik kiri.",
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
    description: "Bilik jantung kiri berdinding tebal pemompa darah oksigenasi tinggi menuju seluruh tubuh melalui katup aorta.",
    clinicalNote: "Fraksi ejeksi ventrikel kiri (LVEF normal 55-70%) adalah parameter hemodinamik kunci evaluasi gagal jantung.",
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
    description: "Serambi kanan jantung penerima darah deoksigenasi dari vena cava superior, vena cava inferior, dan sinus coronarius.",
    clinicalNote: "Memuat Nodus Sinoatrialis (SA node / perintis irama alami) di sulcus terminalis taut VCS dan atrium kanan.",
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
    description: "Serambi kiri jantung yang menerima darah bersih teroksigenasi dari paru-paru melalui 4 muara venae pulmonales.",
    clinicalNote: "Apendiks atrium kiri (auricula sinistra) merupakan sumber 90% tromboemboli sistemik pada pasien fibrilasi atrium.",
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
    nameIndo: "Arteri Koronaria Kiri (LCA / LAD)",
    nameLatin: "Arteria Coronaria Sinistra",
    meshId: "left-coronary",
    category: "vaskular",
    description: "Arteri utama pemelihara miokardium ventrikel kiri; bercabang menjadi LAD (ramus interventricularis anterior) dan LCx.",
    clinicalNote: "Oklusi LAD dijuluki 'widow-maker' karena memicu infark miokard anteroseptal masif dan syok kardiogenik.",
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
    description: "Arteri yang berjalan di sulcus coronarius kanan; memperdarahi atrium kanan, ventrikel kanan, nodus SA, dan nodus AV.",
    clinicalNote: "Oklusi RCA memicu infark dinding inferior dan kerap disertai bradiaritmia / blok AV total.",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#eab308",
  },
];

// 3. REGIO THORAX (DADA & DINDING TORAKS) - 12 STRUKTUR OTOT 3D NYATA (SESUAI SILABUS FK ULM)
export const mockThorax3DStructures: Anatomy3DStructure[] = [
  {
    id: "struct-th-01",
    nameIndo: "Musculus Pectoralis Major",
    nameLatin: "M. Pectoralis Major",
    meshId: "pectoralis-major",
    category: "otot",
    description: "Otot kipas tebal penutup dinding anterior dada; memiliki pars clavicularis dan pars sternocostalis; berinsersio pada crista tuberculi majoris humeri.",
    clinicalNote: "Diinervasi oleh N. Pectoralis Lateralis & Medialis (C5-T1). Adduksi kuat dan rotasi medial brachium (gerakan memeluk); absen pada sindrom Poland kongenital.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-th-02",
    nameIndo: "Musculus Pectoralis Minor",
    nameLatin: "M. Pectoralis Minor",
    meshId: "pectoralis-minor",
    category: "otot",
    description: "Otot segitiga tipis di profunda M. pectoralis major; berorigo di kosta 3-5 dan berinsersio pada processus coracoideus scapulae.",
    clinicalNote: "Diinervasi oleh N. Pectoralis Medialis (C8-T1). Landmark bedah krusial pembagi Arteria Axillaris menjadi 3 bagian (pars 1 medial, pars 2 posterior, pars 3 lateral).",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#be123c",
  },
  {
    id: "struct-th-03",
    nameIndo: "Musculus Subclavius",
    nameLatin: "M. Subclavius",
    meshId: "subclavius",
    category: "otot",
    description: "Otot silindris kecil di bawah clavicula; berorigo di kosta 1 dan berinsersio pada sulcus musculi subclavii di facies inferior clavicula.",
    clinicalNote: "Diinervasi oleh Nervus Subclavius (C5-C6). Menstabilkan clavicula pada articulatio sternoclavicularis saat gerakan lengan dan melindungi vasa subclavia saat fraktur klavikula.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#c2410c",
  },
  {
    id: "struct-th-04",
    nameIndo: "Musculus Serratus Anterior",
    nameLatin: "M. Serratus Anterior",
    meshId: "serratus-anterior",
    category: "otot",
    description: "Otot bergerigi menyerupai bilah gergaji pada dinding lateral toraks; berorigo di kosta 1-8/9 dan berinsersio di sepanjang margo medialis scapulae.",
    clinicalNote: "Diinervasi oleh N. Thoracicus Longus (Bell, C5-C7). Protraktor utama scapula ('boxer's muscle'). Cedera saraf saat mastektomi atau diseksi aksila memicu scapula alata (winged scapula).",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#9f1239",
  },
  {
    id: "struct-th-05",
    nameIndo: "Musculi Intercostales Externi",
    nameLatin: "Mm. Intercostales Externi",
    meshId: "external-intercostals",
    category: "otot",
    description: "Lapisan terluar otot interkostal di 11 spatium intercostale; serabut melintas condong ke inferomedial dari margo inferior kosta atas ke kosta bawah.",
    clinicalNote: "Diinervasi oleh Nervi Intercostales (T1-T11). Mengangkat kosta saat inspirasi tenang (bucket-handle & pump-handle movement) memperbesar volume rongga toraks.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-th-06",
    nameIndo: "Musculi Intercostales Interni",
    nameLatin: "Mm. Intercostales Interni",
    meshId: "internal-intercostals",
    category: "otot",
    description: "Lapisan tengah otot interkostal; serabut melintas condong ke inferolateral (tegak lurus terhadap serabut eksternus) dari sulcus costae ke kosta bawah.",
    clinicalNote: "Diinervasi oleh Nervi Intercostales. Berperan aktif mendepresi kosta saat ekspirasi paksa (batuk, meniup, atau olahraga berat).",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#881337",
  },
  {
    id: "struct-th-07",
    nameIndo: "Musculi Intercostales Intimi",
    nameLatin: "Mm. Intercostales Intimi",
    meshId: "innermost-intercostals",
    category: "otot",
    description: "Lapisan terdalam otot sela iga yang dipisahkan dari M. intercostales interni oleh bidang neurovaskular sulcus costae (VAN: Vena, Arteria, Nervus Intercostalis).",
    clinicalNote: "Insersi jarum torakosentesis atau chest tube (WSD) harus dilakukan tepat di atas tepi superior kosta bawah guna menghindari berkas neurovaskular VAN.",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#7f1d1d",
  },
  {
    id: "struct-th-08",
    nameIndo: "Musculus Transversus Thoracis",
    nameLatin: "M. Transversus Thoracis",
    meshId: "transversus-thoracis",
    category: "otot",
    description: "Otot berbentuk bintang pada facies interna dinding anterior toraks; berorigo di posterior corpus sterni dan proc. xiphoideus menuju cartilago costalis 2-6.",
    clinicalNote: "Diinervasi oleh Nervi Intercostales (T2-T6). Menutupi pembuluh darah Arteria dan Vena Thoracica Interna (Mammaria Interna / LIMA graft) pada operasi CABG.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#a82b27",
  },
  {
    id: "struct-th-09",
    nameIndo: "Musculus Serratus Posterior Superior",
    nameLatin: "M. Serratus Posterior Superior",
    meshId: "serratus-posterior-superior",
    category: "otot",
    description: "Otot pipih tipis dinding posterior atas toraks di profunda rhomboid; berorigo di ligamentum nuchae & proc. spinosus C7-T3 menuju costae 2-5.",
    clinicalNote: "Diinervasi oleh Nervi Intercostales 2-5. Membantu elevasi kosta saat inspirasi dalam.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-th-10",
    nameIndo: "Musculus Serratus Posterior Inferior",
    nameLatin: "M. Serratus Posterior Inferior",
    meshId: "serratus-posterior-inferior",
    category: "otot",
    description: "Otot pipih dinding posterior bawah toraks di profunda latissimus dorsi; berorigo di proc. spinosus T11-L2 menuju costae 9-12.",
    clinicalNote: "Diinervasi rami ventrales T9-T12. Menarik kosta bawah ke inferoposterior menahan tarikan diafragma saat inspirasi.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#991b1b",
  },
  {
    id: "struct-th-11",
    nameIndo: "Musculi Levatores Costarum",
    nameLatin: "Mm. Levatores Costarum",
    meshId: "levatores-costarum",
    category: "otot",
    description: "12 pasang otot kecil berbentuk kipas di toraks posterior; membentang dari apex processus transversus C7-T11 ke costa tepat di bawahnya.",
    clinicalNote: "Diinervasi oleh rami posteriores nervorum spinalium C8-T11. Berfungsi mengangkat kosta dan laterofleksi columna vertebralis.",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#c2410c",
  },
  {
    id: "struct-th-12",
    nameIndo: "Diaphragma (Lantai Kavitas Toraks)",
    nameLatin: "Diaphragma",
    meshId: "diaphragm",
    category: "otot",
    description: "Kubah muskuloaponeurotik dasar rongga dada; membatasi cavitas thoracis dari cavitas abdominis; memiliki centrum tendineum di sentral.",
    clinicalNote: "Diinervasi oleh Nervus Phrenicus (C3-C5). Otot inspirasi paling vital (kontraksi menurunkan kubah diafragma menciptakan tekanan intratorakal negatif).",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#dc2626",
  },
];

// 4. REGIO ABDOMEN (PERUT & DINDING ABDOMEN) - 10 STRUKTUR OTOT 3D NYATA (SESUAI SILABUS FK ULM)
export const mockAbdomen3DStructures: Anatomy3DStructure[] = [
  {
    id: "struct-ab-01",
    nameIndo: "Musculus Rectus Abdominis",
    nameLatin: "M. Rectus Abdominis",
    meshId: "rectus-abdominis",
    category: "otot",
    description: "Otot vertikal berpasangan dinding anterior abdomen yang dipisahkan oleh linea alba; memiliki 3-4 intersectiones tendineae pembentuk tampilan 'six-pack'.",
    clinicalNote: "Diinervasi oleh N. Thoracicus inferior (T7-T12). Dibungkus oleh vagina musculi recti abdominis. Peregangan berlebihan atau kelemahan aponeurosis midline pasca kehamilan memicu diastasis recti.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-ab-02",
    nameIndo: "Musculus Pyramidalis",
    nameLatin: "M. Pyramidalis",
    meshId: "pyramidalis",
    category: "otot",
    description: "Otot segitiga kecil vestigial di bagian paling bawah anterior M. rectus abdominis di dalam vagina musculi recti; berorigo di os pubis dan berinsersio pada linea alba.",
    clinicalNote: "Diinervasi oleh N. Subcostalis (T12). Berfungsi menegangkan linea alba; menjadi patokan garis tengah saat insisi Pfannenstiel atau laparatomi ginekologis.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#c2410c",
  },
  {
    id: "struct-ab-03",
    nameIndo: "Linea Alba",
    nameLatin: "Linea Alba",
    meshId: "linea-alba",
    category: "otot",
    description: "Raphe aponeurotica tendinosa avaskular di linea mediana yang dibentuk oleh persilangan aponeurosis ketiga otot pipih abdomen; membentang dari proc. xiphoideus ke symphysis pubica.",
    clinicalNote: "Jalur insisi favorit laparatomi mediana (cepat dan sedikit perdarahan). Kelemahan serat kolagen dapat memicu hernia epigastrika atau hernia ventralis insisional.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#e2e8f0",
  },
  {
    id: "struct-ab-04",
    nameIndo: "Musculus Obliquus Externus Abdominis",
    nameLatin: "M. Obliquus Externus Abdominis",
    meshId: "external-oblique",
    category: "otot",
    description: "Lapisan otot terluar dari tiga otot pipih anterolateral abdomen; berorigo di kosta 5-12 dengan arah serabut condong inferomedial ('tangan masuk ke saku').",
    clinicalNote: "Diinervasi rami ventrales T7-T12. Tepi bebas inferior aponeurosisnya melipat ke dalam membentuk Ligamentum Inguinale (Poupart); batas crus laterale dan mediale membentuk anulus inguinalis superficialis.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#be123c",
  },
  {
    id: "struct-ab-05",
    nameIndo: "Musculus Obliquus Internus Abdominis",
    nameLatin: "M. Obliquus Internus Abdominis",
    meshId: "internal-oblique",
    category: "otot",
    description: "Lapisan otot pipih tengah dinding anterolateral abdomen; berorigo di fascia thoracolumbalis, crista iliaca, dan lateral ligamentum inguinale; serabut berjalan superomedial tegak lurus oblikus eksternus.",
    clinicalNote: "Diinervasi oleh T7-L1 (N. Iliohypogastricus & N. Ilioinguinalis). Serabut inferior melengkung bersama aponeurosis M. transversus membentuk tendo conjunctivus (falx inguinalis) yang memperkuat dinding posterior kanalis inguinalis.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#9f1239",
  },
  {
    id: "struct-ab-06",
    nameIndo: "Musculus Transversus Abdominis",
    nameLatin: "M. Transversus Abdominis",
    meshId: "transversus-abdominis",
    category: "otot",
    description: "Lapisan otot terdalam dari tiga otot pipih abdomen; arah serabut berjalan horizontal melintang; bertindak sebagai sabuk pengencang anatomis (korset fisiologis).",
    clinicalNote: "Diinervasi T7-L1. Berperan utama meningkatkan tekanan intraabdominal (valsalva) saat proses miksi, defekasi, batuk, dan partus. Di bawah linea arcuata (Douglas), seluruh aponeurosisnya melintas di depan M. rectus.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#881337",
  },
  {
    id: "struct-ab-07",
    nameIndo: "Musculus Quadratus Lumborum",
    nameLatin: "M. Quadratus Lumborum",
    meshId: "quadratus-lumborum",
    category: "otot",
    description: "Otot tebal kuadrangular pada dinding posterior abdomen; berorigo di labium internum crista iliaca & ligamentum iliolumbale, berinsersio pada costa XII dan processus transversus L1-L4.",
    clinicalNote: "Diinervasi oleh serabut ventral T12 dan L1-L4. Fiksasi costa XII saat inspirasi dan laterofleksi columna vertebralis. Merupakan patokan utama pada akses bedah retroperitoneal / nefrektomi.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#a82b27",
  },
  {
    id: "struct-ab-08",
    nameIndo: "Musculus Psoas Major",
    nameLatin: "M. Psoas Major",
    meshId: "psoas-major",
    category: "otot",
    description: "Otot fusiformis besar dinding posterior abdomen; berorigo di corpus dan proc. transversus T12-L5, berjalan di lateral columna vertebralis menuju trigonum femorale.",
    clinicalNote: "Diinervasi pleksus lumbalis (L1-L3). Bersatu dengan M. Iliacus membentuk M. Iliopsoas (fleksor panggul utama). Psoas sign positif pada apendisitis retrosekal; rentan penumpukan abses dingin spondilitis tuberkulosa (Pott disease).",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-ab-09",
    nameIndo: "Musculus Iliacus",
    nameLatin: "M. Iliacus",
    meshId: "iliacus",
    category: "otot",
    description: "Otot berbentuk kipas yang mengisi seluruh fossa iliaca ossis coxae; serabutnya berkonvergensi bersama tendo M. psoas major melintasi bawah lig. inguinale untuk berinsersio di trochanter minor femoris.",
    clinicalNote: "Diinervasi oleh N. Femoralis (L2-L4). Bersama psoas major merupakan fleksor paha paling kuat pada articulatio coxae serta stabilisator postur tubuh tegak.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#991b1b",
  },
  {
    id: "struct-ab-10",
    nameIndo: "Diaphragma (Kubah Diafragma)",
    nameLatin: "Diaphragma",
    meshId: "diaphragm",
    category: "otot",
    description: "Kubah muskuloaponeurotik yang membentuk atap cavitas abdominis dan memisahkannya dari rongga toraks; memiliki centrum tendineum di puncak dan crus dekstrum/sinistrum di posterior.",
    clinicalNote: "Diinervasi oleh N. Phrenicus (C3, C4, C5 - 'keeps the diaphragm alive'). Memiliki 3 apertura utama: Foramen Venae Cavae (T8), Hiatus Oesophageus (T10 - rentan hernia hiatus), dan Hiatus Aorticus (T12).",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#dc2626",
  },
];

// 5. REGIO PELVIS (PANGGUL & GELANG PANGGUL) - 15 STRUKTUR OTOT 3D NYATA (SESUAI SILABUS FK ULM)
export const mockPelvis3DStructures: Anatomy3DStructure[] = [
  {
    id: "struct-pel-01",
    nameIndo: "Musculus Gluteus Maximus",
    nameLatin: "M. Gluteus Maximus",
    meshId: "gluteus-maximus",
    category: "otot",
    description: "Otot terbesar dan terkuat di bokong; berorigo di os ilium posterior, sacrum, dan lig. sacrotuberale, berinsersio pada tractus iliotibialis dan tuberositas glutea femoris.",
    clinicalNote: "Diinervasi oleh N. Gluteus Inferior (L5-S2). Ekstensor utama panggul saat bangkit dari duduk atau menaiki tangga. Kuadran superolateral bokong merupakan zona aman injeksi intramuskular (menghindari N. ischiadicus).",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-pel-02",
    nameIndo: "Musculus Gluteus Medius",
    nameLatin: "M. Gluteus Medius",
    meshId: "gluteus-medius",
    category: "otot",
    description: "Otot abduktor panggul berbentuk kipas di profunda M. gluteus maximus; berorigo di ala ossis ilii dan berinsersio pada trochanter major femoris.",
    clinicalNote: "Diinervasi oleh N. Gluteus Superior (L4-S1). Mencegah panggul jatuh ke sisi kontralateral saat berdiri satu kaki; kelemahan otot ini menimbulkan tanda Trendelenburg positif.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#be123c",
  },
  {
    id: "struct-pel-03",
    nameIndo: "Musculus Gluteus Minimus",
    nameLatin: "M. Gluteus Minimus",
    meshId: "gluteus-minimus",
    category: "otot",
    description: "Otot terdalam kelompok gluteal; berorigo di antara linea glutea anterior dan inferior ossis ilii, berinsersio di tepi anterior trochanter major femoris.",
    clinicalNote: "Diinervasi oleh N. Gluteus Superior (L4-S1). Bekerja sinergis bersama M. gluteus medius untuk abduksi dan rotasi medial paha pada articulatio coxae.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#9f1239",
  },
  {
    id: "struct-pel-04",
    nameIndo: "Musculus Tensor Fasciae Latae (TFL)",
    nameLatin: "M. Tensor Fasciae Latae",
    meshId: "tensor-fasciae-latae",
    category: "otot",
    description: "Otot ramping anterolateral panggul; berorigo di SIAS dan crista iliaca, berlanjut ke bawah menjadi Tractus Iliotibialis (ITB) yang berinsersio di tuberculum Gerdy tibia.",
    clinicalNote: "Diinervasi oleh N. Gluteus Superior. Menegangkan fascia lata dan menstabilkan sendi lutut saat posisi ekstensi penuh.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#c2410c",
  },
  {
    id: "struct-pel-05",
    nameIndo: "Musculus Piriformis",
    nameLatin: "M. Piriformis",
    meshId: "piriformis",
    category: "otot",
    description: "Otot berbentuk buah pir di dinding posterior pelvis; berorigo di facies anterior sacrum (S2-S4) dan keluar melalui foramen ischiadicum majus menuju trochanter major.",
    clinicalNote: "Diinervasi oleh rami anteriores S1-S2. Landmark foramen ischiadicum majus (membagi foramen suprapiriforme & infrapiriforme). Spasme otot ini menjepit N. Ischiadicus memicu Sindrom Piriformis (ischialgia).",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#a82b27",
  },
  {
    id: "struct-pel-06",
    nameIndo: "Musculus Gemellus Superior",
    nameLatin: "M. Gemellus Superior",
    meshId: "gemellus-superior",
    category: "otot",
    description: "Otot kecil rotator lateral panggul; berorigo di spina ischiadica dan menyatu dengan tendo M. obturator internus untuk berinsersio pada fossa trochanterica.",
    clinicalNote: "Diinervasi oleh saraf ke M. obturator internus (L5-S1). Bekerja sebagai pemutar paha ke lateral (eksorotasi).",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#881337",
  },
  {
    id: "struct-pel-07",
    nameIndo: "Musculus Obturator Internus",
    nameLatin: "M. Obturator Internus",
    meshId: "obturator-internus",
    category: "otot",
    description: "Otot berbentuk kipas yang berorigo di facies interna membrana obturatoria, tendo-nya berbelok 90 derajat keluar lewat foramen ischiadicum minus menuju fossa trochanterica.",
    clinicalNote: "Diinervasi oleh N. musculi obturatorii interni (L5-S1). Menjadi pembatas lateral fossa ischioanalis dan tempat perlekatan arcus tendineus musculi levatoris ani.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-pel-08",
    nameIndo: "Musculus Gemellus Inferior",
    nameLatin: "M. Gemellus Inferior",
    meshId: "gemellus-inferior",
    category: "otot",
    description: "Otot kecil rotator lateral di bawah tendo obturator internus; berorigo di tuber ischiadicum dan berinsersio di fossa trochanterica femoris.",
    clinicalNote: "Diinervasi oleh saraf ke M. quadratus femoris (L4-S1). Eksorotasi femur dan stabilisasi caput femoris di acetabulum.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#7f1d1d",
  },
  {
    id: "struct-pel-09",
    nameIndo: "Musculus Quadratus Femoris",
    nameLatin: "M. Quadratus Femoris",
    meshId: "quadratus-femoris",
    category: "otot",
    description: "Otot kuadrilateral datar tebal di bawah gemellus inferior; berorigo di margo lateralis tuber ischiadicum dan berinsersio pada crista intertrochanterica (tuberculum quadrati).",
    clinicalNote: "Diinervasi oleh N. musculi quadrati femoris (L4-S1). Eksorotator dan adduktor paha yang sangat stabil pada articulatio coxae.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#991b1b",
  },
  {
    id: "struct-pel-10",
    nameIndo: "Musculus Obturator Externus",
    nameLatin: "M. Obturator Externus",
    meshId: "obturator-externus",
    category: "otot",
    description: "Otot segitiga pipih yang berorigo di facies externa membrana obturatoria dan rami ossis pubis/ischii, tendo-nya melintas di posterior collum femoris menuju fossa trochanterica.",
    clinicalNote: "Diinervasi oleh ramus posterior N. Obturatorius (L3-L4). Eksorotasi paha dan menahan caput femoris di dalam acetabulum saat panggul fleksi.",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#9a3412",
  },
  {
    id: "struct-pel-11",
    nameIndo: "Musculus Pubococcygeus (Levator Ani)",
    nameLatin: "M. Pubococcygeus",
    meshId: "pubococcygeus",
    category: "otot",
    description: "Bagian utama dan terluas dari M. Levator Ani (diafragma pelvis); berorigo di facies posterior os pubis dan berinsersio di lig. anococcygeum dan os coccygis.",
    clinicalNote: "Diinervasi rami ventrales S3-S4 & N. Pudendus. Menyangga organ urogenital panggul; cedera saat persalinan per vaginam memicu prolaps organ panggul dan inkontinensia urin stres.",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#ea580c",
  },
  {
    id: "struct-pel-12",
    nameIndo: "Musculus Puborectalis (Sling Anorektal)",
    nameLatin: "M. Puborectalis",
    meshId: "puborectalis",
    category: "otot",
    description: "Serabut medial M. pubococcygeus yang membentuk pita tebal melingkari peralihan rektum dan kanalis analis (flexura perinealis) membentuk sling berbentuk U.",
    clinicalNote: "Mempertahankan sudut anorektal tajam (80°-90°) saat istirahat untuk menjamin kontinensia alvi (fekal); relaksasi otot ini membuka sudut anorektal saat proses defekasi.",
    difficulty: "sulit",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#d97706",
  },
  {
    id: "struct-pel-13",
    nameIndo: "Musculus Iliococcygeus",
    nameLatin: "M. Iliococcygeus",
    meshId: "iliococcygeus",
    category: "otot",
    description: "Komponen posterolateral M. Levator Ani; berorigo di arcus tendineus musculi levatoris ani pada fascia obturatoria dan berinsersio di lig. anococcygeum.",
    clinicalNote: "Diinervasi oleh serabut S3-S4. Bersama pubococcygeus membentuk diafragma muskuler penyangga tekanan intraabdominal.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#c2410c",
  },
  {
    id: "struct-pel-14",
    nameIndo: "Musculus Coccygeus (Ischiococcygeus)",
    nameLatin: "M. Coccygeus",
    meshId: "coccygeus",
    category: "otot",
    description: "Otot segitiga di posterior diafragma pelvis yang terletak tepat di anterior Ligamentum Sacrospinale; membentang dari spina ischiadica ke margo lateralis os coccygis & sacrum.",
    clinicalNote: "Diinervasi oleh serabut ventral S4-S5. Menarik os coccygis ke anterior pasca persalinan atau defekasi dan menstabilkan artikulatio sacroiliaca.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "box",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#b45309",
  },
  {
    id: "struct-pel-15",
    nameIndo: "Musculus Sphincter Ani Externus",
    nameLatin: "M. Sphincter Ani Externus",
    meshId: "external-anal-sphincter",
    category: "otot",
    description: "Cincin otot lurik volunter yang mengelilingi 2/3 bawah canalis analis; terbagi menjadi pars subcutanea, pars superficialis, dan pars profunda.",
    clinicalNote: "Diinervasi oleh N. Rectalis Inferior (cabang N. Pudendus, S2-S4). Kontraksi volunter mencegah kebocoran feses mendadak; laserasi perineum derajat III/IV saat partus harus dijahit lapis demi lapis.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    baseColor: "#dc2626",
  },
];

// 6. REGIO MEMBRUM (ANGGOTA GERAK ATAS & BAWAH) - 18 STRUKTUR
export const mockMembrum3DStructures: Anatomy3DStructure[] = [
  // EKSTREMITAS ATAS (8 OTOT)
  {
    id: "struct-m-01",
    nameIndo: "Musculus Deltoideus",
    nameLatin: "M. Deltoideus",
    meshId: "deltoid",
    category: "otot",
    description: "Otot segitiga penutup sendi bahu; abduktor utama lengan atas (15°-90°) setelah inisiasi oleh M. supraspinatus.",
    clinicalNote: "Diinervasi oleh Nervus Axillaris (C5-C6); lokasi standar injeksi intramuskular (IM) deltoid pada orang dewasa.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "sphere",
    position: [0.85, 1.35, 0],
    rotation: [0, 0, 0],
    scale: [0.45, 0.55, 0.45],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-02",
    nameIndo: "Musculus Supraspinatus",
    nameLatin: "M. Supraspinatus (Rotator Cuff)",
    meshId: "supraspinatus",
    category: "otot",
    description: "Otot fosa supraspinata scapula; menginisiasi abduksi lengan atas (0°-15°) dan menstabilkan caput humeri pada kavitas glenoidalis.",
    clinicalNote: "Tendon yang paling sering mengalami robekan (rotator cuff tear) dan jepitan subakromial (impingement syndrome / painful arc test positif).",
    difficulty: "sulit",
    masteryStatus: "perlu_diulang",
    geometryType: "box",
    position: [0.65, 1.38, -0.1],
    rotation: [0, 0, -0.2],
    scale: [0.42, 0.18, 0.25],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-03",
    nameIndo: "Musculus Infraspinatus",
    nameLatin: "M. Infraspinatus (Rotator Cuff)",
    meshId: "infraspinatus",
    category: "otot",
    description: "Otot rotator cuff tebal menempati fossa infraspinata scapula; rotator eksternal (lateral) utama sendi bahu bersama M. teres minor.",
    clinicalNote: "Diinervasi oleh Nervus Suprascapularis (C5-C6); kelemahan rotasi eksternal bahu mengindikasikan neuropati atau cedera tendon infraspinatus.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "box",
    position: [0.68, 1.25, -0.2],
    rotation: [0, 0, -0.15],
    scale: [0.4, 0.2, 0.2],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-04",
    nameIndo: "Musculus Biceps Brachii",
    nameLatin: "M. Biceps Brachii",
    meshId: "biceps-brachii",
    category: "otot",
    description: "Otot berkepala dua (caput longum & breve) di kompartemen anterior lengan atas; fleksor siku dan supinator lengan bawah yang kuat.",
    clinicalNote: "Diinervasi oleh N. Musculocutaneus (C5-C6); pengetukan tendo biseps menguji integritas refleks radiks servikal C5-C6 (Biceps reflex).",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.82, 0.65, 0.18],
    rotation: [0, 0, 0.05],
    scale: [0.22, 1.05, 0.22],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-05",
    nameIndo: "Musculus Brachialis",
    nameLatin: "M. Brachialis",
    meshId: "brachialis",
    category: "otot",
    description: "Otot fleksor murni sendi siku terletak di profundus M. biceps brachii; bekerja kuat pada semua posisi lengan bawah (fleksor utama artikulatio cubiti).",
    clinicalNote: "Berinsersio pada tuberositas ulnae dan processus coronoideus ulnae; tetap aktif memfleksikan siku baik dalam pronasi maupun supinasi.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0.8, 0.45, 0.12],
    rotation: [0, 0, 0.05],
    scale: [0.2, 0.85, 0.2],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-06",
    nameIndo: "Musculus Triceps Brachii",
    nameLatin: "M. Triceps Brachii",
    meshId: "triceps-brachii",
    category: "otot",
    description: "Otot berkepala tiga (caput longum, laterale, mediale) di kompartemen posterior lengan atas; ekstensor utama sendi siku berinsersio di olecranon.",
    clinicalNote: "Diinervasi oleh N. Radialis (C6-C8); refleks tendo triseps menguji integritas radiks servikal C7 (Triceps reflex).",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0.8, 0.65, -0.18],
    rotation: [0, 0, -0.05],
    scale: [0.24, 1.15, 0.24],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-07",
    nameIndo: "Musculus Brachioradialis",
    nameLatin: "M. Brachioradialis",
    meshId: "brachioradialis",
    category: "otot",
    description: "Otot kompartemen lateral antebrachium; fleksor siku terutama saat lengan bawah berada pada posisi semipronasi ('beer-drinking muscle').",
    clinicalNote: "Membentuk batas lateral fossa cubiti; diinervasi oleh Nervus Radialis (C5-C6); menguji integritas refleks brachioradialis (supinator reflex).",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0.86, -0.15, 0.12],
    rotation: [0, 0, 0.08],
    scale: [0.18, 0.95, 0.18],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-08",
    nameIndo: "Musculus Pronator Teres",
    nameLatin: "M. Pronator Teres",
    meshId: "pronator-teres",
    category: "otot",
    description: "Otot kompartemen anterior superfisial lengan bawah; pronator utama lengan bawah dan fleksor lemah sendi siku.",
    clinicalNote: "Nervus Medianus melintas di antara kedua kaputnya (caput humerale dan ulnare); hipertrofi atau spasme dapat memicu sindrom pronator teres.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.8, -0.1, 0.05],
    rotation: [0, 0, 0.1],
    scale: [0.15, 0.8, 0.15],
    baseColor: "#b91c1c",
  },

  // EKSTREMITAS BAWAH (10 OTOT & TENDON)
  {
    id: "struct-m-09",
    nameIndo: "Musculus Sartorius",
    nameLatin: "M. Sartorius",
    meshId: "sartorius",
    category: "otot",
    description: "Otot pita terpanjang pada tubuh manusia, melintas serong dari SIAS ke facies medialis tuberositas tibiae bersama tendon pes anserinus.",
    clinicalNote: "Melakukan fleksi, abduksi, dan eksorotasi paha serta fleksi lutut (posisi bersila penjahit / tailor's muscle); diinervasi oleh Nervus Femoralis (L2-L3).",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0.35, -1.05, 0.16],
    rotation: [0.2, 0.3, 0.3],
    scale: [0.1, 1.55, 0.1],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-10",
    nameIndo: "Musculus Rectus Femoris",
    nameLatin: "M. Rectus Femoris (Quadriceps)",
    meshId: "rectus-femoris",
    category: "otot",
    description: "Komponen lurus M. quadriceps femoris; berorigo di Spina Iliaca Anterior Inferior (SIAI) dan berinsersio melalui tendo patellae ke tuberositas tibiae.",
    clinicalNote: "Satu-satunya komponen kuadriseps yang melintasi dua sendi (fleksi articulatio coxae dan ekstensi genu); komponen utama refleks tendon patella (L3-L4).",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.36, -1.15, 0.18],
    rotation: [0, 0, -0.04],
    scale: [0.22, 1.35, 0.22],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-11",
    nameIndo: "Musculus Vastus Lateralis",
    nameLatin: "M. Vastus Lateralis (Quadriceps)",
    meshId: "vastus-lateralis",
    category: "otot",
    description: "Komponen terbesar dari M. quadriceps femoris di kompartemen anterolateral paha; ekstensor sendi lutut yang sangat kuat.",
    clinicalNote: "Lokasi pilihan standar untuk injeksi intramuskular (IM) pada neonatus, bayi, dan balita karena bebas dari struktur neurovaskular mayor.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.55, -1.2, 0.08],
    rotation: [0, 0, -0.08],
    scale: [0.24, 1.3, 0.24],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-12",
    nameIndo: "Musculus Vastus Medialis",
    nameLatin: "M. Vastus Medialis (VMO)",
    meshId: "vastus-medialis",
    category: "otot",
    description: "Komponen medial M. quadriceps femoris; serabut distalnya (Vastus Medialis Oblique / VMO) berperan krusial menstabilkan patella ke arah medial saat ekstensi lutut.",
    clinicalNote: "Kelemahan atau atrofi VMO menyebabkan subluksasi patella ke arah lateral dan sindrom nyeri patellofemoral (patellofemoral pain syndrome / runner's knee).",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0.25, -1.2, 0.08],
    rotation: [0, 0, 0.08],
    scale: [0.24, 1.3, 0.24],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-13",
    nameIndo: "Musculus Gracilis",
    nameLatin: "M. Gracilis",
    meshId: "gracilis",
    category: "otot",
    description: "Otot ramping di kompartemen medial paha; mengadduksikan sendi panggul dan memfleksikan sendi lutut, berinsersio pada pes anserinus bersama sartorius dan semitendinosus.",
    clinicalNote: "Sering digunakan dalam bedah rekonstruksi dan transfer jaringan mikro (gracilis free flap) untuk rekonstruksi sfingter atau defek jaringan lunak.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.2, -1.15, 0],
    rotation: [0, 0, 0.02],
    scale: [0.12, 1.4, 0.12],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-14",
    nameIndo: "Musculus Biceps Femoris",
    nameLatin: "M. Biceps Femoris (Hamstrings)",
    meshId: "biceps-femoris",
    category: "otot",
    description: "Komponen lateral kelompok otot ischiocrurales (hamstrings) di kompartemen posterior paha; fleksor lutut dan ekstensor panggul yang berinsersio pada caput fibulae.",
    clinicalNote: "Tendonnya membentuk batas superolateral fossa poplitea; cedera regangan hamstring (hamstring strain) paling sering melibatkan pertautan miotendinosis M. biceps femoris.",
    difficulty: "sedang",
    masteryStatus: "berkembang",
    geometryType: "cylinder",
    position: [0.42, -1.25, -0.18],
    rotation: [0, 0, -0.05],
    scale: [0.22, 1.35, 0.22],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-15",
    nameIndo: "Musculus Tibialis Anterior",
    nameLatin: "M. Tibialis Anterior",
    meshId: "tibialis-anterior",
    category: "otot",
    description: "Otot utama kompartemen anterior tungkai bawah; berfungsi melakukan dorsofleksi kaki pada pergelangan kaki dan inversi pedis.",
    clinicalNote: "Diinervasi oleh N. Peroneus Profundus (L4-L5); lesi saraf ini menyebabkan drop foot (steppage gait) di mana kaki terkulai saat mengayun.",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.34, -2.15, 0.12],
    rotation: [0, 0, 0],
    scale: [0.16, 1.25, 0.16],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-16",
    nameIndo: "Musculus Gastrocnemius",
    nameLatin: "M. Gastrocnemius",
    meshId: "gastrocnemius",
    category: "otot",
    description: "Otot berkepala dua (caput mediale & laterale) superfisial kompartemen posterior betis; plantarfleksi kuat pergelangan kaki dan membantu fleksi lutut.",
    clinicalNote: "Bersama M. soleus membentuk M. triceps surae; diinervasi oleh N. Tibialis (S1-S2); menghasilkan tenaga pendorong (propulsion) utama saat melompat dan berlari.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.34, -2.05, -0.14],
    rotation: [0, 0, 0],
    scale: [0.24, 1.15, 0.24],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-17",
    nameIndo: "Musculus Soleus",
    nameLatin: "M. Soleus",
    meshId: "soleus",
    category: "otot",
    description: "Otot pipih lebar di profundus M. gastrocnemius; plantarfleksi pergelangan kaki yang sangat penting untuk postur tegak dan berjalan terus-menerus.",
    clinicalNote: "Mengandung pleksus vena luas (soleal plexus) yang bertindak sebagai 'jantung kedua' (peripheral heart) memompa darah vena kembali ke jantung; statis memicu Deep Vein Thrombosis (DVT).",
    difficulty: "sedang",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.34, -2.15, -0.12],
    rotation: [0, 0, 0],
    scale: [0.22, 1.2, 0.22],
    baseColor: "#b91c1c",
  },
  {
    id: "struct-m-18",
    nameIndo: "Tendo Calcaneus (Achillis)",
    nameLatin: "Tendo Calcaneus",
    meshId: "calcaneal-tendon",
    category: "organ",
    description: "Tendon terbesar dan terkuat di tubuh manusia yang menambatkan M. triceps surae (gastrocnemius dan soleus) ke tuber calcanei.",
    clinicalNote: "Ruptur akut tendo Achillis ditandai sensasi ditendang dari belakang dan tes Thompson positif (tidak ada plantarfleksi saat betis diremas); tes refleks Achilles menguji radiks S1-S2.",
    difficulty: "mudah",
    masteryStatus: "dikuasai",
    geometryType: "cylinder",
    position: [0.34, -2.55, -0.15],
    rotation: [0, 0, 0],
    scale: [0.08, 0.65, 0.08],
    baseColor: "#f1f5f9",
  },
];

// Soal Kuis Khusus Regio Membrum (Ekstremitas Atas & Bawah)
export const mockMembrumQuizQuestions: QuizQuestionItem[] = [
  {
    id: "qm-01",
    mode: "klik-struktur",
    targetStructureId: "struct-m-02",
    promptText: "Temukan otot rotator cuff yang menginisiasi 15 derajat pertama abduksi bahu:",
    latinName: "M. Supraspinatus",
    hint: "Cari otot di fosa superior spina scapulae di atas bahu yang sering mengalami robekan rotator cuff.",
    explanation:
      "Tepat sekali! Musculus Supraspinatus menginisiasi abduksi lengan atas (0-15 derajat) sebelum M. deltoideus mengambil alih. Tendonnya paling sering mengalami tendinitis atau ruptur rotator cuff.",
  },
  {
    id: "qm-02",
    mode: "klik-struktur",
    targetStructureId: "struct-m-15",
    promptText: "Klik pada otot kompartemen anterior tungkai bawah yang mengalami kelemahan pada 'drop foot':",
    latinName: "M. Tibialis Anterior",
    hint: "Cari otot lateral os tibia yang bertanggung jawab atas dorsofleksi kaki dan diinervasi oleh N. Peroneus Profundus.",
    explanation:
      "Benar! M. Tibialis Anterior melakukan dorsofleksi pergelangan kaki. Cedera N. Peroneus Profundus menyebabkan kelumpuhan otot ini, bermanifestasi sebagai drop foot (kaki seret/steppage gait).",
  },
  {
    id: "qm-03",
    mode: "sebutkan-nama",
    targetStructureId: "struct-m-11",
    promptText: "Perhatikan otot paha anterolateral yang disorot. Manakah nama struktur dan indikasi klinis utamanya?",
    latinName: "Otot Kompartemen Anterior Femoris",
    options: [
      {
        structureId: "struct-m-11",
        nameIndo: "Musculus Vastus Lateralis",
        nameLatin: "M. Vastus Lateralis (Lokasi Injeksi IM Pediatrik)",
      },
      {
        structureId: "struct-m-10",
        nameIndo: "Musculus Rectus Femoris",
        nameLatin: "M. Rectus Femoris",
      },
      {
        structureId: "struct-m-09",
        nameIndo: "Musculus Sartorius",
        nameLatin: "M. Sartorius",
      },
      {
        structureId: "struct-m-13",
        nameIndo: "Musculus Gracilis",
        nameLatin: "M. Gracilis",
      },
    ],
    hint: "Merupakan komponen kuadriseps terluar di paha lateral, tempat suntikan vaksinasi intramuskular pada bayi.",
    explanation:
      "Tepat sekali! M. Vastus Lateralis adalah komponen terbesar quadriceps femoris di lateral paha dan merupakan lokasi standar injeksi intramuskular pada pediatrik karena aman dari saraf skiatik.",
  },
  {
    id: "qm-04",
    mode: "klik-struktur",
    targetStructureId: "struct-m-18",
    promptText: "Klik tendo terkuat di tumit yang diuji pada tes Thompson:",
    latinName: "Tendo Calcaneus (Achillis)",
    hint: "Cari tendon putih tebal di bagian posterior tumit yang menempel pada tuber calcanei.",
    explanation:
      "Hebat! Tendo Calcaneus (Achillis) menghubungkan M. triceps surae ke os calcaneus. Pada ruptur akut, tes Thompson positif (tidak ada gerakan plantarfleksi pasif saat betis diremas).",
  },
  {
    id: "qm-05",
    mode: "sebutkan-nama",
    targetStructureId: "struct-m-01",
    promptText: "Struktur bahu superficial yang disorot ini diinervasi oleh saraf apa dan berfungsi untuk gerakan apa?",
    latinName: "Otot Bahu Abduktor Utama",
    options: [
      {
        structureId: "struct-m-01",
        nameIndo: "Musculus Deltoideus",
        nameLatin: "M. Deltoideus (N. Axillaris, abduksi 15°-90°)",
      },
      {
        structureId: "struct-m-06",
        nameIndo: "Musculus Triceps Brachii",
        nameLatin: "M. Triceps Brachii (N. Radialis)",
      },
      {
        structureId: "struct-m-04",
        nameIndo: "Musculus Biceps Brachii",
        nameLatin: "M. Biceps Brachii (N. Musculocutaneus)",
      },
      {
        structureId: "struct-m-03",
        nameIndo: "Musculus Infraspinatus",
        nameLatin: "M. Infraspinatus (N. Suprascapularis)",
      },
    ],
    hint: "Otot berbentuk segitiga pelindung bahu yang diinervasi oleh Nervus Axillaris (C5-C6).",
    explanation:
      "Benar sekali! Musculus Deltoideus diinervasi oleh N. Axillaris dan merupakan abduktor kuat sendi glenohumeral pada rentang 15°-90°.",
  },
];

// Alias backwards-compatibility untuk kode terdahulu
export const mock3DStructures: Anatomy3DStructure[] = mockMembrum3DStructures;
export const mockQuizQuestions: QuizQuestionItem[] = mockMembrumQuizQuestions;

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
];

// Helper untuk mengambil struktur berdasarkan regio yang dipilih
export function getStructuresByRegion(regionId: string): Anatomy3DStructure[] {
  switch (regionId) {
    case "reg-caput":
    case "reg-01":
      return mockCaput3DStructures;
    case "reg-collum":
    case "reg-02":
      return mockCollum3DStructures;
    case "reg-thorax":
    case "reg-03":
    case "reg-04":
      return mockThorax3DStructures;
    case "reg-abdomen":
    case "reg-05":
      return mockAbdomen3DStructures;
    case "reg-pelvis":
      return mockPelvis3DStructures;
    case "reg-membrum":
    case "reg-06":
    default:
      return mockMembrum3DStructures;
  }
}

// Soal Kuis Khusus Model 3D Otot Kepala & Wajah
export const mockCaputQuizQuestions: QuizQuestionItem[] = [
  {
    id: "qc-01",
    mode: "klik-struktur",
    targetStructureId: "struct-c-05",
    promptText: "Klik pada otot pengunyah utama yang paling sering mengalami trismus saat infeksi tetanus:",
    latinName: "M. Masseter",
    hint: "Cari otot tebal di pipi bagian belakang/sudut rahang bawah yang menghubungkan arkus zigomatikus ke angulus mandibula.",
    explanation: "Tepat sekali! Musculus Masseter adalah otot pengunyah berkekuatan gigitan sangat besar. Spasme tonik otot ini akibat eksotoksin tetanus menghasilkan trismus (lockjaw).",
  },
  {
    id: "qc-02",
    mode: "klik-struktur",
    targetStructureId: "struct-c-06",
    promptText: "Temukan otot sfingter mata yang mengalami lagoftalmus (tidak bisa memejam) pada Bell's Palsy:",
    latinName: "M. Orbicularis Oculi",
    hint: "Cari otot melingkar konsentris yang mengelilingi kedua kelopak mata.",
    explanation: "Benar! M. Orbicularis Oculi bertindak sebagai sfingter penutup mata. Kelumpuhan N. VII menyebabkan lagoftalmus dan risiko keratitis eksposur.",
  },
  {
    id: "qc-03",
    mode: "klik-struktur",
    targetStructureId: "struct-c-13",
    promptText: "Klik otot dinding pipi dalam yang ditembus oleh Ductus Stenon (parotis):",
    latinName: "M. Buccinator",
    hint: "Cari otot pipi lapis dalam yang menahan makanan di antara gigi saat mengunyah dan menahan tekanan meniup.",
    explanation: "Tepat sekali! Musculus Buccinator membentuk dinding lateral pipi dan ditembus oleh saluran kelenjar parotis di seberang gigi molar dua atas.",
  },
  {
    id: "qc-04",
    mode: "klik-struktur",
    targetStructureId: "struct-c-09",
    promptText: "Temukan otot penarik sudut bibir ke atas dan belakang saat tersenyum tulus:",
    latinName: "M. Zygomaticus Major",
    hint: "Pita otot diagonal dari tulang pipi menuju sudut mulut.",
    explanation: "Luar biasa! Musculus Zygomaticus Major adalah otot utama pembentuk senyum Duchenne; asimetri saat tersenyum adalah uji klinis paling sensitif paresis N. VII.",
  },
];

// Soal Kuis Khusus Model 3D Otot Leher & Cervix (FK ULM)
export const mockCollumQuizQuestions: QuizQuestionItem[] = [
  {
    id: "qcol-01",
    mode: "klik-struktur",
    targetStructureId: "struct-col-02",
    promptText: "Klik otot landmark leher yang diinervasi N. Accessorius (CN XI) dan mengalami spasme atau kontraktur pada Tortikolis:",
    latinName: "M. Sternocleidomastoideus",
    hint: "Cari otot silang besar di leher dari manubrium sterni & klavikula menuju processus mastoideus.",
    explanation: "Tepat sekali! Musculus Sternocleidomastoideus (SCM) membagi leher menjadi trigonum anterior dan posterior. Spasme atau fibrosis unilateral pada SCM menyebabkan tortikolis kongenital (wryneck).",
  },
  {
    id: "qcol-02",
    mode: "klik-struktur",
    targetStructureId: "struct-col-11",
    promptText: "Temukan otot lateral profunda yang disilang N. Phrenicus dan berinsersio pada Tuberculum Lisfranc Costa I:",
    latinName: "M. Scalenus Anterior",
    hint: "Otot yang bersama scalenus medius membentuk celah hiatus scalenus tempat melintasnya Pleksus Brakialis dan A. Subclavia.",
    explanation: "Benar sekali! Musculus Scalenus Anterior membentuk batas anterior hiatus scalenus. Hipertrofi atau variasi anatomis di sini memicu Thoracic Outlet Syndrome (TOS) dengan penekanan neurovaskular ke lengan.",
  },
  {
    id: "qcol-03",
    mode: "klik-struktur",
    targetStructureId: "struct-col-08",
    promptText: "Klik otot infrahioid berurat ganda yang venter superiornya menjadi batas pemisah Trigonum Caroticum dari Trigonum Musculare:",
    latinName: "M. Omohyoideus",
    hint: "Otot berurat panjang yang membentang dari skapula ke os hyoid melalui tendo intermedius di leher lateral-anterior.",
    explanation: "Luar biasa! M. Omohyoideus memiliki venter superior dan inferior; venter superiornya menjadi batas inferolateral Trigonum Caroticum tempat pulsasi arteria carotis communis dipalpasi.",
  },
  {
    id: "qcol-04",
    mode: "klik-struktur",
    targetStructureId: "struct-col-04",
    promptText: "Temukan otot pipih pembentuk dasar rongga mulut (diaphragma oris) yang membatasi perluasan Angina Ludwig:",
    latinName: "M. Mylohyoideus",
    hint: "Otot suprahioid berbentuk sling di bawah lidah yang berorigo di linea mylohyoidea mandibula.",
    explanation: "Sangat tepat! Musculus Mylohyoideus membentuk lantai anatomis rongga mulut (diaphragma oris) dan diinervasi N. Mylohyoideus (CN V3). Infeksi odontogenik dapat menyebar ke ruang submandibular dan sublingual di sekitar batas otot ini.",
  },
  {
    id: "qcol-05",
    mode: "klik-struktur",
    targetStructureId: "struct-col-01",
    promptText: "Klik lembaran otot tipis superfisial di fascia cervicalis superficialis yang dipersarafi Ramus Colli N. Facialis (CN VII):",
    latinName: "M. Platysma",
    hint: "Lapisan otot paling luar yang menutupi bagian anterior dan anterolateral leher tepat di bawah kulit.",
    explanation: "Tepat sekali! Musculus Platysma adalah turunan otot brakial kedua yang berinervasi Ramus Colli N. Facialis (CN VII) dan berfungsi menegangkan kulit leher saat ekspresi emosi ekstrem.",
  },
];

// Soal Kuis Khusus Model 3D Otot Abdomen & Dinding Perut (FK ULM)
export const mockAbdomenQuizQuestions: QuizQuestionItem[] = [
  {
    id: "qab-01",
    mode: "klik-struktur",
    targetStructureId: "struct-ab-01",
    promptText: "Klik otot dinding anterior abdomen yang dipisahkan oleh intersectiones tendineae ('six-pack') dan dibungkus oleh rectus sheath:",
    latinName: "M. Rectus Abdominis",
    hint: "Otot vertikal memanjang berpasangan di sisi kiri dan kanan garis tengah perut.",
    explanation: "Tepat sekali! Musculus Rectus Abdominis adalah otot vertikal utama dinding anterior abdomen. Peregangan berlebihan atau kelemahan aponeurosis midline pasca kehamilan memicu diastasis recti.",
  },
  {
    id: "qab-02",
    mode: "klik-struktur",
    targetStructureId: "struct-ab-08",
    promptText: "Temukan otot dinding posterior abdomen yang mengalami Psoas Sign positif pada apendisitis akut dan menjadi tempat penjalaran abses Pott disease:",
    latinName: "M. Psoas Major",
    hint: "Otot silindris tebal di samping columna vertebralis lumbalis yang melintas ke bawah melewati ligamentum inguinale.",
    explanation: "Benar sekali! Musculus Psoas Major berjalan retroperitoneal dekat apendiks vermiformis. Nyeri paha saat hiperekstensi panggul (Psoas sign) mengindikasikan iritasi peritonitis retrosekal.",
  },
  {
    id: "qab-03",
    mode: "klik-struktur",
    targetStructureId: "struct-ab-03",
    promptText: "Klik pita jaringan ikat aponeurotik avaskular di garis tengah yang menjadi jalur insisi utama laparatomi mediana:",
    latinName: "Linea Alba",
    hint: "Pita fibrosa putih di garis tengah dari processus xiphoideus hingga symphysis pubica.",
    explanation: "Luar biasa! Linea Alba dibentuk oleh jalinan serabut aponeurosis ketiga otot pipih dinding perut. Insisi laparatomi di sini relatif sedikit perdarahan karena bersifat avaskular.",
  },
  {
    id: "qab-04",
    mode: "klik-struktur",
    targetStructureId: "struct-ab-04",
    promptText: "Temukan lapisan otot terluar dinding anterolateral abdomen yang tepi bawah aponeurosisnya melipat membentuk Ligamentum Inguinale (Poupart):",
    latinName: "M. Obliquus Externus Abdominis",
    hint: "Lapisan otot superfisial di samping perut dengan serabut condong ke inferomedial ('tangan masuk saku').",
    explanation: "Sangat tepat! M. Obliquus Externus Abdominis memiliki aponeurosis lebar yang melipat di antara SIAS dan tuberculum pubicum membentuk Ligamentum Inguinale, batas bawah hernia kanalis inguinalis.",
  },
  {
    id: "qab-05",
    mode: "klik-struktur",
    targetStructureId: "struct-ab-10",
    promptText: "Klik kubah muskuloaponeurotik pemisah kavitas toraks dan abdomen yang memiliki hiatus setinggi T8, T10, dan T12:",
    latinName: "Diaphragma",
    hint: "Otot berbentuk kubah di atap cavitas abdominis yang diinervasi oleh Nervus Phrenicus.",
    explanation: "Tepat sekali! Diaphragma adalah otot inspirasi utama dengan 3 apertura mayor: foramen venae cavae (T8), hiatus oesophageus (T10, situs hernia hiatus), dan hiatus aorticus (T12).",
  },
];

// Soal Kuis Khusus Model 3D Otot Dinding Dada & Toraks (FK ULM)
export const mockThoraxQuizQuestions: QuizQuestionItem[] = [
  {
    id: "qth-01",
    mode: "klik-struktur",
    targetStructureId: "struct-th-04",
    promptText: "Klik otot dinding lateral dada yang diinervasi N. Thoracicus Longus dan cederanya saat mastektomi memicu Winged Scapula (Scapula Alata):",
    latinName: "M. Serratus Anterior",
    hint: "Otot berbentuk gerigi yang membentang dari kosta 1-8 menuju margo medialis scapulae.",
    explanation: "Tepat sekali! Musculus Serratus Anterior ('boxer's muscle') menempelkan scapula erat ke dinding toraks. Kerusakan N. Thoracicus Longus memicu lepasnya margo medialis scapula (scapula alata / winged scapula).",
  },
  {
    id: "qth-02",
    mode: "klik-struktur",
    targetStructureId: "struct-th-02",
    promptText: "Temukan otot anterior dada di profunda M. pectoralis major yang menjadi landmark pembagi Arteria Axillaris menjadi tiga segmen:",
    latinName: "M. Pectoralis Minor",
    hint: "Otot segitiga yang berorigo di kosta 3-5 dan berinsersio pada processus coracoideus scapulae.",
    explanation: "Benar sekali! Musculus Pectoralis Minor membagi A. Axillaris menjadi pars 1 (proksimal/medial), pars 2 (posterior), dan pars 3 (distal/lateral), sebuah patokan pembedahan aksila yang sangat vital.",
  },
  {
    id: "qth-03",
    mode: "klik-struktur",
    targetStructureId: "struct-th-07",
    promptText: "Klik lapisan terdalam sela iga yang dipisahkan dari M. intercostales interni oleh berkas neurovaskular (VAN: Vena, Arteri, Saraf):",
    latinName: "Mm. Intercostales Intimi",
    hint: "Lapisan otot interkostal paling dalam yang berbatasan langsung dengan pleura parietalis.",
    explanation: "Luar biasa! Berkas neurovaskular interkostal (VAN) berjalan di sulcus costae antara M. intercostales interni dan intimi. Prosedur pungsi pleura / chest tube harus di tepi atas kosta bawah untuk menghindari struktur ini.",
  },
  {
    id: "qth-04",
    mode: "klik-struktur",
    targetStructureId: "struct-th-01",
    promptText: "Temukan otot tebal dinding dada anterior yang adduksi dan endorotasi lengan serta mengalami agenesis pada Sindrom Poland kongenital:",
    latinName: "M. Pectoralis Major",
    hint: "Otot kipas terbesar di dada dengan pars clavicularis dan pars sternocostalis.",
    explanation: "Sangat tepat! Musculus Pectoralis Major adalah adduktor kuat lengan. Agenesis kongenital otot ini unilateral bersama kelainan jari tangan dikenal sebagai Poland Syndrome.",
  },
  {
    id: "qth-05",
    mode: "klik-struktur",
    targetStructureId: "struct-th-08",
    promptText: "Klik otot berbentuk bintang di dinding dalam sternum yang menutupi pembuluh darah Arteria Thoracica Interna (LIMA graft CABG):",
    latinName: "M. Transversus Thoracis",
    hint: "Otot di bagian dalam dada anterior yang memancar dari sternum ke kartilago kosta 2-6.",
    explanation: "Tepat sekali! Musculus Transversus Thoracis terletak di permukaan dalam dinding anterior dada dan memfiksasi A. Thoracica Interna (Internal Mammary Artery) yang menjadi pilihan utama revaskularisasi bypass jantung (CABG).",
  },
];

// Soal Kuis Khusus Model 3D Otot Panggul, Gluteal & Dasar Panggul (FK ULM)
export const mockPelvisQuizQuestions: QuizQuestionItem[] = [
  {
    id: "qpel-01",
    mode: "klik-struktur",
    targetStructureId: "struct-pel-02",
    promptText: "Klik otot abduktor utama panggul yang diinervasi N. Gluteus Superior dan kelemahannya menimbulkan tanda Trendelenburg positif:",
    latinName: "M. Gluteus Medius",
    hint: "Otot berbentuk kipas di sisi lateral panggul di bawah gluteus maximus yang berinsersio pada trochanter major.",
    explanation: "Tepat sekali! Musculus Gluteus Medius adalah abduktor utama panggul. Saat berdiri satu kaki, otot ini berkontraksi mencegah panggul jatuh ke sisi kontralateral (tanda Trendelenburg).",
  },
  {
    id: "qpel-02",
    mode: "klik-struktur",
    targetStructureId: "struct-pel-05",
    promptText: "Temukan otot berbentuk piramida yang membagi foramen ischiadicum majus dan jika mengalami spasme dapat menjepit N. Ischiadicus:",
    latinName: "M. Piriformis",
    hint: "Otot yang keluar dari facies anterior sacrum melewati takik iskiadika mayor menuju trochanter mayor femoris.",
    explanation: "Benar sekali! Musculus Piriformis membagi foramen ischiadicum majus menjadi ruang suprapiriforme dan infrapiriforme. Spasme atau hipertrofi otot ini memicu Sindrom Piriformis (ischialgia).",
  },
  {
    id: "qpel-03",
    mode: "klik-struktur",
    targetStructureId: "struct-pel-12",
    promptText: "Klik otot sling diafragma pelvis yang melingkari taut anorektal untuk mempertahankan sudut anorektal (kontinensia alvi):",
    latinName: "M. Puborectalis",
    hint: "Serabut medial M. levator ani yang membentuk jerat berbentuk huruf U di belakang sambungan rektum dan kanalis analis.",
    explanation: "Luar biasa! Musculus Puborectalis membentuk sling anorektal yang menarik persambungan anorektal ke anterior menghasilkan sudut 80°-90° yang esensial untuk kontinensia fekal.",
  },
  {
    id: "qpel-04",
    mode: "klik-struktur",
    targetStructureId: "struct-pel-11",
    promptText: "Temukan komponen terbesar M. Levator Ani yang menopang organ visera panggul dan cedera saat partus memicu prolaps organ panggul:",
    latinName: "M. Pubococcygeus",
    hint: "Otot pipih lebar lantai dasar panggul yang membentang dari os pubis ke os coccygis.",
    explanation: "Sangat tepat! Musculus Pubococcygeus adalah penopang utama lantai panggul (pelvic floor). Kelemahan akibat peregangan partus multipara menyebabkan prolaps uteri dan inkontinensia urin.",
  },
  {
    id: "qpel-05",
    mode: "klik-struktur",
    targetStructureId: "struct-pel-01",
    promptText: "Klik otot ekstensor panggul terbesar yang kuadran superolateralnya menjadi zona aman injeksi intramuskular (IM):",
    latinName: "M. Gluteus Maximus",
    hint: "Otot paling besar dan tebal di bokong yang aktif saat menaiki tangga atau bangkit dari posisi duduk.",
    explanation: "Tepat sekali! Musculus Gluteus Maximus adalah otot terkuat bokong. Kuadran superolateral dipilih untuk injeksi IM guna menghindari cedera pada N. Ischiadicus yang melintas di kuadran inferomedial.",
  },
];

export function getQuizQuestionsByRegion(regionId: string): QuizQuestionItem[] {
  switch (regionId) {
    case "reg-caput":
      return mockCaputQuizQuestions;
    case "reg-collum":
      return mockCollumQuizQuestions;
    case "reg-thorax":
      return mockThoraxQuizQuestions;
    case "reg-abdomen":
      return mockAbdomenQuizQuestions;
    case "reg-pelvis":
      return mockPelvisQuizQuestions;
    case "reg-membrum":
      return mockMembrumQuizQuestions;
    default:
      return mockMembrumQuizQuestions;
  }
}

// 11. Data Pengaturan & Preferensi Mahasiswa
export interface UserStudyPreferences {
  targetItemsPerDay: number;
  studyDays: string[];
  reminderTime: string;
  defaultQuizMode: "klik-struktur" | "sebutkan-nama";
}

export interface UserNotificationSettings {
  dailyReminder: boolean;
  examAlert: boolean;
  weeklySummary: boolean;
}

export interface UserAppearanceSettings {
  theme: "light" | "dark" | "system";
  fontSize: "small" | "normal" | "large";
}

export interface AppInfoSettings {
  name: string;
  version: string;
  lastUpdated: string;
  disclaimer: string;
  attribution: string;
  techStack: { name: string; category: string }[];
}

export const mockStudyPreferences: UserStudyPreferences = {
  targetItemsPerDay: 20,
  studyDays: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  reminderTime: "19:30",
  defaultQuizMode: "klik-struktur",
};

export const mockNotificationSettings: UserNotificationSettings = {
  dailyReminder: true,
  examAlert: true,
  weeklySummary: true,
};

export const mockAppearanceSettings: UserAppearanceSettings = {
  theme: "light",
  fontSize: "normal",
};

export const mockAppInfoSettings: AppInfoSettings = {
  name: "PRIMA (Platform Review Interaktif Medis Adaptif)",
  version: "1.3.0",
  lastUpdated: "5 November 2026",
  disclaimer:
    "PRIMA adalah alat bantu belajar, bukan alat diagnosis dan bukan pengganti dosen, praktikum, atau pasien nyata.",
  attribution:
    "Model anatomi 3D diadaptasi dari 'Z-Anatomy, The libre 3D atlas of anatomy' (CC BY-SA 4.0) dan 'BodyParts3D, The Database Center for Life Science' (CC BY-SA 2.1 Japan). Model telah disederhanakan dan dipotong untuk keperluan aplikasi ini. Silabus praktikum mengacu pada Buku Petunjuk Praktikum Anatomi FK ULM.",
  techStack: [
    { name: "Next.js 15 (App Router)", category: "Framework" },
    { name: "React 19", category: "Library" },
    { name: "TypeScript", category: "Language" },
    { name: "Tailwind CSS v4", category: "Styling" },
    { name: "Three.js", category: "3D Graphics" },
    { name: "@react-three/fiber", category: "3D Engine" },
    { name: "@react-three/drei", category: "3D Helpers" },
    { name: "Chart.js", category: "Visualisasi Data" },
    { name: "Bootstrap Icons", category: "Ikon" },
  ],
};

// ==========================================
// FITUR F3: UNGGAH MATERI & RANGKUMAN AI
// ==========================================

export interface MaterialSubtopic {
  id: string;
  title: string;
  latinTerm: string;
  overview: string;
  keyPoints: string[];
  keyTerms: {
    term: string;
    latin: string;
    definition: string;
  }[];
  clinicalCorrelation?: string;
}

export interface MaterialDocumentPage {
  pageNumber: number;
  sectionTitle: string;
  previewSnippet: string;
}

export interface MaterialItem {
  id: string;
  title: string;
  region: "Caput" | "Collum" | "Thorax" | "Abdomen" | "Pelvis" | "Membrum";
  fileName: string;
  fileSize: string;
  fileType: "pdf" | "ppt";
  pageCount: number;
  uploadedAt: string;
  status: "ready" | "processing" | "failed";
  processingProgress?: number;
  aiSummaryOverview?: string;
  subtopics: MaterialSubtopic[];
  previewPages: MaterialDocumentPage[];
}

export const mockMaterials: MaterialItem[] = [
  {
    id: "mat-01",
    title: "Anatomi Jantung dan Vaskularisasi Mediastinum",
    region: "Thorax",
    fileName: "Kuliah-Kardiovaskular-Blok-Thorax.pdf",
    fileSize: "14.2 MB",
    fileType: "pdf",
    pageCount: 38,
    uploadedAt: "4 Nov 2026",
    status: "ready",
    processingProgress: 100,
    aiSummaryOverview:
      "Rangkuman komprehensif mengenai konfigurasi ruang jantung (atria dan ventriculi), aparatus valvularis atrioventrikular dan semilunaris, jaras konduksi otomatis miokardium, serta percabangan arteria coronaria dan sinus coronarius.",
    subtopics: [
      {
        id: "sub-01-1",
        title: "Morfologi Eksterna & Ruang Jantung",
        latinTerm: "Cor: Morfologia Externa et Cavitates Cordis",
        overview:
          "Jantung berorientasi miring dalam mediastinum medium dengan basis menghadap posteriosuperior dan apex mengarah inferolateral ke sela iga V sinistra.",
        keyPoints: [
          "Basis cordis terutama dibentuk oleh atrium sinistrum dan sebagian atrium dextrum.",
          "Apex cordis dibentuk secara eksklusif oleh pars inferolateral ventriculus sinister (ICS V linea medioclavicularis sinistra).",
          "Atrium dextrum menerima darah terdeoksigenasi via Vena Cava Superior, Vena Cava Inferior, dan Sinus Coronarius; terdapat Fossa Ovalis pada septum interatriale.",
          "Ventriculus sinister memiliki dinding miokardial 3x lebih tebal daripada ventriculus dexter untuk mengatasi resistensi vaskular sistemik tinggi.",
        ],
        keyTerms: [
          {
            term: "Basis Jantung",
            latin: "Basis cordis",
            definition: "Permukaan posterosuperior jantung tempat keluarnya pembuluh darah besar.",
          },
          {
            term: "Puncak Jantung",
            latin: "Apex cordis",
            definition: "Ujung tumpul anteroinferior ventriculus sinister pada ICS V kiri.",
          },
          {
            term: "Fosa Ovalis",
            latin: "Fossa ovalis",
            definition: "Sisa lekukan embriologis foramen ovale pada septum interatriale.",
          },
          {
            term: "Otot Papilaris",
            latin: "Musculi papillares",
            definition: "Proyeksi miokardium ventrikel penyangga chordae tendineae katup AV.",
          },
        ],
        clinicalCorrelation:
          "Hipertrofi ventrikel kiri (LVH) sering terjadi akibat hipertensi kronis tak terkontrol, menggeser iktus kordis lebih lateral dari linea medioclavicularis.",
      },
      {
        id: "sub-01-2",
        title: "Aparatus Valvularis & Rangka Fibrosa",
        latinTerm: "Valvae Cordis et Skeleton Cardis",
        overview:
          "Empat katup utama mencegah aliran balik (regurgitasi) darah durante sistol dan diastol, tertanam pada skeleton fibrosum anuli fibrosi.",
        keyPoints: [
          "Valva Atrioventricularis Dextra (Trikuspidalis) memiliki 3 kuspis: anterior, posterior, dan septalis.",
          "Valva Atrioventricularis Sinistra (Bikuspidalis/Mitralis) memiliki 2 kuspis kokoh: anterior dan posterior.",
          "Chordae tendineae menahan tepi katup AV agar tidak prolaps ke dalam atrium saat fase ejeksi sistolik ventrikel.",
          "Valva Semilunaris (Aortae dan Trunci Pulmonalis) memiliki masing-masing 3 valvula semilunaris dengan nodulus valvulae di tengahnya.",
        ],
        keyTerms: [
          {
            term: "Katup Mitral",
            latin: "Valva mitralis / bicuspidalis",
            definition: "Katup bikuspid antara atrium kiri dan ventrikel kiri.",
          },
          {
            term: "Tali Tendon",
            latin: "Chordae tendineae",
            definition: "Struktur fibrosa penahan tepi katup atrioventrikular.",
          },
          {
            term: "Sinus Aorta",
            latin: "Sinus aortae (Valsalva)",
            definition: "Kantung di pangkal aorta tempat muara arteria coronaria.",
          },
        ],
        clinicalCorrelation:
          "Stenosis mitral akibat demam reumatik menyebabkan peningkatan tekanan atrium kiri yang diteruskan ke vena pulmonalis, memicu edema paru kardiogenik.",
      },
      {
        id: "sub-01-3",
        title: "Sistem Konduksi Jantung",
        latinTerm: "Systema Conducens Cordis",
        overview:
          "Jaringan nodus dan serabut miokardial khusus yang memulai serta mengoordinasikan kontraksi ritmis otomatis dinding jantung.",
        keyPoints: [
          "Nodus Sinuatrialis (SA Node) bertindak sebagai pacemaker fisiologis dominan (60-100 denyut/menit), berlokasi pada tautan VCS dan krista terminalis atrium dextrum.",
          "Nodus Atrioventricularis (AV Node) terletak di segitiga Koch, memberikan perlambatan konduksi fisiologis (~0.12 detik) agar ventrikel terisi optimal.",
          "Fasciculus Atrioventricularis (Bundle of His) menembus trigonum fibrosum dextrum menuju septum interventriculare.",
          "Rami subendocardiales (Purkinje fibers) menyalurkan depolarisasi cepat ke seluruh dinding ventrikel dari apeks ke basis.",
        ],
        keyTerms: [
          {
            term: "Nodus SA",
            latin: "Nodus sinuatrialis",
            definition: "Pemicu pacu jantung primer di dinding anterolateral atrium kanan.",
          },
          {
            term: "Nodus AV",
            latin: "Nodus atrioventricularis",
            definition: "Pusat tunda konduksi impuls sebelum diteruskan ke ventrikel.",
          },
          {
            term: "Berkas His",
            latin: "Fasciculus atrioventricularis",
            definition: "Satu-satunya koneksi konduksi fisiologis melintasi anulus fibrosus.",
          },
        ],
        clinicalCorrelation:
          "Blok AV derajat 3 (total AV block) menunjukkan disosiasi komplet antara depolarisasi atrium dan ventrikel, memerlukan pemasangan pacemaker permanen.",
      },
      {
        id: "sub-01-4",
        title: "Sirkulasi Koroner & Drainase Vena",
        latinTerm: "Vasa Sanguinea Cordis",
        overview:
          "Arteria coronaria dextra dan sinistra memperdarahi miokardium secara langsung saat fase diastol jantung ketika ostium aorta terbuka.",
        keyPoints: [
          "A. Coronaria Sinistra (LCA) segera bercabang menjadi Ramus Interventricularis Anterior (LAD) dan Ramus Circumflexus (LCx).",
          "LAD memperdarahi 2/3 anterior septum interventrikular dan dinding anterior ventrikel kiri (sering disebut pembuluh penyebab infark fatal).",
          "A. Coronaria Dextra (RCA) memperdarahi atrium dextrum, ventrikel dextrum, nodus SA (60% populasi), dan nodus AV (90% populasi).",
          "Sebagian besar darah vena jantung bermuara ke Sinus Coronarius yang bermuara langsung di atrium kanan posterior.",
        ],
        keyTerms: [
          {
            term: "Arteri Koroner Kiri",
            latin: "A. coronaria sinistra",
            definition: "Arteri utama pembagi LAD dan Circumflexus.",
          },
          {
            term: "Cabang Penentu (LAD)",
            latin: "Ramus interventricularis anterior",
            definition: "Cabang koroner yang menyuplai dinding anterior dan apeks ventrikel kiri.",
          },
          {
            term: "Sinus Koronarius",
            latin: "Sinus coronarius",
            definition: "Saluran vena lebar pada sulcus coronarius sisi posterior jantung.",
          },
        ],
        clinicalCorrelation:
          "Oklusi aterosklerotik pada LAD memicu Infark Miokard Akut (STEMI) dinding anterior yang memiliki risiko komplikasi kardiogenik tertinggi.",
      },
    ],
    previewPages: [
      {
        pageNumber: 1,
        sectionTitle: "Slide 1: Pengantar Anatomi Toraks & Mediastinum",
        previewSnippet:
          "Mediastinum merupakan kompartemen sentral rongga toraks yang dibatasi oleh pleura mediastinalis lateral, apertura thoracis superior, dan diafragma inferior. Jantung terletak pada mediastinum medium terlindung pericardium fibrosum.",
      },
      {
        pageNumber: 8,
        sectionTitle: "Slide 8: Anatomi Makroskopis Jantung",
        previewSnippet:
          "Konfigurasi eksterna meliputi 4 sulkus utama: Sulcus Coronarius (atrioventricularis), Sulcus Interventricularis Anterior, dan Sulcus Interventricularis Posterior yang dilalui vasa coronaria.",
      },
      {
        pageNumber: 17,
        sectionTitle: "Slide 17: Mekanisme Katup & Auskultasi",
        previewSnippet:
          "Fokus auskultasi: Katup Aorta di ICS II linea parasternalis dextra; Katup Pulmonal di ICS II linea parasternalis sinistra; Katup Trikuspid di ICS IV parasternalis sinistra; Katup Mitral di ICS V midklavikularis sinistra.",
      },
      {
        pageNumber: 26,
        sectionTitle: "Slide 26: Vaskularisasi Koroner & Dominansi",
        previewSnippet:
          "Dominansi koroner ditentukan oleh arteri yang mempercabangkan Ramus Interventricularis Posterior (PDA): RCA dominan pada ~85-90% individu, LCA dominan pada ~10-15%.",
      },
    ],
  },
  {
    id: "mat-02",
    title: "Pleksus Brakialis dan Inervasi Ekstremitas Superior",
    region: "Membrum",
    fileName: "Pleksus-Brakialis-Kuliah-Anatomi.pptx",
    fileSize: "9.8 MB",
    fileType: "ppt",
    pageCount: 32,
    uploadedAt: "5 Nov 2026",
    status: "ready",
    processingProgress: 100,
    aiSummaryOverview:
      "Ulasan komprehensif susunan jaringan saraf pleksus brakialis mulai dari rami anteriores servikal C5-T1, pengelompokan truncus, divisiones anterior-posterior, fasciculi axillaris, hingga cabang-cabang terminal nervus perifer serta manifestasi deformitas motorik klinisnya.",
    subtopics: [
      {
        id: "sub-02-1",
        title: "Radices dan Trunci Pleksus Brakialis",
        latinTerm: "Radices et Trunci Plexus Brachialis",
        overview:
          "Pleksus dibentuk oleh rami anteriores segmen medula spinalis C5 sampai T1 yang melintas di trigonum colli posterius antara m. scalenus anterior dan medius.",
        keyPoints: [
          "Radices C5 dan C6 bergabung membentuk Truncus Superior.",
          "Radix C7 melanjutkan diri secara tunggal membentuk Truncus Medius.",
          "Radices C8 dan T1 bersatu membentuk Truncus Inferior yang melintas di atas iga I.",
          "Cabang langsung dari radices: N. Dorsalis Scapulae (C5) dan N. Thoracicus Longus (C5-C7).",
        ],
        keyTerms: [
          {
            term: "Akar Saraf",
            latin: "Radices anteriores",
            definition: "Cabang primer ventral medula spinalis pembentuk pleksus brakialis.",
          },
          {
            term: "Batang Saraf",
            latin: "Truncus superior/medius/inferior",
            definition: "Tiga unit gabungan saraf utama di regio servikal lateral.",
          },
          {
            term: "Nervus Torasikus Longus",
            latin: "N. thoracicus longus",
            definition: "Saraf motorik m. serratus anterior pencegah winging scapula.",
          },
        ],
        clinicalCorrelation:
          "Traksi leher bayi berlebih saat persalinan sungsang dapat merobek truncus superior (C5-C6), memicu kelumpuhan Erb-Duchenne.",
      },
      {
        id: "sub-02-2",
        title: "Divisiones dan Fasciculi",
        latinTerm: "Divisiones et Fasciculi Infraclaviculares",
        overview:
          "Tepat di belakang clavicula, masing-masing truncus membelah menjadi divisi anterior (fleksor) dan posterior (ekstensor), yang kemudian menyusun tiga fasikulus di aksila.",
        keyPoints: [
          "Fasciculus Lateralis dibentuk oleh divisi anterior truncus superior dan truncus medius.",
          "Fasciculus Medialis merupakan kelanjutan langsung divisi anterior truncus inferior.",
          "Fasciculus Posterior dibentuk oleh penyatuan seluruh divisi posterior dari ketiga truncus (superior, medius, inferior).",
          "Penamaan fasikulus (lateral, medial, posterior) berpatokan pada posisinya terhadap pars secunda Arteria Axillaris.",
        ],
        keyTerms: [
          {
            term: "Fasikulus Lateral",
            latin: "Fasciculus lateralis",
            definition: "Fasikulus pembentuk N. musculocutaneus dan radix lateralis N. medianus.",
          },
          {
            term: "Fasikulus Medial",
            latin: "Fasciculus medialis",
            definition: "Fasikulus pembentuk N. ulnaris dan radix medialis N. medianus.",
          },
          {
            term: "Fasikulus Posterior",
            latin: "Fasciculus posterior",
            definition: "Fasikulus pembentuk N. radialis dan N. axillaris.",
          },
        ],
        clinicalCorrelation:
          "Kompresi arteri dan pleksus brakialis pada apertura thoracis superior (Thoracic Outlet Syndrome) sering mengenai truncus inferior atau fasciculus medialis.",
      },
      {
        id: "sub-02-3",
        title: "Cabang Terminal & Distribusi Motorik-Sensorik",
        latinTerm: "Rami Terminales Plexus Brachialis",
        overview:
          "Lima nervus utama mempersarafi kompartemen otot lengan atas, lengan bawah, serta sensorik dermatom tangan.",
        keyPoints: [
          "N. Musculocutaneus mempersarafi otot fleksor kompartemen anterior brachium (m. biceps brachii, coracobrachialis, brachialis) lalu berlanjut sebagai N. cutaneus antebrachii lateralis.",
          "N. Axillaris melintasi spatium quadrangulare bersama vasa circumflexa humeri posterior untuk m. deltoideus dan teres minor.",
          "N. Radialis berjalan di sulcus nervi radialis humeri, mempersarafi seluruh otot ekstensor lengan dan tangan.",
          "N. Medianus menginervasi sebagian besar fleksor dan pronator lengan bawah serta otot thenar lateral.",
          "N. Ulnaris berjalan di belakang epikondilus medialis ('funny bone') mempersarafi m. flexor carpi ulnaris, setengah medial FDP, dan sebagian besar otot intrinsik manus.",
        ],
        keyTerms: [
          {
            term: "Saraf Radialis",
            latin: "N. radialis",
            definition: "Saraf ekstensor utama lengan atas, lengan bawah, dan pergelangan tangan.",
          },
          {
            term: "Saraf Medianus",
            latin: "N. medianus",
            definition: "Saraf utama fleksor jari lateral dan gerakan oposisi pollex.",
          },
          {
            term: "Saraf Ulnaris",
            latin: "N. ulnaris",
            definition: "Saraf utama keterampilan motorik halus tangan (musculi interossei).",
          },
        ],
        clinicalCorrelation:
          "Fraktur corpus humeri sepertiga tengah rentan merusak N. radialis pada sulcus spiralis, menyebabkan 'wrist drop'.",
      },
      {
        id: "sub-02-4",
        title: "Korelasi Klinis Deformitas Ekstremitas",
        latinTerm: "Deformitates Clinicae Extremitatis Superioris",
        overview:
          "Pola cedera pada level tertentu di pleksus brakialis atau saraf perifer menghasilkan postur karakteristik klinis yang khas.",
        keyPoints: [
          "Erb-Duchenne Palsy (C5-C6): Lengan adduksi, rotasi interna, siku ekstensi, tangan pronasi ('Waiter's tip position').",
          "Klumpke Palsy (C8-T1): Kerusakan saraf T1 menyebabkan hilangnya inervasi otot intrinsik tangan sehingga terjadi 'Claw hand' total, sering disertai Horner's syndrome.",
          "Ape Hand Deformity: Atrofi eminentia thenaris akibat lesi kronis N. medianus proksimal, ibu jari sejajar dengan jari lain tanpa kemampuan oposisi.",
          "Winged Scapula: Tepi medial dan angulus inferior skapula menonjol ke belakang akibat lesi N. thoracicus longus.",
        ],
        keyTerms: [
          {
            term: "Posisi Waiter's Tip",
            latin: "Erb-Duchenne palsy",
            definition: "Postur patologis akibat paresis m. abduktor dan rotasi eksterna bahu.",
          },
          {
            term: "Tangan Cakar",
            latin: "Claw hand / Main en griffe",
            definition: "Hiperekstensi sendi MCP dan fleksi sendi IP akibat lesi N. ulnaris.",
          },
          {
            term: "Skapula Bersayap",
            latin: "Scapula alata",
            definition: "Tonjolan skapula abnormal akibat hilangnya fiksasi m. serratus anterior.",
          },
        ],
        clinicalCorrelation:
          "Carpal Tunnel Syndrome adalah neuropati jepitan N. medianus di bawah retinaculum musculorum flexorum yang memicu parestesia jari I-III lateral.",
      },
    ],
    previewPages: [
      {
        pageNumber: 1,
        sectionTitle: "Slide 1: Skema Arsitektur Pleksus Brakialis",
        previewSnippet:
          "Rumus mnemonic klasik: Roots (5), Trunks (3), Divisions (6), Cords (3), Branches (5) — 'Robert Taylor Drinks Cold Beer'.",
      },
      {
        pageNumber: 9,
        sectionTitle: "Slide 9: Topografi Trigonum Colli & Klavikula",
        previewSnippet:
          "Hubungan erat dengan vasa subclavia: Trunci terletak di atas A. subclavia di antara m. scalenus anterior dan medius, sedangkan V. subclavia berjalan di anterior m. scalenus anterior.",
      },
      {
        pageNumber: 18,
        sectionTitle: "Slide 18: Inervasi Motorik Kompartemen Manus",
        previewSnippet:
          "Mnemonic LOAF untuk N. medianus di tangan: Lumbricals 1-2, Opponens pollicis, Abductor pollicis brevis, Flexor pollicis brevis (pars superficialis). Seluruh otot intrinsik lainnya diinervasi N. ulnaris.",
      },
      {
        pageNumber: 27,
        sectionTitle: "Slide 27: Diagnosis Banding Cedera Saraf Tangan",
        previewSnippet:
          "Pemeriksaan uji Tinel dan Phalen di palmar pergelangan tangan mengonfirmasi kompresi kanalis karpalis. Uji Froment positif pada paresis m. adductor pollicis (lesi N. ulnaris).",
      },
    ],
  },
  {
    id: "mat-03",
    title: "Osteologi Caput dan Basis Cranii Interna",
    region: "Caput",
    fileName: "Neuro-Anatomi-Basis-Cranii.pdf",
    fileSize: "11.4 MB",
    fileType: "pdf",
    pageCount: 26,
    uploadedAt: "3 Nov 2026",
    status: "ready",
    processingProgress: 100,
    aiSummaryOverview:
      "Rangkuman komparatif tiga kompartemen basis cranii interna (fossa cranii anterior, media, posterior), delineasi batas tulang neurokranium, serta jalur keluar 12 nervi kraniales dan vasa meningea.",
    subtopics: [
      {
        id: "sub-03-1",
        title: "Fossa Cranii Anterior & Media",
        latinTerm: "Fossa Cranii Anterior et Media",
        overview:
          "Fossa anterior menopang lobus frontalis cerebri, sedangkan fossa cranii media menampung lobus temporalis dan corpus adiposum orbitae via fissura orbitalis.",
        keyPoints: [
          "Crista galli dan lamina cribrosa ossis ethmoidalis dilalui oleh fila olfactoria (N. I).",
          "Canalis opticus pada ala minor ossis sphenoidalis dilewati oleh N. opticus (N. II) dan A. ophthalmica.",
          "Fissura orbitalis superior dilalui oleh N. III, N. IV, N. V1 (ophthalmicus), N. VI, dan V. ophthalmica superior.",
          "Foramen rotundum dilalui N. V2 (maxillaris), sedangkan Foramen ovale dilalui N. V3 (mandibularis).",
        ],
        keyTerms: [
          {
            term: "Lamina Kribrosa",
            latin: "Lamina cribrosa",
            definition: "Pelat bertapis pada os ethmoidale jalur serabut nervus olfaktorius.",
          },
          {
            term: "Sella Tursika",
            latin: "Sella turcica (Fossa hypophysialis)",
            definition: "Cekungan pada korpus sfenoid tempat bersemayamnya kelenjar hipofisis.",
          },
        ],
        clinicalCorrelation:
          "Fraktur fossa anterior cranii dapat merobek duramater di lamina cribrosa menyebabkan rinorea cairan serebrospinal (CSF leak) dan anosmia.",
      },
      {
        id: "sub-03-2",
        title: "Fossa Cranii Posterior & Foramina Batang Otak",
        latinTerm: "Fossa Cranii Posterior et Foramina Basilaria",
        overview:
          "Kompartemen terdalam dan terluas yang menampung cerebellum, pons, dan medulla oblongata.",
        keyPoints: [
          "Meatus acusticus internus dilalui oleh N. facialis (N. VII), N. vestibulocochlearis (N. VIII), dan A. labyrinthi.",
          "Foramen jugulare merupakan pintu keluar N. glossopharyngeus (N. IX), N. vagus (N. X), N. accessorius (N. XI), serta awal V. jugularis interna.",
          "Canalis nervi hypoglossi dilalui secara eksklusif oleh N. XII yang menginervasi seluruh otot lidah.",
          "Foramen magnum dilalui oleh medulla oblongata, meninges, A. vertebralis, dan radix spinalis N. XI.",
        ],
        keyTerms: [
          {
            term: "Foramen Jugulare",
            latin: "Foramen jugulare",
            definition: "Celah antara os temporale dan occipitale muara V. jugularis interna dan N. IX-XI.",
          },
          {
            term: "Foramen Magnum",
            latin: "Foramen magnum",
            definition: "Lubang terbesar basis kranii tempat sambungan batang otak dan medula spinalis.",
          },
        ],
        clinicalCorrelation:
          "Tumor Schwannoma vestibularis (akustikus) tumbuh di meatus acusticus internus menyebabkan gangguan pendengaran unilateral, tinitus, dan paresis fasialis.",
      },
    ],
    previewPages: [
      {
        pageNumber: 1,
        sectionTitle: "Halaman 1: Topografi Tengkorak & Basis",
        previewSnippet:
          "Basis cranii terbagi menjadi endokranium (fossa anterior, media, posterior) dan eksokranium (norma basilaris).",
      },
      {
        pageNumber: 12,
        sectionTitle: "Halaman 12: Pemetaan Foramina dan Saraf Otak",
        previewSnippet:
          "Tabel ringkasan lintasan 12 pasang nervi kraniales dari N. I di lamina cribrosa hingga N. XII di canalis hypoglossi.",
      },
    ],
  },
  {
    id: "mat-04",
    title: "Dinding Ventrolateral Abdomen dan Canalis Inguinalis",
    region: "Abdomen",
    fileName: "Dinding-Abdomen-dan-Hernia-2026.pdf",
    fileSize: "7.1 MB",
    fileType: "pdf",
    pageCount: 18,
    uploadedAt: "6 Nov 2026",
    status: "processing",
    processingProgress: 68,
    aiSummaryOverview:
      "Sedang memproses analisis subtopik, ekstraksi struktur anatomi dinding ventrolateral (m. obliquus externus/internus, m. transversus abdominis) dan kanalis inguinalis...",
    subtopics: [],
    previewPages: [
      {
        pageNumber: 1,
        sectionTitle: "Halaman 1: Lapisan Dinding Abdomen",
        previewSnippet:
          "Kulit, fasia Camperi, fasia Scarpa, aponeurosis m. obliquus externus abdominis, m. obliquus internus, m. transversus abdominis, fasia transversalis, lemak preperitoneal, peritoneum parietale.",
      },
    ],
  },
  {
    id: "mat-05",
    title: "Topografi Regio Pelvis dan Diafragma Pelvis",
    region: "Pelvis",
    fileName: "Anatomi-Pelvis-Visera-Urogenital.pptx",
    fileSize: "15.6 MB",
    fileType: "ppt",
    pageCount: 22,
    uploadedAt: "6 Nov 2026",
    status: "failed",
    processingProgress: 0,
    aiSummaryOverview:
      "Gagal mengekstrak teks slide: Format berkas presentasi memerlukan pemindaian ulang atau unggah ulang dokumen asli.",
    subtopics: [],
    previewPages: [],
  },
];

// ==========================================
// FITUR F4: LATIHAN SOAL OLEH AI
// ==========================================

export interface QuizOption {
  id: "A" | "B" | "C" | "D";
  text: string;
}

export interface MaterialQuizQuestion {
  id: string;
  materialId: string;
  subtopicId: string;
  subtopicTitle: string;
  region: "Thorax" | "Membrum";
  difficulty: "mudah" | "sedang" | "sulit";
  vignette?: string;
  questionText: string;
  latinTerms: string[];
  options: QuizOption[];
  correctOptionId: "A" | "B" | "C" | "D";
  explanation: string;
  materialSource: {
    materialId: string;
    subtopicId: string;
    page: number;
    quote: string;
  };
}

export interface QuizSessionHistoryItem {
  id: string;
  dateStr: string;
  materialTitle: string;
  materialId: string;
  mode: "latihan" | "simulasi";
  score: number;
  totalQuestions: number;
  correctCount: number;
  durationSeconds: number;
}

export const mockMaterialQuizQuestions: MaterialQuizQuestion[] = [
  // MAT-01: ANATOMI JANTUNG & MEDIASTINUM (6 Soal)
  {
    id: "q-01",
    materialId: "mat-01",
    subtopicId: "sub-01-1",
    subtopicTitle: "Morfologi Eksterna & Ruang Jantung",
    region: "Thorax",
    difficulty: "mudah",
    questionText: "Bagian manakah dari cavitates cordis yang membentuk apex cordis dan memiliki dinding miokardial paling tebal?",
    latinTerms: ["Apex cordis", "Ventriculus sinister", "Myocardium"],
    options: [
      { id: "A", text: "Atrium dextrum" },
      { id: "B", text: "Atrium sinistrum" },
      { id: "C", text: "Ventriculus dexter" },
      { id: "D", text: "Ventriculus sinister" },
    ],
    correctOptionId: "D",
    explanation: "Apex cordis dibentuk secara eksklusif oleh pars inferolateral ventriculus sinister (ICS V linea medioclavicularis sinistra). Dinding miokardium ventrikel kiri 3x lebih tebal daripada ventrikel kanan untuk menghasilkan tekanan sirkulasi sistemik yang tinggi.",
    materialSource: {
      materialId: "mat-01",
      subtopicId: "sub-01-1",
      page: 8,
      quote: "Apex cordis dibentuk secara eksklusif oleh pars inferolateral ventriculus sinister.",
    },
  },
  {
    id: "q-02",
    materialId: "mat-01",
    subtopicId: "sub-01-2",
    subtopicTitle: "Aparatus Valvularis & Rangka Fibrosa",
    region: "Thorax",
    difficulty: "sedang",
    vignette: "Seorang wanita 45 tahun datang dengan keluhan sesak napas saat aktivitas. Pada auskultasi jantung di sela iga (ICS) V linea medioclavicularis sinistra, terdengar bising middiastolik bergemuruh (rumble) dengan opening snap.",
    questionText: "Katup manakah yang paling mungkin mengalami kelainan patologis stenosis pada pasien ini?",
    latinTerms: ["Valva bicuspidalis / mitralis", "Auscultatio cordis"],
    options: [
      { id: "A", text: "Valva tricuspidalis (Atrioventrikular kanan)" },
      { id: "B", text: "Valva bicuspidalis / mitralis (Atrioventrikular kiri)" },
      { id: "C", text: "Valva aortae (Semilunaris)" },
      { id: "D", text: "Valva trunci pulmonalis (Semilunaris)" },
    ],
    correctOptionId: "B",
    explanation: "Auskultasi di ICS V linea medioclavicularis sinistra adalah punctum maximum untuk katup mitral (valva bicuspidalis). Bising middiastolik dengan opening snap adalah karakteristik klasik dari mitral stenosis (stenosis katup mitral).",
    materialSource: {
      materialId: "mat-01",
      subtopicId: "sub-01-2",
      page: 17,
      quote: "Fokus auskultasi: Katup Mitral di ICS V linea medioclavicularis sinistra.",
    },
  },
  {
    id: "q-03",
    materialId: "mat-01",
    subtopicId: "sub-01-3",
    subtopicTitle: "Sistem Konduksi Jantung",
    region: "Thorax",
    difficulty: "sedang",
    questionText: "Di manakah letak anatomis spesifik dari nodus sinuatrialis (SA Node) yang bertindak sebagai pemacu denyut jantung primer?",
    latinTerms: ["Nodus sinuatrialis", "Crista terminalis", "Vena cava superior"],
    options: [
      { id: "A", text: "Di trigonum fibrosum dextrum pada septum membranaceum" },
      { id: "B", text: "Tautan dinding anterolateral atrium dextrum dan vena cava superior di dekat crista terminalis" },
      { id: "C", text: "Pada pars membranacea septum interventriculare di bawah katup aorta" },
      { id: "D", text: "Di dasar atrium sinistrum dekat muara vena pulmonalis" },
    ],
    correctOptionId: "B",
    explanation: "Nodus sinuatrialis (SA node) berlokasi secara anatomis pada tautan antara vena cava superior dan atrium dextrum, tepat di ujung kranial crista terminalis dekat sulcus terminalis.",
    materialSource: {
      materialId: "mat-01",
      subtopicId: "sub-01-3",
      page: 20,
      quote: "Nodus Sinuatrialis (SA Node) berlokasi pada tautan VCS dan crista terminalis atrium dextrum.",
    },
  },
  {
    id: "q-04",
    materialId: "mat-01",
    subtopicId: "sub-01-4",
    subtopicTitle: "Sirkulasi Koroner & Drainase Vena",
    region: "Thorax",
    difficulty: "sulit",
    vignette: "Seorang pria 58 tahun mengeluhkan nyeri dada retrosternal menjalar ke rahang kiri. Rekaman EKG menunjukkan elevasi segmen ST pada sadapan V1 hingga V4 (STEMI dinding anterior dan septum).",
    questionText: "Pembuluh darah koroner manakah yang paling sering mengalami oklusi total pada gambaran klinis ini?",
    latinTerms: ["Ramus interventricularis anterior", "Arteria coronaria sinistra"],
    options: [
      { id: "A", text: "Ramus circumflexus (LCx)" },
      { id: "B", text: "Arteria coronaria dextra (RCA)" },
      { id: "C", text: "Ramus interventricularis anterior (LAD)" },
      { id: "D", text: "Ramus marginalis dexter" },
    ],
    correctOptionId: "C",
    explanation: "Sadapan V1-V4 merekam dinding anterior ventrikel kiri dan septum interventrikulare bagian anterior. Wilayah ini diperdarahi secara langsung oleh Ramus Interventricularis Anterior (LAD / Left Anterior Descending artery), cabang dari LCA.",
    materialSource: {
      materialId: "mat-01",
      subtopicId: "sub-01-4",
      page: 26,
      quote: "LAD memperdarahi 2/3 anterior septum interventrikular dan dinding anterior ventrikel kiri.",
    },
  },
  {
    id: "q-05",
    materialId: "mat-01",
    subtopicId: "sub-01-2",
    subtopicTitle: "Aparatus Valvularis & Rangka Fibrosa",
    region: "Thorax",
    difficulty: "mudah",
    questionText: "Berapa banyak daun katup (cuspis) yang menyusun Valva Atrioventricularis Dextra dan apa saja namanya?",
    latinTerms: ["Valva atrioventricularis dextra", "Cuspis anterior/posterior/septalis"],
    options: [
      { id: "A", text: "Dua kuspis: anterior dan posterior" },
      { id: "B", text: "Tiga kuspis: anterior, posterior, dan septalis" },
      { id: "C", text: "Tiga kuspis: dextra, sinistra, dan posterior" },
      { id: "D", text: "Empat kuspis: medialis, lateralis, superior, dan inferior" },
    ],
    correctOptionId: "B",
    explanation: "Valva atrioventricularis dextra (katup trikuspidalis) memiliki tiga kuspis yaitu cuspis anterior, cuspis posterior, dan cuspis septalis yang dihubungkan dengan chordae tendineae ke musculi papillares.",
    materialSource: {
      materialId: "mat-01",
      subtopicId: "sub-01-2",
      page: 15,
      quote: "Valva Atrioventricularis Dextra memiliki 3 kuspis: anterior, posterior, dan septalis.",
    },
  },
  {
    id: "q-06",
    materialId: "mat-01",
    subtopicId: "sub-01-4",
    subtopicTitle: "Sirkulasi Koroner & Drainase Vena",
    region: "Thorax",
    difficulty: "sulit",
    questionText: "Pada mayoritas populasi manusia (~90%), Ramus nodi atrioventricularis yang memperdarahi Nodus AV dipercabangkan oleh:",
    latinTerms: ["Ramus nodi atrioventricularis", "Arteria coronaria dextra"],
    options: [
      { id: "A", text: "Arteria coronaria dextra (RCA)" },
      { id: "B", text: "Ramus circumflexus (LCx)" },
      { id: "C", text: "Ramus interventricularis anterior (LAD)" },
      { id: "D", text: "Truncus coeliacus" },
    ],
    correctOptionId: "A",
    explanation: "Pada ~90% individu, Ramus nodi atrioventricularis berasal dari Arteria Coronaria Dextra (RCA) di dekat crux cordis (pola sirkulasi koroner dominan kanan).",
    materialSource: {
      materialId: "mat-01",
      subtopicId: "sub-01-4",
      page: 26,
      quote: "RCA memperdarahi atrium dextrum, ventrikel dextrum, nodus SA (60%), dan nodus AV (90%).",
    },
  },

  // MAT-02: PLEKSUS BRAKIALIS & INERVASI EKSTREMITAS SUPERIOR (6 Soal)
  {
    id: "q-07",
    materialId: "mat-02",
    subtopicId: "sub-02-1",
    subtopicTitle: "Radices dan Trunci Pleksus Brakialis",
    region: "Membrum",
    difficulty: "mudah",
    questionText: "Truncus superior pada plexus brachialis dibentuk oleh persatuan serabut dari rami anteriores medula spinalis segmen:",
    latinTerms: ["Truncus superior", "Radices anteriores C5-C6"],
    options: [
      { id: "A", text: "C3 dan C4" },
      { id: "B", text: "C5 dan C6" },
      { id: "C", text: "C7 dan C8" },
      { id: "D", text: "C8 dan T1" },
    ],
    correctOptionId: "B",
    explanation: "Plexus brachialis dibentuk oleh rami anteriores C5-T1. Radix C5 dan C6 bersatu membentuk Truncus Superior, radix C7 membentuk Truncus Medius, dan radices C8 serta T1 membentuk Truncus Inferior.",
    materialSource: {
      materialId: "mat-02",
      subtopicId: "sub-02-1",
      page: 5,
      quote: "Radices C5 dan C6 bergabung membentuk Truncus Superior.",
    },
  },
  {
    id: "q-08",
    materialId: "mat-02",
    subtopicId: "sub-02-4",
    subtopicTitle: "Korelasi Klinis Deformitas Ekstremitas",
    region: "Membrum",
    difficulty: "sedang",
    vignette: "Seorang bayi baru lahir setelah partus dengan distosia bahu. Pada pemeriksaan tampak ekstremitas atas kanan tergantung lemas di sisi tubuh dengan bahu adduksi dan rotasi interna, sendi siku ekstensi, serta pergelangan tangan pronasi ('waiter's tip position').",
    questionText: "Kerusakan struktur manakah yang paling mendasari kondisi palsy ini?",
    latinTerms: ["Erb-Duchenne palsy", "Truncus superior C5-C6"],
    options: [
      { id: "A", text: "Truncus superior (C5-C6) / Erb-Duchenne palsy" },
      { id: "B", text: "Truncus inferior (C8-T1) / Klumpke palsy" },
      { id: "C", text: "Nervus ulnaris di sulcus epicondyli medialis" },
      { id: "D", text: "Nervus medianus di fossa cubitalis" },
    ],
    correctOptionId: "A",
    explanation: "Traksi berlebih pada leher bayi saat proses persalinan dapat meregangkan atau merobek truncus superior (C5-C6), memicu kelumpuhan Erb-Duchenne dengan postur klasik 'waiter's tip hand' akibat paresis abduktor bahu, rotator eksterna, dan fleksor siku.",
    materialSource: {
      materialId: "mat-02",
      subtopicId: "sub-02-4",
      page: 24,
      quote: "Erb-Duchenne Palsy (C5-C6): Lengan adduksi, rotasi interna, siku ekstensi, tangan pronasi ('Waiter's tip position').",
    },
  },
  {
    id: "q-09",
    materialId: "mat-02",
    subtopicId: "sub-02-3",
    subtopicTitle: "Cabang Terminal & Distribusi Motorik-Sensorik",
    region: "Membrum",
    difficulty: "sedang",
    questionText: "Saraf perifer manakah yang berjalan melalui spatium quadrangulare bersama vasa circumflexa humeri posterior untuk menginervasi musculus deltoideus dan teres minor?",
    latinTerms: ["Nervus axillaris", "Spatium quadrangulare", "Musculus deltoideus"],
    options: [
      { id: "A", text: "Nervus radialis" },
      { id: "B", text: "Nervus axillaris" },
      { id: "C", text: "Nervus musculocutaneus" },
      { id: "D", text: "Nervus suprascapularis" },
    ],
    correctOptionId: "B",
    explanation: "Nervus axillaris melintasi spatium quadrangulare di regio bahu posterior bersama arteri circumflexa humeri posterior, menginervasi m. deltoideus dan m. teres minor serta sensorik kulit di atas insersio deltoid.",
    materialSource: {
      materialId: "mat-02",
      subtopicId: "sub-02-3",
      page: 15,
      quote: "N. Axillaris melintasi spatium quadrangulare bersama vasa circumflexa humeri posterior.",
    },
  },
  {
    id: "q-10",
    materialId: "mat-02",
    subtopicId: "sub-02-4",
    subtopicTitle: "Korelasi Klinis Deformitas Ekstremitas",
    region: "Membrum",
    difficulty: "sulit",
    vignette: "Pria 22 tahun mengalami fraktur transversal pada sepertiga tengah corpus humeri setelah kecelakaan sepeda motor. Pasien mengeluh tidak dapat mengangkat atau mengekstensikan pergelangan tangan dan jari-jarinya ('wrist drop').",
    questionText: "Nervus manakah yang paling rentan mengalami cedera karena posisinya melintasi sulcus spiralis humeri?",
    latinTerms: ["Nervus radialis", "Wrist drop", "Sulcus nervi radialis"],
    options: [
      { id: "A", text: "Nervus musculocutaneus" },
      { id: "B", text: "Nervus ulnaris" },
      { id: "C", text: "Nervus radialis" },
      { id: "D", text: "Nervus medianus" },
    ],
    correctOptionId: "C",
    explanation: "Nervus radialis berjalan melingkar di permukaan posterior corpus humeri pada sulcus nervi radialis (sulcus spiralis). Fraktur sepertiga tengah corpus humeri sangat rentan mencederai saraf ini, menyebabkan kelumpuhan seluruh otot ekstensor tangan ('wrist drop').",
    materialSource: {
      materialId: "mat-02",
      subtopicId: "sub-02-4",
      page: 25,
      quote: "Fraktur corpus humeri sepertiga tengah rentan merusak N. radialis pada sulcus spiralis, menyebabkan 'wrist drop'.",
    },
  },
  {
    id: "q-11",
    materialId: "mat-02",
    subtopicId: "sub-02-3",
    subtopicTitle: "Cabang Terminal & Distribusi Motorik-Sensorik",
    region: "Membrum",
    difficulty: "sedang",
    vignette: "Seorang sekretaris 42 tahun mengeluhkan kebas dan kesemutan di sisi palmar ibu jari, telunjuk, jari tengah, dan setengah sisi lateral jari manis kanan. Gejala memberat di malam hari. Tampak mulai ada atrofi pada eminentia thenaris.",
    questionText: "Nervus manakah yang mengalami kompresi saat melintasi canalis carpi di bawah retinaculum musculorum flexorum?",
    latinTerms: ["Nervus medianus", "Canalis carpi", "Carpal tunnel syndrome"],
    options: [
      { id: "A", text: "Nervus medianus" },
      { id: "B", text: "Nervus ulnaris" },
      { id: "C", text: "Nervus radialis ramus superficialis" },
      { id: "D", text: "Nervus cutaneus antebrachii medialis" },
    ],
    correctOptionId: "A",
    explanation: "Sindrom lorong karpal (Carpal Tunnel Syndrome) disebabkan kompresi pada Nervus Medianus di bawah retinaculum flexorum di pergelangan tangan, mengakibatkan parestesia pada distribusi sensorik jari I-III serta setengah lateral jari IV dan kelemahan otot-otot thenar.",
    materialSource: {
      materialId: "mat-02",
      subtopicId: "sub-02-4",
      page: 28,
      quote: "Carpal Tunnel Syndrome adalah neuropati jepitan N. medianus di bawah retinaculum flexorum.",
    },
  },
  {
    id: "q-12",
    materialId: "mat-02",
    subtopicId: "sub-02-4",
    subtopicTitle: "Korelasi Klinis Deformitas Ekstremitas",
    region: "Membrum",
    difficulty: "sulit",
    questionText: "Deformitas 'Claw hand' (tangan cakar) terutama pada digiti IV dan V yang disertai hilangnya kemampuan adduksi ibu jari (tanda Froment positif) diakibatkan oleh lesi pada:",
    latinTerms: ["Nervus ulnaris", "Claw hand", "Froment test"],
    options: [
      { id: "A", text: "Nervus ulnaris" },
      { id: "B", text: "Nervus radialis" },
      { id: "C", text: "Nervus musculocutaneus" },
      { id: "D", text: "Nervus thoracicus longus" },
    ],
    correctOptionId: "A",
    explanation: "Nervus ulnaris menginervasi sebagian besar otot intrinsik tangan termasuk musculi interossei palmares/dorsales, lumbricales 3-4, dan m. adductor pollicis. Kelumpuhan otot ini menyebabkan hiperekstensi sendi MCP dan fleksi sendi IP (claw hand) serta tanda Froment positif saat menjepit kertas.",
    materialSource: {
      materialId: "mat-02",
      subtopicId: "sub-02-4",
      page: 26,
      quote: "Tangan Cakar (Claw hand): Hiperekstensi sendi MCP dan fleksi IP akibat lesi N. ulnaris.",
    },
  },
];

export const mockQuizSessionHistories: QuizSessionHistoryItem[] = [
  {
    id: "hist-01",
    dateStr: "Kemarin, 14:20",
    materialTitle: "Anatomi Jantung dan Vaskularisasi Mediastinum",
    materialId: "mat-01",
    mode: "latihan",
    score: 80,
    totalQuestions: 5,
    correctCount: 4,
    durationSeconds: 245,
  },
  {
    id: "hist-02",
    dateStr: "4 Nov 2026, 09:15",
    materialTitle: "Pleksus Brakialis dan Inervasi Ekstremitas",
    materialId: "mat-02",
    mode: "simulasi",
    score: 60,
    totalQuestions: 5,
    correctCount: 3,
    durationSeconds: 310,
  },
];

// ==========================================
// FITUR F5: FLASHCARD ISTILAH PENTING
// ==========================================

export interface FlashcardItem {
  id: string;
  deckId: string;
  front: string;
  latin: string;
  back: string;
  clinicalHint?: string;
  status: "unlearned" | "hesitant" | "mastered";
  marked?: boolean;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  region: "Caput" | "Collum" | "Thorax" | "Abdomen" | "Pelvis" | "Membrum";
  materialId?: string;
  materialTitle?: string;
  cardCount: number;
  masteredCount: number;
  hesitantCount: number;
  unlearnedCount: number;
  lastStudied?: string;
}

export const mockFlashcardDecks: FlashcardDeck[] = [
  {
    id: "deck-01",
    title: "Istilah Anatomi Jantung & Mediastinum",
    region: "Thorax",
    materialId: "mat-01",
    materialTitle: "Anatomi Jantung dan Vaskularisasi Mediastinum",
    cardCount: 12,
    masteredCount: 8,
    hesitantCount: 3,
    unlearnedCount: 1,
    lastStudied: "Kemarin",
  },
  {
    id: "deck-02",
    title: "Pleksus Brakialis & Saraf Ekstremitas Superior",
    region: "Membrum",
    materialId: "mat-02",
    materialTitle: "Pleksus Brakialis dan Inervasi Ekstremitas Superior",
    cardCount: 12,
    masteredCount: 6,
    hesitantCount: 4,
    unlearnedCount: 2,
    lastStudied: "2 hari lalu",
  },
  {
    id: "deck-03",
    title: "Basis Cranii Interna & Nervi Craniales",
    region: "Caput",
    materialId: "mat-03",
    materialTitle: "Osteologi Caput dan Basis Cranii Interna",
    cardCount: 10,
    masteredCount: 5,
    hesitantCount: 3,
    unlearnedCount: 2,
    lastStudied: "4 hari lalu",
  },
];

export const mockFlashcards: FlashcardItem[] = [
  // ================= DECK 1: ANATOMI JANTUNG (12 Kartu) =================
  {
    id: "fc-01-01",
    deckId: "deck-01",
    front: "Puncak Jantung",
    latin: "Apex cordis",
    back: "Ujung tumpul anteroinferior yang dibentuk secara eksklusif oleh pars inferolateral ventriculus sinister, berlokasi di sela iga (ICS) V linea medioclavicularis sinistra.",
    clinicalHint: "Iktus kordis teraba paling kuat di apeks; bergeser lateral pada kardiomegali.",
    status: "mastered",
  },
  {
    id: "fc-01-02",
    deckId: "deck-01",
    front: "Basis Jantung",
    latin: "Basis cordis",
    back: "Permukaan posterosuperior jantung yang menghadap ke arah korpus vertebra T6-T9, terutama dibentuk oleh atrium sinistrum dan sebagian atrium dextrum.",
    clinicalHint: "Tempat keluar-masuknya vasa magna (aorta, truncus pulmonalis, venae cavae).",
    status: "mastered",
  },
  {
    id: "fc-01-03",
    deckId: "deck-01",
    front: "Fosa Ovalis",
    latin: "Fossa ovalis",
    back: "Cekungan oval pada permukaan kanan septum interatriale yang merupakan sisa embriologis dari foramen ovale tertutup.",
    clinicalHint: "Defek septum atrium (ASD) sering terjadi akibat kegagalan penutupan foramen ovale.",
    status: "mastered",
  },
  {
    id: "fc-01-04",
    deckId: "deck-01",
    front: "Katup Bikuspid / Mitral",
    latin: "Valva mitralis / Valva bicuspidalis",
    back: "Katup atrioventrikular sisi kiri jantung yang tersusun atas dua kuspis (anterior dan posterior), mencegah regurgitasi darah ke atrium kiri saat sistol ventrikel.",
    clinicalHint: "Stenosis mitral menimbulkan murmur middiastolik rumble di ICS V midklavikula.",
    status: "mastered",
  },
  {
    id: "fc-01-05",
    deckId: "deck-01",
    front: "Katup Trikuspid",
    latin: "Valva tricuspidalis",
    back: "Katup atrioventrikular sisi kanan jantung yang memiliki tiga kuspis: anterior, posterior, dan septalis.",
    clinicalHint: "Terdengar paling jelas pada punctum maximum di ICS IV linea parasternalis sinistra.",
    status: "hesitant",
  },
  {
    id: "fc-01-06",
    deckId: "deck-01",
    front: "Tali Tendon Katup",
    latin: "Chordae tendineae",
    back: "Serabut tali fibrosa kolagen yang menghubungkan cuspis katup AV dengan musculi papillares pada dinding ventrikel.",
    clinicalHint: "Ruptur chordae tendineae akibat endokarditis menyebabkan insufisiensi katup akut.",
    status: "mastered",
  },
  {
    id: "fc-01-07",
    deckId: "deck-01",
    front: "Nodus Sinoatrial (SA Node)",
    latin: "Nodus sinuatrialis",
    back: "Pusat pacu jantung alami primer (frekuensi 60-100 x/mnt) yang berlokasi di tautan anterolateral vena cava superior dan atrium kanan dekat crista terminalis.",
    clinicalHint: "Dipersarafi oleh cabang simpatis dan N. vagus (parasimpatis).",
    status: "mastered",
  },
  {
    id: "fc-01-08",
    deckId: "deck-01",
    front: "Nodus Atrioventrikular (AV Node)",
    latin: "Nodus atrioventricularis",
    back: "Pusat tunda konduksi impuls listrik (~0.12 detik) yang terletak di dasar atrium kanan posterior dekat septum interatriale (Trigonum Koch).",
    clinicalHint: "Menunda depolarisasi agar atrium selesai mengosongkan darah ke dalam ventrikel.",
    status: "hesitant",
  },
  {
    id: "fc-01-09",
    deckId: "deck-01",
    front: "Berkas Atrioventrikular (His)",
    latin: "Fasciculus atrioventricularis",
    back: "Jalur konduksi tunggal yang menembus skeleton fibrosum cordis menuju ke pars membranacea septum interventriculare.",
    clinicalHint: "Bercabang menjadi Crus dextrum dan Crus sinistrum di septum ventrikel.",
    status: "unlearned",
  },
  {
    id: "fc-01-10",
    deckId: "deck-01",
    front: "Arteri Koroner Desenden Anterior (LAD)",
    latin: "Ramus interventricularis anterior",
    back: "Cabang utama arteria coronaria sinistra yang melintasi sulcus interventricularis anterior menuju apeks, menyuplai 2/3 anterior septum dan ventrikel kiri.",
    clinicalHint: "Sering disebut 'widow maker' karena oklusi LAD menyebabkan infark miokard anterior luas.",
    status: "mastered",
  },
  {
    id: "fc-01-11",
    deckId: "deck-01",
    front: "Sinus Koronarius",
    latin: "Sinus coronarius",
    back: "Saluran vena lebar di facies diaphragmatica jantung (sulcus coronarius posterior) tempat bermuaranya sebagian besar vena kardiaka sebelum masuk ke atrium kanan.",
    clinicalHint: "Bermuara langsung ke atrium dextrum di antara ostium vena cava inferior dan katup trikuspid.",
    status: "hesitant",
  },
  {
    id: "fc-01-12",
    deckId: "deck-01",
    front: "Rangka Jantung",
    latin: "Skeleton cordis",
    back: "Struktur jaringan ikat fibrosa padat pembentuk 4 anulus fibrosus katup yang berfungsi sebagai tempat perlekatan miokardium dan isolator listrik antara atrium dan ventrikel.",
    clinicalHint: "Mencegah penyebaran depolarisasi acak langsung dari atrium ke ventrikel.",
    status: "mastered",
  },

  // ================= DECK 2: PLEKSUS BRAKIALIS (12 Kartu) =================
  {
    id: "fc-02-01",
    deckId: "deck-02",
    front: "Akar Pleksus Brakialis",
    latin: "Radices anteriores C5-T1",
    back: "Rami anteriores saraf spinal servikal ke-5 hingga torakal ke-1 yang melintas di celah spatium interscalenicum antara m. scalenus anterior dan medius.",
    clinicalHint: "Keluar di atas arteri subclavia di trigonum colli posterius.",
    status: "mastered",
  },
  {
    id: "fc-02-02",
    deckId: "deck-02",
    front: "Batang Saraf Atas",
    latin: "Truncus superior",
    back: "Penyatuan radix anterior C5 dan C6 tepat di lateral m. scalenus anterior.",
    clinicalHint: "Lesi pada truncus superior menyebabkan Erb-Duchenne palsy (waiter's tip position).",
    status: "mastered",
  },
  {
    id: "fc-02-03",
    deckId: "deck-02",
    front: "Batang Saraf Bawah",
    latin: "Truncus inferior",
    back: "Penyatuan radix anterior C8 dan T1 yang melengkung di atas permukaan costa I di belakang arteria subclavia.",
    clinicalHint: "Lesi pada truncus inferior memicu Klumpke palsy (claw hand total).",
    status: "hesitant",
  },
  {
    id: "fc-02-04",
    deckId: "deck-02",
    front: "Fasikulus Posterior",
    latin: "Fasciculus posterior",
    back: "Fasikulus yang dibentuk oleh persatuan seluruh divisi posterior dari ketiga truncus (C5-T1), terletak di posterior pars secunda A. axillaris.",
    clinicalHint: "Mencabangkan Nervus Radialis dan Nervus Axillaris.",
    status: "mastered",
  },
  {
    id: "fc-02-05",
    deckId: "deck-02",
    front: "Fasikulus Lateral",
    latin: "Fasciculus lateralis",
    back: "Dibentuk oleh gabungan divisi anterior truncus superior dan truncus medius (serabut C5, C6, C7).",
    clinicalHint: "Mencabangkan N. musculocutaneus dan radix lateralis N. medianus.",
    status: "hesitant",
  },
  {
    id: "fc-02-06",
    deckId: "deck-02",
    front: "Saraf Radialis",
    latin: "Nervus radialis",
    back: "Cabang terbesar fasciculus posterior (C5-T1) yang berjalan di sulcus nervi radialis humeri, mempersarafi seluruh otot ekstensor lengan dan tangan.",
    clinicalHint: "Fraktur corpus humeri sepertiga tengah menyebabkan 'wrist drop'.",
    status: "mastered",
  },
  {
    id: "fc-02-07",
    deckId: "deck-02",
    front: "Saraf Medianus",
    latin: "Nervus medianus",
    back: "Dibentuk oleh gabungan radix lateralis dan radix medialis di depan A. axillaris, menginervasi otot fleksor kompartemen anterior antebrachium dan otot thenar.",
    clinicalHint: "Terjepit di canalis carpi menimbulkan Carpal Tunnel Syndrome (kesemutan jari I-III).",
    status: "mastered",
  },
  {
    id: "fc-02-08",
    deckId: "deck-02",
    front: "Saraf Ulnaris",
    latin: "Nervus ulnaris",
    back: "Kelanjutan langsung fasciculus medialis (C8-T1) yang melintasi posterior epicondylus medialis humeri, menginervasi sebagian besar otot intrinsik manus.",
    clinicalHint: "Kerusakan saraf ini menyebabkan 'Claw hand' pada jari ke-4 dan ke-5.",
    status: "unlearned",
  },
  {
    id: "fc-02-09",
    deckId: "deck-02",
    front: "Saraf Aksilaris",
    latin: "Nervus axillaris",
    back: "Cabang fasciculus posterior (C5-C6) yang melintasi spatium quadrangulare mengelilingi collum chirurgicum humeri untuk menginervasi m. deltoideus dan teres minor.",
    clinicalHint: "Rentan cedera pada dislokasi sendi bahu anterior.",
    status: "hesitant",
  },
  {
    id: "fc-02-10",
    deckId: "deck-02",
    front: "Saraf Torasikus Panjang",
    latin: "Nervus thoracicus longus",
    back: "Berasal langsung dari radices C5, C6, dan C7 yang melintasi dinding lateral toraks untuk menginervasi musculus serratus anterior.",
    clinicalHint: "Lesi pasca mastektomi memicu deformitas 'winged scapula' (skapula alata).",
    status: "mastered",
  },
  {
    id: "fc-02-11",
    deckId: "deck-02",
    front: "Kelumpuhan Erb-Duchenne",
    latin: "Paralysis Erb-Duchenne",
    back: "Kondisi paresis ekstremitas atas akibat traksi pada truncus superior (C5-C6) saat persalinan; ekstremitas adduksi, rotasi interna, siku ekstensi, tangan pronasi.",
    clinicalHint: "Disebut juga 'waiter's tip position' atau 'porter's tip deformity'.",
    status: "hesitant",
  },
  {
    id: "fc-02-12",
    deckId: "deck-02",
    front: "Kelumpuhan Klumpke",
    latin: "Paralysis Klumpke",
    back: "Kondisi paresis tangan akibat tarikan mendadak saat meraih pegangan jatuh yang merusak truncus inferior (C8-T1); memicu atrofi otot intrinsik tangan ('claw hand').",
    clinicalHint: "Sering disertai sindrom Horner unilateral akibat keterlibatan serabut T1 simpatis.",
    status: "unlearned",
  },

  // ================= DECK 3: BASIS CRANII (10 Kartu) =================
  {
    id: "fc-03-01",
    deckId: "deck-03",
    front: "Pelat Bertapis",
    latin: "Lamina cribrosa",
    back: "Pelat horizontal bertapis pada os ethmoidale di fossa cranii anterior yang dilalui oleh serabut nervus olfactorius (N. I).",
    clinicalHint: "Fraktur fossa anterior dapat memicu anosmia dan rinorea cairan serebrospinal (CSF leak).",
    status: "mastered",
  },
  {
    id: "fc-03-02",
    deckId: "deck-03",
    front: "Saluran Optik",
    latin: "Canalis opticus",
    back: "Saluran pada ala minor ossis sphenoidalis yang menghubungkan orbita dengan fossa cranii media, dilalui oleh N. opticus (N. II) dan A. ophthalmica.",
    clinicalHint: "Lesi kompresif menyebabkan defek lapang pandang monokular.",
    status: "mastered",
  },
  {
    id: "fc-03-03",
    deckId: "deck-03",
    front: "Celah Orbita Atas",
    latin: "Fissura orbitalis superior",
    back: "Celah antara ala major dan ala minor sphenoid yang dilalui N. III, N. IV, N. V1 (ophthalmicus), N. VI, dan vena ophthalmica superior.",
    clinicalHint: "Sindrom fissura orbitalis superior melumpuhkan pergerakan bola mata (oftalmoplegia total).",
    status: "hesitant",
  },
  {
    id: "fc-03-04",
    deckId: "deck-03",
    front: "Lubang Bundar",
    latin: "Foramen rotundum",
    back: "Foramen sirkular di ala major ossis sphenoidalis yang dilewati oleh Nervus maxillaris (N. V2) menuju fossa pterygopalatina.",
    clinicalHint: "Menyalurkan sensasi sensorik pipi, palatum, dan gigi atas.",
    status: "mastered",
  },
  {
    id: "fc-03-05",
    deckId: "deck-03",
    front: "Lubang Lonjong",
    latin: "Foramen ovale",
    back: "Foramen oval di ala major ossis sphenoidalis yang dilalui oleh Nervus mandibularis (N. V3), A. meningea accessoria, dan N. petrosus minor.",
    clinicalHint: "Mnemonic MALE: Mandibular nerve, Accessory meningeal artery, Lesser petrosal nerve, Emissary vein.",
    status: "mastered",
  },
  {
    id: "fc-03-06",
    deckId: "deck-03",
    front: "Lubang Duri",
    latin: "Foramen spinosum",
    back: "Foramen kecil posterolateral foramen ovale yang dilalui oleh Arteria meningea media dan Ramus meningeus N. V3.",
    clinicalHint: "Ruptur A. meningea media akibat trauma pelipis (pterion) memicu Hematoma Epidural (EDH).",
    status: "hesitant",
  },
  {
    id: "fc-03-07",
    deckId: "deck-03",
    front: "Liang Telinga Dalam",
    latin: "Meatus acusticus internus",
    back: "Saluran pada pars petrosa ossis temporalis di fossa cranii posterior yang dilalui oleh N. facialis (N. VII), N. vestibulocochlearis (N. VIII), dan A. labyrinthi.",
    clinicalHint: "Lokasi pertumbuhan vestibular schwannoma (akustikus neurinoma).",
    status: "mastered",
  },
  {
    id: "fc-03-08",
    deckId: "deck-03",
    front: "Lubang Jugularis",
    latin: "Foramen jugulare",
    back: "Foramen lebar antara os temporale dan os occipitale yang dilalui oleh N. IX, N. X, N. XI, dan merupakan tempat berawalnya Vena Jugularis Interna.",
    clinicalHint: "Sindrom foramen jugulare (Vernet) menyebabkan disfagia dan paralisis pita suara.",
    status: "unlearned",
  },
  {
    id: "fc-03-09",
    deckId: "deck-03",
    front: "Saluran Saraf Hipoglosus",
    latin: "Canalis nervi hypoglossi",
    back: "Saluran pada condylus occipitalis yang dilalui secara eksklusif oleh Nervus hypoglossus (N. XII) menuju otot intrinsik dan ekstrinsik lidah.",
    clinicalHint: "Lesi N. XII menyebabkan deviasi lidah ke sisi yang sakit saat dijulurkan.",
    status: "hesitant",
  },
  {
    id: "fc-03-10",
    deckId: "deck-03",
    front: "Lubang Besar Tengkorak",
    latin: "Foramen magnum",
    back: "Lubang terbesar pada dasar tengkorak (os occipitale) tempat transisi medulla oblongata menjadi medulla spinalis, dilalui juga oleh A. vertebralis dan radix spinalis N. XI.",
    clinicalHint: "Herniasi tonsil serebelar melalui foramen magnum menekan pusat pernapasan di medula.",
    status: "unlearned",
  },
];
