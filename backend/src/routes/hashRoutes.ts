// backend/src/routes/hashRoutes.ts
import express from 'express';
import { generateHashesController, getSupportedAlgorithmsController } from '../controllers/hashController';

const router = express.Router();

// POST /api/hash/generate - Generate hashes for text
router.post('/generate', generateHashesController);

// GET /api/hash/algorithms - Get supported algorithms
router.get('/algorithms', getSupportedAlgorithmsController);

export default router;