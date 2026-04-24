export type Tone =
  | "Inspirational"
  | "Casual"
  | "Contrarian"
  | "Educational"
  | "Founder-style"
  | "Storytelling"
  | "Professional";

export type PostFormat =
  | "Story"
  | "List"
  | "Hot take"
  | "Announcement"
  | "Lessons learned"
  | "How-to"
  | "Personal reflection";

export type PostLength = "Short" | "Medium" | "Long";

export type ScoreBreakdown = {
  overallScore: number;
  hookStrength: { score: number; tip: string };
  readability: { score: number; tip: string };
  ctaClarity: { score: number; tip: string };
  hashtagRelevance: { score: number; tip: string };
};
