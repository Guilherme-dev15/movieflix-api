// src/server.ts
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import apiRoutes from "./routes/Index";

// Importe e configure o dotenv no topo do arquivo
import "dotenv/config"; 

const port = 3000;
const app = express();


app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Usando o roteador centralizado
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Servidor em execução em http://localhost:${port}`);
});