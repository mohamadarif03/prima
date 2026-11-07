import json

# Read raw whisper segments
with open("video/transcription.json", encoding="utf-8") as f:
    raw_segments = json.load(f)

# Polished Indonesian subtitle sentences aligned with each whisper segment
polished_texts = [
    "Kenalin, ini Rifqi, mahasiswa Kedokteran Universitas Brawijaya.",
    "Lima bulan lalu, Rifqi sangat bahagia karena diterima di Fakultas Kedokteran.",
    "Ia semangat sekali memulai perkuliahan, tapi beberapa minggu kemudian semuanya berubah.",
    "Slide kuliah mulai menumpuk, ratusan istilah dan struktur anatomi harus dihafal,",
    "dan Rifqi bingung harus mulai dari mana.",
    "Ia belajar tanpa strategi, lalu mulai merasa kewalahan dan cepat lelah setiap kali membuka buku.",
    "Sayangnya, Rifqi tidak sendirian.",
    "Menurut survei terhadap 947 mahasiswa kedokteran di 27 universitas di Indonesia,",
    "sekitar 35 persen mengalami burnout. Dan studi tahun 2026 di jurnal Research and Development in Medical Education",
    "menunjukkan bahwa beban belajar anatomi yang berat berkaitan dengan stres,",
    "kelelahan, hingga menurunnya kepuasan belajar.",
    "Padahal, tinjauan pustaka tentang menghafal di pendidikan kedokteran menyebut bahwa strategi seperti",
    "spaced repetition dan active recall dapat membantu.",
    "Masalahnya, banyak mahasiswa tidak punya alat yang membantu mereka belajar lebih terarah.",
    "Karena itu hadirlah PRIMA: Pembelajaran Responsif Interaktif Medis Adaptif.",
    "Sebuah aplikasi web berbahasa Indonesia yang dapat membantu mahasiswa kedokteran belajar lebih terarah.",
    "Dengan bantuan AI dan visualisasi 3 dimensi anatomi, mari kita lihat",
    "bagaimana PRIMA dapat membantu Rifqi.",
    "Langkah pertama, setelah Rifqi mendaftar pada aplikasi tersebut,",
    "Rifqi mulai mengisi pengaturan awal: memilih topik yang sedang dipelajari,",
    "tanggal ujian, hingga berapa lama ia bisa belajar setiap hari.",
    "Dengan begitu, PRIMA tahu persis seperti apa yang Rifqi butuhkan.",
    "Berdasarkan pengaturan tersebut, AI PRIMA langsung menyusun rencana belajar:",
    "apa yang dipelajari hari ini, besok, hingga sampai hari H ujian.",
    "Rifqi tidak perlu lagi bingung harus mulai dari mana.",
    "Sekarang saatnya belajar: Rifqi dapat mengunggah materi perkuliahannya,",
    "dan AI langsung merangkum isinya, jadi ia tidak perlu membaca puluhan slide dari nol.",
    "Rangkuman ini adalah alat bantu, tetapi tetap perlu dicek dengan sumber utama.",
    "Setelah paham isinya, Rifqi perlu menguji dirinya.",
    "Dari materi yang sama, AI membuatkan latihan soal.",
    "Lalu untuk istilah-istilah penting yang harus dihafal,",
    "AI dapat membuatkan flashcard,",
    "sehingga Rifqi bisa mengulang istilah kapan saja,",
    "bahkan saat hanya punya waktu beberapa menit.",
    "Tapi anatomi tidak cukup dipelajari dari teks,",
    "karena itu PRIMA menyediakan visualisasi 3 dimensi.",
    "Rifqi bisa memutar, memperbesar, dan menjelajahi enam regio tubuh,",
    "mulai dari Caput, Collum, hingga Membrum,",
    "lengkap dengan nama strukturnya.",
    "Dengan begitu, ia punya gambaran nyata tentang letak",
    "dan bentuk struktur yang selama ini hanya ia hafal namanya.",
    "Dengan PRIMA, Rifqi tidak lagi bingung harus mulai dari mana.",
    "Ia punya rencana belajar yang lebih jelas,",
    "materi yang terangkum, latihan yang siap dipakai,",
    "dan gambaran anatomi yang lebih nyata.",
    "PRIMA tidak menggantikan dosen, buku, ataupun praktikum,",
    "tetapi membantu mahasiswa belajar lebih terarah di tengah materi yang sangat banyak.",
    "Dengan PRIMA, belajar kedokteran lebih terarah."
]

subtitles = []
FPS = 30

for i, seg in enumerate(raw_segments):
    text = polished_texts[i] if i < len(polished_texts) else seg["text"]
    start_frame = max(0, int(round(seg["start"] * FPS)))
    end_frame = int(round(seg["end"] * FPS)) + 6 # extra small tail for readability
    subtitles.append({
        "id": seg["id"],
        "startSec": seg["start"],
        "endSec": seg["end"],
        "startFrame": start_frame,
        "endFrame": end_frame,
        "text": text
    })

ts_content = f"""// Auto-generated synchronized subtitles for PRIMA Demo Video (30 fps)
export interface SubtitleItem {{
  id: number;
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
  text: string;
}}

export const SUBTITLES: SubtitleItem[] = {json.dumps(subtitles, indent=2, ensure_ascii=False)};
"""

with open("video/src/data/subtitles.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Generated {len(subtitles)} subtitles in video/src/data/subtitles.ts")
