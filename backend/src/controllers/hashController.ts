// backend/src/controllers/hashController.ts
import { Request, Response } from 'express';
import { generateHashes, getSupportedHashAlgorithms, validateHashRequest } from '../utils/hashUtils';

/**
 * Generate hashes for the provided text using specified algorithms
 */
export const generateHashesController = async (req: Request, res: Response) => {
  try {
    // Validate request
    const validation = validateHashRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const { text, algorithms } = req.body;

    // Generate hashes
    const result = generateHashes({ text, algorithms });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        results: result.results
      }
    });
  } catch (error) {
    console.error('Hash generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during hash generation'
    });
  }
};

/**
 * Get supported hash algorithms
 */
export const getSupportedAlgorithmsController = async (req: Request, res: Response) => {
  try {
    const algorithms = getSupportedHashAlgorithms();
    
    return res.status(200).json({
      success: true,
      data: {
        algorithms
      }
    });
  } catch (error) {
    console.error('Error getting supported algorithms:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};