"use client";

import DashboardShell from "@/components/DashboardShell";

export default function DashboardPage() {
  return (
    <DashboardShell title="ISP management">
      <div className="text-slate-600 text-sm">Dashboard</div>
      <div className="mt-3 text-slate-700">You Are logged</div>
    </DashboardShell>
  );
  
}

