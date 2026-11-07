# Rencana Pembuatan Video Demo PRIMA (Invofest 2026)

## 1. Spesifikasi Teknis Video
- **Format:** MP4 (H.264 / AAC)
- **Resolusi:** 1920x1080 (Full HD, 16:9)
- **Frame Rate:** 30 fps
- **Total Durasi:** 228.99 detik (~3 menit 49 detik) / 6.870 frames
- **Audio Utama:** `video/public/voiceover.MP3` (sinkronisasi ketat dengan subtitle dan transisi)

---

## 2. Storyboard dan Rincian per Segmen

| No | Segmen | Rentang Waktu (s) | Rentang Frame (30fps) | Tipe Konten | Visual & Aksi yang Ditampilkan |
|---|---|---|---|---|---|
| 1 | **Latar Belakang (Studi Kasus Rifqi)** | 0.00s - 34.00s | 0 - 1020 | **Motion Graphics** | Karakter Rifqi mahasiswa FK UB, sukacita diterima di FK, tumpukan slide kuliah & buku anatomi menumpuk, istilah medis rumit melayang, kebingungan dan kelelahan belajar tanpa strategi. |
| 2 | **Data Pendukung & Burnout** | 34.00s - 77.50s | 1020 - 2325 | **Motion Graphics** | Angka stat counter `35,5%` mahasiswa burnout menghitung naik, visualisasi 27 universitas di Indonesia (947 responden), kutipan jurnal medis (Govindasamy 2026, Nasution 2025, Cihan Univ 2024), konsep active recall & spaced repetition. |
| 3 | **Perkenalan PRIMA & Hero** | 77.50s - 99.50s | 2325 - 2985 | **Motion Graphics + App Screen** | Logo PRIMA reveal dengan kepanjangan resmi (Pembelajaran Responsif Interaktif Medis Adaptif), lalu transisi mulus ke antarmuka aplikasi web landing page PRIMA di localhost:3000. |
| 4 | **Onboarding & Pengaturan Awal** | 99.50s - 118.00s | 2985 - 3540 | **Rekaman Aplikasi** | Alur onboarding: Rifqi memilih topik (Thorax & Membrum), mengatur tanggal ujian target (2 minggu), slider jam belajar (2 jam/hari), konfirmasi data demo. |
| 5 | **Rencana Belajar Hasil AI** | 118.00s - 132.00s | 3540 - 3960 | **Rekaman Aplikasi** | Halaman `/perencana`: kalender dan timeline belajar personalisasi AI, breakdown jadwal harian sampai hari H ujian, target modul belajar. |
| 6 | **Unggah Materi & Rangkuman AI** | 132.00s - 149.50s | 3960 - 4485 | **Rekaman Aplikasi** | Halaman `/materi`: proses upload dokumen kuliah anatomi PDF, AI generating spinner, tampilan rangkuman cerdas per subtopik dengan sitasi disclaimer AI. |
| 7 | **Latihan Soal & Flashcard Interaktif** | 149.50s - 170.50s | 4485 - 5115 | **Rekaman Aplikasi** | Halaman `/latihan-materials`: memilih jawaban kuis pilihan ganda, pembahasan instan; beralih ke `/flashcard`: interaksi membalik kartu istilah latin (active recall). |
| 8 | **Visualisasi 3D Anatomi 6 Regio** | 170.50s - 197.80s | 5115 - 5934 | **Rekaman Aplikasi** | Halaman `/latihan` (Anatomi 3D): eksplorasi 6 regio (Caput, Collum, Thorax, Abdomen, Pelvis, Membrum), rotasi 3D mulus, zoom ke struktur, klik otot/organ untuk melihat label nama Indonesia dan Latin. |
| 9 | **Penutup & Tagline PRIMA** | 197.80s - 228.99s | 5934 - 6870 | **Motion Graphics** | Rekap nilai tambah (rencana terarah, rangkuman ringkas, latihan siap, visualisasi 3D nyata), positioning PRIMA sebagai pendamping belajar mahasiswa kedokteran, logo penutup & tagline. |

---

## 3. Subtitle dan Penyelarasan Audio
Setiap kata dan kalimat dalam video akan dilengkapi subtitel Bahasa Indonesia yang sinkron dengan transkrip Whisper asli (`video/transcription.json`), ditampilkan dengan tipografi bersih, kontras tinggi, dan bayangan lembut di bagian bawah video.

---

## 4. Rencana Perekaman Layar Otomatis (Playwright)
- Menggunakan Playwright Chromium pada resolusi 1920x1080.
- Skrip Playwright akan merekam klip terpisah per segmen ke dalam `video/public/recordings/`:
  - `clip_03_hero.webm`
  - `clip_04_onboarding.webm`
  - `clip_05_perencana.webm`
  - `clip_06_materi.webm`
  - `clip_07_kuis_flashcard.webm`
  - `clip_08_anatomi3d.webm`
- Dilengkapi kursor virtual, easing scrolling, klik yang ditandai efek ripple, dan timing stabil tanpa lag.
