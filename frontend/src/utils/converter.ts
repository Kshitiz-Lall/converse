// src/utils/converter.ts
import { DataFormat } from 'constants/converter';
import { formatApi } from '@/services/api';

// Convert between data formats using the API
export const convertData = async (
  inputText: string,
  inputFormat: DataFormat,
  outputFormat: DataFormat
) => {
  return await formatApi.convertFormat(inputText, inputFormat, outputFormat);
};

// Format the data using the API
export const formatData = async (inputText: string, format: DataFormat) => {
  return await formatApi.beautifyFormat(inputText, format);
};

// Detect format from filename
export const detectFormatFromFilename = (filename: string): DataFormat | null => {
  const extension = filename.split('.').pop()?.toLowerCase();

  if (extension === 'json') {
    return 'json';
  } else if (extension === 'yaml' || extension === 'yml') {
    return 'yaml';
  } else if (extension === 'xml') {
    return 'xml';
  }

  return null;
};

// Download file
export const downloadFile = (content: string, format: DataFormat) => {
  if (!content) return;

  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);

  element.download = `converted.${format}`;

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};
