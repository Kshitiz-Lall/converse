import { Router } from 'express';
import { summarizeUrl } from '../controllers/openAIController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// Temporarily remove auth middleware for testing
router.post('/summarize', summarizeUrl);

export default router;
