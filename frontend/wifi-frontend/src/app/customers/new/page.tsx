"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getPb } from "@/lib/pb";

export default function NewCustomerPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [info, setInfo] = useState("");

  function ambilLokasi() {
    setInfo("");
    if (!navigator.geolocation) {
      setInfo("Browser tidak support GPS.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      (err) => {
        setInfo("Gagal ambil lokasi. Pastikan izin lokasi aktif. " + err.message);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  async function simpan() {
    setInfo("");
    if (!nama.trim() || !noHp.trim() || lat === null || lng === null) {
      setInfo("Nama, No HP, dan lokasi wajib diisi.");
      return;
    }

    const pb = getPb();
    if (!pb.authStore.isValid) {
      router.push("/login");
      return;
    }

    try {
      await pb.collection("customers").create({
        nama: nama.trim(),
        no_hp: noHp.trim(),
        alamat: alamat.trim(),
        lat,
        lng,
        teknisi: pb.authStore.model?.id,
      });

      router.push("/customers");
    } catch (e) {
      setInfo("Gagal simpan. Cek rules PocketBase atau field required.");
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: "20px auto", padding: 12 }}>
      <h2>Tambah Pelanggan</h2>
      <Link href="/customers">← Kembali</Link>

      <input
        placeholder="Nama pelanggan"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />
      <input
        placeholder="No HP"
        value={noHp}
        onChange={(e) => setNoHp(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />
      <input
        placeholder="Alamat (opsional)"
        value={alamat}
        onChange={(e) => setAlamat(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <input value={lat ?? ""} readOnly placeholder="Latitude" style={{ flex: 1, padding: 10 }} />
        <input value={lng ?? ""} readOnly placeholder="Longitude" style={{ flex: 1, padding: 10 }} />
      </div>

      <button onClick={ambilLokasi} style={{ width: "100%", padding: 10, marginTop: 10 }}>
        Ambil Lokasi (GPS)
      </button>

      <button onClick={simpan} style={{ width: "100%", padding: 10, marginTop: 10 }}>
        Simpan
      </button>

      {info && <p style={{ color: "crimson" }}>{info}</p>}
    </div>
  );
}