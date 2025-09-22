import { API_URL } from '../config';

export interface CronParseResponse {
  cronExpression: string;
  description: string;
  nextRunTimes: string[];
}

export interface CronParseRequest {
  description: string;
}

export const parseNaturalLanguageCron = async (request: CronParseRequest): Promise<CronParseResponse> => {
  const response = await fetch(`${API_URL}/cron/parse-natural-language`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to parse natural language input');
  }

  return response.json();
};