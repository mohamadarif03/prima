# PRIMA: Aturan untuk AI Agent

PRIMA (Platform Review Interaktif Medis Adaptif) adalah aplikasi web pendamping belajar untuk mahasiswa kedokteran. Aturan di file ini berlaku di SETIAP sesi dan SETIAP halaman, jadi tidak perlu diulang di prompt. Detail produk lengkap ada di `docs/prd.md` (v1.1); baca file itu sebelum mengerjakan halaman apa pun.

## Ringkasan Produk
Mahasiswa mengisi onboarding (topik, tanggal ujian, waktu belajar), AI menyusun rencana belajar, mahasiswa mengunggah materi kuliah lalu AI membuat rangkuman, latihan soal, dan flashcard. Untuk anatomi tersedia visualisasi 3D interaktif 6 regio (Caput, Collum, Thorax, Abdomen, Pelvis, Membrum).
- Pengguna: mahasiswa kedokteran tahun awal (preklinik)
- Bahasa antarmuka: Bahasa Indonesia (istilah anatomi disertai nama Latin)
- Konteks: karya lomba software development, jadi tampilan harus rapi dan siap didemokan

## Lingkup Saat Ini: HANYA TAMPILAN (UI)
- Boleh: halaman, komponen, styling, animasi, interaksi sisi klien (state lokal).
- Semua data memakai mock data statis di `lib/mock-data.ts`. Semua "AI" (rangkuman, soal, flashcard, rencana) dan unggahan berkas hanya SIMULASI di sisi klien.
- Dilarang: backend, API route, database, autentikasi nyata, integrasi LLM, atau logika server. Jika fitur butuh itu, buat tampilannya saja dan beri komentar `// TODO: sambungkan ke backend`.
- Fitur fase kedua (dashboard peta kelemahan, spaced repetition, kuis 3D, vignette klinis, panel dosen) TIDAK dibangun kecuali diminta.

## Acuan Gaya Visual
Halaman `/beranda` adalah acuan tampilan yang sudah disetujui. Semua halaman HARUS memakai layout, sidebar, topbar, tipografi, warna, jarak, bentuk kartu, dan gaya grafik yang sama. Gunakan ulang komponen reusable yang sudah ada (StatCard, SectionCard, Badge, ProgressBar, EmptyState, dan lainnya). Jangan membuat gaya atau komponen baru jika padanannya sudah ada. Satu-satunya area yang boleh berbeda adalah viewer 3D.

## Tech Stack
- Next.js (App Router) + TypeScript, ikuti struktur proyek yang ada.
- Pertahankan library styling dan template yang sudah dipakai. Jangan menggantinya.
- Boleh tanpa bertanya: `lucide-react`, `recharts`, `@react-three/fiber`, `@react-three/drei`. Dependency lain, tanyakan dulu.
- Komponen 3D dimuat hanya di klien (`dynamic import` dengan `ssr: false`).

## Rute Aplikasi
- `/masuk`: masuk dan daftar
- `/onboarding`: wizard pengaturan awal
- `/beranda`: halaman utama (acuan gaya)
- `/perencana`: Rencana Belajar (rencana hasil AI)
- `/materi` dan `/materi/[id]`: unggah materi dan rangkuman
- `/latihan-materials`: Latihan Soal
- `/flashcard`: flashcard
- `/anatomi`: visualisasi 3D anatomi
- `/pengaturan`: pengaturan dan kredit
- `/latihan` dan `/kelemahan` (jika ada): halaman lama. JANGAN diubah, ditimpa, atau dihapus kecuali diminta secara eksplisit.

## Konvensi Kode
- Komponen reusable di `components/`; komponen khusus satu halaman ditaruh dekat halamannya. Nama deskriptif dan tipe TypeScript yang jelas.
- Hindari duplikasi: pola yang muncul di dua halaman dijadikan komponen bersama.
- Data dummy tetap satu sumber di `lib/mock-data.ts`. Nama materi, subtopik, dan regio harus konsisten antarhalaman.
- Tautan antarhalaman memakai rute di atas, dengan parameter URL bila perlu (contoh `/latihan-materials?materi=ID`).

## Standar Kualitas (berlaku untuk semua halaman)
- Hierarki visual jelas, transisi halus, state loading (skeleton), dan state kosong (EmptyState).
- Responsive di laptop dan HP; kontrol nyaman disentuh.
- Aksesibilitas: kontras cukup, label jelas, bisa dinavigasi dengan keyboard, status tidak hanya dibedakan warna (tambahkan teks atau ikon), hormati `prefers-reduced-motion`.
- Teks UI Bahasa Indonesia yang singkat, ramah, dan menyemangati (hindari kata menghakimi seperti "gagal" atau "buruk").
- Setiap keluaran yang tampak berasal dari AI diberi keterangan: "Dibuat oleh AI dan bisa mengandung kesalahan. Periksa dengan sumber utama."
- Konten medis di mock data hanya contoh dan harus mudah diganti; jangan menyatakan fakta medis yang tidak pasti secara berlebihan.
- PRIMA adalah alat bantu belajar: bukan alat diagnosis, tidak memberi saran medis ke pasien, dan tidak mengukur atau melabeli burnout.

## Kredit Model 3D
Placeholder dipakai sampai model asli siap. Model asli diadaptasi dari Z-Anatomy (CC BY-SA 4.0) dan BodyParts3D (CC BY-SA 2.1 Japan). Teks atribusi: "Model anatomi 3D diadaptasi dari 'Z-Anatomy, The libre 3D atlas of anatomy' (CC BY-SA 4.0) dan 'BodyParts3D, The Database Center for Life Science' (CC BY-SA 2.1 Japan). Model telah disederhanakan dan dipotong untuk keperluan aplikasi ini." Atribusi ini harus tampil di /pengaturan bagian "Tentang dan Kredit".

## Cara Kerja
1. Kerjakan SATU halaman per permintaan. Setelah selesai, berhenti. Jangan lanjut ke halaman lain sebelum diminta.
2. Sebelum mulai, baca `docs/prd.md` dan lihat `/beranda` serta komponen yang sudah ada.
3. Jangan mengubah halaman lain kecuali untuk tautan dan komponen bersama; sebutkan perubahan itu di ringkasan.
4. Jika permintaan ambigu, ambil asumsi paling masuk akal, sebutkan dalam satu kalimat, lalu kerjakan.

## Penutup Setiap Tugas (wajib, tanpa perlu diminta)
1. Jalankan aplikasi dan uji hasilnya di browser (laptop dan ukuran HP), bandingkan gaya dengan `/beranda`, perbaiki masalah yang ditemukan, dan pastikan `npm run build` berhasil tanpa error.
2. Commit dan push ke GitHub:
   - Jalankan `git status` dan periksa isinya. Jangan meng-commit `.env`, kunci rahasia, `node_modules`, file build, atau file model besar.
   - Conventional Commits: formal, bahasa Inggris, imperatif, tanpa titik di akhir, judul maksimal 72 karakter (contoh: `feat(flashcards): add flashcards page with deck list and study session`). Pisahkan commit data (`chore(data): ...`) dari commit fitur bila memungkinkan.
   - Push ke `origin` pada branch yang aktif. Jangan memakai `--force`, jangan mengubah riwayat commit, jangan membuat atau mengganti remote. Jika push gagal, berhenti dan laporkan penyebabnya.
3. Ringkas: apa yang dibuat, komponen reusable yang dihasilkan, asumsi yang diambil, serta hash dan judul commit yang di-push. Lalu berhenti.

## Larangan Umum
- Jangan menambah fitur di luar `docs/prd.md` tanpa diminta.
- Jangan menaruh kunci rahasia, token, atau data pribadi di kode.
