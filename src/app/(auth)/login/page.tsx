"use client";

import Navbar from "@/components/Navbar";
import { useAuth } from "@/app/providers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Oxanium } from "next/font/google";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message ?? "Login failed");
        return;
      }

      await login(data.token);
      router.push("/dashboard");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={`${oxanium.className} h-screen overflow-hidden bg-cover bg-center bg-no-repeat`}
      style={{ backgroundImage: "url('/images/auth/login_BG.jpg')" }}
    >
      <Navbar />
      <main className="mx-auto grid h-[calc(100vh-64px)] overflow-hidden w-full max-w-7xl grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
        <section className="order-2 flex items-center px-2 lg:order-2 lg:px-10">
          <div className="w-full max-w-md lg:-translate-y-4 ml-auto">
            <img
              src="/images/auth/UniNexus_auth_Logo.png"
              alt="UniNexus Logo"
              className="-ml-8 mb-8 h-24 w-auto"
            />

            <h1 className="text-3xl font-semibold text-gray-900">Welcome back</h1>
            <p className="mt-1 text-gray-700">Login to continue.</p>

            <form
              onSubmit={onSubmit}
              className="mt-6 space-y-4 rounded-2xl border border-white/50 bg-white/45 p-6 shadow-sm backdrop-blur-sm"
            >
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50/90 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="text-base font-medium">Email</label>
                <input
                  className="mt-1 w-full rounded-md border border-white/60 bg-white/70 px-3 py-2 outline-none focus:ring"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="YourStudentNumber@my.sliit.lk"
                  required
                />
              </div>

              <div>
                <label className="text-base font-medium">Password</label>
                <input
                  className="mt-1 w-full rounded-md border border-white/60 bg-white/70 px-3 py-2 outline-none focus:ring"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                disabled={submitting}
                className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
              >
                {submitting ? "Logging in..." : "Login"}
              </button>

              <p className="text-center text-sm text-gray-700">
                Don&apos;t have an account?{" "}
                <a href="/register" className="font-medium text-black underline underline-offset-2">
                  Register
                </a>
              </p>
            </form>
          </div>
        </section>

        <section className="order-1 hidden items-center justify-center p-0 lg:order-1 lg:flex lg:p-1 ">
          <img
            src="/images/auth/login_img1.png"
            alt="Login"
            className="h-full w-full rounded-2xl object-cover lg:translate-x-0 lg:-translate-y-0 lg:scale-105"
          />
        </section>
      </main>
    </div>
  );
}
