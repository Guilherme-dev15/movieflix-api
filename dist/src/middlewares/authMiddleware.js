"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    // 1. Obtenha o token do cabeçalho da requisição
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Token de autenticação não fornecido" });
    }
    const token = authHeader.split(" ")[1];
    // 2. Verifique se a variável de ambiente JWT_SECRET está definida
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error("JWT_SECRET não está definido nas variáveis de ambiente");
        return res.status(500).send({ message: "Configuração de segurança inválida" });
    }
    // 3. Verifique o token
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.userId = decoded.userId; // Adiciona o ID do usuário à requisição
        next(); // Passa para o próximo middleware ou rota
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).send({ message: "Token expirado" });
        }
        return res.status(401).send({ message: "Token inválido" });
    }
};
exports.authMiddleware = authMiddleware;
