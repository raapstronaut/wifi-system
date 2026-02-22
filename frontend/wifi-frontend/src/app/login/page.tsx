"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getPb } from "@/lib/pb";

export default function LoginPage() {
  /** Next.js App Router navigation (buat redirect setelah login berhasil) */
  const router = useRouter();

  /** State untuk input form */
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  /** Checkbox "Remember Me" (saat ini hanya UI; PocketBase default simpan auth di localStorage) */
  const [remember, setRemember] = useState(true);

  /** Loading untuk disable tombol + ubah teks tombol */
  const [loading, setLoading] = useState(false);

  /** Pesan error ketika login gagal */
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    /** Cegah reload halaman saat submit form */
    e.preventDefault();

    /** Reset error & aktifkan loading */
    setError(null);
    setLoading(true);

    try {
      /** Ambil instance PocketBase client */
      const pb = getPb();

      /** Login ke PocketBase: email/username + password */
      await pb.collection("users").authWithPassword(emailOrUsername, password);

      /** 
       * Remember Me:
       * - PocketBase default simpan sesi di localStorage (persist).
       * - Kalau mau "session only" saat remember=false, butuh custom authStore (belum kita implement).
       */
      if (!remember) {
        // placeholder (opsional: implement custom authStore kalau mau benar-benar session-only)
      }

      /** Semua role masuk ke dashboard yang sama */
      router.push("/dashboard");
    } catch (err: any) {
      /** Kalau gagal login, tampilkan error */
      setError("Email/Password salah");
    } finally {
      /** Matikan loading apapun hasilnya */
      setLoading(false);
    }
  }

  return (
    /** Background abu-abu + center (mirip UI ISPAdmin/AdminLTE) */
    <div className="min-h-screen bg-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Judul besar di atas card */}
        <h1 className="text-center text-4xl font-light text-slate-600 mb-6">
          ISP<span className="font-normal">Login</span>
        </h1>

        {/* Card putih */}
        <div className="bg-white border shadow-sm">
          {/* Subjudul di dalam card */}
          <div className="px-6 pt-6 text-center text-slate-500 text-sm">
            Sign in to start your session
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="px-6 pb-6 pt-4">
            {/* Input Email/Username + icon kanan */}
            <div className="relative">
              <input
                className="w-full border border-slate-200 rounded px-3 py-2 pr-10 outline-none focus:ring focus:ring-indigo-200"
                placeholder="Email"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                autoComplete="username"
              />
              {/* icon email (kanan) */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                ✉️
              </span>
            </div>

            {/* Input Password + icon kanan */}
            <div className="relative mt-4">
              <input
                type="password"
                className="w-full border border-slate-200 rounded px-3 py-2 pr-10 outline-none focus:ring focus:ring-indigo-200"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {/* icon lock (kanan) */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                🔒
              </span>
            </div>

            {/* Row: Remember Me + tombol Sign In (kanan) */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember Me
              </label>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded disabled:opacity-60"
              >
                {loading ? "Signing..." : "Sign In"}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded">
                {error}
              </div>
            )}

            {/* Link bawah */}
            <div className="mt-4 space-y-1 text-sm">
              <Link href="/login/forgot" className="text-blue-600 hover:underline block">
                I forgot my password
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}