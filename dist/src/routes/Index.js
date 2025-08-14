"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const moviesRoutes_1 = __importDefault(require("./moviesRoutes"));
const usersRoutes_1 = __importDefault(require("./usersRoutes"));
const router = (0, express_1.Router)();
router.use("/movies", moviesRoutes_1.default);
router.use("/users", usersRoutes_1.default); // Mudamos a rota base para /users
exports.default = router;
