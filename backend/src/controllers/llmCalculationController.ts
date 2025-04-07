import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(
  __dirname,
  "../../constants/data/llm-calculation-data"
);
const LAST_POLL_FILE = path.join(DATA_DIR, "last-poll.json");

export const getLatestLeaderboardData = (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(LAST_POLL_FILE)) {
      return res.status(404).json({ error: "No poll data found yet." });
    }

    const lastPollRaw = fs.readFileSync(LAST_POLL_FILE, "utf-8");
    const { filename } = JSON.parse(lastPollRaw);
    const leaderboardFilePath = path.join(DATA_DIR, filename);

    if (!fs.existsSync(leaderboardFilePath)) {
      return res.status(404).json({ error: "Leaderboard data file missing." });
    }

    const fileContent = fs.readFileSync(leaderboardFilePath, "utf-8");
    let leaderboardArray = JSON.parse(fileContent) as any[];

    // ─────────────────────────────
    // 🧠 Filtering
    const sizeFilter = (req.query.size as string)?.toLowerCase();
    const officialFilter = req.query.official === "true";
    const search = (req.query.search as string)?.toLowerCase();
    const baseModel = (req.query.base_model as string)?.toLowerCase();
    const minHearts = parseInt(req.query.min_hearts as string);
    const maxHearts = parseInt(req.query.max_hearts as string);
    const minParams = parseFloat(req.query.min_params as string);
    const maxParams = parseFloat(req.query.max_params as string);
    const merged = req.query.merged === "true";
    const moe = req.query.moe === "true";
    const available = req.query.available === "true";

    leaderboardArray = leaderboardArray.filter((entry) => {
      const size = entry.metadata?.params_billions || 0;
      const isOfficial = entry.features?.is_official_provider;
      const isMerged = entry.features?.is_merged;
      const isMoe = entry.features?.is_moe;
      const isAvailable = !entry.features?.is_not_available_on_hub;
      const hearts = entry.metadata?.hub_hearts ?? 0;
      const params = entry.metadata?.params_billions ?? 0;
      const modelName = entry.model?.name?.toLowerCase() ?? "";
      const base = entry.metadata?.base_model?.toLowerCase() ?? "";

      // Size Category Filter
      let sizeMatch = true;
      if (sizeFilter === "edge") sizeMatch = size <= 3;
      else if (sizeFilter === "smol") sizeMatch = size > 3 && size <= 7;
      else if (sizeFilter === "mid") sizeMatch = size > 7 && size <= 65;
      else if (sizeFilter === "gpu") sizeMatch = size > 65;

      // Apply filters
      const officialMatch = officialFilter ? isOfficial === true : true;
      const searchMatch = search ? modelName.includes(search) : true;
      const baseMatch = baseModel ? base === baseModel : true;
      const heartsMatch =
        (!isNaN(minHearts) ? hearts >= minHearts : true) &&
        (!isNaN(maxHearts) ? hearts <= maxHearts : true);
      const paramsMatch =
        (!isNaN(minParams) ? params >= minParams : true) &&
        (!isNaN(maxParams) ? params <= maxParams : true);
      const mergedMatch = req.query.merged ? isMerged === merged : true;
      const moeMatch = req.query.moe ? isMoe === moe : true;
      const availableMatch = req.query.available
        ? isAvailable === available
        : true;

      return (
        sizeMatch &&
        officialMatch &&
        searchMatch &&
        baseMatch &&
        heartsMatch &&
        paramsMatch &&
        mergedMatch &&
        moeMatch &&
        availableMatch
      );
    });

    // ─────────────────────────────
    // 🔁 Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit =
      parseInt(req.query.limit as string) || leaderboardArray.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = leaderboardArray.slice(start, end);

    return res.status(200).json({
      page,
      limit,
      total: leaderboardArray.length,
      totalPages: Math.ceil(leaderboardArray.length / limit),
      data: paginatedData,
    });
  } catch (error) {
    console.error("Error loading leaderboard data:", error);
    return res.status(500).json({ error: "Failed to load leaderboard data." });
  }
};
