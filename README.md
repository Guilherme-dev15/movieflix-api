# 🎬 **MovieFlix API**

Uma API RESTful completa para gerenciamento de filmes, construída com foco em **segurança**, **escalabilidade** e **documentação**.  
Este projeto serve como portfólio para demonstrar habilidades sólidas em desenvolvimento backend com tecnologias modernas.

---
## 📽 **Preview da API**
*(Espaço reservado para o GIF de demonstração)*  
> Coloque aqui um GIF mostrando a API em funcionamento.
---

## 🚀 **Funcionalidades**

- **Autenticação de Usuários**: Sistema de cadastro e login com senhas criptografadas (`bcrypt`).
- **Segurança com JWT**: Rotas protegidas exigem autenticação via **JSON Web Tokens**.
- **CRUD de Filmes**: Criar, listar, atualizar e excluir filmes.
- **Filtragem e Pesquisa**: Filtrar filmes por gênero ou idioma.
- **Paginação**: Listagem de filmes com suporte a `limit` e `offset`.
- **Documentação da API**: Documentação interativa via Swagger UI (`/api-docs`).
- **Código Modular**: Separação em rotas, controladores e middlewares para alta manutenibilidade.

---

## 🛠 **Tecnologias Utilizadas**

- **Backend**: Node.js, Express.js, TypeScript  
- **Banco de Dados**: PostgreSQL + Prisma ORM  
- **Autenticação**: `bcrypt` e `jsonwebtoken`  
- **Documentação**: `swagger-ui-express`  
- **Ambiente de Desenvolvimento**: `tsx`

---

## 📋 **Pré-requisitos**

Antes de começar, certifique-se de ter instalado:

- Node.js (versão LTS)
- PostgreSQL
- Prisma CLI

---

## ⚙ **Instalação e Execução**

1️⃣ **Clone o repositório**  
```bash
git clone [URL-DO-SEU-REPOSITÓRIO]
cd movieflix-api


2️⃣ **Instale as dependências**

```bash
npm install
```

3️⃣ **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:

```dotenv
DATABASE_URL="postgresql://usuario:senha@localhost:5432/movieflix?schema=public"
JWT_SECRET="sua-chave-secreta-forte"
```

4️⃣ **Execute as migrações do banco**

```bash
npx prisma migrate dev --name init
```

5️⃣ **Inicie o servidor em modo de desenvolvimento**

```bash
npm run dev
```

A API estará disponível em:
**[http://localhost:3000](http://localhost:3000)**

---

## 📚 **Documentação da API**

Swagger UI disponível em:
**[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

---

## 🔗 **Principais Endpoints**

| Método   | Endpoint                              | Descrição                             | Autenticação |
| -------- | ------------------------------------- | ------------------------------------- | ------------ |
| `POST`   | `/api/users/register`                 | Cria um novo usuário                  | Não          |
| `POST`   | `/api/users/login`                    | Autentica usuário e retorna token JWT | Não          |
| `GET`    | `/api/movies`                         | Lista todos os filmes                 | Não          |
| `GET`    | `/api/movies/{id}`                    | Detalhes de um filme                  | Não          |
| `POST`   | `/api/movies`                         | Adiciona novo filme                   | Sim          |
| `PUT`    | `/api/movies/{id}`                    | Atualiza informações de um filme      | Sim          |
| `DELETE` | `/api/movies/{id}`                    | Remove um filme                       | Sim          |
| `GET`    | `/api/movies/genre/{genreName}`       | Filtra por gênero                     | Não          |
| `GET`    | `/api/movies/language/{languageName}` | Filtra por idioma                     | Não          |

---

## 💡 **Diferenciais do Projeto**

* **Padrões de Projeto**: Arquitetura modular separando rotas, lógica de negócio e segurança.
* **Foco em Segurança**: Criptografia de senhas e autenticação por token JWT.
* **Qualidade de Código**: Uso de TypeScript para tipagem e segurança em tempo de compilação.
* **Documentação Profissional**: Swagger UI para uso rápido e entendimento claro da API.

---

## 👤 **Autor**

**Guilherme Anjos**
📧 [guilherme.macedo1598@gmail.com](mailto:guilherme.macedo1598@gmail.com)
📍 São Paulo - SP


