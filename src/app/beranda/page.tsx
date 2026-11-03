"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ChartJS from "chart.js/auto";

export default function BerandaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePeriod, setActivePeriod] = useState<"7D" | "30D" | "90D" | "1Y">("7D");

  const revenueChartRef = useRef<HTMLCanvasElement | null>(null);
  const userGrowthChartRef = useRef<HTMLCanvasElement | null>(null);
  const orderStatusChartRef = useRef<HTMLCanvasElement | null>(null);

  // Revenue Chart
  useEffect(() => {
    if (!revenueChartRef.current) return;
    const ctx = revenueChartRef.current.getContext("2d");
    if (!ctx) return;

    const blueGrad = ctx.createLinearGradient(0, 0, 0, 280);
    blueGrad.addColorStop(0, "rgba(37, 99, 235, 0.08)");
    blueGrad.addColorStop(1, "rgba(37, 99, 235, 0.01)");

    const tealGrad = ctx.createLinearGradient(0, 0, 0, 280);
    tealGrad.addColorStop(0, "rgba(13, 148, 136, 0.08)");
    tealGrad.addColorStop(1, "rgba(13, 148, 136, 0.01)");

    const chartInstance = new ChartJS(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Revenue",
            data: [45000, 44400, 17200, 16200, 23400, 18000, 49200, 30500, 33800, 31000, 28500, 15800],
            borderColor: "#1d6ce0",
            backgroundColor: blueGrad,
            borderWidth: 1.8,
            fill: true,
            tension: 0.42,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
          {
            label: "Profit",
            data: [20400, 13200, 13800, 6800, 11800, 14600, 21600, 10000, 16200, 17400, 6900, 18800],
            borderColor: "#008a7b",
            backgroundColor: tealGrad,
            borderWidth: 1.8,
            fill: true,
            tension: 0.42,
            pointRadius: 0,
            pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            border: {
              color: "#e2e8f0",
            },
            ticks: {
              font: { size: 11.5, family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
              color: "#64748b",
              padding: 6,
            },
          },
          y: {
            min: 0,
            max: 52000,
            border: {
              display: false,
              dash: [3, 3],
            },
            grid: {
              color: "#eef2f6",
              tickBorderDash: [3, 3],
            },
            ticks: {
              stepSize: 10000,
              font: { size: 11.5, family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
              color: "#64748b",
              padding: 10,
              callback: function (value) {
                if (value === 0) return "$0";
                return "$" + (Number(value) / 1000).toFixed(3);
              },
            },
          },
        },
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, [activePeriod]);

  // User Growth Chart
  useEffect(() => {
    if (!userGrowthChartRef.current) return;
    const ctx = userGrowthChartRef.current.getContext("2d");
    if (!ctx) return;

    const chartInstance = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: ["Day 24", "Day 25", "Day 26", "Day 27", "Day 28", "Day 29", "Day 30"],
        datasets: [
          {
            label: "New Users",
            data: [32, 75, 118, 44, 97, 51, 70],
            backgroundColor: "#3b76e1",
            borderRadius: {
              topLeft: 6,
              topRight: 6,
              bottomLeft: 4,
              bottomRight: 4,
            },
            borderSkipped: false,
            barPercentage: 0.56,
            categoryPercentage: 0.82,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: "#e2e8f0" },
            ticks: {
              font: { size: 11.5, family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
              color: "#64748b",
              padding: 6,
            },
          },
          y: {
            min: 0,
            max: 125,
            border: { display: false },
            grid: {
              color: "#f1f5f9",
            },
            ticks: {
              stepSize: 20,
              font: { size: 11.5, family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
              color: "#64748b",
              padding: 10,
            },
          },
        },
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, []);

  // Order Status Chart
  useEffect(() => {
    if (!orderStatusChartRef.current) return;
    const ctx = orderStatusChartRef.current.getContext("2d");
    if (!ctx) return;

    const chartInstance = new ChartJS(ctx, {
      type: "doughnut",
      data: {
        labels: ["Completed", "Shipped", "Pending", "Cancelled"],
        datasets: [
          {
            data: [82.5, 10.5, 5.5, 1.5],
            backgroundColor: [
              "#159647", // Green
              "#0884a6", // Teal/Blue
              "#d96b0b", // Orange
              "#d62828", // Red
            ],
            borderColor: "#ffffff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: 0,
        cutout: "60%",
        plugins: {
          legend: { display: false },
        },
      },
    });

    return () => {
      chartInstance.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-[#1e293b]">
      {/* TOP NAVBAR */}
      <header className="h-[60px] bg-white border-b border-[#e5e7eb] flex items-center justify-between px-4 sticky top-0 z-30">
        {/* Left: Brand & Hamburger */}
        <div className="flex items-center">
          <div className="w-[214px] flex items-center justify-between pr-3">
            <Link href="/beranda" className="flex items-center gap-2.5 no-underline">
              {/* Blue 'M' Logo Box */}
              <div className="w-[32px] h-[32px] rounded-[7px] bg-[#2563eb] flex items-center justify-center text-white font-bold text-[19px] tracking-tight shadow-sm">
                M
              </div>
              <span className="font-bold text-[18px] text-[#1e293b] tracking-tight">Metis</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
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
              placeholder="Search... (Ctrl+K)"
              className="w-full h-[36px] bg-[#f1f5f9] text-[13px] text-[#334155] placeholder-[#64748b] pl-3.5 pr-9 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#cbd5e1]"
            />
            <i className="bi bi-search absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] text-[14px]"></i>
          </div>
        </div>

        {/* Right: Icons & Profile */}
        <div className="flex items-center gap-4 pr-1">
          {/* Sun Icon */}
          <button className="text-[#334155] hover:text-[#0f172a] flex items-center justify-center" title="Toggle Theme">
            <i className="bi bi-sun-fill text-[15px]"></i>
          </button>

          {/* Fullscreen Icon */}
          <button className="text-[#334155] hover:text-[#0f172a] flex items-center justify-center" title="Fullscreen">
            <i className="bi bi-arrows-fullscreen text-[13.5px]"></i>
          </button>

          {/* Notification Bell with Badge 3 */}
          <button className="relative text-[#334155] hover:text-[#0f172a] flex items-center justify-center" title="Notifications">
            <i className="bi bi-bell text-[15.5px]"></i>
            <span className="absolute -top-2 -right-2 bg-[#dc2626] text-white text-[9.5px] font-bold w-[15px] h-[15px] rounded-full flex items-center justify-center leading-none">
              3
            </span>
          </button>

          {/* Divider */}
          <div className="h-[24px] w-[1px] bg-[#e2e8f0] mx-0.5"></div>

          {/* User Profile */}
          <button className="flex items-center gap-2 text-left">
            <div className="w-[26px] h-[26px] rounded-full bg-[#64748b] text-white flex items-center justify-center overflow-hidden">
              <i className="bi bi-person-circle text-[26px] leading-none text-[#64748b] bg-white"></i>
            </div>
            <span className="text-[13px] font-semibold text-[#1e293b]">John Doe</span>
            <i className="bi bi-chevron-down text-[11px] text-[#64748b] ml-0.5"></i>
          </button>
        </div>
      </header>

      {/* MAIN BODY WRAPPER */}
      <div className="flex flex-1">
        {/* LEFT SIDEBAR */}
        {sidebarOpen && (
          <aside className="w-[230px] bg-white border-r border-[#e5e7eb] flex-shrink-0 select-none pt-3 pb-8 block transition-all">
            <nav className="flex flex-col">
              {/* Dashboard (Active) */}
              <Link href="/beranda" className="nav-item active">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-speedometer2 nav-icon"></i>
                  <span>Dashboard</span>
                </div>
              </Link>

              {/* Go Pro */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-rocket-takeoff nav-icon"></i>
                  <span>Go Pro</span>
                </div>
                <span className="bg-[#dc2626] text-white text-[10.5px] font-semibold px-2 py-0.5 rounded-full leading-tight">
                  Hot
                </span>
              </a>

              {/* Analytics */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-graph-up nav-icon"></i>
                  <span>Analytics</span>
                </div>
              </a>

              {/* Users */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-people nav-icon"></i>
                  <span>Users</span>
                </div>
              </a>

              {/* Products */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-box-seam nav-icon"></i>
                  <span>Products</span>
                </div>
              </a>

              {/* Orders */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-bag-check nav-icon"></i>
                  <span>Orders</span>
                </div>
              </a>

              {/* Forms */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-ui-checks-grid nav-icon"></i>
                  <span>Forms</span>
                </div>
                <span className="bg-[#198754] text-white text-[10.5px] font-semibold px-2 py-0.5 rounded-full leading-tight">
                  New
                </span>
              </a>

              {/* Elements */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2">
                  <i className="bi bi-puzzle nav-icon"></i>
                  <span>Elements</span>
                  <span className="bg-[#0d6efd] text-white text-[10.5px] font-semibold px-2 py-0.5 rounded-full leading-tight ml-0.5">
                    New
                  </span>
                </div>
                <i className="bi bi-chevron-down text-[11px] text-[#64748b]"></i>
              </a>

              {/* Reports */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-file-earmark-text nav-icon"></i>
                  <span>Reports</span>
                </div>
              </a>

              {/* Messages */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-chat-dots nav-icon"></i>
                  <span>Messages</span>
                </div>
                <span className="bg-[#dc2626] text-white text-[10.5px] font-semibold w-[20px] h-[18px] flex items-center justify-center rounded-full leading-none">
                  3
                </span>
              </a>

              {/* Calendar */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-calendar-event nav-icon"></i>
                  <span>Calendar</span>
                </div>
              </a>

              {/* Files */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-folder nav-icon"></i>
                  <span>Files</span>
                </div>
              </a>

              {/* Pages */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-file-earmark nav-icon"></i>
                  <span>Pages</span>
                </div>
                <i className="bi bi-chevron-down text-[11px] text-[#64748b]"></i>
              </a>

              {/* ADMIN SECTION */}
              <div className="px-6 pt-5 pb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#475569]">
                ADMIN
              </div>

              {/* Settings */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-gear nav-icon"></i>
                  <span>Settings</span>
                </div>
              </a>

              {/* Security */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-shield-check nav-icon"></i>
                  <span>Security</span>
                </div>
              </a>

              {/* Help & Support */}
              <a href="#" className="nav-item">
                <div className="flex items-center gap-2.5">
                  <i className="bi bi-question-circle nav-icon"></i>
                  <span>Help & Support</span>
                </div>
              </a>
            </nav>
          </aside>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 px-6 pt-6 pb-8 max-w-[1600px] w-full mx-auto">
            {/* PAGE HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <h1 className="text-[21px] font-medium text-[#1e293b] leading-tight">Dashboard</h1>
                <p className="text-[12.5px] text-[#64748b] mt-0.5">Last 30 days · updated 5 minutes ago</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="h-[34px] px-3.5 bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[13px] font-medium rounded-[6px] flex items-center gap-1.5 shadow-sm transition">
                  <i className="bi bi-plus-lg text-[13px]"></i>
                  <span>New Item</span>
                </button>
                <button
                  className="w-[34px] h-[34px] bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#475569] rounded-[6px] flex items-center justify-center transition"
                  title="Refresh"
                >
                  <i className="bi bi-arrow-clockwise text-[14px]"></i>
                </button>
                <button
                  className="w-[34px] h-[34px] bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#475569] rounded-[6px] flex items-center justify-center transition"
                  title="Download"
                >
                  <i className="bi bi-download text-[13.5px]"></i>
                </button>
                <button
                  className="w-[34px] h-[34px] bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#475569] rounded-[6px] flex items-center justify-center transition"
                  title="Settings"
                >
                  <i className="bi bi-gear text-[13.5px]"></i>
                </button>
              </div>
            </div>

            {/* ROW 1: 4 KPI STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
              {/* Card 1: TOTAL USERS */}
              <div className="metis-card p-[18px] flex items-center gap-4">
                <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#475569] flex-shrink-0">
                  <i className="bi bi-people text-[18px]"></i>
                </div>
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">TOTAL USERS</div>
                  <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">12.430</div>
                  <div className="text-[11.5px] mt-0.5 flex items-center gap-1">
                    <span className="text-[#64748b]">↑</span>
                    <span className="text-[#198754] font-semibold">+12.5%</span>
                  </div>
                </div>
              </div>

              {/* Card 2: REVENUE */}
              <div className="metis-card p-[18px] flex items-center gap-4">
                <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#475569] flex-shrink-0">
                  <i className="bi bi-graph-up text-[17px]"></i>
                </div>
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">REVENUE</div>
                  <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">$54,320</div>
                  <div className="text-[11.5px] mt-0.5 flex items-center gap-1">
                    <span className="text-[#64748b]">↑</span>
                    <span className="text-[#198754] font-semibold">+8.2%</span>
                  </div>
                </div>
              </div>

              {/* Card 3: ORDERS */}
              <div className="metis-card p-[18px] flex items-center gap-4">
                <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#475569] flex-shrink-0">
                  <i className="bi bi-bag-check text-[17px]"></i>
                </div>
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">ORDERS</div>
                  <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">1,852</div>
                  <div className="text-[11.5px] mt-0.5 flex items-center gap-1">
                    <span className="text-[#64748b]">↓</span>
                    <span className="text-[#dc2626] font-semibold">-2.1%</span>
                  </div>
                </div>
              </div>

              {/* Card 4: AVG. RESPONSE */}
              <div className="metis-card p-[18px] flex items-center gap-4">
                <div className="w-[44px] h-[44px] rounded-[8px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#475569] flex-shrink-0">
                  <i className="bi bi-clock text-[17px]"></i>
                </div>
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-[#64748b]">AVG. RESPONSE</div>
                  <div className="text-[22px] font-bold text-[#0f172a] leading-snug mt-0.5">2.3s</div>
                  <div className="text-[11.5px] mt-0.5 flex items-center gap-1">
                    <span className="text-[#64748b]">↑</span>
                    <span className="text-[#198754] font-semibold">+5.4%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: REVENUE OVERVIEW & RECENT ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
              {/* Revenue Overview */}
              <div className="metis-card lg:col-span-8 flex flex-col">
                <div className="metis-card-header">
                  <h2 className="metis-card-title">Revenue Overview</h2>
                  <div className="btn-group-period">
                    {(["7D", "30D", "90D", "1Y"] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setActivePeriod(period)}
                        className={`btn-period ${activePeriod === period ? "active" : ""}`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-5 flex-1 flex items-center">
                  <div className="w-full h-[290px] relative">
                    <canvas ref={revenueChartRef}></canvas>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="metis-card lg:col-span-4 flex flex-col">
                <div className="metis-card-header">
                  <h2 className="metis-card-title">Recent Activity</h2>
                </div>
                <div className="px-5 py-2 flex-1 flex flex-col justify-between divide-y divide-[#f1f5f9]">
                  {/* Activity 1 */}
                  <div className="py-3.5 flex items-start gap-3">
                    <div className="w-[30px] h-[30px] rounded-[6px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#475569] flex-shrink-0 mt-0.5">
                      <i className="bi bi-person-plus text-[13px]"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-[#1e293b] leading-snug">New user registered</div>
                      <div className="text-[11.5px] text-[#64748b] mt-0.5 truncate">
                        Priya Raman · Engineering · 2 minutes ago
                      </div>
                    </div>
                  </div>

                  {/* Activity 2 */}
                  <div className="py-3.5 flex items-start gap-3">
                    <div className="w-[30px] h-[30px] rounded-[6px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#475569] flex-shrink-0 mt-0.5">
                      <i className="bi bi-bag-check text-[13px]"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-[#1e293b] leading-snug">Order #1234 completed</div>
                      <div className="text-[11.5px] text-[#64748b] mt-0.5 truncate">
                        Shipped to Rotterdam, NL · 5 minutes ago
                      </div>
                    </div>
                  </div>

                  {/* Activity 3 */}
                  <div className="py-3.5 flex items-start gap-3">
                    <div className="w-[30px] h-[30px] rounded-[6px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#475569] flex-shrink-0 mt-0.5">
                      <i className="bi bi-box-arrow-in-right text-[13px]"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-[#1e293b] leading-snug">
                        Sign-in from a new device
                      </div>
                      <div className="text-[11.5px] text-[#64748b] mt-0.5 truncate">
                        Jane Smith · Chrome on macOS · 12 minutes ...
                      </div>
                    </div>
                  </div>

                  {/* Activity 4 */}
                  <div className="py-3.5 flex items-start gap-3">
                    <div className="w-[30px] h-[30px] rounded-[6px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#475569] flex-shrink-0 mt-0.5">
                      <i className="bi bi-file-earmark-text text-[13px]"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-[#1e293b] leading-snug">
                        Monthly revenue report exported
                      </div>
                      <div className="text-[11.5px] text-[#64748b] mt-0.5 truncate">
                        CSV · 4,812 rows · 24 minutes ago
                      </div>
                    </div>
                  </div>

                  {/* Activity 5 */}
                  <div className="py-3.5 flex items-start gap-3">
                    <div className="w-[30px] h-[30px] rounded-[6px] bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center text-[#475569] flex-shrink-0 mt-0.5">
                      <i className="bi bi-currency-dollar text-[13px]"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-[#1e293b] leading-snug">
                        Payment of $2,480 received
                      </div>
                      <div className="text-[11.5px] text-[#64748b] mt-0.5 truncate">
                        Invoice INV-2098 settled · 40 minutes ago
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 3: USER GROWTH & ORDER STATUS DISTRIBUTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
              {/* User Growth */}
              <div className="metis-card lg:col-span-7 flex flex-col">
                <div className="metis-card-header">
                  <h2 className="metis-card-title">User Growth (Last 7 Days)</h2>
                </div>
                <div className="p-5 flex-1 flex items-center">
                  <div className="w-full h-[270px] relative">
                    <canvas ref={userGrowthChartRef}></canvas>
                  </div>
                </div>
              </div>

              {/* Order Status Distribution */}
              <div className="metis-card lg:col-span-5 flex flex-col">
                <div className="metis-card-header">
                  <h2 className="metis-card-title">Order Status Distribution</h2>
                </div>
                <div className="p-5 flex-1 flex items-center justify-center">
                  <div className="w-[235px] h-[235px] relative">
                    <canvas ref={orderStatusChartRef}></canvas>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 4: RECENT ORDERS & STORAGE STATUS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
              {/* Recent Orders Table */}
              <div className="metis-card lg:col-span-8 flex flex-col">
                <div className="metis-card-header">
                  <h2 className="metis-card-title">Recent Orders</h2>
                </div>
                <div className="p-5 overflow-x-auto">
                  <table className="w-full orders-table border-collapse">
                    <thead>
                      <tr>
                        <th className="w-[20%]">ORDER ID</th>
                        <th className="w-[25%]">CUSTOMER</th>
                        <th className="w-[18%]">AMOUNT</th>
                        <th className="w-[20%]">STATUS</th>
                        <th className="w-[17%]">DATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-bold text-[#0f172a]">#5773</td>
                        <td>Bob Brown</td>
                        <td>$455.54</td>
                        <td>
                          <span className="badge-completed">Completed</span>
                        </td>
                        <td>31/10/2026</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-[#0f172a]">#8762</td>
                        <td>Sarah Wilson</td>
                        <td>$451.19</td>
                        <td>
                          <span className="badge-completed">Completed</span>
                        </td>
                        <td>01/11/2026</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-[#0f172a]">#9297</td>
                        <td>John Doe</td>
                        <td>$389.32</td>
                        <td>
                          <span className="badge-shipped">Shipped</span>
                        </td>
                        <td>29/10/2026</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-[#0f172a]">#2194</td>
                        <td>Mike Johnson</td>
                        <td>$484.58</td>
                        <td>
                          <span className="badge-shipped">Shipped</span>
                        </td>
                        <td>29/10/2026</td>
                      </tr>
                      <tr>
                        <td className="font-bold text-[#0f172a]">#6024</td>
                        <td>John Doe</td>
                        <td>$366.25</td>
                        <td>
                          <span className="badge-pending">Pending</span>
                        </td>
                        <td>01/11/2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Storage Status */}
              <div className="metis-card lg:col-span-4 flex flex-col">
                <div className="metis-card-header">
                  <h2 className="metis-card-title">Storage Status</h2>
                </div>
                <div className="p-5 flex-1 flex items-center justify-center">
                  {/* SVG Circular Radial Bar (76%) */}
                  <div className="relative w-[220px] h-[220px] flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      {/* Track circle */}
                      <circle cx="60" cy="60" r="48" fill="none" stroke="#e2e8f0" strokeWidth="10.5" />
                      {/* Progress circle: 76% of (2 * pi * 48 = 301.59) = 229.2 */}
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="10.5"
                        strokeDasharray="229.2 301.59"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[12.5px] text-[#475569] font-normal">Used Space</span>
                      <span className="text-[25px] font-bold text-[#0f172a] leading-tight mt-0.5">76%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 5: SALES BY LOCATION (TREEMAP) */}
            <div className="metis-card">
              <div className="metis-card-header">
                <h2 className="metis-card-title">Sales by Location</h2>
              </div>
              <div className="p-5 relative">
                {/* Top-right floating chart hamburger button */}
                <button className="absolute top-3 right-7 z-10 w-[26px] h-[24px] bg-white border border-[#e2e8f0] rounded-[4px] shadow-sm flex items-center justify-center text-[#64748b] hover:text-[#1e293b]">
                  <i className="bi bi-list text-[14px]"></i>
                </button>

                {/* Exact Proportional Treemap Layout */}
                <div className="w-full h-[310px] flex gap-[2px] bg-white overflow-hidden">
                  {/* Col 1: United States (22.5%) */}
                  <div className="h-full" style={{ width: "22.5%" }}>
                    <div className="treemap-cell w-full h-full bg-[#5a7bd8]">
                      <span>United States</span>
                      <span>2822</span>
                    </div>
                  </div>

                  {/* Col 2: Canada & United Kingdom (19.2%) */}
                  <div className="h-full flex flex-col gap-[2px]" style={{ width: "19.2%" }}>
                    <div className="treemap-cell w-full bg-[#739ee9]" style={{ height: "59.5%" }}>
                      <span>Canada</span>
                      <span>1432</span>
                    </div>
                    <div className="treemap-cell w-full bg-[#8cb9f2]" style={{ height: "40.5%" }}>
                      <span>United Kingdom</span>
                      <span>980</span>
                    </div>
                  </div>

                  {/* Col 3: Australia & Germany (11.8%) */}
                  <div className="h-full flex flex-col gap-[2px]" style={{ width: "11.8%" }}>
                    <div className="treemap-cell w-full bg-[#92bef4]" style={{ height: "54.5%" }}>
                      <span>Australia</span>
                      <span>780</span>
                    </div>
                    <div className="treemap-cell w-full bg-[#a7ccf8]" style={{ height: "45.5%" }}>
                      <span>Germany</span>
                      <span>650</span>
                    </div>
                  </div>

                  {/* Col 4: Brazil & India (18%) */}
                  <div className="h-full flex flex-col gap-[2px]" style={{ width: "18%" }}>
                    <div className="treemap-cell w-full bg-[#b7d6fa]" style={{ height: "20.5%" }}>
                      <span>Brazil</span>
                      <span>450</span>
                    </div>
                    <div className="treemap-cell w-full bg-[#76a1ec]" style={{ height: "79.5%" }}>
                      <span>India</span>
                      <span>1800</span>
                    </div>
                  </div>

                  {/* Col 5: China, Japan, Russia (28.5%) */}
                  <div className="h-full flex flex-col gap-[2px]" style={{ width: "28.5%" }}>
                    {/* Top: China */}
                    <div className="treemap-cell w-full bg-[#6587df]" style={{ height: "60.5%" }}>
                      <span>China</span>
                      <span>2100</span>
                    </div>
                    {/* Bottom: Japan & Russia */}
                    <div className="w-full flex gap-[2px]" style={{ height: "39.5%" }}>
                      <div className="treemap-cell h-full bg-[#96c1f5]" style={{ width: "60.5%" }}>
                        <span>Japan</span>
                        <span>850</span>
                      </div>
                      <div className="treemap-cell h-full bg-[#aed1f9]" style={{ width: "39.5%" }}>
                        <span>Russia</span>
                        <span>550</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* FOOTER */}
          <footer className="mt-auto border-t border-[#e2e8f0] bg-[#f8f9fa] px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[12.5px] text-[#475569]">
            <div>© 2026 Modern Bootstrap Admin Template</div>
            <div className="mt-1 sm:mt-0">
              Built with Bootstrap 5 by{" "}
              <a href="#" className="underline text-[#334155] hover:text-[#0f172a]">
                Colorlib
              </a>{" "}
              · Distributed by{" "}
              <a href="#" className="underline text-[#334155] hover:text-[#0f172a]">
                ThemeWagon
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
