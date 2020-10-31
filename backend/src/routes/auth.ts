import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

// Check token
router.get("/check-token", AuthController.checkToken);

// Login route
router.post("/login", AuthController.login);

// Register
router.post("/register", AuthController.register);

// Change password
router.patch("/change-password", [checkJwt], AuthController.changePassword);

export default router;
