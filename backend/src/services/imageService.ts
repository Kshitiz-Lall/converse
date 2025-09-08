import sharp, { Sharp } from "sharp";
import {
  ImageFormat,
  ImageProcessingOptions,
  ProcessedImage,
} from "../types/image";

/**
 * Optimizes an image with the given options
 */
export const optimizeImage = async (
  buffer: Buffer,
  options: ImageProcessingOptions
): Promise<ProcessedImage> => {
  try {
    // Get image metadata
    const metadata = await sharp(buffer).metadata();

    // Start processing pipeline
    let imageProcessor: Sharp = sharp(buffer);

    // Apply resizing if requested
    if (options.width || options.height) {
      imageProcessor = imageProcessor.resize({
        width: options.width,
        height: options.height,
        fit: options.maintain_aspect_ratio ? "inside" : "fill",
        withoutEnlargement: true,
      });
    }

    // Apply format conversion and compression
    let outputFormat = (options.format ||
      (metadata.format as ImageFormat)) as ImageFormat;

    let outputOptions: any = {};
    const quality = options.quality || 80;

    switch (outputFormat) {
      case "jpeg":
        outputOptions = { quality };
        break;
      case "png":
        outputOptions = {
          compressionLevel: Math.max(
            0,
            Math.min(9, Math.floor(9 - quality / 11.1))
          ),
          palette: quality > 70,
        };
        break;
      case "webp":
        outputOptions = { quality };
        break;
      case "avif":
        outputOptions = { quality };
        break;
      default:
        outputFormat = "jpeg";
        outputOptions = { quality };
    }

    // Process the image
    const outputBuffer = await imageProcessor[outputFormat](
      outputOptions
    ).toBuffer({ resolveWithObject: true });

    return {
      data: outputBuffer.data,
      format: outputFormat,
      width: outputBuffer.info.width,
      height: outputBuffer.info.height,
      size: outputBuffer.data.length,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Image optimization error: ${error.message}`);
    }
    throw new Error("Unknown image optimization error");
  }
};
