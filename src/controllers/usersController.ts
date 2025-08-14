import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: username, mode: "insensitive" } },
          { email: { equals: email, mode: "insensitive" } },
        ],
      },
    });

    if (userExists) {
      return res.status(409).send({ message: "Usuário já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password_hash: hashedPassword,
      },
    });

    res.status(201).send();
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);

    interface PrismaError {
      code?: string;
      [key: string]: unknown;
    }
    const prismaError = error as PrismaError;
    if (typeof error === "object" && error !== null && "code" in prismaError && prismaError.code === 'P2000') {
      return res.status(400).send({
        message: "Dados excedem o tamanho máximo permitido"
      });
    }

    res.status(500).send("Erro no servidor");
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body; 
  try {
    if (!username || !password) {
      return res.status(400).send({ message: "Nome de usuário e senha são obrigatórios" });
    }

    const user = await prisma.user.findUnique({ where: { username } }); // Use 'username' aqui

    if (!user) return res.status(404).send({ message: "Usuário não encontrado" });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).send({ message: "Senha incorreta" });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) return res.status(500).send({ message: "Configuração de segurança inválida" });

    const token = jwt.sign(
      { userId: user.id },
      jwtSecret,
      { expiresIn: "1h", algorithm: "HS256" }
    );

    return res.json({ token });

  } catch (error) {
    console.error("Erro no login:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(500).send("Falha na autenticação");
    }
    return res.status(500).send("Erro no servidor");
  }
};

export const getGenreById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  console.log(`Buscando gênero com o ID: ${id}`);

  try {
    const genre = await prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      return res.status(404).json({ message: "Gênero não encontrado" });
    }

    res.json(genre);
  } catch (error) {
    console.error("Erro ao buscar gênero:", error);
    res.status(500).send("Erro no servidor");
  }
};

export const getLanguageById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  console.log(`Buscando idioma com o ID: ${id}`);

  try {
    const language = await prisma.language.findUnique({
      where: { id },
    });

    if (!language) {
      return res.status(404).json({ message: "Idioma não encontrado" });
    }

    res.json(language);
  } catch (error) {
    console.error("Erro ao buscar idioma:", error);
    res.status(500).send("Erro no servidor");
  }
};