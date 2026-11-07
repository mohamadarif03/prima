import glob
import os
import subprocess

recordings = glob.glob("video/public/recordings/*.webm")
print(f"Found {len(recordings)} webm files to convert to MP4.")

for webm in recordings:
    mp4 = webm.replace(".webm", ".mp4")
    print(f"Converting {webm} -> {mp4} ...")
    cmd = [
        "ffmpeg", "-y", "-i", webm,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-r", "30",
        "-g", "30",
        "-crf", "18",
        "-preset", "fast",
        mp4
    ]
    subprocess.check_call(cmd)
    print(f"Done converting {mp4}")

print("All recordings successfully converted to CFR 30fps MP4!")
