"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white transition-colors">
      <div className="flex flex-1">
        {/* Responsive Desktop & Mobile Sidebar */}
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
          <Topbar onOpenMobileMenu={() => setMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

          {/* PRIMA Minimal Medical Footer */}
          <footer className="mt-auto border-t border-slate-200/80 bg-white/50 px-6 py-4 text-center sm:text-left text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>
                © 2026 <strong>PRIMA</strong> • Platform Review Interaktif Medis Adaptif
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Alat bantu belajar mandiri preklinik kedokteran • Tidak ditujukan untuk diagnosis klinis
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
