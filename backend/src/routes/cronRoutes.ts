import express from 'express';
import { parseNaturalLanguageCron } from '../controllers/cronController'; 

const router = express.Router();

// POST /api/cron/parse-natural-language
router.post('/parse-natural-language', parseNaturalLanguageCron);

export default router;