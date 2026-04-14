export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  extractionConfidence: number;
  ocrUsed: boolean;
  uploadDate: string;
  rawText?: string;
  confidenceBreakdown: {
    personalInfo: number;
    skills: number;
    education: number;
    experience: number;
  };
}

export interface SystemMetrics {
  totalResumes: number;
  ocrPercentage: number;
  avgMatchScore: number;
  lowConfidenceCount: number;
  manualOverrides: number;
}

export interface MatchResult {
  candidateId: string;
  candidateName: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
}

export interface Activity {
  id: string;
  type: 'parse' | 'match' | 'correction';
  message: string;
  timestamp: string;
}
