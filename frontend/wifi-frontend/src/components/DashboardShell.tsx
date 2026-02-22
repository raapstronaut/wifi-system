"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getPb } from "@/lib/pb";
import { getRole, getMe } from "@/lib/auth";

type MenuItem = {
  label: string;
  href?: string;
  adminOnly?: boolean;
  section?: boolean;
};

export default function DashboardShell({
  children,
  title = "ISP management",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [ready, setReady] = useState(false);

  /** role diambil dari authStore (client-side) */
  const role = useMemo(() => getRole(), []);
  const me: any = useMemo(() => getMe(), []);

  /** Guard minimal: kalau belum login, lempar ke /login */
  useEffect(() => {
    const pb = getPb();
    if (!pb.authStore.isValid) {
      router.push("/login");
      return;
    }
    setReady(true);
  }, [router]);

  /** Menu ala gambar (bisa kamu ubah nama/href-nya) */
  const menu: MenuItem[] = [
    { label: "MENU", section: true },
    { label: "Master", href: "/dashboard/master", adminOnly: true },
    { label: "Monitoring", href: "/dashboard/monitoring" },
    { label: "Grafik", href: "grafik" },
    { label: "Costumers", href: "customers" },
    { label: "Peta", href: "map" },
    { label: "SpeedTest", href: "speedtest" },
  ];

  /** Filter menu: TEKNIS tidak melihat item adminOnly */
  const visibleMenu = menu.filter((m) => !m.adminOnly || role === "ADMIN");

  function logout() {
    const pb = getPb();
    pb.authStore.clear();
    router.push("/login");
  }

  /** Biar tidak kedip-kedip sebelum cek login selesai */
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Topbar biru */}
      <header className="h-14 bg-sky-700 text-white flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold">{title}</div>
          <button
            className="ml-2 px-2 py-1 rounded hover:bg-white/10"
            title="Menu"
            type="button"
          >
            ☰
          </button>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="hidden sm:block opacity-90">
            {me?.username || me?.email || "User"} • {role}
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20"
            type="button"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-56px)]">
          <nav className="py-3">
            {visibleMenu.map((item, idx) => {
              if (item.section) {
                return (
                  <div
                    key={idx}
                    className="px-4 pt-2 pb-1 text-xs uppercase text-slate-400"
                  >
                    {item.label}
                  </div>
                );
              }

              const active = item.href && pathname === item.href;

              return (
                <Link
                  key={idx}
                  href={item.href || "#"}
                  className={[
                    "flex items-center gap-3 px-4 py-3 text-sm",
                    active ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <span className="text-slate-500">↳</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content area */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}