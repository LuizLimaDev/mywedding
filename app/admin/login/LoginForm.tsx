"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Falha no login");
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao autenticar";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-foreground/30 bg-white p-6 shadow-lg"
    >
      <h1 className="text-center font-cinzel text-2xl font-bold uppercase">Admin Login</h1>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Login</span>
        <input
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="rounded-lg border border-foreground/40 px-3 py-2"
          placeholder="Seu login"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold">Senha</span>
        <input
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-foreground/40 px-3 py-2"
          placeholder="Sua senha"
        />
      </label>

      {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
