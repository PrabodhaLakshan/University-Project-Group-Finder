"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function TutorRegisterPage() {
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [subjects, setSubjects] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch("/api/tutor-connect/tutors/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio,
          subjects: subjects
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          language: language
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        setError(message || "Failed to register as tutor");
        setLoading(false);
        return;
      }

      router.push("/tutor-connect/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-md border border-slate-100 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Become a Tutor</h1>
        <p className="text-slate-500 mb-8">
          Fill in your tutor details once. After that, you can manage slots and bookings from your dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short tutor bio"
              className="w-full min-h-[120px] rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Subjects
            </label>
            <input
              type="text"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="Example: DSA, OOP, Database"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-sm text-slate-400 mt-2">
              Enter subjects separated by commas.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Languages
            </label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Example: English, Sinhala"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-sm text-slate-400 mt-2">
              Enter languages separated by commas.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Register as Tutor"}
          </button>
        </form>
      </div>
    </div>
  );
}