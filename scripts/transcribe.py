import json
from faster_whisper import WhisperModel

print("Loading Whisper model (tiny or base)...")
# Using base model in Indonesian
model = WhisperModel("base", device="cpu", compute_type="int8")

audio_path = "video/public/voiceover.MP3"
print(f"Transcribing {audio_path}...")

segments, info = model.transcribe(
    audio_path,
    language="id",
    beam_size=5,
    word_timestamps=True
)

print(f"Detected language '{info.language}' with probability {info.language_probability:.2f}")

results = []
for segment in segments:
    words_data = []
    if segment.words:
        for w in segment.words:
            words_data.append({
                "word": w.word,
                "start": round(w.start, 2),
                "end": round(w.end, 2),
                "probability": round(w.probability, 2)
            })
    
    seg_dict = {
        "id": segment.id,
        "start": round(segment.start, 2),
        "end": round(segment.end, 2),
        "text": segment.text.strip(),
        "words": words_data
    }
    print(f"[{seg_dict['start']}s -> {seg_dict['end']}s]: {seg_dict['text']}")
    results.append(seg_dict)

with open("video/transcription.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Done! Saved {len(results)} segments to video/transcription.json")
