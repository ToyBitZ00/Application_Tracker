"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ============================================================
// MOCK DATA
// ============================================================

const weeklyApplications = [
  { week: "Week 1", applications: 12 },
  { week: "Week 2", applications: 19 },
  { week: "Week 3", applications: 8 },
  { week: "Week 4", applications: 24 },
  { week: "Week 5", applications: 15 },
  { week: "Week 6", applications: 30 },
];

const statusDistribution = [
  { name: "Applied", value: 45 },
  { name: "Screening", value: 20 },
  { name: "Interview", value: 15 },
  { name: "Offer", value: 5 },
  { name: "Rejected", value: 25 },
];

// ============================================================
// UNIFIED DESIGN SYSTEM
// ============================================================

const THEME = {
  ink: "#0F172A",
  paper: "#F8F7F4",
  coral: "#FF6B4A",
  offer: "#2D9C6F",
  slate: "#94A3B8",
  hairline: "#E2E4E8",
  white: "#FFFFFF",
};

// Semantic status colors.
// These are intentionally limited to the established palette.
const STATUS_COLORS = [
  THEME.slate, // Applied
  "#64748B",   // Screening — secondary neutral
  THEME.ink,   // Interview
  THEME.offer, // Offer
  THEME.coral, // Rejected
];

// ============================================================
// ICONS
// ============================================================

const Icon = ({
  name,
  className = "w-5 h-5",
}: {
  name: string;
  className?: string;
}) => {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<string, React.ReactNode> = {
    activity: (
      <polyline
        points="22 12 18 12 15 21 9 3 6 12 2 12"
        {...common}
      />
    ),

    target: (
      <>
        <circle cx="12" cy="12" r="10" {...common} />
        <circle cx="12" cy="12" r="6" {...common} />
        <circle cx="12" cy="12" r="2" {...common} />
      </>
    ),

    clock: (
      <>
        <circle cx="12" cy="12" r="10" {...common} />
        <polyline points="12 6 12 12 16 14" {...common} />
      </>
    ),

    trendingUp: (
      <>
        <polyline
          points="23 6 13.5 15.5 8.5 10.5 1 18"
          {...common}
        />
        <polyline points="17 6 23 6 23 12" {...common} />
      </>
    ),

    barChart: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" {...common} />
        <line x1="12" y1="20" x2="12" y2="4" {...common} />
        <line x1="6" y1="20" x2="6" y2="14" {...common} />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

// ============================================================
// REUSABLE KPI CARD
// ============================================================

function MetricCard({
  label,
  value,
  description,
  icon,
  change,
}: {
  label: string;
  value: string;
  description: string;
  icon: string;
  change?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E4E8] bg-white p-6 shadow-sm transition-shadow hover:shadow-[0_8px_25px_rgba(15,23,42,0.05)]">

      <div className="flex items-center justify-between gap-4">

        <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
          {label}
        </span>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E2E4E8] bg-[#F8F7F4] text-[#0F172A]">
          <Icon name={icon} className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 flex items-end gap-3">

        <h3 className="text-4xl font-extrabold tracking-tight text-[#0F172A]">
          {value}
        </h3>

        {change && (
          <span className="mb-1.5 flex items-center gap-1 rounded-md bg-[#2D9C6F]/10 px-2 py-0.5 text-[12px] font-bold text-[#2D9C6F]">
            <Icon name="trendingUp" className="h-3 w-3" />
            {change}
          </span>
        )}
      </div>

      <p className="mt-3 text-[12px] font-medium leading-5 text-[#94A3B8]">
        {description}
      </p>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function ReportsAnalyticsPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F4] px-4 pb-32 font-sans text-[#0F172A] sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* ======================================================
            STICKY HEADER
        ======================================================= */}

        <div className="sticky top-0 z-40 bg-[#F8F7F4] pb-6 pt-5">

          <header className="overflow-hidden rounded-2xl border border-[#E2E4E8] bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

            <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

              <div className="flex items-center gap-4">

                {/* Page Icon */}
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0F172A] text-[#F8F7F4] sm:flex">
                  <Icon name="barChart" className="h-6 w-6" />
                </div>

                <div>

                  <div className="mb-1 flex items-center gap-2">

                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#94A3B8]">
                      Dashboard
                    </span>

                    <span className="h-1 w-1 rounded-full bg-[#94A3B8]" />

                    <span className="text-[10px] font-semibold text-[#94A3B8]">
                      Overview
                    </span>
                  </div>

                  <h1 className="text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">
                    Reports & Analytics
                  </h1>

                  <p className="mt-1 hidden text-[13px] font-medium text-[#94A3B8] sm:block">
                    Monitor your application momentum and pipeline conversion.
                  </p>

                </div>
              </div>
            </div>

            {/* Consistent accent line */}
            <div className="h-[3px] bg-gradient-to-r from-[#0F172A] to-[#E2E4E8]" />

          </header>
        </div>

        {/* ======================================================
            KPI SUMMARY
        ======================================================= */}

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">

          <MetricCard
            label="Response Rate"
            value="42.5%"
            change="+4.2%"
            description="Of total applications received a reply."
            icon="activity"
          />

          <MetricCard
            label="Interview Conversion"
            value="18.0%"
            change="+2.1%"
            description="Converted from applied to interview."
            icon="target"
          />

          <MetricCard
            label="Avg Time-to-Response"
            value="8.4"
            description="Average wait time for initial contact."
            icon="clock"
          />

        </section>

        {/* ======================================================
            CHARTS
        ======================================================= */}

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">

          {/* ====================================================
              APPLICATION MOMENTUM
          ===================================================== */}

          <div className="rounded-2xl border border-[#E2E4E8] bg-white p-5 shadow-sm sm:p-7 lg:col-span-8">

            <div className="mb-8">

              <h2 className="text-[16px] font-bold tracking-tight text-[#0F172A]">
                Application Momentum
              </h2>

              <p className="mt-1 text-[13px] leading-5 text-[#94A3B8]">
                Number of applications submitted per week.
              </p>

            </div>

            <div className="h-[320px] w-full">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart
                  data={weeklyApplications}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={THEME.hairline}
                  />

                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: THEME.slate,
                      fontWeight: 500,
                    }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: THEME.slate,
                      fontWeight: 500,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: THEME.paper,
                    }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: `1px solid ${THEME.hairline}`,
                      boxShadow:
                        "0 10px 25px rgba(15,23,42,0.05)",
                      fontWeight: "bold",
                      color: THEME.ink,
                    }}
                  />

                  <Bar
                    dataKey="applications"
                    fill={THEME.ink}
                    radius={[6, 6, 0, 0]}
                    barSize={45}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>
          </div>

          {/* ====================================================
              PIPELINE STATUS
          ===================================================== */}

          <div className="flex flex-col rounded-2xl border border-[#E2E4E8] bg-white p-5 shadow-sm sm:p-7 lg:col-span-4">

            <div className="mb-4">

              <h2 className="text-[16px] font-bold tracking-tight text-[#0F172A]">
                Pipeline Status
              </h2>

              <p className="mt-1 text-[13px] leading-5 text-[#94A3B8]">
                Current distribution of applications.
              </p>

            </div>

            <div className="min-h-[320px] w-full flex-1">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >

                    {statusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          STATUS_COLORS[
                            index % STATUS_COLORS.length
                          ]
                        }
                      />
                    ))}

                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: `1px solid ${THEME.hairline}`,
                      boxShadow:
                        "0 10px 25px rgba(15,23,42,0.05)",
                      fontWeight: "bold",
                      color: THEME.ink,
                    }}
                    itemStyle={{
                      fontWeight: "bold",
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={60}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="ml-1 text-[13px] font-bold text-[#0F172A]">
                        {value}
                      </span>
                    )}
                  />

                </PieChart>

              </ResponsiveContainer>

            </div>
          </div>

        </section>
      </div>
    </main>
  );
}