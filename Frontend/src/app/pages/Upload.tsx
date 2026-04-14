import { useState } from "react";
import { Upload as UploadIcon, FileText, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ConfidenceBadge } from "../components/ConfidenceBadge";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../../services/api";

interface UploadedFile {
  name: string;
  status: "uploading" | "completed" | "error";
  progress: number;
  candidate?: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    education: string[];
    confidence: number;
    ocrUsed: boolean;
  };
}

export function Upload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadResume = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    setFiles((prev) => [
      ...prev,
      {
        name: file.name,
        status: "uploading",
        progress: 50,
      },
    ]);

    try {
      const res = await api.post("/api/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { resume, confidence } = res.data;

      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name
            ? {
                ...f,
                status: "completed",
                progress: 100,
                candidate: {
                  name: resume.name || "—",
                  email: resume.email || "—",
                  phone: resume.phone || "—",
                  skills: resume.skills || [],
                  education: resume.education?.join(", ") || "—",
                  confidence:
                    confidence.skills === "high"
                      ? 90
                      : confidence.skills === "medium"
                      ? 70
                      : 50,
                  ocrUsed: confidence.ocr_used,
                },
              }
            : f
        )
      );
    } catch (err) {
      console.error(err);
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name ? { ...f, status: "error", progress: 0 } : f
        )
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    Array.from(e.dataTransfer.files).forEach((file) => {
      if (
        file.type === "application/pdf" ||
        file.type.includes("word/") ||
        file.name.toLowerCase().endsWith(".docx") ||
        file.name.toLowerCase().endsWith(".doc")
      ) {
        uploadResume(file);
      }
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach((file) => {
      if (
        file.type === "application/pdf" ||
        file.type.includes("word/") ||
        file.name.toLowerCase().endsWith(".docx") ||
        file.name.toLowerCase().endsWith(".doc")
      ) {
        uploadResume(file);
      }
    });
  };

  return (
    <div className="relative min-h-full">
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(192,132,252,0.25),_transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl space-y-6 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
            Upload & parse
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl md:text-4xl">
            AI‑powered resume ingestion
          </h1>
          <div className="mt-3 h-1.5 w-20 rounded-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400" />
          <p className="text-sm text-slate-400">
            Intelligent document parsing with OCR fallback and confidence
            tracking.
          </p>
        </header>

        {/* Upload Area */}
        <Card className="rounded-2xl border border-slate-800/80 bg-[#050716]/95 shadow-[0_0_30px_rgba(15,23,42,0.9)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm text-slate-100 sm:text-base">
              <UploadIcon className="h-5 w-5 text-teal-300" />
              Upload documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-colors sm:p-8 lg:p-10 ${
                isDragging
                  ? "border-[#26A69A] bg-[#009688]/10"
                  : "border-slate-700 bg-slate-950/70 hover:border-[#26A69A]"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <UploadIcon className="mx-auto mb-4 h-12 w-12 text-slate-400 sm:h-16 sm:w-16" />
              <h3 className="mb-1 text-lg font-semibold text-slate-50 sm:text-xl">
                Drag & drop PDF or DOCX resumes
              </h3>
              <p className="mb-6 text-sm text-slate-400">
                or click below to browse your files
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileSelect}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <Button
                size="lg"
                className="rounded-xl bg-[#009688] text-white shadow-[0_0_18px_rgba(0,150,136,0.45)] transition-all duration-300 hover:bg-[#26A69A] hover:shadow-[0_0_28px_rgba(0,150,136,0.65)]"
              >
                <FileText className="mr-2 h-5 w-5" />
                Select PDF/DOCX files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        {files.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-slate-50 sm:text-xl">
                Processing status
              </h2>
              <Badge
                variant="outline"
                className="self-start border-slate-600 bg-slate-900/70 text-xs text-slate-300"
              >
                {files.length} file{files.length > 1 ? "s" : ""} uploaded
              </Badge>
            </div>

            <AnimatePresence>
              {files.map((file, index) => (
                <motion.div
                  key={file.name + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Card className="rounded-2xl border border-slate-700/80 bg-[#050716]/95">
                    <CardContent className="space-y-4 px-4 py-4 sm:p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex gap-3">
                          <FileText className="h-6 w-6 text-slate-400" />
                          <div>
                            <h3 className="font-medium text-slate-50">
                              {file.name}
                            </h3>
                            {file.status === "uploading" && (
                              <p className="text-sm text-slate-400">
                                Uploading & parsing…
                              </p>
                            )}
                            {file.status === "completed" && (
                              <p className="flex items-center gap-1 text-sm text-emerald-400">
                                <CheckCircle className="h-4 w-4" />
                                Parsing completed
                              </p>
                            )}
                            {file.status === "error" && (
                              <p className="text-sm text-rose-400">
                                Error while processing
                              </p>
                            )}
                          </div>
                        </div>

                        {file.status !== "completed" && (
                          <Badge
                            variant="outline"
                            className="self-start border-slate-600 bg-slate-900/70 text-xs text-slate-200"
                          >
                            {file.progress}%
                          </Badge>
                        )}
                      </div>

                      {file.status === "uploading" && (
                        <Progress
                          value={file.progress}
                          className="h-2 rounded-full bg-slate-800"
                        />
                      )}

                      {file.status === "completed" && file.candidate && (
                        <div className="space-y-3 rounded-xl bg-slate-900/80 p-4 text-sm text-slate-200">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h4 className="font-semibold">
                              Extracted candidate data
                            </h4>
                            <div className="flex flex-wrap items-center gap-2">
                              <ConfidenceBadge
                                confidence={file.candidate.confidence}
                              />
                              {file.candidate.ocrUsed && (
                                <Badge
                                  variant="outline"
                                  className="border-teal-300/60 bg-teal-500/10 text-[11px] uppercase tracking-wide text-teal-200"
                                >
                                  OCR used
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                Name
                              </span>
                              <p className="font-medium text-slate-50">
                                {file.candidate.name}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                Email
                              </span>
                              <p className="font-medium">
                                {file.candidate.email}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                Phone
                              </span>
                              <p className="font-medium">
                                {file.candidate.phone}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                Education
                              </span>
                              <p className="font-medium">
                                {file.candidate.education}
                              </p>
                            </div>
                          </div>

                          <div>
                            <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                              Skills
                            </span>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {file.candidate.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="rounded-full bg-slate-800 text-[11px] text-slate-100"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </section>
        )}
      </div>
    </div>
  );
}
