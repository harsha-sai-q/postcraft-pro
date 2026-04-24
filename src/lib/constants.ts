import { PostFormat, Tone } from "./types";

export const tones: Tone[] = [
  "Inspirational",
  "Casual",
  "Contrarian",
  "Educational",
  "Founder-style",
  "Storytelling",
  "Professional"
];

export const formats: PostFormat[] = [
  "Story",
  "List",
  "Hot take",
  "Announcement",
  "Lessons learned",
  "How-to",
  "Personal reflection"
];

export const lengths = ["Short", "Medium", "Long"] as const;
