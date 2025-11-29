import express from 'express';
import {
  generateInterviewPrep,
  getInterviewPrep,
  getInterviewHistory,
  deleteInterviewPrep
} from '../controllers/interview.controller.js';

const router = express.Router();

// Interview prep routes
router.post('/generate', generateInterviewPrep);
router.get('/prep/:prepId', getInterviewPrep);
router.get('/history', getInterviewHistory);
router.delete('/prep/:prepId', deleteInterviewPrep);

export default router;

