import { Volume } from "@/services/api";

/**
 * Returns the correct cover image URL for a volume based on the issue number.
 * Issue 2 shows coverImageIssue2 (if set), all others default to coverImage.
 */
export const getVolumeImage = (
  volume: Volume | null | undefined,
  issueNumber?: number,
): string => {
  if (!volume) return "/issue-cover.png";
  if (issueNumber === 2 && volume.coverImageIssue2) {
    return volume.coverImageIssue2;
  }
  return volume.coverImage || "/issue-cover.png";
};
