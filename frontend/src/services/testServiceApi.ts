// frontend/src/services/apiTesterService.ts
import axios from 'axios';
import { API_URL } from '@/config';
import { ApiRequest, ApiResponse, HistoryItem, Collection, Environment } from '@/types/apiTester';

const api = axios.create({
  baseURL: `${API_URL}/request-tester`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Execute an API request
 */
export const executeRequest = async (request: ApiRequest): Promise<ApiResponse> => {
  try {
    const response = await api.post('/execute', request);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to execute request');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

/**
 * Get request history
 */
export const getHistory = async (limit = 20, offset = 0): Promise<HistoryItem[]> => {
  try {
    const response = await api.get(`/history?limit=${limit}&offset=${offset}`);
    return response.data.data.items;
  } catch (error) {
    console.error('Failed to fetch history:', error);
    return [];
  }
};

/**
 * Clear request history
 */
export const clearHistory = async (): Promise<void> => {
  try {
    await api.delete('/history');
  } catch (error) {
    console.error('Failed to clear history:', error);
    throw error;
  }
};

/**
 * Get all collections
 */
export const getCollections = async (): Promise<Collection[]> => {
  try {
    const response = await api.get('/collections');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
};

/**
 * Get a collection by ID
 */
export const getCollectionById = async (id: string): Promise<Collection | null> => {
  try {
    const response = await api.get(`/collections/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch collection ${id}:`, error);
    return null;
  }
};

/**
 * Create a new collection
 */
export const createCollection = async (
  name: string,
  description?: string
): Promise<Collection | null> => {
  try {
    const response = await api.post('/collections', { name, description });
    return response.data.data;
  } catch (error) {
    console.error('Failed to create collection:', error);
    throw error;
  }
};

/**
 * Update a collection
 */
export const updateCollection = async (
  id: string,
  updates: { name?: string; description?: string }
): Promise<Collection | null> => {
  try {
    const response = await api.put(`/collections/${id}`, updates);
    return response.data.data;
  } catch (error) {
    console.error('Failed to update collection:', error);
    throw error;
  }
};

/**
 * Delete a collection
 */
export const deleteCollection = async (id: string): Promise<void> => {
  try {
    await api.delete(`/collections/${id}`);
  } catch (error) {
    console.error('Failed to delete collection:', error);
    throw error;
  }
};

/**
 * Add request to collection
 */
export const addRequestToCollection = async (
  collectionId: string,
  request: {
    name: string;
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: any;
    params?: Record<string, string>;
    description?: string;
  }
): Promise<any> => {
  try {
    const response = await api.post(`/collections/${collectionId}/requests`, request);
    return response.data.data;
  } catch (error) {
    console.error('Failed to add request to collection:', error);
    throw error;
  }
};

/**
 * Import a collection
 */
export const importCollection = async (collectionData: any): Promise<Collection | null> => {
  try {
    const response = await api.post('/collections/import', collectionData);
    return response.data.data;
  } catch (error) {
    console.error('Failed to import collection:', error);
    throw error;
  }
};

/**
 * Export a collection
 */
export const exportCollection = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/collections/${id}/export`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to export collection:', error);
    throw error;
  }
};

/**
 * Get all environments
 */
export const getEnvironments = async (): Promise<Environment[]> => {
  try {
    const response = await api.get('/environments');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch environments:', error);
    return [];
  }
};

/**
 * Get active environment
 */
export const getActiveEnvironment = async (): Promise<Environment | null> => {
  try {
    const response = await api.get('/environments/active');
    return response.data.data;
  } catch (error) {
    // A 404 is expected if there's no active environment
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error('Failed to fetch active environment:', error);
    return null;
  }
};

/**
 * Create a new environment
 */
export const createEnvironment = async (
  name: string,
  variables: Record<string, string> = {}
): Promise<Environment | null> => {
  try {
    const response = await api.post('/environments', { name, variables });
    return response.data.data;
  } catch (error) {
    console.error('Failed to create environment:', error);
    throw error;
  }
};

/**
 * Update an environment
 */
export const updateEnvironment = async (
  id: string,
  updates: { name?: string; variables?: Record<string, string> }
): Promise<Environment | null> => {
  try {
    const response = await api.put(`/environments/${id}`, updates);
    return response.data.data;
  } catch (error) {
    console.error('Failed to update environment:', error);
    throw error;
  }
};

/**
 * Delete an environment
 */
export const deleteEnvironment = async (id: string): Promise<void> => {
  try {
    await api.delete(`/environments/${id}`);
  } catch (error) {
    console.error('Failed to delete environment:', error);
    throw error;
  }
};

/**
 * Set active environment
 */
export const setActiveEnvironment = async (id: string): Promise<Environment | null> => {
  try {
    const response = await api.post(`/environments/${id}/activate`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to set active environment:', error);
    throw error;
  }
};
