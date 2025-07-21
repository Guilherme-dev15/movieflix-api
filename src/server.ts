/* eslint-disable @typescript-eslint/no-unused-vars */
import express from "express";
import { PrismaClient } from "./generated/client";


const port = 3000;
const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.get("/movies", async (_, res) => {
   const movies = await prisma.movie.findMany({
      orderBy: {
         title: "asc",
      },
      include: {
         genres: true,
         languages: true,
      }
   });
   res.json(movies);
});

app.post("/movies", async (req, res) => {
   const { title, genre_id, language_id, oscar_count, release_date } = req.body;

   try {
      const movieWithSameTitle = await prisma.movie.findFirst({
         where: {
            title: { equals: title.trim(), mode: "insensitive" }
         },
      });

      if (movieWithSameTitle) {
         res.status(409).send({ message: "Já existe um filme com esse título" });
         return;
      }

      await prisma.movie.create({
         data: {
            title: title.trim(),
            genre_id,
            language_id,
            oscar_count,
            release_date: new Date(release_date),
         },
      });
   } catch (error) {
      res.status(500).send({ message: "Falha ao cadastrar um filme" });
      return;
   }

   res.status(201).send();
});

app.put('/movies/:id', async (req, res) => {
   try {
      const id = Number(req.params.id);

      const movie = await prisma.movie.findUnique({
         where: {
            id
         }
      });

      if (!movie) {
         res.status(404).send({ message: "Filme não encontrado" });
         return;
      }

      const data = { ...req.body }
      data.release_date = data.release_date ? new Date(data.release_date) : undefined;

      await prisma.movie.update({
         where: {
            id
         },
         data: data
      });
      res.status(200).send()
}catch (error) {
   res.status(500).send({ message: "Falha ao atualizar o filme" });
   return;
}
});

app.listen(port, () => {
   console.log(`Servidor em execução em http://localhost:${port}`);
});