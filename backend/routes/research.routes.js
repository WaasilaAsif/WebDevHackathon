import express from 'express';
import {
  getCompanyResearch,
  getRoleResearch,
  getIndustryTrends,
  getDeepResearch
} from '../controllers/research.controller.js';

const router = express.Router();

// Research routes
router.get('/company/:companyName', getCompanyResearch);
router.get('/role/:role', getRoleResearch);
router.get('/industry/:industry', getIndustryTrends);
router.get('/deep', getDeepResearch);

export default router;

