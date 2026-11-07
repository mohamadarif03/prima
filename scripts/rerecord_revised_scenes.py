import asyncio
import os
import shutil
import subprocess
from playwright.async_api import async_playwright
from record_clips import HumanPointer, OUTPUT_DIR, CURSOR_INJECTION_SCRIPT

async def run_materi_revised(page, pointer):
    print("Recording: Materi upload & AI summary at /materi/mat-01 ...")
    await page.goto("http://localhost:3000/materi", wait_until="networkidle")
    await pointer.init()
    await asyncio.sleep(1.0)

    # Hover dropzone
    dropzone = page.locator("text=Tarik & lepas, text=Unggah Dokumen").first
    if await dropzone.is_visible():
        box = await dropzone.bounding_box()
        if box:
            await pointer.move_to(box["x"] + box["width"]/2, box["y"] + box["height"]/2, duration=0.6)
            await asyncio.sleep(0.5)

    # Upload file
    file_input = page.locator("input[type='file']").first
    pdf_path = os.path.abspath("video/public/Kuliah_Anatomi_Thorax.pdf")
    if await file_input.count() > 0 and os.path.exists(pdf_path):
        await file_input.set_input_files(pdf_path)
        # Wait for AI processing bar (1.8s)
        await asyncio.sleep(2.0)

    # Open /materi/mat-01 directly to show the real AI summary per subtopic
    print("Navigating to /materi/mat-01 ...")
    await page.goto("http://localhost:3000/materi/mat-01", wait_until="networkidle")
    await pointer.init()
    await asyncio.sleep(1.5)

    # Scroll smoothly through subtopics and AI disclaimer
    await pointer.smooth_scroll(360, duration=1.0)
    await asyncio.sleep(2.2)
    await pointer.smooth_scroll(380, duration=1.0)
    await asyncio.sleep(2.2)
    await pointer.smooth_scroll(-740, duration=1.0)
    await asyncio.sleep(1.5)


async def run_kuis_flashcard_revised(page, pointer):
    print("Recording: Quiz session & flashcard demo ...")
    # Part A: Latihan Soal
    await page.goto("http://localhost:3000/latihan-materials", wait_until="networkidle")
    await pointer.init()
    await asyncio.sleep(1.0)

    # Click "Buat Soal & Mulai Sesi"
    start_btn = page.locator("button:has-text('Buat Soal & Mulai Sesi')").first
    if await start_btn.is_visible():
        box = await start_btn.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            print("Clicked 'Buat Soal & Mulai Sesi', waiting for AI generation...")
            await asyncio.sleep(3.2)

    # Click Option B
    option_b = page.locator("button:has-text('B.')").first
    if await option_b.is_visible():
        box = await option_b.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            print("Selected Option B in quiz session.")
            await asyncio.sleep(1.6)

    # Scroll down to reveal instant clinical explanation
    await pointer.smooth_scroll(280, duration=0.8)
    await asyncio.sleep(2.2)

    # Part B: Flashcard
    print("Navigating to /flashcard ...")
    await page.goto("http://localhost:3000/flashcard", wait_until="networkidle")
    await pointer.init()
    await asyncio.sleep(1.2)

    # Click "Mulai Belajar"
    deck_start = page.locator("button:has-text('Mulai Belajar')").first
    if await deck_start.is_visible():
        box = await deck_start.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(1.5)

    # Click on flashcard to flip
    await pointer.click(960, 470)
    await asyncio.sleep(2.0)

    # Click Ingat / Mastered
    ingat_btn = page.locator("button:has-text('Ingat'), button:has-text('Paham')").first
    if await ingat_btn.is_visible():
        box = await ingat_btn.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(1.2)

    # Flip the second card
    await pointer.click(960, 470)
    await asyncio.sleep(2.0)


async def record_and_convert(name, runner_fn):
    temp_dir = os.path.join(OUTPUT_DIR, f"temp_{name}")
    os.makedirs(temp_dir, exist_ok=True)
    webm_file = os.path.join(OUTPUT_DIR, f"{name}.webm")
    mp4_file = os.path.join(OUTPUT_DIR, f"{name}.mp4")

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--enable-webgl",
                "--ignore-gpu-blocklist",
                "--use-gl=angle",
                "--use-angle=d3d11",
                "--window-size=1920,1080",
            ]
        )
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=temp_dir,
            record_video_size={"width": 1920, "height": 1080},
        )
        page = await context.new_page()
        pointer = HumanPointer(page)

        try:
            await runner_fn(page, pointer)
        except Exception as e:
            print(f"Error recording {name}: {e}")
            import traceback
            traceback.print_exc()

        video = page.video
        await context.close()
        await browser.close()

        if video:
            video_path = await video.path()
            if os.path.exists(webm_file):
                os.remove(webm_file)
            shutil.move(video_path, webm_file)
            shutil.rmtree(temp_dir, ignore_errors=True)

            print(f"Converting {webm_file} to 30fps CFR MP4...")
            cmd = [
                "ffmpeg", "-y", "-i", webm_file,
                "-c:v", "libx264",
                "-pix_fmt", "yuv420p",
                "-r", "30",
                "-g", "30",
                "-crf", "18",
                "-preset", "fast",
                mp4_file
            ]
            subprocess.check_call(cmd)
            os.remove(webm_file)
            print(f"Successfully generated {mp4_file}!")

async def main():
    await record_and_convert("clip_06_materi", run_materi_revised)
    await record_and_convert("clip_07_kuis_flashcard", run_kuis_flashcard_revised)
    print("Re-recording finished successfully!")

if __name__ == "__main__":
    asyncio.run(main())
