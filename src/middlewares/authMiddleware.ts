// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Defina uma interface para estender o objeto Request do Express
// Isso permite que o TypeScript saiba que a propriedade 'userId' existe
interface CustomRequest extends Request {
  userId?: number;
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, jwtSecret) as { userId: number };
    req.userId = decoded.userId; // Adiciona o ID do usuário à requisição
    next(); // Passa para o próximo middleware ou rota
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send({ message: "Token expirado" });
    }
    return res.status(401).send({ message: "Token inválido" });
  }
};