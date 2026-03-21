"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a1020]">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-semibold text-white">
          UniNest
        </Link>

        <div className="flex items-center gap-6 text-white/70">
          
          {/* Not Logged In */}
          {!loading && !user && (
            <>
              <Link className="text-sm hover:underline" href="/login">
                Login
              </Link>

              <Link
                className="rounded-md bg-black px-3 py-1.5 text-sm text-white"
                href="/register"
              >
                Register
              </Link>
            </>
          )}

          {/* Logged In */}
          {!loading && user && (
            <>
              <Link
                className="hover:text-blue-300 transition"
                href="/dashboard"
              >
                Dashboard
              </Link>

               

              <Link
                className="hover:text-blue-300 transition"
                href="/profile"
              >
                Profile
              </Link>

              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 hover:border-blue-500/40 hover:bg-blue-500/10 text-white transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
