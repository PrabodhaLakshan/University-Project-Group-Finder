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
    <div
      className={`${oxanium.className} h-screen overflow-hidden bg-cover bg-center bg-no-repeat`}
      style={{ backgroundImage: "url('/images/auth/signup_BG.jpg')" }}
    >
      <Navbar />
      <main className="mx-auto grid h-[calc(100vh-64px)] overflow-hidden w-full max-w-7xl grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center px-6 lg:px-16">
          <div className="w-full max-w-lg lg:-translate-y-20">
            <img
              src="/images/auth/UniNexus_auth_Logo.png"
              alt="UniNexus Logo"
              className="-ml-8 mb-8 h-24 w-auto"
            />

            <h1 className="text-3xl font-semibold text-gray-900">Create account</h1>
            <p className="mt-1 text-gray-700">Join and find your project team.</p>

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
                <label className="text-base font-medium">Full Name</label>
                <input
                  className="mt-1 w-full rounded-md border border-white/60 bg-white/70 px-3 py-2 outline-none focus:ring"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="text-base font-medium">Email</label>
                <input
                  className="mt-1 w-full rounded-md border border-white/60 bg-white/70 px-3 py-2 outline-none focus:ring"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YourStudentNumber@my.sliit.lk"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-base font-medium">Student ID</label>
                  <input
                    className="mt-1 w-full rounded-md border border-white/60 bg-white/70 px-3 py-2 outline-none focus:ring"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter your student ID"
                    required
                  />
                </div>

                <div>
                  <label className="text-base font-medium">Password</label>
                  <input
                    className="mt-1 w-full rounded-md border border-white/60 bg-white/70 px-3 py-2 outline-none focus:ring"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>

              <button disabled={submitting} className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60">
                {submitting ? "Creating..." : "Register"}
              </button>

              <p className="text-center text-sm text-gray-700">
                Already have an account?{" "}
                <a href="/login" className="font-medium text-black underline underline-offset-2">
                  Login
                </a>
              </p>
            </form>
          </div>
        </section>

        <section className="hidden items-center justify-center p-0 lg:flex lg:p-2">
          <img
            src="/images/auth/signup_img1.png"
            alt="Signup"
            className="h-full w-full rounded-2xl object-cover lg:translate-x-8 lg:-translate-y-12 lg:scale-105"
          />
        </section>
      </main>
    </div>
  );
}
