"use client";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          student_id: studentId,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? "Register failed");
        return;
      }

      // some APIs return token after register; if not, redirect to login
      if (data?.token) {
        await login(data.token);
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-10">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-1 text-gray-600">Join and find your project team.</p>

       <form
  onSubmit={onSubmit}
  className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-[#0a1020] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
>
  {error && (
    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
      {error}
    </div>
  )}

  <div>
    <label className="text-sm font-medium text-white/80">Full Name</label>
    <input
      className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 text-white px-3 py-2 shadow-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/60 transition"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="John Doe"
      required
    />
  </div>

  <div>
    <label className="text-sm font-medium text-white/80">Student ID</label>
    <input
      className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 text-white px-3 py-2 shadow-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/60 transition"
      value={studentId}
      onChange={(e) => setStudentId(e.target.value)}
      placeholder="IT23XXXXXX"
      required
    />
  </div>

  <div>
    <label className="text-sm font-medium text-white/80">Email</label>
    <input
      type="email"
      className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 text-white px-3 py-2 shadow-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/60 transition"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="you@example.com"
      required
    />
  </div>

  <div>
    <label className="text-sm font-medium text-white/80">Password</label>
    <input
      type="password"
      className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 text-white px-3 py-2 shadow-sm outline-none placeholder:text-white/40 focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/60 transition"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="••••••••"
      required
    />
  </div>

  <button
    disabled={submitting}
    className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 transition disabled:opacity-60"
  >
    {submitting ? "Creating..." : "Register"}
  </button>
</form>
      </main>
    </div>
  );
}
