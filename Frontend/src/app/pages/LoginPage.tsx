import { useState } from "react";
import { LockKeyhole, Mail, User } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/overview", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT — HERO (hidden on mobile) */}
        <div className="relative hidden flex-col overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_55%)]" />
          <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_30%_40%,_rgba(45,212,191,0.12),_transparent_60%)]" />

          {/* logo */}
          <div className="relative z-10 px-8 pt-8 xl:px-10 xl:pt-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                <span className="text-sm font-semibold text-teal-300">ATS</span>
              </div>
              <div>
                <h1 className="text-base font-semibold">ATS Platform</h1>
                <p className="text-xs text-slate-300">Intelligent Recruiting</p>
              </div>
            </div>
          </div>

          {/* hero content */}
          <div className="relative z-10 mt-24 px-8 pb-12 xl:mt-32 xl:px-10 xl:pb-14">
            <h2 className="text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
              Smarter hiring <br />
              <span className="text-teal-300">powered by intelligence</span>
            </h2>

            <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />

            <p className="mt-5 max-w-md text-sm text-slate-300">
              Parse resumes, analyze candidates, and run ML-based talent‑role
              matching in a unified ATS built for modern recruiting teams.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-xs">
              {[
                "AI resume parsing",
                "OCR fallback",
                "Talent matching",
                "Candidate comparison",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-4 py-1.5 ring-1 ring-white/15"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-10 text-[11px] text-slate-400">
              © {new Date().getFullYear()} ATS Platform · Demo system
            </p>
          </div>
        </div>

        {/* RIGHT — LOGIN CARD */}
        <div className="relative flex items-center justify-center px-4 py-10 sm:px-6 md:px-10 lg:px-6 lg:py-0">
          {/* ambient glow */}
          <div className="pointer-events-none absolute h-[320px] w-[320px] rounded-full bg-gradient-to-br from-teal-400/15 via-cyan-400/10 to-purple-500/10 blur-3xl sm:h-[380px] sm:w-[380px] lg:h-[420px] lg:w-[420px]" />

          <div className="z-10 w-full max-w-md">
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-8">
              {/* top highlight */}
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {/* header */}
              <div className="mb-6 flex flex-col items-center gap-3 text-center sm:mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                  <LockKeyhole className="h-6 w-6 text-teal-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold sm:text-2xl">
                    {mode === "login" ? "Welcome back" : "Create your account"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    ATS intelligent workspace
                  </p>
                </div>
              </div>

              {/* form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {mode === "signup" && (
                  <div>
                    <label className="text-xs text-slate-400">Full name</label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <Input
                        className="h-10 rounded-xl border border-white/15 bg-black/30 pl-9 text-sm text-white placeholder:text-slate-400 focus:border-teal-400/60"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs text-slate-400">Email</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      type="email"
                      className="h-10 rounded-xl border border-white/15 bg-black/30 pl-9 text-sm text-white placeholder:text-slate-400 focus:border-teal-400/60"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400">Password</label>
                  <Input
                    type="password"
                    className="mt-1 h-10 rounded-xl border border-white/15 bg-black/30 text-sm text-white placeholder:text-slate-400 focus:border-teal-400/60"
                    placeholder="••••••••"
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-3 w-full rounded-xl bg-[#009688] text-white shadow-[0_0_18px_rgba(0,150,136,0.45)] transition-all duration-300 hover:bg-[#26A69A] hover:shadow-[0_0_28px_rgba(0,150,136,0.65)]"
                >
                  {mode === "login" ? "Sign in" : "Create account"}
                </Button>
              </form>

              {/* footer */}
              <p className="mt-5 text-center text-xs text-slate-400">
                {mode === "login" ? (
                  <>
                    New here?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-teal-300 hover:underline"
                    >
                      Create account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-teal-300 hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
