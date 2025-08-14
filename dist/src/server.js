"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const Index_1 = __importDefault(require("./routes/Index"));
// Importe e configure o dotenv no topo do arquivo
require("dotenv/config");
const port = 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
// Usando o roteador centralizado
app.use("/api", Index_1.default);
app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
});
