# Proyek Video Demo PRIMA (Remotion + Motion Graphics)

Proyek ini berisi kode komposisi video demo resmi untuk aplikasi web **PRIMA (Pembelajaran Responsif Interaktif Medis Adaptif)** dalam rangka lomba **Invofest 2026**.

---

## 1. Spesifikasi Video Final
* **File Output:** [`out/prima-demo.mp4`](file:///c:/Users/Arif/Github/lomba/prima/video/out/prima-demo.mp4)
* **Format:** MP4 (Video: H.264 High Profile, Audio: AAC Stereo 48 kHz)
* **Resolusi:** 1920x1080 (Full HD, 16:9)
* **Framerate:** 30.0 fps (CFR)
* **Total Durasi:** 03:49 (229 detik / 6.870 frame)
* **Ukuran File:** ~39.5 MB

---

## 2. Struktur Adegan Video

| Segmen | Rentang Waktu | Tipe Visual | Deskripsi |
|---|---|---|---|
| **1. Latar Belakang** | 00:00 - 00:34 | **Motion Graphics** | Cerita Rifqi mahasiswa FK Universitas Brawijaya, sukacita diterima di kedokteran, slide kuliah dan istilah anatomi menumpuk, kebingungan belajar tanpa strategi. |
| **2. Data Pendukung** | 00:34 - 01:17 | **Motion Graphics** | Stat counter `35,5%` mahasiswa burnout, survei 947 responden di 27 universitas di Indonesia, kutipan jurnal Research and Development in Medical Education (2026), konsep *Spaced Repetition* & *Active Recall*. |
| **3. Perkenalan PRIMA** | 01:17 - 01:39 | **Motion Graphics + Rekaman** | Logo reveal PRIMA (Pembelajaran Responsif Interaktif Medis Adaptif) dan transisi ke rekaman aplikasi beranda (`clip_03_hero.mp4`). |
| **4. Onboarding & Personalisasi** | 01:39 - 01:58 | **Rekaman Aplikasi** | Perekaman wizard `/onboarding`: pemilihan regio (Thorax & Membrum), tanggal ujian, alokasi jam belajar harian, dan penyusunan AI. |
| **5. Rencana Belajar AI** | 01:58 - 02:12 | **Rekaman Aplikasi** | Perekaman halaman `/perencana`: kalender belajar adaptif 14 hari dan target modul harian. |
| **6. Unggah Materi & Rangkuman AI** | 02:12 - 02:29 | **Rekaman Aplikasi** | Perekaman halaman `/materi`: dropzone upload PDF kuliah anatomi, proses ekstraksi AI, dan pembagian rangkuman per subtopik dengan disclaimer AI. |
| **7. Latihan Soal & Flashcard** | 02:29 - 02:50 | **Rekaman Aplikasi** | Perekaman `/latihan-materials` (pilihan ganda klinis & feedback instan) serta `/flashcard` (3D flip card terminologi Latin). |
| **8. Visualisasi 3D WebGL Anatomi** | 02:50 - 03:17 | **Rekaman Aplikasi** | Perekaman `/latihan`: rotasi model 3D WebGL asli 6 regio (Caput, Collum, Thorax, Abdomen, Pelvis, Membrum) dan penyorotan nama struktur Indonesia-Latin. |
| **9. Penutup & Tagline** | 03:17 - 03:49 | **Motion Graphics** | Rangkuman 4 pilar nilai tambah, positioning PRIMA sebagai pendamping belajar mandiri preklinik, logo penutup, dan tagline *"PRIMA, Belajar Kedokteran Lebih Terarah"*. |

---

## 3. Daftar Aset Eksternal & Hak Cipta
1. **Audio Voiceover:** File rekaman asli di `video/public/voiceover.MP3` (disediakan pengguna).
2. **Logo & Ikon:** Aset logo resmi PRIMA dari `public/logo.png`.
3. **Dokumen Sampel Demo:** `video/public/Kuliah_Anatomi_Thorax.pdf` (diadaptasi dari materi praktikum internal `docs/`).
4. **Font:** Sistem tipografi sans-serif modern (Inter / system-ui) bawaan Tailwind & OS.

---

## 4. Cara Menjalankan & Render Ulang

### Melihat Live Preview (Remotion Studio)
Jalankan perintah ini di dalam folder `video/`:
```powershell
cd video
npm run dev
```
Buka browser di `http://localhost:3000` (atau port yang ditampilkan) untuk meninjau animasi frame demi frame.

### Render Ulang Video Final MP4
```powershell
cd video
npx remotion render src/index.ts PrimaDemo out/prima-demo.mp4 --concurrency=8
```
