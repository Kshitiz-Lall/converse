// frontend/src/types/apiTester.ts

/**
 * HTTP Methods supported by the API Tester
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

/**
 * API Request structure
 */
export interface ApiRequest {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
  timeout?: number;
}

/**
 * API Response structure
 */
export interface ApiResponse {
  data: any;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  responseTime: number;
}

/**
 * History item structure
 */
export interface HistoryItem {
  id: string;
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
  response?: {
    status: number;
    statusText: string;
    data: any;
    headers: Record<string, string>;
    responseTime: number;
  };
  timestamp: string;
}

/**
 * Request item in a collection
 */
export interface CollectionRequest {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  body?: any;
  description?: string;
}

/**
 * Collection structure
 */
export interface Collection {
  id: string;
  name: string;
  description?: string;
  requests: CollectionRequest[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Environment structure
 */
export interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}
