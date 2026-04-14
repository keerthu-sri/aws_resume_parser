import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  Trash2,
  Pencil,
} from "lucide-react";

import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { ConfidenceBadge } from "../components/ConfidenceBadge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { api } from "../../services/api";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  education: string[];
  extractionConfidence: number;
  uploadDate: string;
  rawText?: string;
}

export function Repository() {
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);
  const [editingCandidate, setEditingCandidate] =
    useState<Candidate | null>(null);

  const fetchResumes = async () => {
    const res = await api.get("/api/resumes");
    const normalized: Candidate[] = res.data.map((r: any) => ({
      id: r.id,
      name: r.name || "Unknown",
      email: r.email || "—",
      phone: r.phone || "—",
      skills: r.skills || [],
      education: r.education || [],
      extractionConfidence: r.manually_corrected ? 95 : 80,
      uploadDate: new Date().toISOString(),
      rawText: r.raw_text,
    }));
    setCandidates(normalized);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const deleteCandidate = async (id: string) => {
    if (!confirm("Delete this candidate permanently?")) return;
    await api.delete(`/api/resumes/${id}`);
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    setSelectedCandidate(null);
  };

  const saveEdits = async () => {
    if (!editingCandidate) return;
    await api.put(`/api/resumes/${editingCandidate.id}`, editingCandidate);
    await fetchResumes();
    setEditingCandidate(null);
  };

  const filteredCandidates = candidates.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q));
    return matchesSearch;
  });

  return (
    <div className="relative min-h-full">
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(192,132,252,0.25),_transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl space-y-6 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        {/* HEADER */}
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Candidate repository
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl md:text-4xl">
              Parsed resume directory
            </h1>
            <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400" />
          </div>
          <p className="text-sm text-slate-400">
            {candidates.length} resumes parsed and searchable
          </p>
        </header>

        {/* SEARCH */}
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search by name, email, skill"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border-slate-700 bg-slate-950/90 pl-10 text-slate-100"
            />
          </div>
        </section>

        {/* GRID */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredCandidates.map((c) => (
            <Card
              key={c.id}
              className="rounded-2xl border border-slate-700/70 bg-[#050716]/95 shadow-[0_0_30px_rgba(15,23,42,0.9)]"
            >
              <CardContent className="space-y-4 px-4 py-4 sm:p-6">
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start sm:gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-slate-50 sm:text-lg">
                      {c.name}
                    </h3>
                    <div className="mt-1 space-y-1 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{c.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{c.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full justify-start sm:w-auto sm:justify-end">
                    <ConfidenceBadge confidence={c.extractionConfidence} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {c.skills.slice(0, 6).map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="border-emerald-400/40 bg-emerald-500/10 text-[11px] font-medium uppercase tracking-wide text-emerald-300"
                    >
                      {s}
                    </Badge>
                  ))}
                  {c.skills.length > 6 && (
                    <Badge className="rounded-full bg-slate-900 text-[11px] text-slate-300">
                      +{c.skills.length - 6} more
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-800 pt-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(c.uploadDate).toLocaleDateString()}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-slate-600 bg-slate-900/70 text-xs"
                      onClick={() => setSelectedCandidate(c)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-slate-600 bg-slate-900/70 text-xs"
                      onClick={() => setEditingCandidate(c)}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-full text-xs"
                      onClick={() => deleteCandidate(c.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredCandidates.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-slate-500">
              No candidates match your search.
            </p>
          )}
        </section>

        {/* VIEW MODAL */}
        <Dialog
          open={!!selectedCandidate}
          onOpenChange={() => setSelectedCandidate(null)}
        >
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto rounded-2xl border-slate-700 bg-[#050716]/95">
            {selectedCandidate && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-lg text-slate-50">
                    {selectedCandidate.name}
                  </DialogTitle>
                </DialogHeader>

                <h3 className="mt-4 text-sm font-semibold text-slate-200">
                  Education
                </h3>
                <div className="mt-2 space-y-2">
                  {selectedCandidate.education.map((e, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-700 bg-slate-900/80 p-2 text-sm text-slate-200"
                    >
                      {e}
                    </div>
                  ))}
                  {selectedCandidate.education.length === 0 && (
                    <p className="text-xs text-slate-500">
                      No education parsed.
                    </p>
                  )}
                </div>

                <Collapsible className="mt-4">
                  <CollapsibleTrigger className="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <ChevronDown className="h-4 w-4" />
                    Raw text
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <pre className="mt-2 max-h-64 overflow-y-auto rounded-xl bg-slate-900/90 p-3 text-[11px] text-slate-200">
                      {selectedCandidate.rawText}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* EDIT MODAL */}
        <Dialog
          open={!!editingCandidate}
          onOpenChange={() => setEditingCandidate(null)}
        >
          <DialogContent className="max-w-md rounded-2xl border-slate-700 bg-[#050716]/95">
            <DialogHeader>
              <DialogTitle className="text-lg text-slate-50">
                Edit candidate
              </DialogTitle>
            </DialogHeader>

            {editingCandidate && (
              <div className="space-y-3">
                <Input
                  value={editingCandidate.name}
                  onChange={(e) =>
                    setEditingCandidate({
                      ...editingCandidate,
                      name: e.target.value,
                    })
                  }
                  className="rounded-xl border-slate-700 bg-slate-900/90 text-slate-100"
                />
                <Input
                  value={editingCandidate.email}
                  onChange={(e) =>
                    setEditingCandidate({
                      ...editingCandidate,
                      email: e.target.value,
                    })
                  }
                  className="rounded-xl border-slate-700 bg-slate-900/90 text-slate-100"
                />
                <Input
                  value={editingCandidate.phone}
                  onChange={(e) =>
                    setEditingCandidate({
                      ...editingCandidate,
                      phone: e.target.value,
                    })
                  }
                  className="rounded-xl border-slate-700 bg-slate-900/90 text-slate-100"
                />

                <Button
                  onClick={saveEdits}
                  className="mt-2 w-full rounded-xl bg-[#009688] text-white shadow-[0_0_18px_rgba(0,150,136,0.45)] transition-all duration-300 hover:bg-[#26A69A] hover:shadow-[0_0_28px_rgba(0,150,136,0.65)]"
                >
                  Save changes
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
