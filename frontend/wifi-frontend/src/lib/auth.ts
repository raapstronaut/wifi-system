import { getPb } from "@/lib/pb";

/** Ambil user model dari PocketBase (kalau belum login => null) */
export function getMe<T = any>(): T | null {
  const pb = getPb();
  if (!pb.authStore.isValid) return null;
  return pb.authStore.model as T;
}

/** Ambil role user (ADMIN/TEKNIS) */
export function getRole(): "ADMIN" | "TEKNIS" | "UNKNOWN" {
  const me: any = getMe();
  const role = me?.role;
  if (role === "ADMIN") return "ADMIN";
  if (role === "TEKNIS") return "TEKNIS";
  return "UNKNOWN";
}