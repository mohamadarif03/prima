# Catatan Keselarasan Narasi & Fitur PRIMA (Issues & Alignments)

Dokumen ini mencatat evaluasi antara naskah voiceover resmi dan implementasi fitur yang ada pada aplikasi web PRIMA:

## 1. Rute Anatomi 3D (`/latihan` vs `/anatomi`)
* **Kondisi:** Pada naskah dan dokumen awal, modul 3D anatomi kadang disebut sebagai halaman `/anatomi`. Namun di kode inti aplikasi web PRIMA yang sudah berjalan, visualisasi 3D anatomi interaktif 6 regio (Caput, Collum, Thorax, Abdomen, Pelvis, Membrum) berada pada rute `/latihan` (ditautkan langsung pada tombol sidebar "Anatomi 3D").
* **Solusi di Video Demo:** Perekaman layar dilakukan langsung pada rute resmi `/latihan`, URL bar pada browser frame menampilkan `https://prima.med.id/latihan` sehingga fitur WebGL asli 6 regio dan label nomenklatur Latin tampil 100% nyata sesuai fungsionalitas aplikasi.

## 2. Simulasi Waktu Proses AI
* **Kondisi:** Fitur AI pada aplikasi web (pembuatan rencana belajar di `/onboarding`, perangkuman materi di `/materi`, dan pembuatan butir soal di `/latihan-materials`) menggunakan state simulasi client-side dengan timeout 2-3 detik dan pesan progres bertahap (sesuai aturan PRD fase prototipe lomba).
* **Solusi di Video Demo:** Perekaman Playwright memberikan jeda natural yang cukup sehingga indikator progres AI (0% -> 100%) terekam secara utuh tanpa ada langkah yang dilewati (*cut* mendadak) ataupun jeda kosong terlalu lama.

## 3. Subtitle & Transkripsi Audio
* **Kondisi:** Audio voiceover memiliki beberapa artikulasi ucapan natural (misal: penyebutan "1947" untuk 947 responden, serta kata sambung santai).
* **Solusi di Video Demo:** Subtitel bahasa Indonesia diselaraskan secara presisi per detik mengikuti ketukan audio, dengan teks baku dan ejaan medis yang tepat (*Caput*, *Collum*, *Thorax*, *Spaced Repetition*, *Active Recall*) agar nyaman dibaca oleh juri dan penonton.
