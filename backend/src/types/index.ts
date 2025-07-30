export type DataFormat = "json" | "yaml" | "xml";

export interface ConversionResult {
  result: string;
  error: string | null;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string | null;
}

// JWT-related types
export interface JWTDecodeResult {
  success: boolean;
  header?: any;
  payload?: any;
  signature?: string;
  error?: string;
}

export interface JWTEncodeOptions {
  payload: any;
  secret: string;
  algorithm?: string;
  expiresIn?: string | number;
}

export interface JWTVerifyResult {
  valid: boolean;
  decoded?: any;
  error?: string;
}
