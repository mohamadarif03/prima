"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockUserProfile } from "@/lib/mock-data";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <header className="h-[60px] bg-white border-b border-[#e5e7eb] flex items-center justify-between px-4 sticky top-0 z-30">
      {/* Left: Brand & Hamburger */}
      <div className="flex items-center">
        <div className="w-[214px] flex items-center justify-between pr-3">
          <Link href="/beranda" className="flex items-center gap-2.5 no-underline">
            {/* Blue 'P' Logo Box */}
            <div className="w-[32px] h-[32px] rounded-[7px] bg-[#2563eb] flex items-center justify-center text-white font-bold text-[19px] tracking-tight shadow-sm">
              P
            </div>
            <span className="font-bold text-[18px] text-[#1e293b] tracking-tight">PRIMA</span>
          </Link>
          <button
            onClick={onToggleSidebar}
            className="text-[#475569] hover:text-[#0f172a] p-1 rounded transition"
            aria-label="Toggle Sidebar"
          >
            <i className="bi bi-list text-[20px]"></i>
          </button>
        </div>
      </div>

      {/* Center: Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-[385px] mx-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Cari materi anatomi... (Ctrl+K)"
            className="w-full h-[36px] bg-[#f1f5f9] text-[13px] text-[#334155] placeholder-[#64748b] pl-3.5 pr-9 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#cbd5e1]"
          />
          <i className="bi bi-search absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] text-[14px]"></i>
        </div>
      </div>

      {/* Right: Icons & Profile */}
      <div className="flex items-center gap-4 pr-1">
        {/* Sun Icon */}
        <button
          className="text-[#334155] hover:text-[#0f172a] flex items-center justify-center"
          title="Toggle Theme"
        >
          <i className="bi bi-sun-fill text-[15px]"></i>
        </button>

        {/* Fullscreen Icon */}
        <button
          className="text-[#334155] hover:text-[#0f172a] flex items-center justify-center"
          title="Fullscreen"
        >
          <i className="bi bi-arrows-fullscreen text-[13.5px]"></i>
        </button>

        {/* Notification Bell with Badge 3 */}
        <div className="relative">
          <button
            onClick={() => setShowNotification(!showNotification)}
            className="relative text-[#334155] hover:text-[#0f172a] flex items-center justify-center"
            title="Notifikasi Belajar"
          >
            <i className="bi bi-bell text-[15.5px]"></i>
            <span className="absolute -top-2 -right-2 bg-[#dc2626] text-white text-[9.5px] font-bold w-[15px] h-[15px] rounded-full flex items-center justify-center leading-none">
              3
            </span>
          </button>

          {/* Notification Dropdown */}
          {showNotification && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowNotification(false)}
              />
              <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-white border border-[#e2e8f0] rounded-[8px] shadow-lg z-40 p-3 text-xs">
                <div className="font-bold text-[#1e293b] pb-2 border-b border-[#f1f5f9] flex justify-between items-center">
                  <span>Notifikasi Belajar</span>
                  <span className="badge-completed">3 Baru</span>
                </div>
                <div className="divide-y divide-[#f1f5f9] mt-1">
                  <div className="py-2">
                    <p className="font-semibold text-[#1e293b]">12 Item Jatuh Tempo</p>
                    <p className="text-[#64748b] text-[11px]">Plexus brachialis perlu repetisi hari ini.</p>
                  </div>
                  <div className="py-2">
                    <p className="font-semibold text-[#1e293b]">Rekomendasi Baru</p>
                    <p className="text-[#64748b] text-[11px]">Latihan 3D Rotator cuff telah dijadwalkan.</p>
                  </div>
                  <div className="py-2">
                    <p className="font-semibold text-[#1e293b]">Streak 5 Hari 🔥</p>
                    <p className="text-[#64748b] text-[11px]">Disiplin belajar kamu meningkat!</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-[24px] w-[1px] bg-[#e2e8f0] mx-0.5"></div>

        {/* User Profile */}
        <button className="flex items-center gap-2 text-left">
          <div className="w-[26px] h-[26px] rounded-full bg-[#64748b] text-white flex items-center justify-center overflow-hidden">
            <i className="bi bi-person-circle text-[26px] leading-none text-[#64748b] bg-white"></i>
          </div>
          <span className="text-[13px] font-semibold text-[#1e293b] hidden sm:inline-block">
            {mockUserProfile.name}
          </span>
          <i className="bi bi-chevron-down text-[11px] text-[#64748b] ml-0.5"></i>
        </button>
      </div>
    </header>
  );
};
