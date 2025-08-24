// frontend/src/services/hashApi.ts
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface HashResult {
  algorithm: string;
  input: string;
  hash: string;
}

export interface HashGenerateRequest {
  text: string;
  algorithms: string[];
}

export interface HashGenerateResponse {
  results: HashResult[];
}

// Hash API calls
export const hashApi = {
  // Generate hashes for text with specified algorithms
  generateHashes: async (request: HashGenerateRequest) => {
    try {
      const response = await api.post('/hash/generate', request);
      return { result: response.data.data as HashGenerateResponse, error: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { result: null, error: error.response.data.error || 'Hash generation failed' };
      }
      return { result: null, error: 'Network error. Please try again.' };
    }
  },

  // Get supported algorithms
  getSupportedAlgorithms: async () => {
    try {
      const response = await api.get('/hash/algorithms');
      return { result: response.data.data.algorithms as string[], error: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { result: [], error: error.response.data.error || 'Failed to get algorithms' };
      }
      return { result: [], error: 'Network error. Please try again.' };
    }
  },
};