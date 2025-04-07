// src/services/api.ts
import axios from 'axios';
import { DataFormat } from 'constants/converter';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Format conversion API calls
export const formatApi = {
  // Convert between formats
  convertFormat: async (inputText: string, inputFormat: DataFormat, outputFormat: DataFormat) => {
    try {
      const response = await api.post('/format/convert', {
        inputText,
        inputFormat,
        outputFormat,
      });
      return { result: response.data.data.result, error: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { result: '', error: error.response.data.error || 'Conversion failed' };
      }
      return { result: '', error: 'Network error. Please try again.' };
    }
  },

  // Beautify format
  beautifyFormat: async (inputText: string, format: DataFormat) => {
    try {
      const response = await api.post('/format/beautify', {
        inputText,
        format,
      });
      return { result: response.data.data.result, error: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { result: inputText, error: error.response.data.error || 'Beautify failed' };
      }
      return { result: inputText, error: 'Network error. Please try again.' };
    }
  },
};
