"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.admin));
      router.push("/modules/admin/dashboard");
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="al-root">
      {/* Left accent panel */}
      <div className="al-left-panel">
        <div className="al-left-inner">
          <div className="al-left-logo">
            <Image
              src="/images/navbar/UniNexus_nav_Logo_lightT.png"
              alt="UniNexus"
              width={200}
              height={55}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="al-left-title">UniNexus<br />Admin Portal</h2>
          <p className="al-left-sub">
            Manage platform operations, moderate content, and track growth across all 4 core modules.
          </p>
          <div className="al-left-features">
            {[
              { dot: "#4B6CF7", label: "Project Group Finder" },
              { dot: "#F97316", label: "Uni Mart Marketplace" },
              { dot: "#6C4CF1", label: "Startup Connector" },
              { dot: "#22C55E", label: "Tutor Finder" },
            ].map((f) => (
              <div key={f.label} className="al-feature-row">
                <span className="al-feature-dot" style={{ background: f.dot }} />
                <span className="al-feature-label">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login card */}
      <div className="al-right-panel">
        <div className="al-card">
          {/* Badge */}
          <div className="al-badge">
            <ShieldCheck size={13} />
            <span>Secure Admin Access</span>
          </div>

          <h1 className="al-heading">Welcome back</h1>
          <p className="al-subheading">Sign in with your admin credentials to access the control panel</p>

          <form onSubmit={handleLogin} className="al-form">
            {error && (
              <div className="al-error">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <div className="al-field">
              <label htmlFor="admin-email">Email address</label>
              <div className="al-input-wrap">
                <Mail size={15} className="al-input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="uniadmin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="al-field">
              <label htmlFor="admin-password">Password</label>
              <div className="al-input-wrap">
                <Lock size={15} className="al-input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="al-eye-btn"
                  aria-label="Toggle password"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="al-submit-btn">
              {loading ? (
                <><Loader2 size={17} className="al-spin" /> Authenticating...</>
              ) : (
                <><ShieldCheck size={17} /> Sign in to Admin Panel</>
              )}
            </button>
          </form>

          <p className="al-footer">UniNexus Admin Panel &copy; {new Date().getFullYear()} &mdash; Authorized access only</p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .al-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
          background: #F4F6FB;
        }

        /* Left accent panel */
        .al-left-panel {
          display: none;
          flex: 1;
          background: linear-gradient(160deg, #4B6CF7 0%, #6C4CF1 45%, #F97316 100%);
          padding: 3rem;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 900px) { .al-left-panel { display: flex; align-items: center; justify-content: center; } }
        .al-left-panel::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .al-left-inner {
          position: relative; z-index: 1;
          max-width: 380px;
        }
        .al-left-logo {
          background: rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 0.75rem 1.25rem;
          margin-bottom: 2rem;
          display: inline-block;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .al-left-title {
          font-size: 2.4rem; font-weight: 900;
          color: white; margin: 0 0 1rem;
          line-height: 1.15; letter-spacing: -0.02em;
        }
        .al-left-sub {
          color: rgba(255,255,255,0.75);
          font-size: 0.9rem; line-height: 1.6;
          margin: 0 0 2rem;
        }
        .al-left-features {
          display: flex; flex-direction: column; gap: 0.75rem;
        }
        .al-feature-row {
          display: flex; align-items: center; gap: 0.75rem;
        }
        .al-feature-dot {
          width: 8px; height: 8px; border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 8px rgba(255,255,255,0.5);
        }
        .al-feature-label {
          color: rgba(255,255,255,0.9);
          font-size: 0.875rem; font-weight: 600;
        }

        /* Right panel */
        .al-right-panel {
          flex: 1; max-width: 560px;
          display: flex; align-items: center; justify-content: center;
          padding: 2rem 1.5rem;
          background: #F4F6FB;
        }
        @media (min-width: 900px) { .al-right-panel { max-width: 480px; } }

        .al-card {
          width: 100%; max-width: 420px;
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 24px;
          padding: 2.25rem 2rem;
          box-shadow: 0 8px 40px rgba(15,23,42,0.08);
        }

        .al-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: linear-gradient(135deg, #EEF2FF, #FFF7ED);
          border: 1px solid #C7D2FE;
          color: #4B6CF7;
          font-size: 10.5px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 100px;
          margin-bottom: 1.5rem;
        }

        .al-heading {
          font-size: 1.7rem; font-weight: 900;
          color: #0f172a; margin: 0 0 0.4rem;
          letter-spacing: -0.02em;
        }
        .al-subheading {
          color: #64748b; font-size: 0.85rem; margin: 0 0 1.75rem;
          line-height: 1.5;
        }

        .al-form { display: flex; flex-direction: column; gap: 1.1rem; }

        .al-error {
          display: flex; align-items: center; gap: 8px;
          background: #FFF5F5; border: 1px solid #FECACA;
          color: #DC2626; border-radius: 11px;
          padding: 0.75rem 1rem; font-size: 0.83rem; font-weight: 500;
        }

        .al-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .al-field label {
          color: #374151; font-size: 0.8rem; font-weight: 600;
        }
        .al-input-wrap { position: relative; display: flex; align-items: center; }
        .al-input-icon {
          position: absolute; left: 13px; color: #94a3b8;
          pointer-events: none; z-index: 1;
        }
        .al-input-wrap input {
          width: 100%; height: 46px;
          padding: 0 44px 0 42px;
          background: #F8FAFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 12px;
          color: #0f172a; font-size: 0.875rem; outline: none;
          transition: all 0.2s;
        }
        .al-input-wrap input::placeholder { color: #cbd5e1; }
        .al-input-wrap input:focus {
          border-color: #4B6CF7;
          background: #EEF2FF;
          box-shadow: 0 0 0 3px rgba(75,108,247,0.1);
        }
        .al-eye-btn {
          position: absolute; right: 13px;
          background: none; border: none;
          cursor: pointer; color: #94a3b8;
          display: flex; align-items: center;
          transition: color 0.2s;
        }
        .al-eye-btn:hover { color: #4B6CF7; }

        .al-submit-btn {
          margin-top: 0.25rem;
          height: 50px; border-radius: 13px; border: none;
          cursor: pointer; font-size: 0.9rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          color: white;
          background: linear-gradient(135deg, #4B6CF7 0%, #6C4CF1 60%, #F97316 100%);
          background-size: 200% 100%;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(75,108,247,0.35);
        }
        .al-submit-btn:hover:not(:disabled) {
          opacity: 0.92; transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(75,108,247,0.45);
        }
        .al-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .al-spin { animation: alSpin 0.8s linear infinite; }
        @keyframes alSpin { to { transform: rotate(360deg); } }

        .al-footer {
          text-align: center; margin-top: 1.5rem;
          color: #94a3b8; font-size: 0.73rem;
        }
      `}</style>
    </div>
  );
}
