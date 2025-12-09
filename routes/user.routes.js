import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";

const router = Router();

// ---------------------------------------------
// USER AUTH ROUTES
// ---------------------------------------------

// Register a new user account
router.post("/register", register);

// Login user and generate JWT token
router.post("/login", login);

// Export user routes
export default router;
