import json

with open("video/transcription.json", encoding="utf-8") as f:
    data = json.load(f)

for s in data:
    print(f"{s['id']}: [{s['start']}s - {s['end']}s] {s['text']}")
