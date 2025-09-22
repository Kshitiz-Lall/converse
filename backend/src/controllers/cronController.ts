import { Request, Response } from 'express';

interface NaturalLanguageCronRequest extends Request {
  body: {
    description: string;
  };
}

interface CronParsing {
  cronExpression: string;
  description: string;
  nextRunTimes: string[];
}

// Natural language to cron expression mapping patterns
const cronPatterns = [
  // Every minute/hour patterns
  { regex: /every\s+(\d+)\s+minutes?/i, generate: (match: RegExpMatchArray) => {
    const minutes = match[1];
    return minutes === '1' ? '* * * * *' : `*/${minutes} * * * *`;
  }},
  { regex: /every\s+minute/i, generate: () => '* * * * *' },
  { regex: /every\s+(\d+)\s+hours?/i, generate: (match: RegExpMatchArray) => {
    const hours = match[1];
    return hours === '1' ? '0 * * * *' : `0 */${hours} * * *`;
  }},
  { regex: /every\s+hour/i, generate: () => '0 * * * *' },
  
  // Daily patterns
  { regex: /every\s+day\s+at\s+(\d{1,2}):?(\d{0,2})\s*(am|pm)?/i, generate: (match: RegExpMatchArray) => {
    let hour = parseInt(match[1]);
    const minute = match[2] ? parseInt(match[2]) : 0;
    const period = match[3]?.toLowerCase();
    
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    
    return `${minute} ${hour} * * *`;
  }},
  { regex: /daily\s+at\s+(\d{1,2}):?(\d{0,2})\s*(am|pm)?/i, generate: (match: RegExpMatchArray) => {
    let hour = parseInt(match[1]);
    const minute = match[2] ? parseInt(match[2]) : 0;
    const period = match[3]?.toLowerCase();
    
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    
    return `${minute} ${hour} * * *`;
  }},
  { regex: /every\s+day/i, generate: () => '0 0 * * *' },
  { regex: /daily/i, generate: () => '0 0 * * *' },
  
  // Weekly patterns
  { regex: /every\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+at\s+(\d{1,2}):?(\d{0,2})\s*(am|pm)?/i, generate: (match: RegExpMatchArray) => {
    const dayMap: Record<string, number> = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6
    };
    
    let hour = parseInt(match[2]);
    const minute = match[3] ? parseInt(match[3]) : 0;
    const period = match[4]?.toLowerCase();
    const dayNum = dayMap[match[1].toLowerCase()];
    
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    
    return `${minute} ${hour} * * ${dayNum}`;
  }},
  { regex: /every\s+week/i, generate: () => '0 0 * * 0' },
  { regex: /weekly/i, generate: () => '0 0 * * 0' },
  
  // Weekday patterns
  { regex: /every\s+weekday\s+at\s+(\d{1,2}):?(\d{0,2})\s*(am|pm)?/i, generate: (match: RegExpMatchArray) => {
    let hour = parseInt(match[1]);
    const minute = match[2] ? parseInt(match[2]) : 0;
    const period = match[3]?.toLowerCase();
    
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    
    return `${minute} ${hour} * * 1-5`;
  }},
  { regex: /weekdays/i, generate: () => '0 9 * * 1-5' },
  
  // Monthly patterns
  { regex: /every\s+month\s+on\s+the\s+(\d{1,2})(st|nd|rd|th)?\s+at\s+(\d{1,2}):?(\d{0,2})\s*(am|pm)?/i, generate: (match: RegExpMatchArray) => {
    const day = parseInt(match[1]);
    let hour = parseInt(match[3]);
    const minute = match[4] ? parseInt(match[4]) : 0;
    const period = match[5]?.toLowerCase();
    
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    
    return `${minute} ${hour} ${day} * *`;
  }},
  { regex: /monthly/i, generate: () => '0 0 1 * *' },
  { regex: /every\s+month/i, generate: () => '0 0 1 * *' },
  
  // Yearly patterns
  { regex: /yearly/i, generate: () => '0 0 1 1 *' },
  { regex: /every\s+year/i, generate: () => '0 0 1 1 *' },
  
  // Specific time patterns
  { regex: /at\s+(\d{1,2}):(\d{2})\s*(am|pm)?/i, generate: (match: RegExpMatchArray) => {
    let hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const period = match[3]?.toLowerCase();
    
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    
    return `${minute} ${hour} * * *`;
  }},
  
  // Default fallback patterns
  { regex: /(\d{1,2})\s*(am|pm)/i, generate: (match: RegExpMatchArray) => {
    let hour = parseInt(match[1]);
    const period = match[2]?.toLowerCase();
    
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    
    return `0 ${hour} * * *`;
  }}
];

function parseNaturalLanguage(description: string): string {
  const cleanDesc = description.toLowerCase().trim();
  
  for (const pattern of cronPatterns) {
    const match = cleanDesc.match(pattern.regex);
    if (match) {
      try {
        return pattern.generate(match);
      } catch (error) {
        console.error('Error generating cron expression:', error);
        continue;
      }
    }
  }
  
  // If no patterns match, return a default daily expression
  return '0 9 * * *';
}

function getNextRunTimes(cronExpression: string): string[] {
  // Simple mock implementation - in production, use a proper cron parser library
  const now = new Date();
  const nextRuns: string[] = [];
  
  for (let i = 1; i <= 3; i++) {
    const nextTime = new Date(now.getTime() + (i * 24 * 60 * 60 * 1000)); // Add i days
    nextRuns.push(nextTime.toLocaleString());
  }
  
  return nextRuns;
}

export const parseNaturalLanguageCron = async (
  req: NaturalLanguageCronRequest,
  res: Response
): Promise<void> => {
  try {
    const { description } = req.body;
    
    if (!description || typeof description !== 'string') {
      res.status(400).json({
        error: 'Description is required and must be a string'
      });
      return;
    }
    
    if (description.trim().length === 0) {
      res.status(400).json({
        error: 'Description cannot be empty'
      });
      return;
    }
    
    const cronExpression = parseNaturalLanguage(description);
    const nextRunTimes = getNextRunTimes(cronExpression);
    
    const result: CronParsing = {
      cronExpression,
      description: description.trim(),
      nextRunTimes
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in parseNaturalLanguageCron:', error);
    res.status(500).json({
      error: 'Failed to parse natural language input'
    });
  }
};