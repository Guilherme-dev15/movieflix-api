import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota para buscar todos os filmes com paginação
app.get("/movies", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const movies = await prisma.movie.findMany({
      skip: offset,
      take: limit,
      orderBy: { title: "asc" },
      include: { genres: true, languages: true },
    });

    res.json(movies);
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    res.status(500).send({ message: "Falha ao remover o registro", error });
  }

  res.status(200).send();
});

// Filtragem por gênero e idioma
app.get("/movies/genre/:genrerName", async (req, res) => {
  const genrerName = req.params.genrerName as string;
  const languageName = req.query.languageName as string;

  const whereClause: Prisma.MovieWhereInput = {};

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
  } catch (error) {
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

  } catch (error) {
    // Logar o erro para depuração
    console.error("Falha ao buscar filmes por idioma:", error);
    // Retornar uma resposta de erro genérica
    return res.status(500).send({ message: "Ocorreu um erro interno no servidor." });
  }
});


// Rota para buscar filme pelo id do genero
app.get("/movies/genre/:genreId", async (req, res) => {
  const genreId = Number(req.params.genreId);
  // debugando o valor de genreId
  console.log(`Buscando filmes com o gênero ID: ${genreId}`);

  try {
    const moviesFilteredByGenreId = await prisma.movie.findMany({
      where: {
        genre_id: genreId,
      },
      include: {
        genres: true,
        languages: true,
      },
    })
    return res.status(200).send({ message: "Filmes encontrados com sucesso.", movies: moviesFilteredByGenreId });
  }
  catch (error) {
    return res.status(404).send({ message: "Nenhum filme encontrado para este gênero.", error });
  }
}
);


// Rota para buscar filme pelo id do filme







app.listen(port, () => {
  console.log(`Servidor em execução em http://localhost:${port}`);
});
