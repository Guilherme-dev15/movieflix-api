"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/moviesRoutes.ts
const express_1 = require("express");
const moviesController_1 = require("../controllers/moviesController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Importe o middleware
const router = (0, express_1.Router)();
// Rotas públicas (não precisam de autenticação)
router.get("/", moviesController_1.getAllMovies);
router.get("/genre/:genrerName", moviesController_1.filterMoviesByGenreAndLanguage);
router.get("/language/:languageName", moviesController_1.filterMoviesByLanguage);
router.get("/:id", moviesController_1.getMovieById);
// Rotas protegidas (precisam de autenticação)
router.use(authMiddleware_1.authMiddleware); // Todas as rotas abaixo desta linha estarão protegidas
router.post("/", moviesController_1.createMovie);
router.put("/:id", moviesController_1.updateMovie);
router.delete("/:id", moviesController_1.deleteMovie);
exports.default = router;
