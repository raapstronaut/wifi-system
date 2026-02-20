"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPb } from "@/lib/pb";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function onLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (loading) return;

    setInfo("");
    setLoading(true);

    try {
      const pb = getPb();
      await pb.collection("users").authWithPassword(username.trim(), password.trim());
      router.push("/customers");
    } catch {
      setInfo("Login gagal. Cek username/password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 12 }}>
      <h2>Login</h2>

      <form onSubmit={onLogin}>
        <input
          placeholder="email/username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 8 }}
        />

        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 8 }}
        />

        <button 
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        >
          {loading ? "Logging in..." : "login"}
        </button>
      </form>
      
      {info && <p style={{ color: "crimson" }}>{info}</p>}
    </div>
  );
}