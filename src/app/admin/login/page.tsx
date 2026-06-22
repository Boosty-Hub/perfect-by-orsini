"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Credenciales inválidas.");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-900 px-6 text-cream-50">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-3xl bg-ink-950 p-8 ring-1 ring-white/10"
      >
        <p className="font-serif text-2xl">Perfect by Dr. Orsini</p>
        <p className="mt-1 text-sm text-nude-300">Panel de administración</p>

        <label className="mt-6 block text-sm text-cream-100/80">
          Correo
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2.5 text-cream-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-nude-300"
          />
        </label>
        <label className="mt-4 block text-sm text-cream-100/80">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg bg-white/5 px-3 py-2.5 text-cream-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-nude-300"
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-nude-300 px-6 py-3 font-medium text-ink-900 transition-opacity disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
