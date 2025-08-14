"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieById = exports.filterMoviesByLanguage = exports.filterMoviesByGenreAndLanguage = exports.deleteMovie = exports.updateMovie = exports.createMovie = exports.getAllMovies = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllMovies = async (req, res) => {
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
};
exports.getAllMovies = getAllMovies;
const createMovie = async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;
    try {
        const movieWithSameTitle = await prisma.movie.findFirst({
            where: {
                title: { equals: title, mode: "insensitive" },
            },
        });
        if (movieWithSameTitle) {
            return res.status(409).send({ message: "Já existe um filme cadastrado com este título" });
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
        return res.status(500).send({ message: "Falha ao cadastrar um filme", error });
    }
    res.status(201).send();
};
exports.createMovie = createMovie;
const updateMovie = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const movie = await prisma.movie.findUnique({
            where: { id },
        });
        if (!movie) {
            return res.status(404).send({ message: "Filme não encontrado" });
        }
        const data = { ...req.body };
        data.release_date = data.release_date ? new Date(data.release_date) : undefined;
        await prisma.movie.update({ where: { id }, data });
    }
    catch (error) {
        return res.status(500).send({ message: "Falha ao atualizar o registro", error });
    }
    res.status(200).send();
};
exports.updateMovie = updateMovie;
const deleteMovie = async (req, res) => {
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
};
exports.deleteMovie = deleteMovie;
const filterMoviesByGenreAndLanguage = async (req, res) => {
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
        return res.status(500).send({ message: "Falha ao filtrar filmes", error });
    }
};
exports.filterMoviesByGenreAndLanguage = filterMoviesByGenreAndLanguage;
const filterMoviesByLanguage = async (req, res) => {
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
            return res.status(404).send({ message: "Nenhum filme encontrado para este idioma." });
        }
        res.status(200).send(moviesFilteredByLanguageName);
    }
    catch (error) {
        console.error("Falha ao buscar filmes por idioma:", error);
        return res.status(500).send({ message: "Ocorreu um erro interno no servidor." });
    }
};
exports.filterMoviesByLanguage = filterMoviesByLanguage;
const getMovieById = async (req, res) => {
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
};
exports.getMovieById = getMovieById;
