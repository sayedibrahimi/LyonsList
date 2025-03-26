export const ReportCategory: Record<string, string> = {
  PROHIBITED_ITEMS: "Prohibited or illegal items",
  COUNTERFEIT: "Counterfeit or fake products",
  MISLEADING: "Misleading or inaccurate description",
  SPAM: "Spam or repetitive listing",
  INAPPROPRIATE: "Inappropriate content or imagery",
  PERSONAL_INFO: "Contains personal information",
  OTHER: "Other violation",
};

export function isValidReportCategory(category: string): boolean {
  return Object.values(ReportCategory).includes(category);
}
