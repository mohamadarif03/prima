"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { mockUserProfile } from "@/lib/mock-data";

interface SidebarProps {
  desktopOpen: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavMenuItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
}

const mainNavItems: NavMenuItem[] = [
  {
    name: "Beranda",
    href: "/beranda",
    icon: "bi bi-speedometer2",
  },
  {
    name: "Anatomi 3D",
    href: "/latihan",
    icon: "bi bi-box-seam",
    badge: "3D",
    badgeColor: "bg-[#0d6efd]",
  },
  {
    name: "Rencana Belajar",
    href: "/perencana",
    icon: "bi bi-calendar-event",
  },
  {
    name: "Materi",
    href: "/materi",
    icon: "bi bi-file-earmark-medical",
    badge: "AI",
    badgeColor: "bg-[#0d6efd]",
  },
  {
    name: "Latihan Soal",
    href: "/latihan-materials",
    icon: "bi bi-ui-checks",
    badge: "AI",
    badgeColor: "bg-[#0d6efd]",
  },
  {
    name: "Flashcard",
    href: "/flashcard",
    icon: "bi bi-card-heading",
    badge: "AI",
    badgeColor: "bg-[#16a34a]",
  },
  {
    name: "Peta Kelemahan",
    href: "/kelemahan",
    icon: "bi bi-graph-up",
    badge: "Adaptif",
    badgeColor: "bg-[#cc7a00]",
  },
];

const accountNavItems: NavMenuItem[] = [
  {
    name: "Pengaturan",
    href: "/pengaturan",
    icon: "bi bi-gear",
  },
  {
    name: "Ulangi Onboarding",
    href: "/onboarding",
    icon: "bi bi-magic",
    badge: "Wizard",
    badgeColor: "bg-[#198754]",
  },
  {
    name: "Masuk / Keluar",
    href: "/masuk",
    icon: "bi bi-box-arrow-in-right",
    badge: "Auth",
    badgeColor: "bg-[#475569]",
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  desktopOpen,
  mobileOpen,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const sidebarContent = (
    <>
      <nav className="flex flex-col">
        {/* FITUR MEDIS SECTION */}
        <div className="px-6 pt-2 pb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#475569]">
          MENU PRIMA
        </div>

        {mainNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/materi" && pathname.startsWith("/materi")) ||
            (item.href === "/latihan-materials" && pathname.startsWith("/latihan-materials")) ||
            (item.href === "/flashcard" && pathname.startsWith("/flashcard"));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                <i className={`${item.icon} nav-icon`}></i>
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`${
                    item.badgeColor || "bg-[#0d6efd]"
                  } text-white text-[10.5px] font-semibold px-2 py-0.5 rounded-full leading-tight`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* AKUN SECTION */}
        <div className="px-6 pt-5 pb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#475569]">
          PENGATURAN
        </div>

        {accountNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                <i className={`${item.icon} nav-icon`}></i>
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Streak Mini Box in Sidebar Footer */}
      <div className="px-4 pt-4 border-t border-[#f1f5f9]">
        <div className="p-3 bg-[#f8f9fa] border border-[#e2e8f0] rounded-[6px] flex items-center gap-3">
          <div className="w-[30px] h-[30px] rounded-[6px] bg-[#fff3cd] border border-[#ffeeba] text-[#856404] flex items-center justify-center font-bold text-[14px]">
            🔥
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-bold text-[#1e293b]">
              {mockUserProfile.streakDays} Hari Beruntun
            </div>
            <div className="text-[10.5px] text-[#64748b] truncate">
              Target ujian 17 hari lagi
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (Matches template exactly with zero gap) */}
      <aside
        className={`hidden lg:flex flex-col justify-between bg-white border-r border-[#e5e7eb] select-none pt-3 pb-8 flex-shrink-0 transition-all duration-300 ease-in-out ${
          desktopOpen
            ? "w-[230px] opacity-100"
            : "!w-0 !p-0 !border-0 opacity-0 overflow-hidden"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Smooth animated slide-over with backdrop) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileOpen
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none"
        }`}
      >
        {/* Animated backdrop */}
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onCloseMobile}
        />

        {/* Animated drawer panel */}
        <div
          className={`relative z-10 h-full w-[250px] max-w-[85vw] transform transition-transform duration-300 ease-in-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <aside className="w-full h-full bg-white border-r border-[#e5e7eb] select-none pt-4 pb-8 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div className="px-6 pb-3 border-b border-[#f1f5f9] flex items-center justify-between">
              <Link href="/beranda" onClick={onCloseMobile} className="flex items-center no-underline">
                <Image
                  src="/logo-horizontal.png"
                  alt="PRIMA"
                  width={130}
                  height={40}
                  className="h-[34px] w-auto object-contain"
                />
              </Link>
              <button
                onClick={onCloseMobile}
                className="text-[#64748b] hover:text-[#0f172a] p-1 rounded"
              >
                <i className="bi bi-x-lg text-[16px]"></i>
              </button>
            </div>
            <div className="flex-1 pt-2 flex flex-col justify-between">
              {sidebarContent}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};
