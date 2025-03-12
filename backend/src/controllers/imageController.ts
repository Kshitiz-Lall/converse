import { Request, Response } from "express";
import * as imageService from "../services/imageService";
import { ImageFormat, ImageProcessingOptions } from "../types/image";

export const optimizeImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
      return;
    }

    // Parse options from request
    const options: ImageProcessingOptions = {
      quality: req.body.quality ? parseInt(req.body.quality) : 80,
      width: req.body.width ? parseInt(req.body.width) : undefined,
      height: req.body.height ? parseInt(req.body.height) : undefined,
      format: req.body.format as ImageFormat,
      maintain_aspect_ratio: req.body.maintain_aspect_ratio === "true",
    };

    // Process image
    const result = await imageService.optimizeImage(req.file.buffer, options);

    // Calculate compression ratio
    const originalSize = req.file.size;
    const newSize = result.data.length;
    const compressionRatio = (
      ((originalSize - newSize) / originalSize) *
      100
    ).toFixed(1);

    // If the client wants JSON stats
    if (req.query.stats === "true") {
      res.status(200).json({
        success: true,
        data: {
          format: result.format,
          width: result.width,
          height: result.height,
          originalSize,
          newSize,
          compressionRatio: `${compressionRatio}%`,
        },
      });
      return;
    }

    // Otherwise, send the image directly
    res.set("Content-Type", `image/${result.format}`);
    res.set(
      "Content-Disposition",
      `attachment; filename="optimized-${req.file.originalname}"`
    );
    res.set("X-Original-Size", originalSize.toString());
    res.set("X-New-Size", newSize.toString());
    res.set("X-Compression-Ratio", `${compressionRatio}%`);
    res.send(result.data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Unknown error occurred during image optimization",
      });
    }
  }
};
