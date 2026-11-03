"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-[#1e293b]">
      {/* Top Navbar matching template */}
      <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Body Wrapper */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 px-6 pt-6 pb-8 max-w-[1600px] w-full mx-auto">
            {children}
          </main>

          {/* Footer matching template */}
          <footer className="mt-auto border-t border-[#e2e8f0] bg-[#f8f9fa] px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[12.5px] text-[#475569]">
            <div>© 2026 PRIMA • Platform Review Interaktif Medis Adaptif</div>
            <div className="mt-1 sm:mt-0">
              Alat bantu belajar mandiri mahasiswa kedokteran preklinik · Bukan alat diagnosis klinis
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
