import asyncio
import os
import shutil
from playwright.async_api import async_playwright

OUTPUT_DIR = os.path.abspath("video/public/recordings")
os.makedirs(OUTPUT_DIR, exist_ok=True)

CURSOR_INJECTION_SCRIPT = """
(() => {
    if (document.getElementById('virtual-cursor')) return;
    
    const style = document.createElement('style');
    style.id = 'virtual-cursor-style';
    style.innerHTML = `
        #virtual-cursor {
            position: fixed;
            top: 0;
            left: 0;
            width: 24px;
            height: 24px;
            pointer-events: none;
            z-index: 9999999;
            transform: translate(-2px, -2px);
            filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
        }
        .virtual-click-ripple {
            position: fixed;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(13, 110, 253, 0.45);
            border: 2.5px solid #0d6efd;
            pointer-events: none;
            z-index: 9999998;
            transform: translate(-50%, -50%) scale(0.2);
            animation: ripple-anim 0.55s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        @keyframes ripple-anim {
            0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.95; }
            100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    cursor.id = 'virtual-cursor';
    cursor.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
            <path d="M4 3L18 13L11 14L8 20L4 3Z" fill="#0f172a" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
        </svg>
    `;
    document.body.appendChild(cursor);

    window.__updateCursorPos = (x, y) => {
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
    };

    window.__triggerClickRipple = (x, y) => {
        const ripple = document.createElement('div');
        ripple.className = 'virtual-click-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    };
})();
"""

class HumanPointer:
    def __init__(self, page):
        self.page = page
        self.x = 960
        self.y = 540

    async def init(self):
        await self.page.evaluate(CURSOR_INJECTION_SCRIPT)
        await self.page.evaluate(f"window.__updateCursorPos({self.x}, {self.y})")

    async def move_to(self, target_x, target_y, steps=25, duration=0.45):
        start_x, start_y = self.x, self.y
        step_sleep = duration / steps
        for i in range(1, steps + 1):
            t = i / steps
            ease_t = t * t * (3.0 - 2.0 * t)
            cur_x = start_x + (target_x - start_x) * ease_t
            cur_y = start_y + (target_y - start_y) * ease_t
            await self.page.mouse.move(cur_x, cur_y)
            await self.page.evaluate(f"window.__updateCursorPos({cur_x}, {cur_y})")
            await asyncio.sleep(step_sleep)
        self.x = target_x
        self.y = target_y

    async def click(self, target_x=None, target_y=None):
        if target_x is not None and target_y is not None:
            await self.move_to(target_x, target_y)
        await self.page.evaluate(f"window.__triggerClickRipple({self.x}, {self.y})")
        await self.page.mouse.click(self.x, self.y)
        await asyncio.sleep(0.3)

    async def drag(self, dx, dy, steps=35, duration=0.9):
        await self.page.mouse.down()
        start_x, start_y = self.x, self.y
        step_sleep = duration / steps
        for i in range(1, steps + 1):
            t = i / steps
            ease_t = t * t * (3.0 - 2.0 * t)
            cur_x = start_x + dx * ease_t
            cur_y = start_y + dy * ease_t
            await self.page.mouse.move(cur_x, cur_y)
            await self.page.evaluate(f"window.__updateCursorPos({cur_x}, {cur_y})")
            await asyncio.sleep(step_sleep)
        await self.page.mouse.up()
        self.x = start_x + dx
        self.y = start_y + dy
        await asyncio.sleep(0.3)

    async def smooth_scroll(self, dy, steps=25, duration=0.7):
        step_y = dy / steps
        for _ in range(steps):
            await self.page.mouse.wheel(0, step_y)
            await asyncio.sleep(duration / steps)


async def record_clip(name, runner_fn):
    print(f"\n==========================================")
    print(f"--- Starting recording: {name} ---")
    print(f"==========================================")
    
    temp_dir = os.path.join(OUTPUT_DIR, f"temp_{name}")
    os.makedirs(temp_dir, exist_ok=True)
    target_file = os.path.join(OUTPUT_DIR, f"{name}.webm")

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
            device_scale_factor=1,
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
            if os.path.exists(target_file):
                os.remove(target_file)
            shutil.move(video_path, target_file)
            print(f"Successfully saved {target_file}")
            shutil.rmtree(temp_dir, ignore_errors=True)


# Clip 03: Hero & Landing Page
async def run_hero(page, pointer):
    await page.goto("http://localhost:3000", wait_until="networkidle")
    await pointer.init()
    await asyncio.sleep(1.0)
    
    # Move across the spotlight mask
    await pointer.move_to(800, 480, duration=0.8)
    await pointer.move_to(1100, 420, duration=1.0)
    await pointer.move_to(950, 520, duration=0.8)
    await asyncio.sleep(0.5)

    # Scroll down to features
    await pointer.smooth_scroll(650, duration=1.0)
    await asyncio.sleep(1.5)
    
    # Hover over feature badges
    await pointer.move_to(640, 400, duration=0.8)
    await asyncio.sleep(0.8)
    await pointer.move_to(1280, 400, duration=0.8)
    await asyncio.sleep(1.0)

    # Scroll down to Cara Kerja section
    await pointer.smooth_scroll(750, duration=1.2)
    await asyncio.sleep(2.0)
    await pointer.smooth_scroll(-1400, duration=1.2)
    await asyncio.sleep(1.5)


# Clip 04: Onboarding Flow
async def run_onboarding(page, pointer):
    await page.goto("http://localhost:3000/onboarding", wait_until="networkidle")
    await pointer.init()
    await asyncio.sleep(1.5)

    # Step 1: Regio selection (Thorax & Membrum)
    thorax_btn = page.locator("text=Thorax").first
    if await thorax_btn.is_visible():
        box = await thorax_btn.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(0.6)

    membrum_btn = page.locator("text=Membrum").first
    if await membrum_btn.is_visible():
        box = await membrum_btn.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(0.6)

    # Click Next button
    next_btn = page.locator("button:has-text('Lanjut')").first
    if await next_btn.is_visible():
        box = await next_btn.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(1.2)

    # Step 2: Exam date
    date_input = page.locator("input[type='date']").first
    if await date_input.is_visible():
        box = await date_input.bounding_box()
        if box:
            await pointer.move_to(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(0.8)

    next_btn = page.locator("button:has-text('Lanjut')").first
    if await next_btn.is_visible():
        box = await next_btn.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(1.2)

    # Step 3: Hours & Preferences
    slider = page.locator("input[type='range']").first
    if await slider.is_visible():
        box = await slider.bounding_box()
        if box:
            await pointer.move_to(box["x"] + box["width"]*0.4, box["y"] + box["height"]/2)
            await asyncio.sleep(0.6)

    # Click Submit / Generate plan
    submit_btn = page.locator("button:has-text('Susun'), button:has-text('Mulai')").first
    if await submit_btn.is_visible():
        box = await submit_btn.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            # Wait for AI simulation progress to finish
            await asyncio.sleep(3.5)


# Clip 05: Perencana Belajar
async def run_perencana(page, pointer):
    await page.goto("http://localhost:3000/perencana", wait_until="networkidle")
    await pointer.init()
    await asyncio.sleep(1.5)

    # Hover over summary stats
    await pointer.move_to(450, 240, duration=0.8)
    await asyncio.sleep(0.8)
    await pointer.move_to(750, 240, duration=0.8)
    await asyncio.sleep(0.8)

    # Click Day cards (e.g. Day 2, Day 3)
    day_cards = await page.locator("button:has-text('Hari'), div:has-text('Hari')").all()
    if len(day_cards) > 2:
        box = await day_cards[1].bounding_box()
        if box and box["y"] > 0:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(1.2)

    # Scroll down to daily targets
    await pointer.smooth_scroll(450, duration=1.0)
    await asyncio.sleep(1.5)
    await pointer.move_to(680, 500, duration=0.8)
    await asyncio.sleep(1.2)
    await pointer.smooth_scroll(-450, duration=0.8)
    await asyncio.sleep(1.5)


# Clip 06: Materi & Rangkuman AI
async def run_materi(page, pointer):
    await page.goto("http://localhost:3000/materi", wait_until="networkidle")
    await pointer.init()
    await asyncio.sleep(1.5)

    # Hover over dropzone
    dropzone = page.locator("text=Tarik & lepas, text=Unggah Dokumen").first
    if await dropzone.is_visible():
        box = await dropzone.bounding_box()
        if box:
            await pointer.move_to(box["x"] + box["width"]/2, box["y"] + box["height"]/2, duration=0.8)
            await asyncio.sleep(0.8)

    # Upload file
    file_input = page.locator("input[type='file']").first
    pdf_path = os.path.abspath("video/public/Kuliah_Anatomi_Thorax.pdf")
    if await file_input.count() > 0 and os.path.exists(pdf_path):
        await file_input.set_input_files(pdf_path)
        # Wait for AI processing simulation bar
        await asyncio.sleep(3.2)

    # Click on the first ready material
    card = page.locator("a:has-text('Kardiovaskular'), a:has-text('Thorax'), a:has-text('Anatomi')").first
    if await card.is_visible():
        box = await card.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(2.0)
    else:
        await page.goto("http://localhost:3000/materi/mat-thorax", wait_until="networkidle")
        await asyncio.sleep(1.5)

    # In detail page, scroll smoothly through summary and disclaimer
    await pointer.smooth_scroll(400, duration=1.0)
    await asyncio.sleep(1.5)
    await pointer.smooth_scroll(400, duration=1.0)
    await asyncio.sleep(1.5)
    await pointer.smooth_scroll(-800, duration=1.0)
    await asyncio.sleep(1.0)


# Clip 07: Kuis Soal & Flashcard
async def run_kuis_flashcard(page, pointer):
    # Part A: Latihan Soal
    await page.goto("http://localhost:3000/latihan-materials", wait_until="networkidle")
    await pointer.init()
    await asyncio.sleep(1.5)

    # Click Mulai Latihan
    start_btn = page.locator("button:has-text('Mulai Latihan')").first
    if await start_btn.is_visible():
        box = await start_btn.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(1.5)

    # Select Option (e.g. Option B)
    option = page.locator("button:has-text('B.')").first
    if await option.is_visible():
        box = await option.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(1.0)

    # Click Cek Jawaban / Kirim
    check_btn = page.locator("button:has-text('Cek Jawaban'), button:has-text('Simpan')").first
    if await check_btn.is_visible():
        box = await check_btn.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(2.0)

    # Part B: Flashcard
    await page.goto("http://localhost:3000/flashcard", wait_until="networkidle")
    await pointer.init()
    await asyncio.sleep(1.5)

    # Click Mulai Belajar on first deck
    deck_btn = page.locator("button:has-text('Mulai'), a:has-text('Mulai')").first
    if await deck_btn.is_visible():
        box = await deck_btn.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(1.5)

    # Click card to flip
    card = page.locator("div[role='button']:has-text('Klik untuk membalik'), div:has-text('Klik untuk membalik')").first
    if await card.is_visible():
        box = await card.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(2.0)
            
            # Click Mastered / Ingat
            ingat_btn = page.locator("button:has-text('Ingat'), button:has-text('Mudah')").first
            if await ingat_btn.is_visible():
                box2 = await ingat_btn.bounding_box()
                if box2:
                    await pointer.click(box2["x"] + box2["width"]/2, box2["y"] + box2["height"]/2)
                    await asyncio.sleep(1.5)


# Clip 08: Anatomi 3D Interactive WebGL
async def run_anatomi3d(page, pointer):
    await page.goto("http://localhost:3000/latihan", wait_until="networkidle")
    await pointer.init()
    # Give WebGL and GLTF time to compile and render
    await asyncio.sleep(3.5)

    # Drag across canvas to rotate 3D model
    canvas = page.locator("canvas").first
    if await canvas.is_visible():
        box = await canvas.bounding_box()
        if box:
            cx = box["x"] + box["width"]/2
            cy = box["y"] + box["height"]/2
            await pointer.move_to(cx, cy, duration=0.8)
            await asyncio.sleep(0.5)

            # Smooth 3D rotation horizontally
            await pointer.drag(160, -30, duration=1.0)
            await asyncio.sleep(0.6)
            await pointer.drag(-240, 20, duration=1.2)
            await asyncio.sleep(0.8)

    # Click on a structure item in sidebar / list
    struct_btn = page.locator("button:has-text('M. Frontalis'), button:has-text('Temporalis'), button:has-text('Pectoralis')").first
    if await struct_btn.is_visible():
        box = await struct_btn.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(1.8)

    # Switch region pill to Thorax or Membrum
    thorax_pill = page.locator("button:has-text('Thorax'), div:has-text('Thorax')").first
    if await thorax_pill.is_visible():
        box = await thorax_pill.bounding_box()
        if box:
            await pointer.click(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            await asyncio.sleep(2.5)

            # Rotate again in Thorax
            if await canvas.is_visible():
                box2 = await canvas.bounding_box()
                if box2:
                    cx = box2["x"] + box2["width"]/2
                    cy = box2["y"] + box2["height"]/2
                    await pointer.move_to(cx, cy, duration=0.6)
                    await pointer.drag(140, -20, duration=1.0)
                    await asyncio.sleep(1.2)


async def main():
    await record_clip("clip_03_hero", run_hero)
    await record_clip("clip_04_onboarding", run_onboarding)
    await record_clip("clip_05_perencana", run_perencana)
    await record_clip("clip_06_materi", run_materi)
    await record_clip("clip_07_kuis_flashcard", run_kuis_flashcard)
    await record_clip("clip_08_anatomi3d", run_anatomi3d)
    print("\nAll screen recordings completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
