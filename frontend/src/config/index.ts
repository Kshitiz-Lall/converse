import axios from 'axios';
import { DataFormat } from 'constants/converter';
import { API_URL } from '@/config';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
