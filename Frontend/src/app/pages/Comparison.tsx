import { useEffect, useState } from "react";
import { GitCompare, Users, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api } from "../../services/api";

interface Resume {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  skills: string[];
}

interface ComparisonResult {
  left_candidate_name?: string;
  right_candidate_name?: string;
  common_skills: string[];
  left_only_skills: string[];
  right_only_skills: string[];
  experience_diff?: number;
}

export function Comparison() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [leftId, setLeftId] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/api/resumes").then((res) => setResumes(res.data));
  }, []);

  const runComparison = async () => {
    if (!leftId || !rightId) return;

    setLoading(true);
    try {
      const res = await api.get("/api/resumes/compare", {
        params: { left_id: leftId, right_id: rightId },
      });
      setResult(res.data);
    } catch (err) {
      console.error("Comparison failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-full">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(192,132,252,0.25),_transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl space-y-6 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        {/* Header */}
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Resume Comparison
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl md:text-4xl">
              Side‑by‑side candidate analysis
            </h1>
            <div className="mt-3 h-1.5 w-20 rounded-full bg-[#009688]" />
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-400 md:text-xs">
            <GitCompare className="h-4 w-4 text-teal-300" />
            <span>Compare skills and experience deltas</span>
          </div>
        </header>

        {/* Selection */}
        <Card className="rounded-2xl border border-slate-700/70 bg-[#050716]/95 shadow-[0_0_30px_rgba(15,23,42,0.9)]">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-sm text-slate-100 sm:text-base">
              <Users className="h-5 w-5 text-teal-300" />
              Select candidates
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
            <Select onValueChange={setLeftId}>
              <SelectTrigger className="rounded-xl border-slate-600 bg-slate-950/80">
                <SelectValue placeholder="Select first candidate" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-900">
                {resumes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name || r.id.slice(0, 8)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setRightId}>
              <SelectTrigger className="rounded-xl border-slate-600 bg-slate-950/80">
                <SelectValue placeholder="Select second candidate" />
              </SelectTrigger>
              <SelectContent className="border-slate-700 bg-slate-900">
                {resumes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name || r.id.slice(0, 8)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              className="rounded-xl md:col-span-2 w-full md:w-auto bg-[#009688] text-white shadow-[0_0_18px_rgba(0,150,136,0.45)] transition-all duration-300 hover:bg-[#26A69A] hover:shadow-[0_0_28px_rgba(0,150,136,0.65)]"
              size="lg"
              onClick={runComparison}
              disabled={!leftId || !rightId || loading}
            >
              {loading ? "Comparing..." : "Compare resumes"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Names */}
            <Card className="rounded-2xl border border-slate-700/70 bg-[#050716]/95">
              <CardContent className="grid grid-cols-1 gap-4 px-4 py-4 sm:px-6 sm:py-5 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-900/80 p-4">
                  <p className="text-[11px] font-semibold tracking-[0.25em] text-slate-400 uppercase">
                    Candidate A
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-50 sm:text-xl">
                    {result.left_candidate_name || "Candidate A"}
                  </h3>
                </div>
                <div className="rounded-2xl bg-slate-900/80 p-4">
                  <p className="text-[11px] font-semibold tracking-[0.25em] text-slate-400 uppercase">
                    Candidate B
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-50 sm:text-xl">
                    {result.right_candidate_name || "Candidate B"}
                  </h3>
                </div>
              </CardContent>
            </Card>

            {/* Common Skills */}
            <Card className="rounded-2xl border border-slate-700/70 bg-[#050716]/95 shadow-[0_0_30px_rgba(15,23,42,0.9)]">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-100 sm:text-base">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  Common skills ({result.common_skills.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.common_skills.length > 0 ? (
                  result.common_skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="border-emerald-400/40 bg-emerald-500/10 text-[11px] font-medium uppercase tracking-wide text-emerald-300"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">
                    No overlapping skills
                  </span>
                )}
              </CardContent>
            </Card>

            {/* Unique Skills */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left only */}
              <Card className="rounded-2xl border border-slate-700/70 bg-[#050716]/95">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm text-slate-100 sm:text-base">
                    <AlertCircle className="h-5 w-5 text-sky-300" />
                    Left only skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {result.left_only_skills.length > 0 ? (
                    result.left_only_skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="border-amber-400/40 bg-amber-500/10 text-[11px] font-medium uppercase tracking-wide text-amber-200"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">None</span>
                  )}
                </CardContent>
              </Card>

              {/* Right only */}
              <Card className="rounded-2xl border border-slate-700/70 bg-[#050716]/95">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-sm text-slate-100 sm:text-base">
                    <AlertCircle className="h-5 w-5 text-sky-300" />
                    Right only skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {result.right_only_skills.length > 0 ? (
                    result.right_only_skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="border-sky-400/40 bg-sky-500/10 text-[11px] font-medium uppercase tracking-wide text-sky-200"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">None</span>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Experience */}
            {typeof result.experience_diff === "number" && (
              <Card className="rounded-2xl border border-slate-700/70 bg-[#050716]/95">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm text-slate-100 sm:text-base">
                    Experience difference
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300">
                    Difference in total experience:
                    <span className="ml-2 font-semibold text-teal-300">
                      {Math.abs(result.experience_diff)} years
                    </span>
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty state */}
        {!result && (
          <Card className="rounded-2xl border border-slate-700/70 bg-[#050716]/95">
            <CardContent className="px-6 py-10 text-center sm:px-10 sm:py-12">
              <GitCompare className="mx-auto mb-4 h-14 w-14 text-slate-500 sm:h-16 sm:w-16" />
              <h3 className="mb-2 text-lg font-semibold text-slate-50 sm:text-xl">
                Select two resumes to compare
              </h3>
              <p className="text-sm text-slate-400">
                The system will highlight overlapping skills and key
                differences in experience.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
