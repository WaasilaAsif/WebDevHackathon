import express from "express";
import { getMatches } from "../controllers/match.controller.js";

const router = express.Router();

router.get("/match/:userId", getMatches); // get matched jobs for a user

export default router;
