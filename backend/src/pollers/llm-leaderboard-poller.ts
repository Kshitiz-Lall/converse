import fs from "fs";
import path from "path";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";

// Type definitions
interface LeaderboardData {
  [key: string]: {
    id: string;
    model: {
      name: string;
      sha: string;
      precision: string;
      type: string;
      weight_type: string;
      architecture: string;
      average_score: number;
      has_chat_template: boolean;
    };
    evaluations: Record<
      string,
      {
        name: string;
        value: number;
        normalized_score: number;
      }
    >;
    features: {
      is_not_available_on_hub: boolean;
      is_merged: boolean;
      is_moe: boolean;
      is_flagged: boolean;
      is_official_provider: boolean;
    };
    metadata: {
      upload_date: string;
      submission_date: string;
      generation: number;
      base_model: string;
      hub_license: string;
      hub_hearts: number;
      params_billions: number;
      co2_cost: number;
    };
  };
}

interface LastPollData {
  timestamp: string;
  filename: string;
}

// Configuration
const DATA_DIR = path.join(
  __dirname,
  "../../constants/data/llm-calculation-data"
);
const API_URL =
  "https://open-llm-leaderboard-open-llm-leaderboard.hf.space/api/leaderboard/formatted";
const POLL_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

// Ensure data directory exists
function ensureDataDirectory(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`Created data directory at ${DATA_DIR}`);
  }
}

// Fetch data from API with proper typing
async function fetchLeaderboardData(): Promise<LeaderboardData | null> {
  try {
    console.log(`Fetching data from ${API_URL}...`);
    const response = await axios.get<LeaderboardData>(API_URL);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error fetching leaderboard data:", axiosError.message);

    if (axiosError.response) {
      console.error("Response status:", axiosError.response.status);
      console.error("Response data:", axiosError.response.data);
    }

    return null;
  }
}

// Generate filename with current timestamp
function generateFilename(): string {
  const now = new Date();
  return `leaderboard-${format(now, "yyyy-MM-dd-HH-mm-ss")}.json`;
}

// Save data to file with error handling
function saveData(data: LeaderboardData | null): string | null {
  if (!data) {
    console.log("No data to save");
    return null;
  }

  const filename = generateFilename();
  const filepath = path.join(DATA_DIR, filename);

  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`Data saved to ${filename}`);

    // Update last-poll.json
    const lastPollData: LastPollData = {
      timestamp: new Date().toISOString(),
      filename: filename,
    };

    const lastPollPath = path.join(DATA_DIR, "last-poll.json");
    fs.writeFileSync(lastPollPath, JSON.stringify(lastPollData, null, 2));

    return filepath;
  } catch (error) {
    const fsError = error as NodeJS.ErrnoException;
    console.error("Error saving data:", fsError.message);

    if (fsError.code) {
      console.error("Error code:", fsError.code);
    }

    return null;
  }
}

// Main polling function
async function poll(): Promise<void> {
  console.log("Starting LLM Leaderboard poller...");
  ensureDataDirectory();

  // Initial poll
  const data = await fetchLeaderboardData();
  saveData(data);

  // Set up interval polling
  setInterval(async () => {
    const data = await fetchLeaderboardData();
    saveData(data);
  }, POLL_INTERVAL_MS);
}

// Run immediately if this is the main module
if (require.main === module) {
  poll().catch((error) => {
    console.error("Poller failed:", error);
    process.exit(1);
  });
}

// Export for programmatic use
export { LeaderboardData, LastPollData, fetchLeaderboardData, saveData, poll };
