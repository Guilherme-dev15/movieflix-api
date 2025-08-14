import { Router } from "express";
import moviesRoutes from "./moviesRoutes";
import usersRoutes from "./usersRoutes";

const router = Router();

router.use("/movies", moviesRoutes);
router.use("/users", usersRoutes); // Mudamos a rota base para /users

export default router;