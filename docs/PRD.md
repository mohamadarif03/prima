# PRD: Pendamping Belajar Mahasiswa Kedokteran

*Versi 1.0 • Kategori: Software Development • Nama produk: **PRIMA***

---

## 1. Ringkasan dalam Satu Paragraf

PRIMA (Platform Review Interaktif Medis Adaptif) adalah aplikasi web berbahasa Indonesia yang membantu mahasiswa kedokteran belajar dengan lebih terarah. Sistem mencatat apa yang sudah dan belum dikuasai mahasiswa, lalu mengatur ulang latihan secara otomatis (*spaced repetition*) supaya materi yang lemah lebih sering diulang. Untuk materi anatomi, latihan dilakukan lewat model 3D interaktif. Mahasiswa melihat progres dan kelemahannya di satu dashboard pribadi.

---

## 2. Latar Belakang: Masalah yang Ingin Diselesaikan

Berdasarkan telaah 16 studi terbaru dan sebuah review tentang AI dalam pendidikan medis, mahasiswa kedokteran menghadapi:

| Masalah | Gambaran singkat |
| --- | --- |
| **Beban materi sangat luas** | Informasi menumpuk, terutama di tahap preklinik; mahasiswa sulit menentukan prioritas |
| **Manajemen waktu dan strategi belajar lemah** | Banyak yang belajar dengan cara kurang efektif dan merasa tertinggal |
| **Latihan kurang interaktif dan tidak merata** | Kesempatan berlatih bergantung pada fasilitas dan lingkungan masing-masing |
| **Hambatan bahasa** | Banyak sumber belajar berbahasa Inggris |
| **Stres dan burnout** | Berkaitan dengan beban akademik dan kurangnya dukungan |

**Yang akan dijawab PRIMA:** tiga masalah pertama dan sebagian dari hambatan bahasa. **Yang tidak akan dijawab:** burnout secara klinis, keuangan, dan perbaikan kurikulum. Hal-hal ini butuh solusi dari institusi, dan akan ditulis sebagai batasan.

---

## 3. Tujuan Produk

**Tujuan utama:** membantu mahasiswa belajar lebih efisien dengan latihan yang menyesuaikan kelemahan masing-masing.

**Tujuan terukur (indikator keberhasilan):**

- Mahasiswa dapat menyelesaikan satu sesi latihan dalam kurang dari 10 menit.
- Skor kegunaan (SUS) di atas 68 dari uji coba 10-15 mahasiswa.
- Sebagian besar penguji menyatakan peta kelemahan membantu mereka tahu apa yang harus dipelajari berikutnya.

**Bukan tujuan:** menggantikan dosen, buku, atau praktikum nyata.

---

## 4. Siapa Penggunanya

**Pengguna utama: Mahasiswa kedokteran (preklinik / tahun awal)** Butuh cara belajar yang jelas di tengah materi yang banyak. Biasanya belajar lewat HP atau laptop, dan sering kekurangan waktu.

**Pengguna sekunder (tahap lanjut): Dosen** Ingin tahu topik mana yang paling sering dijawab salah oleh satu angkatan.

---

## 5. Cerita Penggunaan (User Story)

> **Rina**, mahasiswa semester 2, punya ujian anatomi blok muskuloskeletal dan toraks dua minggu lagi. Ia membuka PRIMA, memilih fokus pada **Regio Thorax (Dada & Organ Dalam)** dan **Regio Membrum (Anggota Gerak)**. Sistem membagi target ke jadwal harian. Hari ini ia berlatih lewat model 3D: sistem menyorot sebuah organ/otot dan ia memilih namanya, atau sistem meminta Rina mengklik langsung struktur pada model 3D (seperti *Arcus aortae* atau *M. Biceps brachii*). Beberapa jawabannya salah, dan sistem mencatat kelemahan tersebut. Besok struktur yang salah muncul lagi dengan jeda adaptif (*spaced repetition*). Di dashboard, Rina dapat melihat peta penguasaan per regio sehingga ia tahu regio mana yang membutuhkan latihan intensif.

---

## 6. Fitur

### 6.1 Fitur Wajib (MVP)

| No | Fitur | Apa yang dilakukan | Kenapa penting |
| --- | --- | --- | --- |
| F1 | **Akun dan profil** | Daftar, masuk, pilih regio atau topik yang dipelajari | Dasar untuk menyimpan progres |
| F2 | **Perencana belajar** | Mahasiswa mengisi topik dan tanggal ujian, sistem membagi target harian | Menjawab masalah manajemen waktu |
| F3 | **Latihan adaptif (spaced repetition)** | Item yang salah diulang lebih cepat, yang benar diulang lebih jarang | Menjawab masalah strategi belajar dan beban materi |
| F4 | **Modul anatomi 3D berbasis 6 regio tubuh** | Eksplorasi 3D dan kuis interaktif yang mencakup 6 regio utama tubuh manusia: Caput, Collum, Thorax, Abdomen, Pelvis, dan Membrum. Mode kuis: *klik struktur* dan *sebutkan nama* | Menjadi daya tarik utama dan latihan terstruktur sesuai kurikulum anatomi kedokteran |
| F5 | **Dashboard pribadi** | Progres, peta kelemahan per topik, rekomendasi latihan berikutnya | Memberi arah dan rasa kemajuan |

### 6.2 Fitur Fase Kedua

| No | Fitur | Catatan |
| --- | --- | --- |
| F6 | **Vignette klinis** | Soal kasus singkat yang mengarah ke struktur anatomi tertentu |
| F7 | **Mode belajar bertahap** | Lapisan kulit → otot → tulang, label Indonesia dan Latin |
| F8 | **Bank soal teks (non-3D)** | Soal pilihan ganda per topik |
| F9 | **Panel dosen** | Statistik topik yang paling sering salah per angkatan |

### 6.3 Pengembangan Lanjutan (Roadmap)

- Pasien virtual berbasis LLM
- Check-in kesejahteraan dan info layanan konseling
- Banyak regio anatomi dan bidang lain
- Aplikasi seluler

---

## 7. Alur Pengguna (Garis Besar)

1. **Daftar / masuk**
2. **Pilih regio dan tanggal ujian**: sistem membuat rencana belajar
3. **Mulai latihan harian**: kuis 3D dan soal
4. **Dapat umpan balik langsung**: benar atau salah, disertai penjelasan singkat
5. **Sistem menjadwalkan ulang** item sesuai hasil
6. **Lihat dashboard**: progres dan peta kelemahan

---

## 8. Hal yang Bukan Bagian dari Produk (Batasan)

- PRIMA **bukan alat diagnosis** dan tidak memberi saran medis ke pasien.
- PRIMA **tidak mengukur atau mendiagnosis burnout**.
- Konten latihan anatomi diorganisasikan ke dalam **6 regio utama tubuh manusia** (Caput, Collum, Thorax, Abdomen, Pelvis, Membrum).
- Sistem membantu belajar, **tidak menggantikan** praktikum dan bimbingan dosen.

---

## 9. Persyaratan Non-Fungsional (Mutu yang Diharapkan)

| Aspek | Harapan |
| --- | --- |
| **Mudah dipakai** | Mahasiswa baru bisa mulai latihan tanpa tutorial panjang |
| **Ringan** | Model 3D dimuat dalam beberapa detik di laptop dan HP biasa |
| **Bahasa** | Seluruh antarmuka dalam bahasa Indonesia; istilah anatomi disertai Latin |
| **Privasi** | Data belajar bersifat pribadi; kata sandi disimpan aman (hash) |
| **Akurasi konten** | Nama dan letak struktur divalidasi dosen atau sumber terpercaya |
| **Lisensi** | Model 3D dan konten memakai sumber dengan lisensi yang jelas |

---

## 10. Gambaran Teknis (Sederhana)

- **Tampilan (frontend):** web, dengan Three.js atau Babylon.js untuk 3D
- **Server (backend):** API sederhana (misalnya Node.js atau FastAPI)
- **Database:** PostgreSQL atau MySQL
- **Penjadwalan ulang:** algoritma spaced repetition sederhana (mirip SM-2)

**Data inti:** pengguna, topik, item latihan (soal atau struktur 3D), riwayat jawaban, jadwal ulang, rencana belajar.

---

## 11. Ukuran Keberhasilan

| Ukuran | Target |
| --- | --- |
| Fitur MVP (F1-F5) berjalan tanpa error besar saat demo | 100% |
| Skor SUS dari penguji | 68 atau lebih |
| Jumlah penguji | 10-15 mahasiswa kedokteran |
| Perbaikan skor (jika dilakukan pre-test dan post-test) | Ada peningkatan pada regio yang dilatih |
| Waktu muat halaman 3D | Beberapa detik di perangkat biasa |

---

## 12. Risiko dan Cara Mengatasinya

| Risiko | Cara mengatasi |
| --- | --- |
| Model 3D sulit dicari atau lisensinya tidak jelas | Pilih satu sumber dengan lisensi terbuka lebih awal, simpan bukti lisensi |
| Akurasi konten anatomi | Minta satu dosen atau senior memeriksa daftar struktur |
| Lingkup meluas | Pertahankan fokus pada F1-F5, fitur lain masuk roadmap |
| Penguji sulit dicari | Mulai kumpulkan relawan sejak awal lewat angkatan dan komunitas |
| Klaim "unik" perlu dibuktikan | Lakukan survei aplikasi sejenis dan tampilkan perbandingannya |

---

## 13. Tahapan Pengembangan

Pengembangan dilakukan dalam enam tahap berurutan:

1. **Validasi masalah:** survei singkat mahasiswa kedokteran dan survei aplikasi serupa
2. **Rancangan:** mockup layar dan skema database
3. **Siapkan konten:** pilih model 3D dan susun daftar struktur satu regio
4. **Bangun MVP:** F1 sampai F5
5. **Uji pengguna:** kumpulkan skor SUS dan masukan
6. **Perbaiki dan siapkan presentasi:** masalah, solusi, demo, hasil uji, roadmap

---

## 14. Sumber Rujukan Masalah

- Zhao, Wang & Xie (2026). *The digital transformation of clinical teaching: a review of AI and data-driven quality assurance systems in medical education.* Frontiers in Public Health.
- Telaah 16 studi (2025-2026) tentang tantangan mahasiswa kedokteran (burnout, beban belajar, adaptasi, pengajaran klinis, hambatan bahasa).
