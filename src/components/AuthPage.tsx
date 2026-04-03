"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/app/providers";
import {
  isValidPassword,
  isValidSliitEmail,
  isValidStudentId,
  sanitizeStudentId,
} from "@/lib/validation";
import { Oxanium } from "next/font/google";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Mode = "login" | "register";

interface Props {
  initial: Mode;
}

const STUDENT_EMAIL_PATTERN = "[^\\s@]+@my\\.sliit\\.lk$";
const passwordHint =
  "Password must be at least 8 characters and include at least 1 letter and 1 number.";

function getInputClass(hasError: boolean) {
  return `mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring ${
    hasError
      ? "border-red-400 bg-red-50/70 focus:ring-red-200"
      : "border-white/60 bg-white/70 focus:ring"
  }`;
}

export default function AuthPage({ initial }: Props) {
  const router = useRouter();
  const { login } = useAuth();

  const [flipped, setFlipped] = useState(initial === "register");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginTouched, setLoginTouched] = useState({ email: false, password: false });

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [registerTouched, setRegisterTouched] = useState({
    name: false,
    studentId: false,
    email: false,
    password: false,
  });

  const normalizedLoginEmail = loginEmail.trim().toLowerCase();
  const normalizedRegisterEmail = regEmail.trim().toLowerCase();
  const normalizedStudentId = sanitizeStudentId(studentId);

  const loginEmailError =
    !normalizedLoginEmail
      ? "Email is required."
      : !isValidSliitEmail(normalizedLoginEmail)
        ? "Please use your @my.sliit.lk email address."
        : "";
  const loginPasswordError = !loginPassword ? "Password is required." : "";

  const registerNameError = !name.trim() ? "Full name is required." : "";
  const registerEmailError =
    !normalizedRegisterEmail
      ? "Email is required."
      : !isValidSliitEmail(normalizedRegisterEmail)
        ? "Please use your @my.sliit.lk email address."
        : "";
  const registerStudentIdError =
    !normalizedStudentId
      ? "Student ID is required."
      : !isValidStudentId(normalizedStudentId)
        ? "Student ID must start with 2 letters followed by 8 numbers."
        : "";
  const registerPasswordError =
    !regPassword
      ? "Password is required."
      : !isValidPassword(regPassword)
        ? passwordHint
        : "";

  function flipTo(next: Mode) {
    setFlipped(next === "register");
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginTouched({ email: true, password: true });

    if (loginEmailError || loginPasswordError) {
      setLoginError(loginEmailError || loginPasswordError);
      return;
    }

    setLoginSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedLoginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data?.message ?? "Login failed");
        return;
      }
      await login(data.token);
      router.push("/dashboard");
    } catch {
      setLoginError("Network error. Try again.");
    } finally {
      setLoginSubmitting(false);
    }
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError(null);
    setRegisterTouched({ name: true, studentId: true, email: true, password: true });

    const firstError =
      registerNameError || registerEmailError || registerStudentIdError || registerPasswordError;

    if (firstError) {
      setRegError(firstError);
      return;
    }

    setRegSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          student_id: normalizedStudentId,
          email: normalizedRegisterEmail,
          password: regPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data?.message ?? "Register failed");
        return;
      }
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
          <div
            className="flip-face bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/auth/login_BG.jpg')" }}
          >
            <Navbar />
            <main className="mx-auto grid h-[calc(100vh-64px)] w-full max-w-7xl grid-cols-1 overflow-hidden lg:grid-cols-2 lg:gap-x-12">
              <section className="order-1 hidden items-center justify-center p-0 lg:flex lg:p-1">
                <img
                  src="/images/auth/login_img1.png"
                  alt="Login"
                  className="h-full w-full rounded-2xl object-cover lg:scale-105"
                />
              </section>

              <section className="order-2 flex items-center px-2 lg:px-10">
                <div className="ml-auto w-full max-w-md lg:-translate-y-4">
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
                        className={getInputClass(loginTouched.email && !!loginEmailError)}
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value.toLowerCase())}
                        onBlur={() => setLoginTouched((current) => ({ ...current, email: true }))}
                        type="email"
                        placeholder="YourStudentNumber@my.sliit.lk"
                        pattern={STUDENT_EMAIL_PATTERN}
                        title="Email must end with @my.sliit.lk"
                        required
                      />
                      {loginTouched.email && loginEmailError ? (
                        <p className="mt-1 text-xs text-red-600">{loginEmailError}</p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-600">
                          Use your university email ending with `@my.sliit.lk`.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-base font-medium">Password</label>
                      <input
                        className={getInputClass(loginTouched.password && !!loginPasswordError)}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        onBlur={() => setLoginTouched((current) => ({ ...current, password: true }))}
                        type="password"
                        placeholder="Enter your password"
                        required
                      />
                      {loginTouched.password && loginPasswordError && (
                        <p className="mt-1 text-xs text-red-600">{loginPasswordError}</p>
                      )}
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

          <div
            className="flip-face flip-face-back bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/auth/signup_BG.jpg')" }}
          >
            <Navbar />
            <main className="mx-auto grid h-[calc(100vh-64px)] w-full max-w-7xl grid-cols-1 overflow-hidden lg:grid-cols-2">
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
                        className={getInputClass(registerTouched.name && !!registerNameError)}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setRegisterTouched((current) => ({ ...current, name: true }))}
                        placeholder="Enter your full name"
                        required
                      />
                      {registerTouched.name && registerNameError && (
                        <p className="mt-1 text-xs text-red-600">{registerNameError}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-base font-medium">Email</label>
                      <input
                        className={getInputClass(registerTouched.email && !!registerEmailError)}
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value.toLowerCase())}
                        onBlur={() => setRegisterTouched((current) => ({ ...current, email: true }))}
                        placeholder="YourStudentNumber@my.sliit.lk"
                        pattern={STUDENT_EMAIL_PATTERN}
                        title="Email must end with @my.sliit.lk"
                        required
                      />
                      {registerTouched.email && registerEmailError ? (
                        <p className="mt-1 text-xs text-red-600">{registerEmailError}</p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-600">
                          Only `@my.sliit.lk` email addresses are allowed.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-base font-medium">Student ID</label>
                        <input
                          className={getInputClass(registerTouched.studentId && !!registerStudentIdError)}
                          value={studentId}
                          onChange={(e) => setStudentId(sanitizeStudentId(e.target.value))}
                          onBlur={() =>
                            setRegisterTouched((current) => ({ ...current, studentId: true }))
                          }
                          placeholder="Ex: IT23918723"
                          pattern="[A-Za-z]{2}\d{8}"
                          maxLength={10}
                          title="Student ID must start with 2 letters followed by 8 digits"
                          required
                        />
                        {registerTouched.studentId && registerStudentIdError ? (
                          <p className="mt-1 text-xs text-red-600">{registerStudentIdError}</p>
                        ) : (
                          <p className="mt-1 text-xs text-gray-600">
                            Student ID must be 2 letters first, then 8 digits. Example: `IT23918723`.
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-base font-medium">Password</label>
                        <input
                          className={getInputClass(registerTouched.password && !!registerPasswordError)}
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          onBlur={() =>
                            setRegisterTouched((current) => ({ ...current, password: true }))
                          }
                          placeholder="Create a password"
                          required
                        />
                        {registerTouched.password && registerPasswordError ? (
                          <p className="mt-1 text-xs text-red-600">{registerPasswordError}</p>
                        ) : (
                          <p className="mt-1 text-xs text-gray-600">{passwordHint}</p>
                        )}
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
