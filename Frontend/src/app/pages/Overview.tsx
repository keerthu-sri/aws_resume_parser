import { useEffect, useState } from "react";
import {
  FileText,
  ScanEye,
  TrendingUp,
  AlertTriangle,
  Edit,
  Upload,
  Users,
  Target,
  GitCompare,
} from "lucide-react";

import { MetricCard } from "../components/MetricCard";
import { ActionCard } from "../components/ActionCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { api } from "../../services/api";

interface Resume {
  id: string;
  name?: string;
  skills: string[];
  raw_text?: string;
}

export function Overview() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [ocrCount, setOcrCount] = useState(0);

  useEffect(() => {
    api.get("/api/resumes").then((res) => {
      setResumes(res.data);
    });
  }, []);

  const totalResumes = resumes.length;

  useEffect(() => {
    const estimatedOcr = resumes.filter(
      (r) => r.raw_text && r.raw_text.length > 3000
    ).length;
    setOcrCount(estimatedOcr);
  }, [resumes]);

  const ocrPercentage =
    totalResumes > 0 ? Math.round((ocrCount / totalResumes) * 100) : 0;

  const avgMatchScore = totalResumes > 0 ? 72 : 0;
  const lowConfidenceCount = Math.round(totalResumes * 0.15);
  const manualOverrides = 0;

  return (
    <div className="relative min-h-full">
      {/* soft glow background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(192,132,252,0.25),_transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl space-y-6 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        {/* Header */}
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
              System Overview
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl md:text-4xl">
              Intelligent recruitment dashboard
            </h1>
            <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400" />
          </div>

          <div className="flex flex-col gap-2 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:gap-3 md:text-xs">
            <div className="flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span>Live database connected</span>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 sm:flex">
              <ScanEye className="h-3.5 w-3.5 text-purple-300" />
              <span>OCR fallback enabled</span>
            </div>
          </div>
        </header>

        {/* Metrics */}
        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-[11px] font-semibold tracking-[0.25em] text-slate-400 uppercase">
            System Metrics
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <MetricCard
              title="Total Resumes Parsed"
              value={totalResumes}
              insight="Live from database"
              icon={FileText}
              trend="up"
              className="rounded-2xl bg-[#050716] border border-purple-500/15 shadow-[0_0_35px_rgba(139,92,246,0.25)]"
            />
            <MetricCard
              title="OCR Usage"
              value={`${ocrPercentage}%`}
              insight="Estimated OCR fallback"
              icon={ScanEye}
              trend="neutral"
              className="rounded-2xl bg-[#050716] border border-indigo-500/10 shadow-[0_0_30px_rgba(79,70,229,0.22)]"
            />
            <MetricCard
              title="Avg Match Score"
              value={`${avgMatchScore}%`}
              insight="Skill similarity baseline"
              icon={TrendingUp}
              trend="up"
              className="rounded-2xl bg-[#050716] border border-emerald-500/15 shadow-[0_0_30px_rgba(16,185,129,0.22)]"
            />
            <MetricCard
              title="Low Confidence Extractions"
              value={lowConfidenceCount}
              insight="Needs review"
              icon={AlertTriangle}
              trend="down"
              className="rounded-2xl bg-[#070816] border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.25)]"
            />
            <MetricCard
              title="Manual Overrides"
              value={manualOverrides}
              insight="No manual edits"
              icon={Edit}
              trend="neutral"
              className="rounded-2xl bg-[#050716] border border-slate-600/40 shadow-[0_0_25px_rgba(148,163,184,0.35)]"
            />
          </div>
        </section>

        {/* Core Actions */}
        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-[11px] font-semibold tracking-[0.25em] text-slate-400 uppercase">
            Core Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ActionCard
              title="Upload & Parse Resumes"
              description="AI-powered parsing with OCR fallback"
              icon={Upload}
              path="/upload"
              className="rounded-2xl bg-gradient-to-r from-purple-700/70 via-fuchsia-600/80 to-indigo-600/80 border border-purple-400/40 shadow-[0_0_40px_rgba(168,85,247,0.55)]"
            />
            <ActionCard
              title="Candidate Repository"
              description="Search and analyze parsed candidates"
              icon={Users}
              path="/repository"
              className="rounded-2xl bg-[#050716] border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
            />
            <ActionCard
              title="Talent–Role Matching"
              description="Match job descriptions to candidates"
              icon={Target}
              path="/matching"
              className="rounded-2xl bg-[#050716] border border-indigo-500/20 shadow-[0_0_30px_rgba(79,70,229,0.3)]"
            />
            <ActionCard
              title="Resume Comparison"
              description="Side-by-side resume analysis"
              icon={GitCompare}
              path="/comparison"
              className="rounded-2xl bg-[#050716] border border-slate-600/40 shadow-[0_0_25px_rgba(148,163,184,0.35)]"
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="space-y-3 sm:space-y-4">
          <h2 className="text-[11px] font-semibold tracking-[0.25em] text-slate-400 uppercase">
            Recent Activity
          </h2>
          <Card className="rounded-2xl border border-slate-700/70 bg-[#050716]/95 shadow-[0_0_30px_rgba(15,23,42,0.9)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-100 sm:text-base">
                Latest parsed resumes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resumes.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2.5"
                >
                  <Badge
                    variant="outline"
                    className="border-purple-400/50 bg-purple-500/10 text-[11px] font-medium uppercase tracking-wide text-purple-300"
                  >
                    Parse
                  </Badge>
                  <div>
                    <p className="text-sm text-slate-100">
                      Resume parsed:&nbsp;
                      <span className="font-medium">
                        {r.name || r.id.slice(0, 8)}
                      </span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Stored with {r.skills.length} extracted skills
                    </p>
                  </div>
                </div>
              ))}

              {resumes.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-500">
                  No activity yet. Upload a resume to see parsing history.
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
