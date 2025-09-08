import { Request, Response } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';
import { successResponse, errorResponse } from '../utils/responseUtils';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class Website {
  url: string;
  title: string;
  text: string;

  constructor(url: string, html: string) {
    const $ = cheerio.load(html);
    this.url = url;
    this.title = $('title').text() || 'No Title';

    // Remove irrelevant elements
    $('script, style, nav, header, footer, aside').remove();

    this.text = $('body').text().replace(/\s\s+/g, ' ').trim();
  }
}

const system_prompt = `You are an assistant that analyzes the contents of a website and provides a short summary, ignoring text that might be navigation related. Respond in markdown.`;

const user_prompt_for = (website: Website) => {
  let user_prompt = `You are looking at a website titled ${website.title}\n\n`;
  user_prompt += `The contents of this website is as follows; please provide a short summary of this website in markdown. If it includes news or announcements, then summarize these too.\n\n`;
  user_prompt += website.text;
  return user_prompt;
};

export const summarizeUrl = async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return errorResponse(res, 'URL is required', 400);
  }

  try {
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    };
    const pageResponse = await axios.get(url, { headers });
    const webObject = new Website(url, pageResponse.data);

    const messages: any = [
      { role: 'system', content: system_prompt },
      { role: 'user', content: user_prompt_for(webObject) },
    ];

    const openAIResponse = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
    });

    successResponse(res, { summary: openAIResponse.choices[0].message.content });
  } catch (error) {
    console.error(error);
    errorResponse(res, 'Error summarizing URL', 500);
  }
};
