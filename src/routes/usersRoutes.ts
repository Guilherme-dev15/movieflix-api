import { Router } from "express";
import { registerUser, loginUser, getGenreById, getLanguageById } from "../controllers/usersController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/genre/:id", getGenreById);
router.get("/language/:id", getLanguageById);

export default router;