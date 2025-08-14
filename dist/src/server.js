"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const port = 3000;
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// Rota para buscar todos os filmes com paginação
app.get("/movies", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const movies = await prisma.movie.findMany({
            skip: offset,
            take: limit,
            orderBy: { title: "asc" },
            include: { genres: true, languages: true },
        });
        res.json(movies);
    }
    catch (error) {
        console.error("Erro ao buscar filmes:", error);
        res.status(500).send("Erro no servidor");
    }
});
// Rota para buscar um filme específico
app.post("/movies", async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;
    try {
        const movieWithSameTitle = await prisma.movie.findFirst({
            where: {
                title: { equals: title, mode: "insensitive" },
            },
        });
        if (movieWithSameTitle) {
            return res
                .status(409)
                .send({ message: "Já existe um filme cadastrado com este título" });
        }
        await prisma.movie.create({
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: new Date(release_date),
            },
        });
    }
    catch (error) {
        return res
            .status(500)
            .send({ message: "Falha ao cadastrar um filme", error });
    }
    res.status(201).send();
});
// Atualização de filme
app.put("/movies/:id", async (req, res) => {
    const id = Number(req.params.id);
    try {
        const movie = await prisma.movie.findUnique({
            where: { id },
        });
        if (!movie) {
            return res.status(404).send({ message: "Filme não encontrado" });
        }
        const data = { ...req.body };
        data.release_date = data.release_date
            ? new Date(data.release_date)
            : undefined;
        await prisma.movie.update({ where: { id }, data });
    }
    catch (error) {
        return res
            .status(500)
            .send({ message: "Falha ao atualizar o registro", error });
    }
    res.status(200).send();
});
// Rota para remover um filme
app.delete("/movies/:id", async (req, res) => {
    const id = Number(req.params.id);
    try {
        const movie = await prisma.movie.findUnique({
            where: { id },
        });
        if (!movie) {
            return res.status(404).send({ message: "Filme não encontrado" });
        }
        await prisma.movie.delete({ where: { id } });
    }
    catch (error) {
        res.status(500).send({ message: "Falha ao remover o registro", error });
    }
    res.status(200).send();
});
// Filtragem por gênero e idioma
app.get("/movies/genre/:genrerName", async (req, res) => {
    const genrerName = req.params.genrerName;
    const languageName = req.query.languageName;
    const whereClause = {};
    if (genrerName) {
        whereClause.genres = {
            name: {
                equals: genrerName,
                mode: "insensitive",
            },
        };
    }
    if (languageName) {
        whereClause.languages = {
            name: {
                equals: languageName,
                mode: "insensitive",
            },
        };
    }
    try {
        const moviesFiltered = await prisma.movie.findMany({
            include: {
                genres: true,
                languages: true,
            },
            where: whereClause,
        });
        res.status(200).send(moviesFiltered);
    }
    catch (error) {
        return res
            .status(500)
            .send({ message: "Falha ao filtrar filmes", error });
    }
});
// Rota para buscar filmes por idioma
app.get("/movies/language/:languageName", async (req, res) => {
    try {
        const languageName = req.params.languageName;
        console.log(`Buscando filmes com o idioma: ${languageName}`);
        const moviesFilteredByLanguageName = await prisma.movie.findMany({
            include: {
                languages: true,
            },
            where: {
                languages: {
                    name: {
                        equals: req.params.languageName,
                        mode: "insensitive",
                    },
                },
            },
        });
        if (moviesFilteredByLanguageName.length === 0) {
            // Se não houver filmes com o idioma especificado, retornar 404
            return res.status(404).send({ message: "Nenhum filme encontrado para este idioma." });
        }
        res.status(200).send(moviesFilteredByLanguageName);
    }
    catch (error) {
        // Logar o erro para depuração
        console.error("Falha ao buscar filmes por idioma:", error);
        // Retornar uma resposta de erro genérica
        return res.status(500).send({ message: "Ocorreu um erro interno no servidor." });
    }
});
// Rota para buscar genero pelo id
app.get("/genre/:id", async (req, res) => {
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
    }
    catch (error) {
        console.error("Erro ao buscar gênero:", error);
        res.status(500).send("Erro no servidor");
    }
});
// Rota para buscar idioma pelo id
app.get("/language/:id", async (req, res) => {
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
    }
    catch (error) {
        console.error("Erro ao buscar idioma:", error);
        res.status(500).send("Erro no servidor");
    }
});
// Rota para buscar filme pelo id do filme
app.get("/movies/:id", async (req, res) => {
    const id = Number(req.params.id);
    try {
        const movie = await prisma.movie.findUnique({
            where: { id },
            include: { genres: true, languages: true },
        });
        if (!movie) {
            return res.status(404).send({ message: "Filme não encontrado" });
        }
        res.json(movie);
    }
    catch (error) {
        console.error("Erro ao buscar filme:", error);
        res.status(500).send("Erro no servidor");
    }
});
// Cadastro de usuario
app.post("/register/users", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Verifica se usuário já existe
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
        // criptografia da senha
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await prisma.user.create({
            data: {
                username,
                email,
                password_hash: hashedPassword,
            },
        });
        res.status(201).send();
    }
    catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        const prismaError = error;
        if (typeof error === "object" && error !== null && "code" in prismaError && prismaError.code === 'P2000') {
            return res.status(400).send({
                message: "Dados excedem o tamanho máximo permitido"
            });
        }
        res.status(500).send("Erro no servidor");
    }
});
// Rota de login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).send({ message: "Usuário não encontrado" });
        const validPassword = await bcrypt_1.default.compare(password, user.password_hash);
        if (!validPassword)
            return res.status(401).send({ message: "Senha incorreta" });
        // --- VALIDAÇÃO DO JWT SECRET ---
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret)
            return res.status(500).send({ message: "Configuração de segurança inválida" });
        // --- GERAÇÃO DO TOKEN ---
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, jwtSecret, {
            expiresIn: "1h",
            algorithm: "HS256",
            // issuer: "sua-api"
        });
        return res.json({ token });
    }
    catch (error) {
        console.error("Erro no login:", error);
        // Tratamento específico para erros de JWT
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(500).send("Falha na autenticação");
        }
        return res.status(500).send("Erro no servidor");
    }
});
app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
});
