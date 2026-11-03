"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar automatically on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileOpen((prev) => !prev);
    } else {
      setDesktopOpen((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-[#1e293b]">
      {/* Top Navbar matching template */}
      <Topbar onToggleSidebar={handleToggleSidebar} />

      {/* Main Body Wrapper */}
      <div className="flex flex-1">
        {/* Persistent Left Sidebar */}
        <Sidebar
          desktopOpen={desktopOpen}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 px-4 sm:px-6 pt-6 pb-8 max-w-[1600px] w-full mx-auto">
            {children}
          </main>

          {/* Footer matching template */}
          <footer className="mt-auto border-t border-[#e2e8f0] bg-[#f8f9fa] px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[12.5px] text-[#475569]">
            <div>© 2026 PRIMA • Platform Review Interaktif Medis Adaptif</div>
            <div className="mt-1 sm:mt-0 text-center sm:text-right">
              Alat bantu belajar mandiri mahasiswa kedokteran preklinik · Bukan alat diagnosis klinis
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
