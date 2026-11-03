"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mockUserProfile } from "@/lib/mock-data";

interface SidebarProps {
  open: boolean;
  onCloseMobile?: () => void;
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
    name: "Latihan Anatomi",
    href: "/latihan",
    icon: "bi bi-box-seam",
    badge: "3D",
    badgeColor: "bg-[#0d6efd]",
  },
  {
    name: "Perencana Belajar",
    href: "/perencana",
    icon: "bi bi-calendar-event",
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
];

export const Sidebar: React.FC<SidebarProps> = ({ open, onCloseMobile }) => {
  const pathname = usePathname();

  const sidebarContent = (
    <aside className="w-[230px] bg-white border-r border-[#e5e7eb] flex-shrink-0 select-none pt-3 pb-8 h-full flex flex-col justify-between">
      <nav className="flex flex-col">
        {/* FITUR MEDIS SECTION */}
        <div className="px-6 pt-2 pb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#475569]">
          MENU PRIMA
        </div>

        {mainNavItems.map((item) => {
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
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden when open is false on desktop, or toggled) */}
      <div className={`hidden lg:block ${open ? "block" : "!hidden"}`}>
        {sidebarContent}
      </div>

      {/* Mobile Sidebar (Slide-over drawer) */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 flex-1 flex max-w-[240px]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
