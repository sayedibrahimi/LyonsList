// utils/dateUtils.ts

/**
 * Converts a timestamp to a human-readable "time ago" string
 * @param timestamp The date string to convert
 * @returns A human-readable string like "Today", "2 days ago", etc.
 */
export function getTimeAgo(timestamp: string): string {
  const postTime = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - postTime.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  } else {
    return `${Math.floor(diffDays / 30)} months ago`;
  }
}

/**
 * Formats a date string to a localized date format
 * @param dateStr The date string to format
 * @returns A formatted date string
 */
export function formatDate(dateStr: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}