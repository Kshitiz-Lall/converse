import jwt from 'jsonwebtoken';
import { JWTDecodeResult, JWTEncodeOptions, JWTVerifyResult } from '../types';

/**
 * Decode JWT token without verification (for debugging purposes)
 */
export const decodeJWT = (token: string): JWTDecodeResult => {
  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/, '');
    
    // Decode without verification to get header and payload
    const decoded = jwt.decode(cleanToken, { complete: true });
    
    if (!decoded) {
      return {
        success: false,
        error: 'Invalid JWT token format',
      };
    }
    
    return {
      success: true,
      header: decoded.header,
      payload: decoded.payload,
      signature: cleanToken.split('.')[2] || '',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to decode JWT',
    };
  }
};

/**
 * Encode payload into JWT token
 */
export const encodeJWT = (options: JWTEncodeOptions): { token?: string; error?: string } => {
  try {
    const { payload, secret, algorithm = 'HS256', expiresIn } = options;
    
    if (!payload || typeof payload !== 'object') {
      return { error: 'Payload must be a valid object' };
    }
    
    if (!secret) {
      return { error: 'Secret is required for JWT encoding' };
    }
    
    const signOptions: any = {
      algorithm: algorithm as jwt.Algorithm,
    };
    
    if (expiresIn) {
      signOptions.expiresIn = expiresIn;
    }
    
    const token = jwt.sign(payload, secret, signOptions);
    
    return { token };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to encode JWT',
    };
  }
};

/**
 * Verify JWT token with secret
 */
export const verifyJWT = (token: string, secret: string, algorithm: string = 'HS256'): JWTVerifyResult => {
  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/, '');
    
    if (!secret) {
      return {
        valid: false,
        error: 'Secret is required for JWT verification',
      };
    }
    
    const decoded = jwt.verify(cleanToken, secret, {
      algorithms: [algorithm as jwt.Algorithm],
    });
    
    return {
      valid: true,
      decoded,
    };
  } catch (error) {
    let errorMessage = 'JWT verification failed';
    
    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = 'JWT token has expired';
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = `JWT error: ${error.message}`;
    } else if (error instanceof jwt.NotBeforeError) {
      errorMessage = 'JWT token not active yet';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      valid: false,
      error: errorMessage,
    };
  }
};

/**
 * Get supported algorithms
 */
export const getSupportedAlgorithms = (): string[] => {
  return ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512'];
};