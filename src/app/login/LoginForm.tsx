"use client";

import Link from "next/link";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  registered: boolean;
};

export default function LoginForm({ registered }: Props) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    registered ? "Account created successfully. Please sign in." : ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login request failed:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-6 text-white">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="text-sm text-white/40 transition hover:text-white"
        >
          ← Sayan Tech Services
        </Link>

        <p className="mt-10 text-sm uppercase tracking-[0.25em] text-white/40">
          Client Portal
        </p>

        <h1 className="mt-4 text-4xl font-semibold">Welcome back.</h1>

        {message && (
          <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none placeholder:text-white/30"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none placeholder:text-white/30"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white px-5 py-4 font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/40">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-white hover:underline">
            Create one
          </a>
        </p>
      </div>
    </main>
  );
}
