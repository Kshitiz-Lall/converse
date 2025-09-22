// src/services/aiFormatApi.ts
import axios from 'axios';
import { DataFormat } from 'constants/converter';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface AIConversionOptions {
  optimize?: boolean;
  addComments?: boolean;
  fixErrors?: boolean;
}

interface AIConversionResponse {
  result: string;
  method: 'ai_enhanced' | 'standard' | 'fallback_standard';
  aiEnhanced: boolean;
  aiError?: string;
}

interface AIAnalysisResponse {
  analysis: {
    structure_analysis?: string;
    issues?: string[];
    recommendations?: string[];
    optimizations?: string[];
    validation_notes?: string;
    analysis?: string; // fallback field
  };
  originalFormat: string;
}

// AI-powered format conversion API calls
export const aiFormatApi = {
  // AI-powered format conversion with intelligent error handling
  convertFormat: async (
    inputText: string, 
    inputFormat: DataFormat, 
    outputFormat: DataFormat,
    options: AIConversionOptions = {}
  ): Promise<{ result: string; error: string | null; aiEnhanced?: boolean; method?: string }> => {
    try {
      const response = await api.post('/ai-format/convert', {
        inputText,
        inputFormat,
        outputFormat,
        options,
      });
      
      const data: AIConversionResponse = response.data.data;
      return { 
        result: data.result, 
        error: null,
        aiEnhanced: data.aiEnhanced,
        method: data.method
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { 
          result: '', 
          error: error.response.data.error || 'AI conversion failed',
          aiEnhanced: false
        };
      }
      return { 
        result: '', 
        error: 'Network error. Please try again.',
        aiEnhanced: false
      };
    }
  },

  // AI-powered format beautification and optimization
  beautifyFormat: async (
    inputText: string, 
    format: DataFormat,
    options: AIConversionOptions = {}
  ): Promise<{ result: string; error: string | null; aiEnhanced?: boolean; method?: string }> => {
    try {
      const response = await api.post('/ai-format/beautify', {
        inputText,
        format,
        options,
      });
      
      const data: AIConversionResponse = response.data.data;
      return { 
        result: data.result, 
        error: null,
        aiEnhanced: data.aiEnhanced,
        method: data.method
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { 
          result: inputText, 
          error: error.response.data.error || 'AI beautification failed',
          aiEnhanced: false
        };
      }
      return { 
        result: inputText, 
        error: 'Network error. Please try again.',
        aiEnhanced: false
      };
    }
  },

  // Smart data analysis and insights
  analyzeData: async (
    inputText: string, 
    format: DataFormat
  ): Promise<{ analysis: any; error: string | null }> => {
    try {
      const response = await api.post('/ai-format/analyze', {
        inputText,
        format,
      });
      
      const data: AIAnalysisResponse = response.data.data;
      return { 
        analysis: data.analysis, 
        error: null
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { 
          analysis: null, 
          error: error.response.data.error || 'Data analysis failed'
        };
      }
      return { 
        analysis: null, 
        error: 'Network error. Please try again.'
      };
    }
  },
};