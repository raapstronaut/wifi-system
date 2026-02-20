"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getPb } from "@/lib/pb";
import { useRouter } from "next/navigation";

type Customer = {
  id: string;
  nama: string;
  no_hp: string;
  alamat?: string;
  lat: number;
  lng: number;
  teknisi: string;
  created: string;
};

function escapeFilterValue(input: string) {
  // PocketBase filter pakai string "...", jadi escape double-quote
  return input.replaceAll(`"`, `\\"`);
}

export default function CustomersPage() {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [items, setItems] = useState<Customer[]>([]);
  const [info, setInfo] = useState("");

  const [role, setRole] = useState<"ADMIN" | "TECH" | "">("");
  const [userName, setUserName] = useState<string>("");

  // bikin 1 instance pb untuk page ini
  const pb = useMemo(() => getPb(), []);

  async function load() {
    setInfo("");

    try {
      if (!pb.authStore.isValid) {
        router.push("/login");
        return;
      }

      // info user login (role & nama)
      const me: any = pb.authStore.model;
      setRole((me?.role as any) || "");
      setUserName(me?.name || me?.username || me?.email || "");

      const keyword = q.trim();
      const safe = escapeFilterValue(keyword);

      const filter = keyword ? `(nama ~ "${safe}" || no_hp ~ "${safe}")` : "";

      const res = await pb.collection("customers").getList<Customer>(1, 30, {
        filter,
        sort: "-created",
      });

      setItems(res.items);
    } catch {
      setInfo("Gagal load data. Pastikan PocketBase jalan dan rules sudah benar.");
    }
  }

  function logout() {
    pb.authStore.clear();
    router.push("/login");
  }

  async function hapus(id: string) {
    if (!confirm("Yakin mau hapus data pelanggan ini?")) return;

    try {
      await pb.collection("customers").delete(id);
      await load(); // refresh list
    } catch {
      setInfo("Gagal hapus. Pastikan kamu ADMIN atau rules mengizinkan.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div style={{ maxWidth: 720, margin: "20px auto", padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <h2>Customers</h2>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/customers/new">+ Tambah</Link>

          {role === "ADMIN" && <Link href="/traffic">Traffic</Link>}

          <Link href="/map">Lihat Peta</Link>

          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <p style={{ marginTop: 8, color: "#555" }}>
        Login sebagai: <b>{userName || "-"}</b> ({role || "UNKNOWN"})
      </p>

      <input
        placeholder="Search nama / no hp..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 8 }}
      />

      {info && <p style={{ color: "crimson" }}>{info}</p>}

      <div style={{ marginTop: 12 }}>
        {items.map((c) => {
          const maps = `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`;
          return (
            <div
              key={c.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 10,
                marginTop: 10,
              }}
            >
              <b>{c.nama}</b>

              <div style={{ color: "#555" }}>
                {c.no_hp}
                {c.alamat ? ` • ${c.alamat}` : ""}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                <a href={maps} target="_blank" rel="noreferrer">
                  Buka di Google Maps
                </a>

                {role === "ADMIN" && (
                  <button onClick={() => hapus(c.id)} style={{ marginLeft: "auto" }}>
                    Hapus
                  </button>
                )}
              </div>

              <div style={{ color: "#777", fontSize: 12 }}>
                {c.lat}, {c.lng}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}