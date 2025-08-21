import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface JWTDecodeResponse {
  header: any;
  payload: any;
  signature: string;
}

export interface JWTEncodeRequest {
  payload: string | object;
  secret: string;
  algorithm?: string;
  expiresIn?: string | number;
}

export interface JWTVerifyRequest {
  token: string;
  secret: string;
  algorithm?: string;
}

export interface JWTVerifyResponse {
  valid: boolean;
  decoded: any;
}

// JWT API calls
export const jwtApi = {
  // Decode JWT without verification
  decode: async (token: string) => {
    try {
      const response = await api.post('/jwt/decode', { token });
      return { result: response.data.data as JWTDecodeResponse, error: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { result: null, error: error.response.data.error || 'Decode failed' };
      }
      return { result: null, error: 'Network error. Please try again.' };
    }
  },

  // Encode payload into JWT
  encode: async (request: JWTEncodeRequest) => {
    try {
      const response = await api.post('/jwt/encode', request);
      return { result: response.data.data.token as string, error: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { result: null, error: error.response.data.error || 'Encode failed' };
      }
      return { result: null, error: 'Network error. Please try again.' };
    }
  },

  // Verify JWT with secret
  verify: async (request: JWTVerifyRequest) => {
    try {
      const response = await api.post('/jwt/verify', request);
      return { result: response.data.data as JWTVerifyResponse, error: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { result: null, error: error.response.data.error || 'Verification failed' };
      }
      return { result: null, error: 'Network error. Please try again.' };
    }
  },

  // Get supported algorithms
  getSupportedAlgorithms: async () => {
    try {
      const response = await api.get('/jwt/algorithms');
      return { result: response.data.data.algorithms as string[], error: null };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { result: [], error: error.response.data.error || 'Failed to get algorithms' };
      }
      return { result: [], error: 'Network error. Please try again.' };
    }
  },
};