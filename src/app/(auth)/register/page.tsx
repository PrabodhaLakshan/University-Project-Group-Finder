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

        <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-xl border bg-white p-5 shadow-sm">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="text-sm font-medium">Student ID</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input className="mt-1 w-full rounded-md border px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button disabled={submitting} className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60">
            {submitting ? "Creating..." : "Register"}
          </button>
        </form>
      </main>
    </div>
  );
}
