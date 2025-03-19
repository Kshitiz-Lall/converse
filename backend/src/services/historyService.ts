// backend/src/services/historyService.ts
import RequestHistory, { IRequestHistory } from "./../models/RequestHistory";

// Define history item interface
export interface RequestHistoryItem {
  id?: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  response?: any;
  timestamp: Date;
}

/**
 * Save a request to history
 */
export const saveRequestToHistory = async (
  requestData: RequestHistoryItem
): Promise<void> => {
  try {
    // Add unique ID and timestamp
    const newHistoryItem: RequestHistoryItem = {
      ...requestData,
      id: generateId(),
      timestamp: new Date(),
    };

    // Save to MongoDB
    await RequestHistory.create(newHistoryItem);

    // Optional: Limit history size to 100 items by removing oldest entries
    const historyCount = await RequestHistory.countDocuments();
    if (historyCount > 100) {
      // Find the oldest entries to remove
      const excessCount = historyCount - 100;
      const oldestEntries = await RequestHistory.find({})
        .sort({ timestamp: 1 })
        .limit(excessCount);

      if (oldestEntries.length > 0) {
        const oldestIds = oldestEntries.map((entry) => entry.id);
        await RequestHistory.deleteMany({ id: { $in: oldestIds } });
      }
    }
  } catch (error) {
    console.error("Error saving request to history:", error);
    throw error;
  }
};

/**
 * Get request history items with pagination
 */
export const getRequestHistoryItems = async (
  limit = 20,
  offset = 0
): Promise<{ items: RequestHistoryItem[]; total: number }> => {
  try {
    // Get total count
    const total = await RequestHistory.countDocuments();

    // Get paginated data
    const items = await RequestHistory.find({})
      .sort({ timestamp: -1 }) // Newest first
      .skip(offset)
      .limit(limit)
      .lean();

    return {
      items: items as RequestHistoryItem[],
      total,
    };
  } catch (error) {
    console.error("Error getting request history:", error);
    throw error;
  }
};

/**
 * Clear all request history
 */
export const clearHistory = async (): Promise<void> => {
  try {
    await RequestHistory.deleteMany({});
  } catch (error) {
    console.error("Error clearing request history:", error);
    throw error;
  }
};

/**
 * Generate a simple unique ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 12);
};
