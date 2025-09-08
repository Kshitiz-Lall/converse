import { Router } from 'express';
import { summarizeUrl } from '../controllers/openAIController';


const router = Router();

// Temporarily remove auth middleware for testing
router.post('/summarize', summarizeUrl);

export default router;
