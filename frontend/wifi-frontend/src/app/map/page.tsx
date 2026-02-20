"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getPb } from "@/lib/pb";
import { markerIcon } from "@/lib/leafletIcon";

// react-leaflet di-load client-only (anti "window is not defined")
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

type Customer = {
  id: string;
  nama: string;
  no_hp: string;
  alamat?: string;
  lat: number;
  lng: number;
};

export default function MapPage() {
  const router = useRouter();
  const [items, setItems] = useState<Customer[]>([]);
  const [info, setInfo] = useState("");

  // Koordinat default (silakan ganti sesuai area kamu)
  const defaultCenter = useMemo<[number, number]>(() => [-5.39714, 105.26679], []);

  async function loadCustomers() {
    setInfo("");
    try {
      const pb = getPb();

      if (!pb.authStore.isValid) {
        router.push("/login");
        return;
      }

      const res = await pb.collection("customers").getList<Customer>(1, 500, {
        sort: "-created",
      });

      setItems(res.items);
    } catch {
      setInfo("Gagal load data pelanggan untuk peta. Cek PocketBase & rules.");
    }
  }

  useEffect(() => {
    loadCustomers();

    const pb = getPb();
    if (!pb.authStore.isValid) return;

    const unsubPromise = pb.collection("customers").subscribe("*", async () => {
      await loadCustomers();
    });

    return () => {
      unsubPromise.then((unsub) => unsub()).catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <div style={{ padding: 10, display: "flex", gap: 10, alignItems: "center" }}>
        <b>Peta Pelanggan</b>
        <button onClick={() => router.push("/customers")} style={{ padding: "6px 10px" }}>
          Kembali
        </button>
        {info && <span style={{ color: "crimson" }}>{info}</span>}
      </div>

      <div style={{ height: "calc(100vh - 52px)" }}>
        <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {items.map((c) => {
            const mapsLink = `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`;
            return (
              <Marker key={c.id} position={[c.lat, c.lng]} icon={markerIcon}>
                <Popup>
                  <div>
                    <b>{c.nama}</b>
                    <div>{c.no_hp}</div>
                    {c.alamat ? <div>{c.alamat}</div> : null}
                    <a href={mapsLink} target="_blank" rel="noreferrer">
                      Buka di Google Maps
                    </a>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                      {c.lat}, {c.lng}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}