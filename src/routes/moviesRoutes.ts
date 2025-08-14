// src/routes/moviesRoutes.ts
import { Router } from "express";
import {
  getAllMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  filterMoviesByGenreAndLanguage,
  filterMoviesByLanguage,
  getMovieById,
} from "../controllers/moviesController";
import { authMiddleware } from "../middlewares/authMiddleware"; // Importe o middleware

const router = Router();

// Rotas públicas (não precisam de autenticação)
router.get("/", getAllMovies);
router.get("/genre/:genrerName", filterMoviesByGenreAndLanguage);
router.get("/language/:languageName", filterMoviesByLanguage);
router.get("/:id", getMovieById);

// Rotas protegidas (precisam de autenticação)
router.use(authMiddleware); // Todas as rotas abaixo desta linha estarão protegidas

router.post("/", createMovie);
router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);


export default router;