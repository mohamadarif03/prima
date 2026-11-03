"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  CalendarDays,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  Stethoscope,
  X,
} from "lucide-react";
import { mockUserProfile } from "@/lib/mock-data";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Latihan Anatomi",
    href: "/latihan",
    icon: Box,
    badge: "3D",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400",
  },
  {
    name: "Perencana Belajar",
    href: "/perencana",
    icon: CalendarDays,
  },
  {
    name: "Peta Kelemahan",
    href: "/kelemahan",
    icon: Activity,
    badge: "Adaptif",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
  },
  {
    name: "Pengaturan",
    href: "/pengaturan",
    icon: Settings,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 transition-all duration-300">
      {/* Brand & Logo Header */}
      <div>
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/80">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 overflow-hidden group"
            onClick={onCloseMobile}
          >
            {/* Logo Emblem */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs group-hover:bg-teal-700 transition">
              <Stethoscope className="h-5 w-5" />
            </div>

            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                  PRIMA
                  <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 border border-teal-200/60 dark:border-teal-800 px-1.5 py-0.5 rounded-full">
                    Preklinik
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Platform Review Medis
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Tutup Menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed && !mobileOpen ? item.name : undefined}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 font-semibold shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 hover:text-slate-900 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? "text-teal-700 dark:text-teal-300"
                      : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {(!collapsed || mobileOpen) && (
                  <div className="flex flex-1 items-center justify-between min-w-0">
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          item.badgeColor || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
        {(!collapsed || mobileOpen) ? (
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Flame className="h-4 w-4 fill-amber-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {mockUserProfile.streakDays} Hari Beruntun
                </p>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                  Disiplin belajar terjaga!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex h-10 w-10 mx-auto items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400"
            title={`${mockUserProfile.streakDays} Hari Belajar Beruntun`}
          >
            <Flame className="h-5 w-5 fill-amber-500" />
          </div>
        )}

        {/* Laptop Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="mt-3 hidden lg:flex w-full items-center justify-center py-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
          aria-label={collapsed ? "Buka Sidebar" : "Ciutkan Sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <ChevronLeft className="h-4 w-4" />
              <span>Ciutkan sidebar</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div
          className={`fixed top-0 bottom-0 left-0 z-30 transition-all duration-300 ${
            collapsed ? "w-[72px]" : "w-64"
          }`}
        >
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Slide-over Drawer Backdrop & Content */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl transition-transform">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
