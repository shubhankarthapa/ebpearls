import express from "express";
import isAuthenticated from "../middleware/authentication.js";
import { 
    getUsers, 
    signup, 
    login, 
    logout, 
    getProfile 
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/logout", isAuthenticated, logout);
router.get("/profile", isAuthenticated, getProfile);
router.get("/", isAuthenticated, getUsers);

export default router;
