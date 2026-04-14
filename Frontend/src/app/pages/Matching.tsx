import { useState } from "react";
import { Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { api } from "../../services/api";
import { motion, AnimatePresence } from "motion/react";

interface MatchResult {
  id: string;
  name: string;
  score: number;
  quality: number;
  matched_skills: string[];
  missing_skills: string[];
  summary: string;
}

export function Matching() {
  const [jobDescription, setJobDescription] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);

  const performMatching = async () => {
    setIsMatching(true);
    setMatchResults([]);

    try {
      const res = await api.post("/api/jobs/match", {
        job: jobDescription,
        resume_ids: null,
      });
      setMatchResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Matching failed:", err);
    } finally {
      setIsMatching(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-300";
    return "text-rose-400";
  };

  return (
    <div className="relative min-h-full">
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(192,132,252,0.25),_transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl space-y-6 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        {/* Header */}
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Talent–Role Matching
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl md:text-4xl">
              ML‑powered candidate ranking
            </h1>
            <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400" />
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-400 md:text-xs">
            <Target className="h-4 w-4 text-sky-300" />
            <span>Semantic similarity over parsed resumes</span>
          </div>
        </header>

        {/* Job Description */}
        <Card className="rounded-2xl border border-slate-700/80 bg-[#050716]/95 shadow-[0_0_32px_rgba(15,23,42,0.85)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-slate-100 sm:text-base">
              <Target className="h-5 w-5 text-sky-300" />
              Job description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste the role description, key responsibilities and required skills..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[180px] rounded-xl border-slate-700 bg-slate-950/90 font-mono text-sm text-slate-100"
            />
            <div className="flex flex-col items-start gap-3 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
              <p>{jobDescription.length} characters</p>
              <Button
              size="lg"
              onClick={performMatching}
              disabled={!jobDescription.trim() || isMatching}
              className="w-full md:w-auto rounded-xl bg-[#009688] text-white shadow-[0_0_18px_rgba(0,150,136,0.45)] transition-all duration-300 hover:bg-[#26A69A] hover:shadow-[0_0_28px_rgba(0,150,136,0.65)]"
            >
              {isMatching ? "Matching..." : "Match candidates"}
            </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        {isMatching && (
          <Card className="rounded-2xl border border-slate-700/80 bg-[#050716]/95">
            <CardContent className="space-y-3 px-4 py-4 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium text-slate-100">
                  Running semantic similarity analysis…
                </p>
                <Badge
                  variant="outline"
                  className="self-start border-sky-400/50 bg-sky-500/10 text-[11px] uppercase tracking-wide text-sky-300"
                >
                  Processing
                </Badge>
              </div>
              <Progress value={70} className="h-2 rounded-full bg-slate-800" />
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {matchResults.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">
                Match results
              </h2>
              <Badge
                variant="outline"
                className="self-start border-slate-600 bg-slate-900/70 text-xs text-slate-300"
              >
                {matchResults.length} candidates ranked
              </Badge>
            </div>

            <AnimatePresence>
              {matchResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                >
                  <Card className="rounded-2xl border border-slate-700/80 bg-[#050716]/95">
                    <CardContent className="space-y-4 px-4 py-4 sm:p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="rounded-full border-slate-600 bg-slate-900/70 text-[11px] text-slate-200"
                          >
                            #{index + 1}
                          </Badge>
                          <div>
                            <h3 className="text-base font-semibold text-slate-50 sm:text-lg">
                              {result.name || "Unknown candidate"}
                            </h3>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                              Ranked by semantic similarity
                            </p>
                          </div>
                        </div>

                        <div className="text-left md:text-right">
                          <div
                            className={`text-2xl font-bold sm:text-3xl ${scoreColor(
                              result.score
                            )}`}
                          >
                            {result.score}%
                          </div>
                          <p className="text-xs text-slate-400">Match score</p>
                        </div>
                      </div>

                      {/* Score bar */}
                      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                        <motion.div
                          className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${result.score}%` }}
                        />
                      </div>

                      {/* Explanation */}
                      <div className="grid gap-3 text-xs text-slate-200 md:grid-cols-3">
                        <div className="rounded-xl bg-slate-900/80 p-3">
                          <p className="mb-1 font-semibold text-emerald-300">
                            Matched skills
                          </p>
                          <p className="text-[11px] text-slate-300">
                            {result.matched_skills.length
                              ? result.matched_skills.join(", ")
                              : "None detected"}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-900/80 p-3">
                          <p className="mb-1 font-semibold text-amber-300">
                            Missing skills
                          </p>
                          <p className="text-[11px] text-slate-300">
                            {result.missing_skills.length
                              ? result.missing_skills.join(", ")
                              : "No major gaps"}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-900/80 p-3">
                          <p className="mb-1 font-semibold text-sky-300">
                            Extra skills
                          </p>
                          
                        </div>
                        <div className="rounded-xl bg-slate-900/80 p-3">
  <p className="mb-1 font-semibold text-purple-300">
    AI Summary
  </p>
  <p className="text-[11px] text-slate-300">
    {result.summary || "No summary available"}
  </p>
</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </section>
        )}

        {/* Empty state */}
        {!isMatching && matchResults.length === 0 && jobDescription && (
          <Card className="rounded-2xl border border-slate-700/70 bg-[#050716]/95">
            <CardContent className="px-6 py-10 text-center sm:px-10 sm:py-12">
              <TrendingUp className="mx-auto mb-4 h-14 w-14 text-slate-500 sm:h-16 sm:w-16" />
              <h3 className="mb-2 text-lg font-semibold text-slate-50 sm:text-xl">
                Ready to match
              </h3>
              <p className="text-sm text-slate-400">
                Click <span className="font-medium">“Match candidates”</span> to
                run ML analysis and see ranked results.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
