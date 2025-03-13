export interface ImageProcessingOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: ImageFormat;
  maintain_aspect_ratio?: boolean;
}

export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'gif';

export interface ProcessedImage {
  data: Buffer;
  format: ImageFormat;
  width: number;
  height: number;
  size: number;
}
