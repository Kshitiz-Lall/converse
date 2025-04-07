// routes/admin/index.ts
import express from 'express';
import authMiddleware from '../../middleware/authMiddleware';
import usersRouter from './userRoute';
import dashboardRouter from './dashboardRoute';

const router = express.Router();

// All admin routes require authentication first
router.use(authMiddleware);

// Then mount the individual admin routers
router.use('/users', usersRouter);
router.use('/dashboard', dashboardRouter);

export default router;
