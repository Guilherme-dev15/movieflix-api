"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const port = 3000;
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
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
//filtragem por gênero e idioma
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
//filtragem por idioma
app.get("/movies/language/:languageName", async (req, res) => {
    try {
        const languageName = req.params.languageName;
        console.log(`Buscando filmes com o idioma: ${languageName}`); // Ótimo para depuração
        const moviesFilteredByLanguageName = await prisma.movie.findMany({
            include: {
                // Você pode incluir 'languages' para ver os dados do idioma no resultado
                languages: true,
            },
            where: {
                // Acessando a relação 'languages' (que é um único objeto)
                languages: {
                    // E filtrando pelo campo 'name' desse objeto relacionado
                    name: {
                        equals: req.params.languageName,
                        mode: "insensitive",
                    },
                },
            },
        });
        if (moviesFilteredByLanguageName.length === 0) {
            // É uma boa prática informar ao cliente que a busca não retornou resultados.
            return res.status(404).send({ message: "Nenhum filme encontrado para este idioma." });
        }
        res.status(200).send(moviesFilteredByLanguageName);
    }
    catch (error) {
        // É uma boa prática logar o erro no servidor para depuração
        console.error("Falha ao buscar filmes por idioma:", error);
        // E enviar uma mensagem mais genérica e segura para o cliente
        return res.status(500).send({ message: "Ocorreu um erro interno no servidor." });
    }
});
app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
});
