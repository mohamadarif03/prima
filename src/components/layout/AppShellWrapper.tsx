"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";

interface AppShellWrapperProps {
  children: React.ReactNode;
}

export function AppShellWrapper({ children }: AppShellWrapperProps) {
  const pathname = usePathname();

  // If visiting landing page (/), auth page (/masuk), or onboarding (/onboarding), don't wrap with AppShell dashboard
  if (
    pathname === "/" ||
    pathname === "/masuk" ||
    pathname.startsWith("/masuk/") ||
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/")
  ) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
