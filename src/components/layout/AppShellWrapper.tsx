"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";

interface AppShellWrapperProps {
  children: React.ReactNode;
}

export function AppShellWrapper({ children }: AppShellWrapperProps) {
  const pathname = usePathname();

  // If visiting auth/landing page like /masuk, don't wrap with AppShell dashboard
  if (pathname === "/masuk" || pathname.startsWith("/masuk/")) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
