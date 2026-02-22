"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { getPb } from "@/lib/pb";

export default function SpeedtestPage() {
  const router = useRouter();

  useEffect(() => {
    const pb = getPb();
    if (!pb.authStore.isValid) router.push("/login");
  }, [router]);

  const speedtestUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `http://${window.location.hostname}:8080`;
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <div style={{ padding: 10, display: "flex", gap: 10, alignItems: "center" }}>
        <b>Speedtest</b>
        <Link href="/customers">Kembali</Link>

        <a href={speedtestUrl} target="_blank" rel="noreferrer" style={{ marginLeft: "auto" }}>
          Buka Full
        </a>
      </div>

      {speedtestUrl && (
        <iframe
          src={speedtestUrl}
          style={{ width: "100%", height: "calc(100vh - 52px)", border: "none" }}
        />
      )}
    </div>
  );
}