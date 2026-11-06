# PRD: Pendamping Belajar Mahasiswa Kedokteran

*Versi 1.1 • Kategori: Software Development • Nama produk: **PRIMA***

---

## 1. Ringkasan dalam Satu Paragraf

PRIMA (Platform Review Interaktif Medis Adaptif) adalah aplikasi web berbahasa Indonesia yang membantu mahasiswa kedokteran belajar dengan lebih terarah. Pada awal pemakaian, mahasiswa mengisi pengaturan (onboarding) tentang topik, tanggal ujian, dan waktu belajar. Berdasarkan itu, AI menyusun rencana belajar. Mahasiswa kemudian dapat mengunggah materi kuliah; AI merangkumnya, membuat latihan soal, dan membuat flashcard untuk istilah penting. Khusus anatomi, tersedia visualisasi 3D interaktif untuk membantu mahasiswa membayangkan letak dan bentuk struktur tubuh manusia.

---

## 2. Latar Belakang: Masalah yang Ingin Diselesaikan

### 2.1 Gambaran Kasus

Rifqi, mahasiswa kedokteran tahun pertama, sangat bersemangat saat diterima. Beberapa minggu kemudian, slide kuliah menumpuk, ratusan istilah dan struktur anatomi harus dihafal, dan ia bingung harus mulai dari mana. Ia belajar tanpa strategi, lalu mulai merasa kewalahan dan cepat lelah saat belajar.

### 2.2 Data Pendukung

- Survei terhadap 947 mahasiswa kedokteran di 27 universitas di Indonesia menemukan prevalensi burnout sekitar 35,5% (dikutip dalam Nasution & Isnayanti, 2025).
- Penelitian di salah satu universitas di Jakarta terhadap 200 mahasiswa melaporkan 77,1% mengalami burnout (sampel kecil, satu kampus).
- Secara global, prevalensi burnout pada mahasiswa kedokteran dilaporkan 44,2%, dengan rentang antar negara 9,9% sampai 75%.
- Studi 2026 (Govindasamy & Govindasamy) mengkaji hubungan beban belajar anatomi dengan stres dan prestasi akademik; penelitian sebelumnya yang dirujuk melaporkan beban anatomi yang berat berkaitan dengan kecemasan, kelelahan, dan menurunnya kepuasan.
- Tinjauan tentang memorisasi di pendidikan kedokteran menyebut bahwa mahasiswa harus menghafal banyak terminologi medis, anatomi, farmakologi, dan patologi, serta bahwa strategi seperti spaced repetition dan active recall dapat membantu.

### 2.3 Masalah yang Dihadapi Mahasiswa

| Masalah | Gambaran singkat |
| --- | --- |
| **Beban materi sangat luas** | Slide dan informasi menumpuk; mahasiswa sulit menentukan prioritas dan urutan belajar |
| **Manajemen waktu dan strategi belajar lemah** | Banyak yang belajar tanpa strategi dan merasa tertinggal |
| **Hafalan istilah dan anatomi sangat banyak** | Ratusan istilah dan struktur harus dihafal, sering tanpa gambaran visual yang jelas |
| **Latihan kurang interaktif dan tidak merata** | Kesempatan berlatih bergantung pada fasilitas dan lingkungan masing-masing |
| **Hambatan bahasa** | Banyak sumber belajar berbahasa Inggris |
| **Stres dan kelelahan akademik** | Berkaitan dengan beban akademik dan kurangnya dukungan |

**Yang akan dijawab PRIMA:** beban materi, manajemen waktu dan strategi belajar, hafalan istilah dan anatomi, latihan yang kurang interaktif, dan sebagian hambatan bahasa. **Yang tidak akan dijawab:** burnout secara klinis, keuangan, dan perbaikan kurikulum. Hal-hal ini membutuhkan solusi dari institusi dan ditulis sebagai batasan.

---

## 3. Tujuan Produk

**Tujuan utama:** membantu mahasiswa belajar lebih terarah dan efisien dengan rencana, latihan, dan visualisasi yang menyesuaikan kebutuhan masing-masing.

**Tujuan terukur (indikator keberhasilan):**

- Mahasiswa baru dapat menyelesaikan onboarding dan mendapat rencana belajar dalam kurang dari 3 menit.
- Skor kegunaan (SUS) di atas 68 dari uji coba 10-15 mahasiswa.
- Sebagian besar penguji menyatakan bahwa rencana belajar dan rangkuman membantu mereka tahu harus belajar apa dan dari mana.
- Rangkuman, soal, dan flashcard dari AI dinilai akurat dan relevan oleh dosen atau mahasiswa senior pada sampel yang diperiksa.

**Bukan tujuan:** menggantikan dosen, buku, atau praktikum nyata.

---

## 4. Siapa Penggunanya

**Pengguna utama: Mahasiswa kedokteran (preklinik / tahun awal).** Butuh cara belajar yang jelas di tengah materi yang banyak. Biasanya belajar lewat HP atau laptop dan sering kekurangan waktu.

**Pengguna sekunder (tahap lanjut): Dosen.** Ingin tahu topik mana yang paling sering dijawab salah oleh satu angkatan.

---

## 5. Cerita Penggunaan (User Story)

> **Rifqi**, mahasiswa kedokteran semester awal, punya ujian anatomi dua minggu lagi. Saat pertama membuka PRIMA, ia mengisi onboarding: topik yang dipelajari (misalnya Thorax dan Membrum), tanggal ujian, dan waktu belajar per hari. AI menyusun rencana belajar harian untuknya. Ia lalu mengunggah slide kuliah; PRIMA merangkumnya, membuat latihan soal, dan membuat flashcard untuk istilah penting. Saat belajar anatomi, ia membuka visualisasi 3D untuk melihat letak dan bentuk struktur seperti *Arcus aortae* atau *M. Biceps brachii* sehingga lebih mudah membayangkannya.

---

## 6. Fitur

### 6.1 Fitur Wajib (MVP)

| No | Fitur | Apa yang dilakukan | Kenapa penting |
| --- | --- | --- | --- |
| F1 | **Akun dan onboarding** | Daftar, masuk, lalu mengisi pengaturan awal: topik atau regio, tanggal ujian, waktu belajar per hari, dan preferensi belajar | Dasar menyimpan progres dan menyesuaikan kebutuhan belajar |
| F2 | **Rencana belajar oleh AI** | AI menyusun jadwal dan target harian dari hasil onboarding | Menjawab masalah manajemen waktu dan bingung harus mulai dari mana |
| F3 | **Unggah materi dan rangkuman AI** | Mahasiswa mengunggah materi kuliah (misalnya PDF); AI merangkum isinya dan memecahnya per subtopik | Menjawab masalah beban materi yang luas |
| F4 | **Latihan soal oleh AI** | AI membuat soal latihan dari materi atau rangkuman, dengan umpan balik dan penjelasan singkat | Memberi kesempatan berlatih yang interaktif dan merata |
| F5 | **Flashcard istilah penting** | AI membuat flashcard dari materi untuk membantu menghafal istilah penting | Menjawab masalah hafalan yang banyak |
| F6 | **Visualisasi 3D anatomi** | Model 3D interaktif (putar, perbesar, pilih struktur) dengan label Indonesia dan Latin, mencakup 6 regio: Caput, Collum, Thorax, Abdomen, Pelvis, dan Membrum | Membantu mahasiswa memiliki gambaran nyata tentang letak dan bentuk struktur anatomi |

### 6.2 Fitur Fase Kedua

| No | Fitur | Catatan |
| --- | --- | --- |
| F7 | **Pengulangan adaptif (spaced repetition)** | Item atau flashcard yang sering salah muncul lebih cepat, yang sudah dikuasai diulang lebih jarang |
| F8 | **Dashboard pribadi** | Progres dan peta kelemahan per topik atau regio, serta rekomendasi latihan berikutnya |
| F9 | **Kuis 3D** | Mode *klik struktur* dan *sebutkan nama* pada model 3D |
| F10 | **Vignette klinis** | Soal kasus singkat yang mengarah ke struktur anatomi tertentu |
| F11 | **Mode belajar bertahap** | Lapisan kulit, otot, lalu tulang |
| F12 | **Panel dosen** | Statistik topik yang paling sering salah per angkatan |

### 6.3 Pengembangan Lanjutan (Roadmap)

- Pasien virtual berbasis LLM
- Check-in kesejahteraan dan info layanan konseling
- Lebih banyak regio anatomi dan bidang lain
- Aplikasi seluler

---

## 7. Alur Pengguna (Garis Besar)

1. **Daftar / masuk**
2. **Onboarding:** pilih topik atau regio, tanggal ujian, dan waktu belajar
3. **AI menyusun rencana belajar** dengan target harian
4. **Unggah materi kuliah:** AI membuat rangkuman dan membaginya per subtopik
5. **Berlatih:** latihan soal dan flashcard dari materi
6. **Jelajahi visualisasi 3D** untuk memahami anatomi
7. **Dapat umpan balik** benar atau salah, disertai penjelasan singkat

---

## 8. Hal yang Bukan Bagian dari Produk (Batasan)

- PRIMA **bukan alat diagnosis** dan tidak memberi saran medis ke pasien.
- PRIMA **tidak mengukur atau mendiagnosis burnout**.
- **Rangkuman, soal, dan flashcard buatan AI adalah alat bantu** dan dapat mengandung kesalahan; mahasiswa tetap perlu memeriksanya dengan sumber utama (buku dan materi dosen).
- Konten anatomi 3D diorganisasikan ke dalam **6 regio utama tubuh manusia** (Caput, Collum, Thorax, Abdomen, Pelvis, Membrum).
- Sistem membantu belajar, **tidak menggantikan** praktikum dan bimbingan dosen.

---

## 9. Persyaratan Non-Fungsional (Mutu yang Diharapkan)

| Aspek | Harapan |
| --- | --- |
| **Mudah dipakai** | Mahasiswa baru bisa menyelesaikan onboarding dan mulai belajar tanpa tutorial panjang |
| **Ringan** | Model 3D dimuat dalam beberapa detik di laptop dan HP biasa |
| **Bahasa** | Seluruh antarmuka dalam bahasa Indonesia; istilah anatomi disertai Latin |
| **Privasi** | Data belajar dan materi yang diunggah bersifat pribadi; kata sandi disimpan aman (hash) |
| **Akurasi konten** | Nama dan letak struktur 3D divalidasi dosen atau sumber terpercaya; keluaran AI diberi keterangan bahwa perlu diperiksa dan diuji pada sampel |
| **Kecepatan AI** | Rangkuman dan soal dihasilkan dalam waktu wajar, dengan indikator proses agar pengguna tahu sistem sedang bekerja |
| **Lisensi** | Model 3D dan konten memakai sumber dengan lisensi yang jelas |

---

## 10. Gambaran Teknis (Sederhana)

- **Tampilan (frontend):** web, dengan Three.js atau Babylon.js untuk 3D
- **Server (backend):** API sederhana (misalnya Node.js atau FastAPI)
- **Database:** PostgreSQL atau MySQL
- **AI:** integrasi LLM lewat API untuk rangkuman, pemecahan materi, rencana belajar, soal, dan flashcard; ekstraksi teks dari berkas yang diunggah (misalnya PDF)
- **Penyimpanan berkas:** penyimpanan materi yang diunggah per pengguna
- **Penjadwalan ulang (fase kedua):** algoritma spaced repetition sederhana (mirip SM-2)

**Data inti:** pengguna, profil dan pengaturan onboarding, rencana belajar, materi unggahan, rangkuman, soal, flashcard, struktur 3D, riwayat jawaban.

---

## 11. Ukuran Keberhasilan

| Ukuran | Target |
| --- | --- |
| Fitur MVP (F1-F6) berjalan tanpa error besar saat demo | 100% |
| Skor SUS dari penguji | 68 atau lebih |
| Jumlah penguji | 10-15 mahasiswa kedokteran |
| Kualitas keluaran AI (rangkuman, soal, flashcard) pada sampel yang diperiksa dosen atau senior | Mayoritas dinilai akurat dan relevan |
| Waktu muat halaman 3D | Beberapa detik di perangkat biasa |
| Penguji menyatakan rencana belajar dan rangkuman membantu | Sebagian besar penguji |

---

## 12. Risiko dan Cara Mengatasinya

| Risiko | Cara mengatasi |
| --- | --- |
| Keluaran AI keliru (rangkuman, soal, flashcard) | Beri keterangan bahwa AI alat bantu, minta dosen atau senior memeriksa sampel, sediakan tombol laporkan kesalahan |
| Materi kuliah yang diunggah memiliki hak cipta atau bersifat pribadi | Materi hanya dapat diakses pengunggahnya; tidak dibagikan ke pengguna lain |
| Biaya dan keterbatasan pemakaian API AI | Batasi ukuran berkas dan jumlah permintaan per pengguna; pilih model sesuai anggaran |
| Kualitas ekstraksi teks dari PDF atau slide rendah | Uji dengan beberapa format; sediakan opsi tempel teks manual |
| Model 3D sulit dicari atau lisensinya tidak jelas | Pilih satu sumber dengan lisensi terbuka lebih awal, simpan bukti lisensi |
| Akurasi konten anatomi 3D | Minta satu dosen atau senior memeriksa daftar struktur |
| Lingkup meluas | Pertahankan fokus pada F1-F6, fitur lain masuk fase kedua atau roadmap |
| Penguji sulit dicari | Mulai kumpulkan relawan sejak awal lewat angkatan dan komunitas |
| Klaim "unik" perlu dibuktikan | Lakukan survei aplikasi sejenis dan tampilkan perbandingannya |

---

## 13. Tahapan Pengembangan

Pengembangan dilakukan dalam enam tahap berurutan:

1. **Validasi masalah:** survei singkat mahasiswa kedokteran dan survei aplikasi serupa
2. **Rancangan:** mockup layar (onboarding, rencana, unggah materi, flashcard, 3D) dan skema database
3. **Siapkan konten:** pilih model 3D, susun daftar struktur satu regio, dan siapkan contoh materi untuk menguji AI
4. **Bangun MVP:** F1 sampai F6
5. **Uji pengguna:** kumpulkan skor SUS, penilaian kualitas keluaran AI, dan masukan
6. **Perbaiki dan siapkan presentasi:** masalah, solusi, demo, hasil uji, roadmap

---

## 14. Sumber Rujukan

- Nasution, A. S. & Isnayanti, D. (2025). Perbandingan student burnout pada setiap angkatan mahasiswa Fakultas Kedokteran Universitas Muhammadiyah Sumatera Utara. *Trilogi: Jurnal Ilmu Teknologi, Kesehatan, dan Humaniora, 6*(3), 144-151.
- Govindasamy, P. & Govindasamy, R. (2026). Impact of high workload on students' learning in anatomy: study how the volume of anatomy content affects stress levels and academic performance. *Research and Development in Medical Education, 15*, 33365. doi: 10.34172/rdme.33365
- Tinjauan tentang memorisasi dalam pendidikan kedokteran (Cihan University, Irak, 2024).
- Zhao, Wang & Xie (2026). The digital transformation of clinical teaching: a review of AI and data-driven quality assurance systems in medical education. *Frontiers in Public Health.*
- Telaah 16 studi (2025-2026) tentang tantangan mahasiswa kedokteran (burnout, beban belajar, adaptasi, pengajaran klinis, hambatan bahasa).
