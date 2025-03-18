// backend/src/services/historyService.ts
import fs from "fs/promises";
import path from "path";

// Define history storage file path
const HISTORY_FILE = path.join(__dirname, "../../data/request-history.json");

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
 * Ensure the history file and directory exist
 */
const ensureHistoryFile = async (): Promise<void> => {
  try {
    // Ensure directory exists
    const directory = path.dirname(HISTORY_FILE);
    await fs.mkdir(directory, { recursive: true });

    // Check if file exists
    try {
      await fs.access(HISTORY_FILE);
    } catch (error) {
      // Create empty history file if it doesn't exist
      await fs.writeFile(HISTORY_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error("Error ensuring history file exists:", error);
    throw error;
  }
};

/**
 * Save a request to history
 */
export const saveRequestToHistory = async (
  requestData: RequestHistoryItem
): Promise<void> => {
  try {
    await ensureHistoryFile();

    // Read existing history
    const historyContent = await fs.readFile(HISTORY_FILE, "utf-8");
    const history: RequestHistoryItem[] = JSON.parse(historyContent || "[]");

    // Add unique ID and timestamp
    const newHistoryItem: RequestHistoryItem = {
      ...requestData,
      id: generateId(),
      timestamp: new Date(),
    };

    // Add to history (at the beginning to show newest first)
    history.unshift(newHistoryItem);

    // Limit history size to 100 items
    const limitedHistory = history.slice(0, 100);

    // Write updated history back to file
    await fs.writeFile(HISTORY_FILE, JSON.stringify(limitedHistory, null, 2));
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
    await ensureHistoryFile();

    // Read history file
    const historyContent = await fs.readFile(HISTORY_FILE, "utf-8");
    const history: RequestHistoryItem[] = JSON.parse(historyContent || "[]");

    // Paginate the results
    const paginatedHistory = history.slice(offset, offset + limit);

    return {
      items: paginatedHistory,
      total: history.length,
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
    await ensureHistoryFile();
    await fs.writeFile(HISTORY_FILE, JSON.stringify([]));
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
