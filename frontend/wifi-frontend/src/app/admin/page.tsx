"use client";

import AdminGuard from "@/components/auth/AdminGuard";

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="text-3xl font-semibold mt-2">{value}</div>
          <div className="text-sm text-slate-500 mt-2">{subtitle}</div>
        </div>
        <div className="h-10 w-10 rounded-xl bg-indigo-100" />
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <>
      <AdminGuard />

      <section className="bg-indigo-600 text-white px-4 md:px-8 py-10">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="text-white/80 mt-2">
          Halaman ini hanya untuk ADMIN (PocketBase auth).
        </p>
      </section>

      <main className="px-4 md:px-8 -mt-10 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Customers" value="18" subtitle="2 New" />
          <StatCard title="Invoices" value="132" subtitle="28 Paid" />
          <StatCard title="Packages" value="12" subtitle="1 New" />
          <StatCard title="Uptime" value="99.2%" subtitle="This month" />
        </div>

        <div className="mt-6 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 font-semibold">Aktivitas Terbaru</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-5 py-3">Nama</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Tanggal</th>
                  <th className="text-left px-5 py-3">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-5 py-4">Rafi</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                      Paid
                    </span>
                  </td>
                  <td className="px-5 py-4">2026-02-21</td>
                  <td className="px-5 py-4">Pembayaran masuk</td>
                </tr>
                <tr>
                  <td className="px-5 py-4">Budi</td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-xs">
                      Due
                    </span>
                  </td>
                  <td className="px-5 py-4">2026-02-20</td>
                  <td className="px-5 py-4">Perlu follow up</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}