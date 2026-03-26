"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/app/providers";
import { Oxanium } from "next/font/google";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Mode = "login" | "register";

interface Props {
  initial: Mode;
}

export default function AuthPage({ initial }: Props) {
  const router = useRouter();
  const { login } = useAuth();

  const [mode, setMode] = useState<Mode>(initial);
  const [flipped, setFlipped] = useState(initial === "register");

  // ── Login state ─────────────────────────────────────
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // ── Register state ───────────────────────────────────
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // ── Flip the card ────────────────────────────────────
  function flipTo(next: Mode) {
    setFlipped(next === "register");
    // After flip completes, update mode so URL can reflect if needed
    setTimeout(() => setMode(next), 400);
  }

  // ── Login submit ─────────────────────────────────────
  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data?.message ?? "Login failed"); return; }
      await login(data.token);
      router.push("/dashboard");
    } catch {
      setLoginError("Network error. Try again.");
    } finally {
      setLoginSubmitting(false);
    }
  }

  // ── Register submit ──────────────────────────────────
  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError(null);
    setRegSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, student_id: studentId, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setRegError(data?.message ?? "Register failed"); return; }
      if (data?.token) {
        await login(data.token);
        router.push("/dashboard");
      } else {
        flipTo("login");
      }
    } catch {
      setRegError("Network error. Try again.");
    } finally {
      setRegSubmitting(false);
    }
  }

  return (
    <div className={`${oxanium.className} h-screen overflow-hidden`}>
      <style>{`
        .flip-container {
          perspective: 1400px;
          width: 100%;
          height: 100%;
        }
        .flip-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        .flip-card.flipped {
          transform: rotateY(-180deg);
        }
        .flip-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          overflow: hidden;
        }
        .flip-face-back {
          transform: rotateY(180deg);
        }
      `}</style>

      <div className="flip-container">
        <div className={`flip-card ${flipped ? "flipped" : ""}`}>

          {/* ════════════════════ FRONT — LOGIN ════════════════════ */}
          <div
            className="flip-face bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/auth/login_BG.jpg')" }}
          >
            <Navbar />
            <main className="mx-auto grid h-[calc(100vh-64px)] overflow-hidden w-full max-w-7xl grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
              {/* Image side */}
              <section className="order-1 hidden items-center justify-center p-0 lg:flex lg:p-1">
                <img
                  src="/images/auth/login_img1.png"
                  alt="Login"
                  className="h-full w-full rounded-2xl object-cover lg:scale-105"
                />
              </section>

              {/* Form side */}
              <section className="order-2 flex items-center px-2 lg:px-10">
                <div className="w-full max-w-md lg:-translate-y-4 ml-auto">
                  <img
                    src="/images/auth/UniNexus_auth_Logo.png"
                    alt="UniNexus Logo"
                    className="-ml-8 mb-8 h-24 w-auto"
                  />
                  <h1 className="text-3xl font-semibold text-gray-900">Welcome back</h1>
                  <p className="mt-1 text-gray-700">Login to continue.</p>

                  <form
                    onSubmit={onLogin}
                    className="mt-6 space-y-4 rounded-2xl border border-white/50 bg-white/45 p-6 shadow-sm backdrop-blur-sm"
                  >
                    {loginError && (
                      <div className="rounded-md border border-red-200 bg-red-50/90 px-3 py-2 text-sm text-red-700">
                        {loginError}
                      </div>
                    )}
                    <div>
                      <label className="text-base font-medium">Email</label>
                      <input
                        className="mt-1 w-full rounded-md border border-white/60 bg-white/70 px-3 py-2 outline-none focus:ring"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        type="email"
                        placeholder="YourStudentNumber@my.sliit.lk"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-base font-medium">Password</label>
                      <input
                        className="mt-1 w-full rounded-md border border-white/60 bg-white/70 px-3 py-2 outline-none focus:ring"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        type="password"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <button
                      disabled={loginSubmitting}
                      className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
                    >
                      {loginSubmitting ? "Logging in..." : "Login"}
                    </button>
                    <p className="text-center text-sm text-gray-700">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => flipTo("register")}
                        className="font-medium text-black underline underline-offset-2"
                      >
                        Register
                      </button>
                    </p>
                  </form>
                </div>
              </section>
            </main>
          </div>

          {/* ════════════════════ BACK — REGISTER ════════════════════ */}
          <div
            className="flip-face flip-face-back bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/auth/signup_BG.jpg')" }}
          >
            <Navbar />
            <main className="mx-auto grid h-[calc(100vh-64px)] overflow-hidden w-full max-w-7xl grid-cols-1 lg:grid-cols-2">
              {/* Form side */}
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
                    onSubmit={onRegister}
                    className="mt-6 space-y-4 rounded-2xl border border-white/50 bg-white/45 p-6 shadow-sm backdrop-blur-sm"
                  >
                    {regError && (
                      <div className="rounded-md border border-red-200 bg-red-50/90 px-3 py-2 text-sm text-red-700">
                        {regError}
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
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
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
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Create a password"
                          required
                        />
                      </div>
                    </div>
                    <button
                      disabled={regSubmitting}
                      className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
                    >
                      {regSubmitting ? "Creating..." : "Register"}
                    </button>
                    <p className="text-center text-sm text-gray-700">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => flipTo("login")}
                        className="font-medium text-black underline underline-offset-2"
                      >
                        Login
                      </button>
                    </p>
                  </form>
                </div>
              </section>

              {/* Image side */}
              <section className="hidden items-center justify-center p-0 lg:flex lg:p-2">
                <img
                  src="/images/auth/signup_img1.png"
                  alt="Signup"
                  className="h-full w-full rounded-2xl object-cover lg:translate-x-8 lg:-translate-y-12 lg:scale-105"
                />
              </section>
            </main>
          </div>

        </div>
      </div>
    </div>
  );
}
