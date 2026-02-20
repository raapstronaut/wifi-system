"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getPb } from "@/lib/pb";

export default function AdminPage() {
  const router = useRouter();
  const [info, setInfo] = useState("");

  useEffect(() => {
    const pb = getPb();
    if (!pb.authStore.isValid) {
      router.push("/login");
      return;
    }
    const me: any = pb.authStore.model;
    if (me?.role !== "ADMIN") {
      router.push("/customers"); // kalau bukan admin, lempar balik
      return;
    }
  }, [router]);

  return (
    <div style={{ maxWidth: 720, margin: "20px auto", padding: 12 }}>
      <h2>Admin Panel</h2>
      <Link href="/customers">← Kembali</Link>
      <p style={{ marginTop: 10, color: "#555" }}>
        Halaman ini hanya untuk ADMIN. Nanti bisa isi fitur: kelola user, export data, dsb.
      </p>
      {info && <p style={{ color: "crimson" }}>{info}</p>}
    </div>
  );
}