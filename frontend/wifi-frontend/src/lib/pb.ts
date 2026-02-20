import PocketBase from "pocketbase";

export function getPb() {
  // PB_URL dari env, fallback ke localhost (untuk laptop)
  const baseUrl = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090";
  return new PocketBase(baseUrl);
}