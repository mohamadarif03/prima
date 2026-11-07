import asyncio
import os
import shutil
from playwright.async_api import async_playwright
from record_clips import HumanPointer, OUTPUT_DIR, CURSOR_INJECTION_SCRIPT

async def run_kuis_flashcard_extended(page, pointer):
    # Part A: Latihan Soal AI
    await page.goto("http://localhost:3000/latihan-materials", wait_until="networkidle")
    await pointer.init()
    await asyncio.sleep(1.2)

    # Click Mulai Latihan
    start_btn = page.locator("button:has-text('Mulai Latihan')").first
    if await start_btn.is_visible():
        box = await start_btn.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            # Wait for AI question generation simulation (2.6s)
            await asyncio.sleep(3.0)

    # Select an option (e.g. Option B)
    option_btns = await page.locator("button:has-text('B.')").all()
    if len(option_btns) > 0:
        box = await option_btns[0].bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(1.8)

    # Scroll down to reveal explanation
    await pointer.smooth_scroll(300, duration=0.8)
    await asyncio.sleep(2.0)

    # Part B: Flashcard
    await page.goto("http://localhost:3000/flashcard", wait_until="networkidle")
    await pointer.init()
    await asyncio.sleep(1.5)

    # Click Mulai Belajar on first deck
    deck_start = page.locator("button:has-text('Mulai Belajar')").first
    if await deck_start.is_visible():
        box = await deck_start.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(1.8)

    # Click card to flip
    card = page.locator("div:has-text('Klik untuk membalik'), div[role='button']").first
    # We can also just click near center of screen
    await pointer.click(960, 480)
    await asyncio.sleep(2.2)

    # Click Mastered / Ingat
    mastered_btn = page.locator("button:has-text('Ingat'), button:has-text('Paham')").first
    if await mastered_btn.is_visible():
        box = await mastered_btn.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(1.8)

    # Flip the second card
    await pointer.click(960, 480)
    await asyncio.sleep(2.5)

async def main():
    name = "clip_07_kuis_flashcard"
    temp_dir = os.path.join(OUTPUT_DIR, f"temp_{name}")
    os.makedirs(temp_dir, exist_ok=True)
    target_file = os.path.join(OUTPUT_DIR, f"{name}.webm")

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--window-size=1920,1080"]
        )
        context = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            record_video_dir=temp_dir,
            record_video_size={"width": 1920, "height": 1080},
        )
        page = await context.new_page()
        pointer = HumanPointer(page)

        await run_kuis_flashcard_extended(page, pointer)

        video = page.video
        await context.close()
        await browser.close()

        if video:
            video_path = await video.path()
            if os.path.exists(target_file):
                os.remove(target_file)
            shutil.move(video_path, target_file)
            print(f"Successfully re-recorded {target_file}")
            shutil.rmtree(temp_dir, ignore_errors=True)

if __name__ == "__main__":
    asyncio.run(main())
