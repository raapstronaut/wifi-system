"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPb } from "@/lib/pb";

export default function TrafficPage() {
  const router = useRouter();

  useEffect(() => {
    const pb = getPb();
    if (!pb.authStore.isValid) {
      router.push("/login");
      return;
    }
    const role = pb.authStore.model?.role;
    if (role !== "ADMIN") {
      router.push("/customers");
    }
  }, [router]);

  return (
    <div style={{ maxWidth: 720, margin: "20px auto", padding: 12 }}>
      <h2>Traffic (Admin)</h2>
      <p>Halaman khusus admin. Nanti bisa isi statistik pemasangan per hari/bulan, teknisi paling aktif, dll.</p>
    </div>
  );
}