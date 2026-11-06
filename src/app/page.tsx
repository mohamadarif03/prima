"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import "./landing.css";

const HERO_FRONT = "/assets/images/hero_front.png";
const HERO_BACK = "/assets/images/hero_back.png";
const MATERIAL = "/assets/images/material_tissue.jpg";
const AVATAR_URLS = [
  "/assets/images/avatar_skeletal.jpg",
  "/assets/images/avatar_muscular.jpg",
  "/assets/images/avatar_nervous.jpg",
  "/assets/images/avatar_cardiovascular.jpg",
  "/assets/images/avatar_digestive.jpg",
];

const SYSTEM_NAMES = [
  "Sistem Rangka & Sendi",
  "Sistem Otot & Jaringan",
  "Sistem Saraf Pusat",
  "Sistem Kardiovaskular",
  "Sistem Pencernaan & Viseral",
];

export default function LandingPage() {
  // Navigation & Interactive States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Atlas 3D");
  const [isJoined, setIsJoined] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Cara Belajar Step States
  const [activeStep, setActiveStep] = useState(0);
  const [indicatorTop, setIndicatorTop] = useState(0);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<"correct" | "wrong" | null>(null);

  // Refs for stage layout and canvas spotlight
  const stageRef = useRef<HTMLDivElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepBtnsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Toast Helper
  const say = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg(null);
    }, 1700);
  }, []);

  // Menu Handlers
  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
    say("Menu navigasi dibuka");
  }, [say]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    say("Menu navigasi ditutup");
  }, [say]);

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => {
      const next = !prev;
      say(next ? "Menu navigasi dibuka" : "Menu navigasi ditutup");
      return next;
    });
  }, [say]);

  // Gallery Avatar selection
  const chooseSystem = useCallback(
    (index: number) => {
      const nextIdx = ((index % 5) + 5) % 5;
      setCurrentIndex(nextIdx);
      say(SYSTEM_NAMES[nextIdx]);
    },
    [say]
  );

  // Play & Eye awake toggles
  const toggleAwake = useCallback(
    (source: "play" | "eye") => {
      setIsAwake((prev) => {
        const next = !prev;
        say(
          source === "play"
            ? next
              ? "Mode pemindaian aktif"
              : "Pemindaian dijeda"
            : next
            ? "Pratinjau visual anatomi"
            : "Pratinjau dijeda"
        );
        return next;
      });
    },
    [say]
  );

  // Join button toggle
  const toggleJoin = useCallback(() => {
    setIsJoined((prev) => {
      const next = !prev;
      say(next ? "Selamat datang di Atlas Anatomi" : "Sesi diakhiri");
      return next;
    });
  }, [say]);

  // Switch Cara Belajar Step
  const switchStep = useCallback(
    (index: number, isUserClick: boolean) => {
      const nextStep = ((index % 3) + 3) % 3;
      setActiveStep(nextStep);
      if (isUserClick) {
        setUserHasInteracted(true);
        if (autoRotateTimerRef.current) {
          clearInterval(autoRotateTimerRef.current);
          autoRotateTimerRef.current = null;
        }
      }
    },
    []
  );

  // Auto-rotate steps
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || userHasInteracted) return;

    autoRotateTimerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 6000);

    return () => {
      if (autoRotateTimerRef.current) clearInterval(autoRotateTimerRef.current);
    };
  }, [userHasInteracted]);

  // Update dynamic indicator position based on active step button
  useEffect(() => {
    function updateIndicator() {
      const btn = stepBtnsRef.current[activeStep];
      if (btn) {
        setIndicatorTop(btn.offsetTop);
      }
    }
    updateIndicator();
    const timer = setTimeout(updateIndicator, 120);
    window.addEventListener("resize", updateIndicator, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeStep]);

  // Outside click listener for mobile menu
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (!isMenuOpen) return;
      if (
        menuPanelRef.current &&
        !menuPanelRef.current.contains(e.target as Node) &&
        burgerRef.current &&
        !burgerRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
        if (burgerRef.current) burgerRef.current.focus();
      }
    }

    window.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  // Core Stage Layout Model
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const PHONE = window.matchMedia("(max-width:520px) and (orientation:portrait)");

    function layout() {
      if (!stage) return;
      if (PHONE.matches) {
        stage.classList.remove("is-mobile", "is-fit");
        stage.classList.add("is-phone", "nav-compact");
        stage.style.width = "";
        stage.style.height = "";
        stage.style.transform = "";
        stage.style.removeProperty("--hf");
        stage.style.removeProperty("--fx");
        return;
      }

      stage.classList.remove("is-phone");
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w / h < 1.05;
      stage.classList.toggle("is-mobile", mobile);

      const bh = mobile ? 1366 : 1024;
      const ideal = Math.round((bh * w) / h);
      const lo = mobile ? 560 : 1060;
      const hi = mobile ? 1450 : 2600;
      const bw = Math.max(lo, Math.min(hi, ideal));
      const s = Math.min(w / bw, h / bh);

      stage.style.setProperty(
        "--hf",
        Math.min(79, (79 * (bw - 295)) / 965).toFixed(2) + "px"
      );
      const baseW = mobile ? 640 : 1536;
      const fx = Math.max(0, (bw - baseW) / 2);
      stage.style.setProperty("--fx", fx.toFixed(2) + "px");

      stage.classList.toggle("is-fit", Math.abs(ideal - bw) > 1);
      const compact = mobile || s < 0.52;
      stage.classList.toggle("nav-compact", compact);

      if (!compact && stage.classList.contains("menu-open")) {
        setIsMenuOpen(false);
      }

      stage.style.width = bw + "px";
      stage.style.height = bh + "px";
      stage.style.transform = "translate(-50%,-50%) scale(" + s + ")";
    }

    window.addEventListener("resize", layout, { passive: true });
    window.addEventListener("orientationchange", layout, { passive: true });
    layout();

    return () => {
      window.removeEventListener("resize", layout);
      window.removeEventListener("orientationchange", layout);
    };
  }, []);

  // Spotlight Reveal Canvas Mechanic
  useEffect(() => {
    const stack = stackRef.current;
    const back = backRef.current;
    const canvas = canvasRef.current;
    if (!stack || !back || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SPOTLIGHT_R = 185;
    const mouse = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };
    let animId: number;

    function resizeCanvas() {
      if (!stack || !canvas) return;
      canvas.width = stack.offsetWidth || 600;
      canvas.height = stack.offsetHeight || 759;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    function handlePointerMove(e: PointerEvent) {
      if (!stack) return;
      const r = stack.getBoundingClientRect();
      const sx = stack.offsetWidth / r.width;
      const sy = stack.offsetHeight / r.height;
      mouse.x = (e.clientX - r.left) * sx;
      mouse.y = (e.clientY - r.top) * sy;
    }

    function handlePointerLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function handleTouchMove(e: TouchEvent) {
      if (!stack || !e.touches || !e.touches[0]) return;
      const t = e.touches[0];
      const r = stack.getBoundingClientRect();
      const sx = stack.offsetWidth / r.width;
      const sy = stack.offsetHeight / r.height;
      mouse.x = (t.clientX - r.left) * sx;
      mouse.y = (t.clientY - r.top) * sy;
    }

    function handleTouchEnd() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    stack.addEventListener("pointermove", handlePointerMove);
    stack.addEventListener("pointerleave", handlePointerLeave);
    stack.addEventListener("touchmove", handleTouchMove, { passive: true });
    stack.addEventListener("touchend", handleTouchEnd);

    function render(x: number, y: number) {
      if (!canvas || !ctx || !back) return;
      if (canvas.width === 0 || canvas.height === 0) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, SPOTLIGHT_R);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.62, "rgba(255,255,255,1)");
      grad.addColorStop(0.8, "rgba(255,255,255,0.5)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, SPOTLIGHT_R, 0, Math.PI * 2);
      ctx.fill();
      const url = canvas.toDataURL();
      back.style.maskImage = "url(" + url + ")";
      back.style.webkitMaskImage = "url(" + url + ")";
    }

    function loop() {
      smooth.x += (mouse.x - smooth.x) * 0.1;
      smooth.y += (mouse.y - smooth.y) * 0.1;
      render(smooth.x, smooth.y);
      animId = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
      if (stack) {
        stack.removeEventListener("pointermove", handlePointerMove);
        stack.removeEventListener("pointerleave", handlePointerLeave);
        stack.removeEventListener("touchmove", handleTouchMove);
        stack.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, []);

  // Web Animations API Entrance Animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || typeof Element.prototype.animate !== "function") {
      return;
    }

    document.documentElement.classList.add("intro");

    const near = window.innerWidth < 640 ? 0.6 : 1;
    function px(v: number) {
      return (v * near).toFixed(2) + "px";
    }
    const TYPE = "cubic-bezier(.16,1,.3,1)";
    const SOFT = "cubic-bezier(.22,.61,.36,1)";

    const anims: Animation[] = [];

    function run(
      els: Element | Element[] | NodeListOf<Element> | null,
      keyframes: Keyframe[],
      durSec: number,
      atSec: number,
      staggerSec = 0,
      easing = "ease"
    ) {
      if (!els) return;
      const list = Array.isArray(els)
        ? els
        : els instanceof NodeList
        ? Array.from(els)
        : [els];
      list.forEach((el, i) => {
        if (!el) return;
        const anim = el.animate(keyframes, {
          duration: durSec * 1000,
          delay: (atSec + i * staggerSec) * 1000,
          fill: "both",
          easing: easing,
        });
        anims.push(anim);
      });
    }

    function fade(from: string) {
      return [
        { opacity: 0, transform: from },
        { opacity: 1, transform: "none" },
      ];
    }

    // 1. Header elements
    run(document.querySelector(".brand"), fade("translateY(-10px)"), 0.5, 0.04, 0, SOFT);
    run(document.querySelector(".menu"), fade("translateY(-10px)"), 0.5, 0.09, 0, SOFT);
    run(document.querySelector(".nav"), fade("translateY(-10px)"), 0.55, 0.13, 0, SOFT);
    run(document.querySelector(".join"), fade("translateY(-10px)"), 0.55, 0.18, 0, SOFT);

    // 2. Headline lines
    const lines = document.querySelectorAll(".headline-line");
    lines.forEach((line, i) => {
      run(
        line,
        [
          { clipPath: "inset(0 -.12em 100% -.12em)" },
          { clipPath: "inset(-.34em -.12em -.34em -.12em)" },
        ],
        0.95,
        0.22 + i * 0.11,
        0,
        TYPE
      );

      Array.from(line.children).forEach((child) => {
        run(
          child,
          [{ transform: "translateY(.9em)" }, { transform: "none" }],
          0.95,
          0.22 + i * 0.11,
          0,
          TYPE
        );
      });
    });

    // 3. Hero
    run(
      document.querySelector(".hero"),
      [
        { opacity: 0, transform: "translateY(" + px(22) + ") scale(.99)" },
        { opacity: 1, transform: "none" },
      ],
      1.05,
      0.48,
      0,
      TYPE
    );

    // 4. Features
    run(
      document.querySelectorAll(".feature"),
      fade("translateX(" + px(12) + ")"),
      0.55,
      0.52,
      0.07,
      SOFT
    );

    // 5. Ghost & Robo-o-avatar
    run(document.querySelectorAll(".ghost"), [{ opacity: 0 }, { opacity: 1 }], 0.9, 0.62, 0.09, SOFT);
    run(document.querySelector(".robo-o-avatar"), fade("scale(.88)"), 0.62, 0.8, 0, TYPE);

    // 6. Glass card & Creator
    run(document.querySelector(".glass-card"), fade("translateY(" + px(18) + ")"), 0.78, 0.7, 0, TYPE);
    run(document.querySelector(".creator"), fade("translateY(" + px(10) + ")"), 0.6, 0.82, 0, SOFT);

    // 7. Material, avatars, socials
    run(document.querySelector(".material"), [{ opacity: 0 }, { opacity: 1 }], 0.72, 0.86, 0, SOFT);
    run(
      document.querySelector(".material-pill"),
      [{ transform: "translateX(" + px(16) + ")" }, { transform: "none" }],
      0.72,
      0.86,
      0,
      TYPE
    );
    run(document.querySelectorAll(".gallery .avatar"), fade("scale(.9)"), 0.55, 0.94, 0.06, TYPE);
    run(document.querySelectorAll(".social"), fade("translateY(" + px(9) + ")"), 0.5, 1.08, 0.05, SOFT);

    // Cleanup when done
    const timer = setTimeout(() => {
      document.documentElement.classList.remove("intro");
    }, 4500);

    return () => {
      clearTimeout(timer);
      document.documentElement.classList.remove("intro");
      anims.forEach((anim) => {
        try {
          anim.cancel();
        } catch {}
      });
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#d6e6f5] text-[#06192f] overflow-x-hidden">
      {/* =========================================================================
          VIEWPORT & RESPONSIVE SCALED STAGE (Hero Arena)
          ========================================================================= */}
      <main
        className="viewport"
        aria-label="Pengalaman interaktif atlas anatomi tubuh manusia Anatoma"
      >
        <div
          ref={stageRef}
          className={`stage ${isMenuOpen ? "menu-open" : ""}`}
        >
          {/* Header */}
          <header className="header">
            <Link
              href="/"
              className="brand"
              aria-label="Anatoma — Atlas Anatomi Tubuh"
            >
              <svg viewBox="0 0 58 21" aria-hidden="true">
                <path d="M0 0h7v21H0zM21 0h7v21h-7zM0 0h12l16 21H16zM30 0h8l12 21h-8zM51 0h7v21h-7z" />
              </svg>
            </Link>

            <button
              ref={burgerRef}
              className="menu"
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <nav className="nav" aria-label="Main navigation">
              {["Atlas 3D", "Sistem Organ", "Fisiologi", "Studi Klinis"].map(
                (item) => (
                  <a
                    key={item}
                    href={item === "Atlas 3D" ? "#home" : item === "Sistem Organ" ? "#cara-belajar" : "/latihan"}
                    className={activeNav === item ? "active" : ""}
                    onClick={(e) => {
                      setActiveNav(item);
                      say(item);
                    }}
                  >
                    {item}
                  </a>
                )
              )}
            </nav>

            <button className="join" type="button" onClick={toggleJoin}>
              <span className="join-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="23" height="23">
                  <circle
                    cx="12"
                    cy="7"
                    r="4"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.5 21c.4-5 3.1-7.3 7.5-7.3s7.1 2.3 7.5 7.3"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="join-label">
                {isJoined ? "Terdaftar" : "Akses Atlas"}
              </span>
            </button>

            {/* Menu panel (for compact / mobile navigation) */}
            <div
              ref={menuPanelRef}
              className="menu-panel"
              aria-hidden={!isMenuOpen}
            >
              {["Atlas 3D", "Sistem Organ", "Fisiologi", "Studi Klinis"].map(
                (item) => (
                  <a
                    key={item}
                    href={item === "Atlas 3D" ? "#home" : item === "Sistem Organ" ? "#cara-belajar" : "/latihan"}
                    className={activeNav === item ? "active" : ""}
                    onClick={() => {
                      setActiveNav(item);
                      closeMenu();
                    }}
                  >
                    {item}
                  </a>
                )
              )}
              <button className="menu-join" type="button" onClick={toggleJoin}>
                <span className="join-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="26" height="26">
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      fill="none"
                      stroke="var(--ink)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.5 21c.4-5 3.1-7.3 7.5-7.3s7.1 2.3 7.5 7.3"
                      fill="none"
                      stroke="var(--ink)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="join-label">
                  {isJoined ? "Terdaftar" : "Akses Atlas"}
                </span>
              </button>
            </div>
          </header>

          {/* Headline */}
          <h1 className="headline" id="home">
            <span className="headline-line">
              <span className="hl-rv">Anatomi tubuh — manusia</span>
            </span>
            <span className="headline-line headline-line2">
              <svg className="chain" viewBox="0 0 151 48" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M22 6c-9.94 0-18 8.06-18 18s8.06 18 18 18h16c9.94 0 18-8.06 18-18s-8.06-18-18-18H22zm0 8h16c5.52 0 10 4.48 10 10s-4.48 10-10 10H22c-5.52 0-10-4.48-10-10s4.48-10 10-10zm45.5-8c-9.94 0-18 8.06-18 18s8.06 18 18 18h16c9.94 0 18-8.06 18-18s-8.06-18-18-18h-16zm0 8h16c5.52 0 10 4.48 10 10s-4.48 10-10 10h-16c-5.52 0-10-4.48-10-10s4.48-10 10-10zm45.5-8c-9.94 0-18 8.06-18 18s8.06 18 18 18h16c9.94 0 18-8.06 18-18s-8.06-18-18-18h-16zm0 8h16c5.52 0 10 4.48 10 10s-4.48 10-10 10h-16c-5.52 0-10-4.48-10-10s4.48-10 10-10z"
                />
              </svg>
              <span>jelajahi sistem organ</span>
            </span>
          </h1>

          {/* Features */}
          <div className="features">
            <div className="feature">
              <span>Atlas 3D</span> <b>/01</b>
            </div>
            <div className="feature">
              <span>Lapisan Organ</span> <b>/02</b>
            </div>
            <div className="feature">
              <span>Interaktif</span> <b>/03</b>
            </div>
          </div>

          {/* Creator */}
          <div className="creator">
            <div className="verified" aria-hidden="true">
              <svg viewBox="0 0 12 12" width="11" height="11">
                <path
                  d="M2.2 6.2 4.7 8.5 9.8 3"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="creator-copy">
              <div>Dept. Anatomi Medis</div>
              <div className="series">Modul Anatomi · Edisi 01</div>
            </div>
          </div>

          {/* Glass Card */}
          <div className="glass-card">
            <div className="card-top">
              <div className="count">
                <strong>+206</strong>
                <small>struktur organ</small>
              </div>
              <button
                className="eye"
                type="button"
                aria-label="Pratinjau visual anatomi"
                onClick={() => toggleAwake("eye")}
              >
                <svg
                  viewBox="0 0 32 22"
                  width="33"
                  height="23"
                  aria-hidden="true"
                >
                  <path
                    d="M1 11C4 4 11 1 16 1s12 3 15 10c-3 7-10 10-15 10S4 18 1 11z"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="16"
                    cy="11"
                    r="3.5"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            </div>
            <p className="card-copy">
              Eksplorasi anatomi manusia,
              <br />
              interaktif lapis demi lapis.
            </p>
            <div className="card-bottom">
              <div className="start">
                Mulai
                <br />
                <strong>belajar</strong>
              </div>
              <button
                className="shuffle"
                type="button"
                aria-label="Ganti sistem organ"
                onClick={() => chooseSystem(currentIndex + 1)}
              >
                <svg
                  viewBox="0 0 30 30"
                  width="27"
                  height="27"
                  aria-hidden="true"
                >
                  <path
                    d="M4 8h5l12 14h5M21 8h5v5M26 8l-6 6M4 22h5l3.5-4.1M17.5 12.1 21 8"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 22h5v-5"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className={`play ${isAwake ? "active" : ""}`}
                type="button"
                aria-label="Aktifkan mode pemindaian"
                aria-pressed={isAwake}
                onClick={() => toggleAwake("play")}
              >
                <svg
                  viewBox="0 0 24 28"
                  width="24"
                  height="26"
                  aria-hidden="true"
                >
                  <path d="m3 2 19 12L3 26z" fill="#fff" />
                </svg>
              </button>
            </div>
          </div>

          {/* Ghost typography behind the subject */}
          <div className="ghost ghost-one" aria-hidden="true">
            B<i className="o-gap"></i>DY
          </div>
          <div className="ghost ghost-two" aria-hidden="true">
            SCAN
          </div>

          {/* Robo-o-avatar */}
          <div className="robo-o-avatar" aria-hidden="true">
            <img src={HERO_FRONT} alt="" />
          </div>

          {/* Hero with Spotlight Reveal */}
          <div className={`hero ${isAwake ? "awake" : ""}`} id="hero">
            <div ref={stackRef} className="hero-stack">
              <img
                className="hero-front"
                alt="Model 3D kerangka tulang anatomi manusia"
                src={HERO_FRONT}
              />
              <img
                ref={backRef}
                className="hero-back"
                aria-hidden="true"
                alt="Lapisan kulit, otot, dan sistem saraf bercahaya"
                src={HERO_BACK}
              />
              <canvas
                ref={canvasRef}
                className="hero-mask-canvas"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Material */}
          <div className="material">
            <div className="material-pill">
              <div className="material-thumb">
                <img src={MATERIAL} alt="Lapisan jaringan organ tubuh" />
              </div>
              <div className="material-copy">
                Lapisan
                <br />
                jaringan
              </div>
              <button
                className="material-next"
                type="button"
                aria-label="Ganti lapisan jaringan"
                onClick={() => chooseSystem(currentIndex + 1)}
              >
                <svg
                  viewBox="0 0 32 32"
                  width="30"
                  height="30"
                  aria-hidden="true"
                >
                  <path
                    d="M7 8 24 25M12 25h12V13"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Gallery */}
          <div
            className="gallery"
            role="group"
            aria-label="Pilihan sistem organ tubuh"
          >
            {AVATAR_URLS.map((url, i) => (
              <button
                key={url}
                className={`avatar ${currentIndex === i ? "active" : ""}`}
                type="button"
                aria-label={SYSTEM_NAMES[i]}
                style={
                  {
                    "--iw": "94%",
                    "--il": "3%",
                    "--it": "3%",
                    background: "rgba(214,230,245,.45)",
                  } as React.CSSProperties
                }
                onClick={() => chooseSystem(i)}
              >
                <img src={url} alt={SYSTEM_NAMES[i]} />
              </button>
            ))}
          </div>

          {/* Socials */}
          <div className="socials" aria-label="Social links">
            <button
              className="social"
              type="button"
              aria-label="Instagram"
              data-name="Instagram"
              onClick={() => say("Instagram dipilih")}
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
                fill="var(--ink)"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </button>
            <button
              className="social"
              type="button"
              aria-label="Facebook"
              data-name="Facebook"
              onClick={() => say("Facebook dipilih")}
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
                fill="var(--ink)"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button
              className="social"
              type="button"
              aria-label="Telegram"
              data-name="Telegram"
              onClick={() => say("Telegram dipilih")}
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
                fill="var(--ink)"
              >
                <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.674c.458 0 .661-.21.917-.457l2.203-2.141 4.582 3.385c.845.466 1.453.226 1.664-.783l3.008-14.17c.308-1.236-.472-1.8-1.437-1.478z" />
              </svg>
            </button>
          </div>

          {/* Toast */}
          <div
            className={`toast ${toastMsg ? "show" : ""}`}
            role="status"
            aria-live="polite"
          >
            {toastMsg}
          </div>
        </div>
      </main>

      {/* =========================================================================
          SECTION: CARA BELAJAR (Asymmetrical 2-Column Medical Learning Engine)
          ========================================================================= */}
      <section
        id="cara-belajar"
        className="relative w-full overflow-hidden py-24 md:py-32 bg-gradient-to-b from-[#d6e6f5] via-[#d9e9f6] to-[#d4e5f4] text-[#06192f] selection:bg-[#1169dc] selection:text-white"
        aria-label="Cara belajar anatomi interaktif"
        onMouseEnter={() => {
          if (autoRotateTimerRef.current) {
            clearInterval(autoRotateTimerRef.current);
            autoRotateTimerRef.current = null;
          }
        }}
        onMouseLeave={() => {
          if (!userHasInteracted) {
            autoRotateTimerRef.current = setInterval(() => {
              setActiveStep((prev) => (prev + 1) % 3);
            }, 6000);
          }
        }}
      >
        {/* Teks Bayangan Raksasa "LATIHAN" di Belakang */}
        <div
          className="cara-watermark"
          aria-hidden="true"
        >
          <span>
            LATIHAN
          </span>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Layout Asimetris Dua Kolom: Kiri ~40%, Kanan ~60% di Desktop */}
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            {/* KOLOM KIRI (~40%): Label, Headline, Daftar Tiga Langkah Tipografi Besar */}
            <div className="flex flex-col justify-center lg:col-span-5">
              {/* Label kecil & Headline */}
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#77899c]">
                  <span className="text-[#1169dc]">/</span> Cara belajar
                </span>
                <h2 className="mt-3 text-3xl font-light tracking-tight text-[#06192f] sm:text-4xl lg:text-5xl leading-[1.12]">
                  Latihan yang menyesuaikan{" "}
                  <span className="font-normal">kelemahanmu</span>
                </h2>
              </div>

              {/* Daftar Tiga Langkah (Tanpa Kotak, Tipografi Besar, Indeks /01 /02 /03) */}
              <div className="relative mt-10 md:mt-12">
                {/* Garis Vertikal Penanda Progres (Desktop) */}
                <div
                  id="step-indicator-bar"
                  className="hidden lg:block"
                  aria-hidden="true"
                >
                  <div
                    id="step-indicator"
                    style={{
                      transform: `translateY(${indicatorTop}px)`,
                    }}
                  ></div>
                </div>

                {/* Tablist Langkah: Horizontal Scroll di HP, Vertikal di Desktop */}
                <div
                  role="tablist"
                  aria-label="Langkah cara belajar"
                  className="flex gap-6 overflow-x-auto pb-4 lg:flex-col lg:gap-8 lg:overflow-visible lg:pb-0 lg:pl-6 scrollbar-none"
                >
                  {/* LANGKAH /01 */}
                  <button
                    ref={(el) => {
                      stepBtnsRef.current[0] = el;
                    }}
                    type="button"
                    role="tab"
                    id="tab-0"
                    aria-selected={activeStep === 0}
                    aria-controls="panel-0"
                    tabIndex={activeStep === 0 ? 0 : -1}
                    className="step-btn group text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1169dc] focus-visible:rounded-lg"
                    onClick={() => switchStep(0, true)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                        e.preventDefault();
                        switchStep(1, true);
                        stepBtnsRef.current[1]?.focus();
                      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        switchStep(2, true);
                        stepBtnsRef.current[2]?.focus();
                      }
                    }}
                  >
                    <div className="flex items-baseline gap-3">
                      <span
                        className={`step-num text-xs font-bold tracking-widest transition-colors duration-300 ${
                          activeStep === 0
                            ? "text-[#06192f]"
                            : "text-[#77899c]/60"
                        }`}
                      >
                        /01
                      </span>
                      <span
                        className={`step-title text-2xl tracking-tight sm:text-3xl transition-colors duration-300 ${
                          activeStep === 0
                            ? "font-normal text-[#06192f]"
                            : "font-light text-[#77899c]/60"
                        }`}
                      >
                        Rencanakan
                      </span>
                    </div>
                    <div
                      className={`step-desc-wrap overflow-hidden transition-all duration-400 ease-out ${
                        activeStep === 0
                          ? "max-h-24 opacity-100 mt-2.5"
                          : "max-h-0 opacity-0 mt-0"
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-[#77899c] pl-9">
                        Isi tanggal ujianmu, pilih regio target, dan biarkan
                        sistem membagi beban materi jadi sasaran harian.
                      </p>
                    </div>
                  </button>

                  {/* LANGKAH /02 */}
                  <button
                    ref={(el) => {
                      stepBtnsRef.current[1] = el;
                    }}
                    type="button"
                    role="tab"
                    id="tab-1"
                    aria-selected={activeStep === 1}
                    aria-controls="panel-1"
                    tabIndex={activeStep === 1 ? 0 : -1}
                    className="step-btn group text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1169dc] focus-visible:rounded-lg"
                    onClick={() => switchStep(1, true)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                        e.preventDefault();
                        switchStep(2, true);
                        stepBtnsRef.current[2]?.focus();
                      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        switchStep(0, true);
                        stepBtnsRef.current[0]?.focus();
                      }
                    }}
                  >
                    <div className="flex items-baseline gap-3">
                      <span
                        className={`step-num text-xs font-bold tracking-widest transition-colors duration-300 ${
                          activeStep === 1
                            ? "text-[#06192f]"
                            : "text-[#77899c]/60"
                        }`}
                      >
                        /02
                      </span>
                      <span
                        className={`step-title text-2xl tracking-tight sm:text-3xl transition-colors duration-300 ${
                          activeStep === 1
                            ? "font-normal text-[#06192f]"
                            : "font-light text-[#77899c]/60"
                        }`}
                      >
                        Latihan di 3D
                      </span>
                    </div>
                    <div
                      className={`step-desc-wrap overflow-hidden transition-all duration-400 ease-out ${
                        activeStep === 1
                          ? "max-h-24 opacity-100 mt-2.5"
                          : "max-h-0 opacity-0 mt-0"
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-[#77899c] pl-9">
                        Klik struktur yang disorot langsung pada model atau
                        sebutkan namanya, kamu langsung dapat umpan balik.
                      </p>
                    </div>
                  </button>

                  {/* LANGKAH /03 */}
                  <button
                    ref={(el) => {
                      stepBtnsRef.current[2] = el;
                    }}
                    type="button"
                    role="tab"
                    id="tab-2"
                    aria-selected={activeStep === 2}
                    aria-controls="panel-2"
                    tabIndex={activeStep === 2 ? 0 : -1}
                    className="step-btn group text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1169dc] focus-visible:rounded-lg"
                    onClick={() => switchStep(2, true)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                        e.preventDefault();
                        switchStep(0, true);
                        stepBtnsRef.current[0]?.focus();
                      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                        e.preventDefault();
                        switchStep(1, true);
                        stepBtnsRef.current[1]?.focus();
                      }
                    }}
                  >
                    <div className="flex items-baseline gap-3">
                      <span
                        className={`step-num text-xs font-bold tracking-widest transition-colors duration-300 ${
                          activeStep === 2
                            ? "text-[#06192f]"
                            : "text-[#77899c]/60"
                        }`}
                      >
                        /03
                      </span>
                      <span
                        className={`step-title text-2xl tracking-tight sm:text-3xl transition-colors duration-300 ${
                          activeStep === 2
                            ? "font-normal text-[#06192f]"
                            : "font-light text-[#77899c]/60"
                        }`}
                      >
                        Diulang otomatis
                      </span>
                    </div>
                    <div
                      className={`step-desc-wrap overflow-hidden transition-all duration-400 ease-out ${
                        activeStep === 2
                          ? "max-h-24 opacity-100 mt-2.5"
                          : "max-h-0 opacity-0 mt-0"
                      }`}
                    >
                      <p className="text-sm leading-relaxed text-[#77899c] pl-9">
                        Yang salah muncul lebih cepat, sedangkan bagian yang
                        sudah kamu kuasai makin jarang diulang.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tombol Pill Navy & Tautan Teks di Bawah Daftar */}
              <div className="mt-10 flex flex-wrap items-center gap-5 sm:mt-12">
                <Link
                  href="/latihan"
                  className="inline-flex items-center justify-center rounded-full bg-[#06192f] px-7 py-3.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#0c2849] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1169dc] focus-visible:ring-offset-2"
                >
                  Coba latihan 3D
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
                <Link
                  href="/beranda"
                  className="group inline-flex items-center text-sm font-medium text-[#06192f] transition-colors hover:text-[#1169dc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1169dc] focus-visible:rounded"
                >
                  <span>Lihat contoh dashboard</span>
                  <svg
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* KOLOM KANAN (~60%): Satu Panggung Kaca Buram Besar Bersudut Membulat */}
            <div className="lg:col-span-7">
              <div
                id="stage-viewport"
                className="relative w-full rounded-[32px] border border-white/80 bg-[#f7fbff]/75 p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(35,57,79,0.08)] backdrop-blur-2xl min-h-[480px] lg:h-[520px] flex flex-col overflow-hidden"
              >
                {/* PANGGUNG 01: Rencanakan */}
                <div
                  id="panel-0"
                  role="tabpanel"
                  aria-labelledby="tab-0"
                  className={`panel-view w-full flex-1 flex flex-col justify-between transition-opacity duration-500 ease-in-out ${
                    activeStep === 0
                      ? "relative opacity-100 pointer-events-auto"
                      : "absolute inset-0 p-6 sm:p-8 md:p-10 opacity-0 pointer-events-none"
                  }`}
                >
                  {/* Header Panggung 01 */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#06192f]/5 pb-4">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#77899c]">
                        Target Modul
                      </span>
                      <p className="text-sm font-semibold text-[#06192f]">
                        Regio: anggota gerak atas
                      </p>
                    </div>
                    <div className="rounded-full border border-[#06192f]/10 bg-white/70 px-3.5 py-1 text-xs font-medium text-[#06192f] shadow-sm">
                      Ujian Blok: 14 Des (H-28)
                    </div>
                  </div>

                  {/* Baris Hari Horizontal (Sen-Min) dengan Target Harian */}
                  <div className="my-auto py-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#77899c] mb-3">
                      Jadwal Belajar Pekan Ini
                    </div>
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 text-center">
                      <div className="flex flex-col justify-between rounded-2xl border border-white/90 bg-white/50 p-2 sm:p-3 transition">
                        <span className="text-[11px] font-medium text-[#77899c]">
                          Sen
                        </span>
                        <span className="my-1.5 text-sm sm:text-base font-semibold text-[#06192f]">
                          18
                        </span>
                        <span className="rounded-md bg-[#06192f]/5 py-0.5 text-[10px] font-medium text-[#77899c]">
                          16 str
                        </span>
                      </div>

                      <div className="flex flex-col justify-between rounded-2xl border border-white/90 bg-white/50 p-2 sm:p-3 transition">
                        <span className="text-[11px] font-medium text-[#77899c]">
                          Sel
                        </span>
                        <span className="my-1.5 text-sm sm:text-base font-semibold text-[#06192f]">
                          19
                        </span>
                        <span className="rounded-md bg-[#06192f]/5 py-0.5 text-[10px] font-medium text-[#77899c]">
                          18 str
                        </span>
                      </div>

                      <div className="flex flex-col justify-between rounded-2xl border border-white/90 bg-white/50 p-2 sm:p-3 transition">
                        <span className="text-[11px] font-medium text-[#77899c]">
                          Rab
                        </span>
                        <span className="my-1.5 text-sm sm:text-base font-semibold text-[#06192f]">
                          20
                        </span>
                        <span className="rounded-md bg-[#06192f]/5 py-0.5 text-[10px] font-medium text-[#77899c]">
                          18 str
                        </span>
                      </div>

                      {/* Hari Ini */}
                      <div className="relative flex flex-col justify-between rounded-2xl border border-[#06192f] bg-[#06192f] p-2 sm:p-3 text-white shadow-md ring-2 ring-[#06192f]/10">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
                          Hari ini
                        </span>
                        <span className="my-1 text-base sm:text-lg font-bold text-white">
                          Kam 21
                        </span>
                        <span className="rounded-md bg-white/20 py-0.5 text-[10px] font-semibold text-white">
                          20 str
                        </span>
                      </div>

                      <div className="flex flex-col justify-between rounded-2xl border border-white/90 bg-white/50 p-2 sm:p-3 transition">
                        <span className="text-[11px] font-medium text-[#77899c]">
                          Jum
                        </span>
                        <span className="my-1.5 text-sm sm:text-base font-semibold text-[#06192f]">
                          22
                        </span>
                        <span className="rounded-md bg-[#06192f]/5 py-0.5 text-[10px] font-medium text-[#77899c]">
                          16 str
                        </span>
                      </div>

                      <div className="flex flex-col justify-between rounded-2xl border border-white/90 bg-white/50 p-2 sm:p-3 transition">
                        <span className="text-[11px] font-medium text-[#77899c]">
                          Sab
                        </span>
                        <span className="my-1.5 text-sm sm:text-base font-semibold text-[#06192f]">
                          23
                        </span>
                        <span className="rounded-md bg-[#06192f]/5 py-0.5 text-[10px] font-medium text-[#77899c]">
                          Kuis
                        </span>
                      </div>

                      <div className="flex flex-col justify-between rounded-2xl border border-white/90 bg-white/50 p-2 sm:p-3 transition">
                        <span className="text-[11px] font-medium text-[#77899c]">
                          Min
                        </span>
                        <span className="my-1.5 text-sm sm:text-base font-semibold text-[#06192f]">
                          24
                        </span>
                        <span className="rounded-md bg-[#06192f]/5 py-0.5 text-[10px] font-medium text-[#77899c]">
                          Ulang
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Panggung 01 */}
                  <div className="rounded-2xl border border-white/90 bg-white/60 p-3.5 text-xs text-[#77899c] flex items-center justify-between">
                    <span>
                      Topik aktif hari ini:{" "}
                      <strong>Osteologi humerus &amp; articulatio cubiti</strong>
                    </span>
                    <span className="font-medium text-[#06192f]">
                      Target: 20 struktur
                    </span>
                  </div>
                </div>

                {/* PANGGUNG 02: Latihan di 3D */}
                <div
                  id="panel-1"
                  role="tabpanel"
                  aria-labelledby="tab-1"
                  className={`panel-view w-full flex-1 flex flex-col justify-between transition-opacity duration-500 ease-in-out ${
                    activeStep === 1
                      ? "relative opacity-100 pointer-events-auto"
                      : "absolute inset-0 p-6 sm:p-8 md:p-10 opacity-0 pointer-events-none"
                  }`}
                >
                  {/* Header Panggung 02 */}
                  <div className="flex items-center justify-between border-b border-[#06192f]/5 pb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#77899c]">
                      Identifikasi Anatomi 3D
                    </span>
                    <span className="rounded-full bg-[#1169dc]/10 px-3 py-1 text-xs font-medium text-[#1169dc]">
                      Spesimen Tulang Lengan
                    </span>
                  </div>

                  {/* Ilustrasi Tulang Lengan Besar dengan Hotspot Berdenyut */}
                  <div className="relative my-auto flex h-48 sm:h-52 w-full items-center justify-center rounded-2xl bg-[#06192f]/[0.025] px-4">
                    <svg
                      viewBox="0 0 340 120"
                      className="h-full w-auto text-[#77899c]"
                      aria-hidden="true"
                    >
                      <circle
                        cx="46"
                        cy="60"
                        r="14"
                        fill="currentColor"
                        fillOpacity="0.25"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <ellipse
                        cx="60"
                        cy="60"
                        rx="6"
                        ry="12"
                        fill="currentColor"
                        fillOpacity="0.2"
                      />
                      <path
                        d="M 64 52 C 100 48, 140 50, 180 54 L 180 66 C 140 70, 100 72, 64 68 Z"
                        fill="currentColor"
                        fillOpacity="0.32"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <path
                        d="M 180 54 C 188 48, 198 52, 198 60 C 198 68, 188 72, 180 66 Z"
                        fill="currentColor"
                        fillOpacity="0.4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <line
                        x1="202"
                        y1="46"
                        x2="202"
                        y2="74"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                        opacity="0.4"
                      />
                      <path
                        d="M 206 52 C 240 46, 280 48, 310 50"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.45"
                      />
                      <path
                        d="M 206 68 C 240 74, 280 72, 310 70"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.45"
                      />
                    </svg>

                    {/* Titik Berdenyut di Korpus Humeri */}
                    <div className="absolute left-[36%] top-[50%] -translate-x-1/2 -translate-y-1/2">
                      <span className="absolute -inset-2.5 animate-ping rounded-full bg-[#1169dc] opacity-75"></span>
                      <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-[#1169dc] shadow-lg ring-4 ring-white">
                        <span className="h-2 w-2 rounded-full bg-white"></span>
                      </span>
                    </div>

                    <span className="absolute bottom-2 right-3 text-[11px] font-medium text-[#77899c]">
                      Pandangan anterior
                    </span>
                  </div>

                  {/* Pertanyaan & Tiga Pilihan Pill */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#06192f]">
                        Struktur yang disorot?
                      </p>
                      <span
                        id="quiz-status"
                        className="text-xs font-medium text-[#77899c]"
                      >
                        {quizAnswer ? "Hasil kuis:" : "Pilih salah satu jawaban:"}
                      </span>
                    </div>

                    <div
                      id="quiz-pills"
                      className="grid grid-cols-3 gap-2.5"
                      role="group"
                      aria-label="Pilihan struktur anatomi"
                    >
                      <button
                        type="button"
                        onClick={() => setQuizAnswer("correct")}
                        className={`quiz-choice rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 ${
                          quizAnswer === "correct"
                            ? "border border-emerald-500 bg-emerald-500/15 font-bold text-emerald-800 ring-emerald-500"
                            : "border border-[#06192f]/15 bg-white/80 text-[#06192f] hover:border-[#1169dc] hover:bg-white ring-[#1169dc]"
                        }`}
                      >
                        Humerus
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuizAnswer("wrong")}
                        className={`quiz-choice rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 ${
                          quizAnswer === "wrong"
                            ? "border border-rose-400 bg-rose-500/15 font-bold text-rose-800 ring-rose-400"
                            : "border border-[#06192f]/15 bg-white/80 text-[#06192f] hover:border-[#1169dc] hover:bg-white ring-[#1169dc]"
                        }`}
                      >
                        Radius
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuizAnswer("wrong")}
                        className={`quiz-choice rounded-full px-4 py-2 text-xs font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 ${
                          quizAnswer === "wrong"
                            ? "border border-rose-400 bg-rose-500/15 font-bold text-rose-800 ring-rose-400"
                            : "border border-[#06192f]/15 bg-white/80 text-[#06192f] hover:border-[#1169dc] hover:bg-white ring-[#1169dc]"
                        }`}
                      >
                        Ulna
                      </button>
                    </div>

                    {/* Umpan Balik Singkat */}
                    <div
                      className={`min-h-[28px] rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                        quizAnswer === "correct"
                          ? "opacity-100 bg-emerald-500/10 text-emerald-800 border border-emerald-300"
                          : quizAnswer === "wrong"
                          ? "opacity-100 bg-rose-500/10 text-rose-800 border border-rose-300"
                          : "opacity-0"
                      }`}
                      aria-live="polite"
                    >
                      <span>
                        {quizAnswer === "correct"
                          ? "Benar! Korpus humeri merupakan tulang panjang utama pada lengan atas."
                          : quizAnswer === "wrong"
                          ? "Kurang tepat. Struktur ini adalah Humerus, terletak proksimal dari sendi siku."
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PANGGUNG 03: Diulang otomatis */}
                <div
                  id="panel-2"
                  role="tabpanel"
                  aria-labelledby="tab-2"
                  className={`panel-view w-full flex-1 flex flex-col justify-between transition-opacity duration-500 ease-in-out ${
                    activeStep === 2
                      ? "relative opacity-100 pointer-events-auto"
                      : "absolute inset-0 p-6 sm:p-8 md:p-10 opacity-0 pointer-events-none"
                  }`}
                >
                  {/* Header Panggung 03 */}
                  <div className="flex items-center justify-between border-b border-[#06192f]/5 pb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#77899c]">
                      Jadwal Retensi Memori
                    </span>
                    <span className="rounded-full bg-[#06192f]/5 px-3 py-1 text-xs font-medium text-[#06192f]">
                      Interval Spaced Repetition
                    </span>
                  </div>

                  {/* Garis Waktu Jeda Ulang: 1 hari -> 3 hari -> 7 hari */}
                  <div className="my-auto py-4 space-y-6">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#77899c] mb-3">
                        Siklus Pengulangan Terjadwal
                      </div>
                      <div className="relative flex items-center justify-between rounded-2xl border border-white/90 bg-white/60 p-4 shadow-sm">
                        <div
                          className="absolute left-10 right-10 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-[#06192f]/15 -z-0"
                          aria-hidden="true"
                        ></div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06192f] text-xs font-bold text-white shadow-sm">
                            1
                          </span>
                          <span className="mt-2 text-xs font-semibold text-[#06192f]">
                            1 hari
                          </span>
                          <span className="text-[10px] text-[#77899c]">
                            Review awal
                          </span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1169dc] text-xs font-bold text-white shadow-sm">
                            3
                          </span>
                          <span className="mt-2 text-xs font-semibold text-[#06192f]">
                            3 hari
                          </span>
                          <span className="text-[10px] text-[#77899c]">
                            Konsolidasi
                          </span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-sm">
                            7
                          </span>
                          <span className="mt-2 text-xs font-semibold text-[#06192f]">
                            7 hari
                          </span>
                          <span className="text-[10px] text-[#77899c]">
                            Retensi permanen
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Peta Kelemahan: Tiga Bar Horizontal (Tulang, Otot, Saraf) */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#77899c] mb-3">
                        <span>Peta Kelemahan Sistem Tubuh</span>
                        <span className="text-[11px] font-medium lowercase text-[#77899c]">
                          berdasarkan tingkat retensi
                        </span>
                      </div>

                      <div className="space-y-3 rounded-2xl border border-white/90 bg-white/60 p-4 shadow-sm">
                        {/* Bar 1: Tulang */}
                        <div>
                          <div className="flex justify-between text-xs font-medium text-[#06192f]">
                            <span>Tulang (Skeletal)</span>
                            <span className="font-bold text-[#1169dc]">
                              88%
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#06192f]/10">
                            <div
                              className="h-full rounded-full bg-[#1169dc]"
                              style={{ width: "88%" }}
                            ></div>
                          </div>
                        </div>

                        {/* Bar 2: Otot */}
                        <div>
                          <div className="flex justify-between text-xs font-medium text-[#06192f]">
                            <span>Otot (Muscular)</span>
                            <span className="font-bold text-[#06192f]">
                              64%
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#06192f]/10">
                            <div
                              className="h-full rounded-full bg-[#06192f]/70"
                              style={{ width: "64%" }}
                            ></div>
                          </div>
                        </div>

                        {/* Bar 3: Saraf */}
                        <div>
                          <div className="flex justify-between text-xs font-medium text-[#06192f]">
                            <span className="flex items-center gap-1.5">
                              <span>Saraf (Nervous)</span>
                              <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">
                                Perlu diulang
                              </span>
                            </span>
                            <span className="font-bold text-rose-600">
                              26%
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#06192f]/10">
                            <div
                              className="h-full rounded-full bg-rose-500"
                              style={{ width: "26%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Panggung 03 */}
                  <div className="text-[11px] text-[#77899c]">
                    Sistem otomatis memprioritaskan soal plexus brachialis dan
                    nervus perifer pada sesi berikutnya.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
