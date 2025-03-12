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
