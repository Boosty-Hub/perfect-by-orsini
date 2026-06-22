"use client";

import { useActionState } from "react";
import { createUserAccount } from "@/app/admin/actions";

const inputCls =
  "mt-1 w-full rounded-lg border border-nude-200 bg-white px-3 py-2 text-sm outline-none focus:border-nude-400";

export function NewUserForm() {
  const [state, action, pending] = useActionState(createUserAccount, { error: "" });

  return (
    <form action={action} className="mt-6 space-y-4 rounded-2xl border border-nude-200 bg-white p-6">
      {state?.error && (
        <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">{state.error}</p>
      )}
      <label className="block text-sm font-medium text-ink-900">
        Nombre
        <input name="full_name" className={inputCls} />
      </label>
      <label className="block text-sm font-medium text-ink-900">
        Correo
        <input name="email" type="email" required className={inputCls} />
      </label>
      <label className="block text-sm font-medium text-ink-900">
        Contraseña (mín. 8)
        <input name="password" type="password" required minLength={8} className={inputCls} />
      </label>
      <label className="block text-sm font-medium text-ink-900">
        Rol
        <select name="role" defaultValue="editor" className={inputCls}>
          <option value="editor">Editor</option>
          <option value="admin">Administrador</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-cream-50 disabled:opacity-60"
      >
        {pending ? "Creando…" : "Crear usuario"}
      </button>
    </form>
  );
}
