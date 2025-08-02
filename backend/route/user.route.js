import express from "express";
import isAuthenticated from "../middleware/authentication.js";
import { getUsers } from "../controllers/user.controller.js";

const router = express.Router()
router.get("/", isAuthenticated, getUsers)


export default router;
