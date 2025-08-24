// backend/src/utils/hashUtils.ts
import crypto from 'crypto';

export interface HashResult {
  algorithm: string;
  input: string;
  hash: string;
}

export interface HashGenerateOptions {
  text: string;
  algorithms: string[];
}

export interface HashGenerateResult {
  success: boolean;
  results?: HashResult[];
  error?: string;
}

/**
 * Get supported hash algorithms
 */
export const getSupportedHashAlgorithms = (): string[] => {
  return ['MD5', 'SHA1', 'SHA256'];
};

/**
 * Generate hash for a single algorithm
 */
export const generateSingleHash = (text: string, algorithm: string): HashResult => {
  const normalizedAlgorithm = algorithm.toUpperCase();
  
  let cryptoAlgorithm: string;
  switch (normalizedAlgorithm) {
    case 'MD5':
      cryptoAlgorithm = 'md5';
      break;
    case 'SHA1':
      cryptoAlgorithm = 'sha1';
      break;
    case 'SHA256':
      cryptoAlgorithm = 'sha256';
      break;
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  const hash = crypto.createHash(cryptoAlgorithm);
  hash.update(text, 'utf8');
  
  return {
    algorithm: normalizedAlgorithm,
    input: text,
    hash: hash.digest('hex')
  };
};

/**
 * Generate hashes for multiple algorithms
 */
export const generateHashes = (options: HashGenerateOptions): HashGenerateResult => {
  try {
    const { text, algorithms } = options;
    
    if (!text) {
      return {
        success: false,
        error: 'Text input is required'
      };
    }
    
    if (!algorithms || algorithms.length === 0) {
      return {
        success: false,
        error: 'At least one algorithm must be specified'
      };
    }
    
    const supportedAlgorithms = getSupportedHashAlgorithms();
    const invalidAlgorithms = algorithms.filter(
      alg => !supportedAlgorithms.includes(alg.toUpperCase())
    );
    
    if (invalidAlgorithms.length > 0) {
      return {
        success: false,
        error: `Unsupported algorithms: ${invalidAlgorithms.join(', ')}. Supported: ${supportedAlgorithms.join(', ')}`
      };
    }
    
    const results: HashResult[] = [];
    
    for (const algorithm of algorithms) {
      try {
        const result = generateSingleHash(text, algorithm);
        results.push(result);
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : `Failed to generate ${algorithm} hash`
        };
      }
    }
    
    return {
      success: true,
      results
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Hash generation failed'
    };
  }
};

/**
 * Validate hash generation request
 */
export const validateHashRequest = (data: any): { valid: boolean; error?: string } => {
  if (!data) {
    return { valid: false, error: 'Request body is required' };
  }
  
  if (!data.text || typeof data.text !== 'string') {
    return { valid: false, error: 'Text field is required and must be a string' };
  }
  
  if (!data.algorithms || !Array.isArray(data.algorithms)) {
    return { valid: false, error: 'Algorithms field is required and must be an array' };
  }
  
  if (data.algorithms.length === 0) {
    return { valid: false, error: 'At least one algorithm must be specified' };
  }
  
  const supportedAlgorithms = getSupportedHashAlgorithms();
  const invalidAlgorithms = data.algorithms.filter(
    (alg: any) => typeof alg !== 'string' || !supportedAlgorithms.includes(alg.toUpperCase())
  );
  
  if (invalidAlgorithms.length > 0) {
    return { 
      valid: false, 
      error: `Invalid algorithms: ${invalidAlgorithms.join(', ')}. Supported: ${supportedAlgorithms.join(', ')}`
    };
  }
  
  return { valid: true };
};