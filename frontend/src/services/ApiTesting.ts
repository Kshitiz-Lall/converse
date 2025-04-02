import axios from 'axios';
import { API_URL } from '@/config';

const BASE_COLLECTIONS = `${API_URL}/request-tester/collections`;
const BASE_ENVIRONMENTS = `${API_URL}/request-tester/environments`;

export const apiCollections = {
  getAll: () => axios.get(BASE_COLLECTIONS),
  getById: (collectionId: string) => axios.get(`${BASE_COLLECTIONS}/${collectionId}`),
  create: (payload: { name: string; description?: string }) =>
    axios.post(BASE_COLLECTIONS, payload),
  update: (collectionId: string, payload: { name: string; description?: string }) =>
    axios.put(`${BASE_COLLECTIONS}/${collectionId}`, payload),
  delete: (collectionId: string) => axios.delete(`${BASE_COLLECTIONS}/${collectionId}`),

  addRequest: (
    collectionId: string,
    requestData: {
      name: string;
      method: string;
      url: string;
      headers?: Record<string, string>;
      params?: Record<string, any>;
      body?: any;
    }
  ) => axios.post(`${BASE_COLLECTIONS}/${collectionId}/requests`, requestData),

  updateRequest: (
    collectionId: string,
    requestId: string,
    requestData: {
      name: string;
      method: string;
      url: string;
      headers?: Record<string, string>;
      params?: Record<string, any>;
      body?: any;
    }
  ) => axios.put(`${BASE_COLLECTIONS}/${collectionId}/requests/${requestId}`, requestData),

  deleteRequest: (collectionId: string, requestId: string) =>
    axios.delete(`${BASE_COLLECTIONS}/${collectionId}/requests/${requestId}`),

  import: (payload: {
    name: string;
    requests: {
      name: string;
      method: string;
      url: string;
      headers?: Record<string, string>;
      params?: Record<string, any>;
      body?: any;
    }[];
  }) => axios.post(`${BASE_COLLECTIONS}/import`, payload),

  export: (collectionId: string) =>
    axios.get(`${BASE_COLLECTIONS}/${collectionId}/export`),
};

export const apiEnvironments = {
  getAll: () => axios.get(BASE_ENVIRONMENTS),
  getActive: () => axios.get(`${BASE_ENVIRONMENTS}/active`),
  create: (payload: {
    name: string;
    variables: { key: string; value: string }[];
  }) => axios.post(BASE_ENVIRONMENTS, payload),

  update: (
    environmentId: string,
    payload: {
      name: string;
      variables: { key: string; value: string }[];
    }
  ) => axios.put(`${BASE_ENVIRONMENTS}/${environmentId}`, payload),

  delete: (environmentId: string) =>
    axios.delete(`${BASE_ENVIRONMENTS}/${environmentId}`),

  activate: (environmentId: string) =>
    axios.post(`${BASE_ENVIRONMENTS}/${environmentId}/activate`),
};
