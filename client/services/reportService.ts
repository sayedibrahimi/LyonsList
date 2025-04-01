// client/services/reportService.ts
// Purpose: Handle reporting listings
// Description: This file contains methods for handling reporting listings, including submitting a report and retrieving valid report categories. This service interacts with the API to submit reports and provides a list of valid report categories.
import { apiService } from './api';

interface ReportData {
  category: string;
  message?: string;
}

export const reportService = {
  // Report a listing
  reportListing: async (listingId: string, reportData: ReportData): Promise<any> => {
    try {
      const response = await apiService.post(`/listings/report/${listingId}`, reportData);
      return (response as any).data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get valid report categories
  getReportCategories: () => {
    return [
      "Prohibited or illegal items",
      "Counterfeit or fake products",
      "Misleading or inaccurate description",
      "Spam or repetitive listing",
      "Inappropriate content or imagery",
      "Contains personal information",
      "Other violation"
    ];
  }
};