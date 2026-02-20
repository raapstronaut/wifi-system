"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPb } from "@/lib/pb";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");

  async function onLogin() {
    setInfo("");
    try {
      const pb = getPb();
      await pb.collection("users").authWithPassword(username.trim(), password.trim());
      router.push("/customers");
    } catch (e) {
      setInfo("Login gagal. Cek username/password.");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 12 }}>
      <h2>Login</h2>
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
      <button onClick={onLogin} style={{ width: "100%", padding: 10, marginTop: 10 }}>
        Login
      </button>
      {info && <p style={{ color: "crimson" }}>{info}</p>}
    </div>
  );
}