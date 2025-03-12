// src/utils/converter.ts
import * as YAML from 'yaml';
import { xml2js, js2xml } from 'xml-js';
import { DataFormat } from '../constants/converter';

/**
 * Converts data from one format to another
 */
export const convertData = (
  inputText: string,
  inputFormat: DataFormat,
  outputFormat: DataFormat
): { result: string; error: string | null } => {
  try {
    if (!inputText.trim()) {
      return { result: '', error: null };
    }

    // First parse input to JavaScript object
    let data: any;

    switch (inputFormat) {
      case 'json':
        data = JSON.parse(inputText);
        break;
      case 'yaml':
        data = YAML.parse(inputText);
        break;
      case 'xml':
        const options = { compact: true, ignoreComment: true, spaces: 2 };
        data = xml2js(inputText, options);
        break;
    }

    // Then convert to output format
    let result = '';
    switch (outputFormat) {
      case 'json':
        result = JSON.stringify(data, null, 2);
        break;
      case 'yaml':
        result = YAML.stringify(data);
        break;
      case 'xml':
        const options = { compact: true, ignoreComment: true, spaces: 2 };
        result = js2xml(data, options);
        break;
    }

    return { result, error: null };
  } catch (err) {
    return {
      result: '',
      error: `Error converting from ${inputFormat.toUpperCase()} to ${outputFormat.toUpperCase()}: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
};

/**
 * Formats data in the specified format
 */
export const formatData = (
  inputText: string,
  format: DataFormat
): { result: string; error: string | null } => {
  try {
    if (!inputText.trim()) {
      return { result: inputText, error: null };
    }

    let result = '';
    switch (format) {
      case 'json':
        const parsed = JSON.parse(inputText);
        result = JSON.stringify(parsed, null, 2);
        break;
      case 'yaml':
        const yamlObj = YAML.parse(inputText);
        result = YAML.stringify(yamlObj);
        break;
      case 'xml':
        const xmlOptions = { compact: true, ignoreComment: true, spaces: 2 };
        const xmlObj = xml2js(inputText, xmlOptions);
        result = js2xml(xmlObj, xmlOptions);
        break;
    }

    return { result, error: null };
  } catch (err) {
    return {
      result: inputText,
      error: `Error formatting ${format.toUpperCase()}: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
};

/**
 * Detects the most likely format based on file extension
 */
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

/**
 * Creates a downloadable file
 */
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

/**
 * Copy content to clipboard
 */
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
