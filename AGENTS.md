# PRIMA: Aturan untuk AI Agent

PRIMA (Platform Review Interaktif Medis Adaptif) adalah aplikasi web pendamping belajar untuk mahasiswa kedokteran. Dokumen ini berisi aturan tetap yang berlaku di setiap sesi. Detail produk lengkap ada di `docs/prd.md`; baca file itu sebelum mengerjakan halaman apa pun.

## Ringkasan Produk

PRIMA membantu mahasiswa kedokteran mengelola beban belajar yang sangat banyak. Sistem mencatat materi yang sudah dan belum dikuasai, lalu menjadwalkan ulang latihan secara otomatis (spaced repetition) supaya materi yang lemah lebih sering diulang. Latihan anatomi dilakukan lewat model 3D interaktif.

- **Pengguna utama:** mahasiswa kedokteran tahun awal (preklinik)
- **Bahasa antarmuka:** Bahasa Indonesia (istilah anatomi disertai nama Latin)
- **Kategori:** karya untuk lomba software development, jadi tampilan harus rapi, meyakinkan, dan siap didemokan

## Lingkup Saat Ini: HANYA TAMPILAN (UI)

Tahap sekarang hanya membangun frontend.

- Boleh: halaman, komponen, styling, animasi, interaksi sisi klien (state lokal).
- Semua data memakai **mock data statis**.
- **Dilarang:** membuat backend, API route, database, autentikasi nyata, integrasi LLM, atau logika server. Jika sebuah fitur butuh itu, buat tampilannya saja dan beri komentar `// TODO: sambungkan ke backend`.

## Tech Stack

- Next.js (App Router) + TypeScript
- Gunakan template dashboard yang sudah ada di proyek sebagai dasar layout, komponen, dan pola styling. Gunakan ulang, jangan membuat ulang dari nol.
- Pertahankan library styling yang sudah dipakai template. Jangan menggantinya.
- Boleh dipakai tanpa bertanya: `lucide-react` (ikon), `recharts` (grafik), `@react-three/fiber` dan `@react-three/drei` (3D).
- Dependency lain, terutama yang berat, **tanyakan dulu**.

## Struktur dan Konvensi

- Ikuti struktur folder yang sudah ada di proyek.
- Komponen yang dipakai ulang ditaruh di `components/`; komponen khusus satu halaman ditaruh dekat halamannya.
- Semua data dummy ditaruh di satu tempat: `lib/mock-data.ts`, agar mudah diganti dengan data asli nanti.
- Rute halaman: `/masuk`, `/beranda`, `/latihan`, `/perencana`, `/kelemahan`, `/pengaturan`.
- Gunakan TypeScript dengan tipe yang jelas. Beri nama komponen yang deskriptif (contoh: `StatCard`, `TopicScoreBar`, `AnatomyViewer`).
- Hindari duplikasi: jika pola yang sama muncul di dua halaman, jadikan komponen bersama.

## Konsep Fitur (Ringkas)

1. **Perencana belajar:** mahasiswa mengisi topik dan tanggal ujian, sistem membagi target harian.
2. **Latihan adaptif (spaced repetition):** item yang sering salah muncul lebih sering.
3. **Modul anatomi 3D:** kuis "klik struktur" dan "sebutkan nama" pada model 3D.
4. **Dashboard pribadi:** progres, peta kelemahan per topik, rekomendasi latihan berikutnya.

PRIMA adalah alat bantu belajar. Tampilan tidak boleh memberi kesan sebagai alat diagnosis atau saran medis, dan tidak boleh mengukur atau melabeli burnout pengguna.

## Arah Desain

- **Nuansa:** bersih, profesional, tenang, bernuansa edukasi medis (tidak kaku seperti rumah sakit).
- **Warna:** satu warna utama (teal atau biru), netral untuk latar, dan satu set warna status yang konsisten (benar, salah, peringatan).
- **Hierarki visual jelas:** angka dan status penting terlihat sekilas.
- **Interaktif:** hover, transisi halus, animasi progres, umpan balik saat klik, state kosong, dan state loading (skeleton).
- **Responsive:** nyaman di laptop dan HP. Dukung dark mode jika template sudah mendukung.
- **Aksesibilitas dasar:** kontras cukup, label jelas, bisa dinavigasi dengan keyboard.
- **Teks UI** singkat, jelas, dan konsisten dalam Bahasa Indonesia.

## Halaman 3D (Latihan Anatomi)

- Muat komponen 3D hanya di sisi klien (`dynamic import` dengan `ssr: false`).
- Model asli belum tersedia. Gunakan placeholder berupa beberapa mesh sederhana yang bisa diklik dan disorot, dan siapkan komponen agar mudah diganti dengan file `.glb` dari `public/models/`.
- Setiap struktur punya `id`, nama Indonesia, dan nama Latin di mock data.

## Cara Kerja

1. Kerjakan **satu halaman per permintaan**. Setelah selesai, berhenti dan ringkas apa yang dibuat dan komponen reusable yang dihasilkan.
2. Jangan melanjutkan ke halaman berikutnya sebelum diminta.
3. Sebelum memulai, baca template yang ada dan `docs/prd.md`.
4. Jangan mengubah halaman lain di luar yang diminta, kecuali untuk memperbaiki komponen bersama, dan sebutkan perubahan itu dalam ringkasan.
5. Jika permintaan ambigu, ambil asumsi yang paling masuk akal, sebutkan asumsinya dalam satu kalimat, lalu kerjakan.

Urutan halaman yang direncanakan: kerangka (sidebar, topbar, tema) → Beranda → Latihan Anatomi 3D → Perencana Belajar → Peta Kelemahan → Masuk dan onboarding.

## Larangan Umum

- Jangan menambah fitur di luar `docs/prd.md` tanpa diminta.
- Jangan memakai konten medis yang tidak pasti sebagai fakta. Konten anatomi di mock data cukup contoh dan harus mudah diganti.
- Jangan menaruh kunci rahasia, token, atau data pribadi di kode.
