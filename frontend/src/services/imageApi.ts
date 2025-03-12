// src/services/imageApi.ts
import axios from 'axios';
import { API_URL } from '@/config';

export interface ImageOptimizationOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: string;
  maintain_aspect_ratio?: boolean;
}

export interface OptimizedImageStats {
  format: string;
  width: number;
  height: number;
  originalSize: number;
  newSize: number;
  compressionRatio: string;
}

const api = axios.create({
  baseURL: API_URL,
});

export const imageApi = {
  optimizeImage: async (file: File, options: ImageOptimizationOptions): Promise<Blob> => {
    const formData = new FormData();
    formData.append('image', file);

    // Add options to form data
    if (options.quality) formData.append('quality', options.quality.toString());
    if (options.width) formData.append('width', options.width.toString());
    if (options.height) formData.append('height', options.height.toString());
    if (options.format) formData.append('format', options.format);
    if (options.maintain_aspect_ratio !== undefined)
      formData.append('maintain_aspect_ratio', options.maintain_aspect_ratio.toString());

    try {
      const response = await api.post('/image/optimize', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to optimize image');
    }
  },

  getOptimizedImageStats: async (
    file: File,
    options: ImageOptimizationOptions
  ): Promise<OptimizedImageStats> => {
    const formData = new FormData();
    formData.append('image', file);

    // Add options to form data
    if (options.quality) formData.append('quality', options.quality.toString());
    if (options.width) formData.append('width', options.width.toString());
    if (options.height) formData.append('height', options.height.toString());
    if (options.format) formData.append('format', options.format);
    if (options.maintain_aspect_ratio !== undefined)
      formData.append('maintain_aspect_ratio', options.maintain_aspect_ratio.toString());

    try {
      const response = await api.post('/image/optimize?stats=true', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error) {
      throw new Error('Failed to get image stats');
    }
  },
};
