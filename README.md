# **MovieFlix API**

Uma API RESTful completa para gerenciamento de filmes, construída com um foco em segurança, escalabilidade e documentação. Este projeto serve como um portfólio para demonstrar habilidades sólidas em desenvolvimento backend com tecnologias modernas.

### **Funcionalidades**

* **Autenticação de Usuários**: Sistema de cadastro e login de usuários com senhas criptografadas usando `bcrypt`[cite: 5]. O esquema do banco de dados inclui campos para `username`, `email` e `password_hash`[cite: 2].
* **Segurança com JWT**: Rotas protegidas exigem autenticação via JSON Web Tokens (JWT) para operações de criação, atualização e exclusão]. A chave secreta (`JWT_SECRET`) é carregada a partir das variáveis de ambiente para garantir a segurança[cite: 4, 5].
* **CRUD de Filmes**: Funcionalidades completas para criar, ler, atualizar e deletar filmes].
* **Filtragem e Pesquisa**: Endpoint para filtrar filmes por gênero e/ou idioma].
* **Paginação**: A rota para listar todos os filmes suporta parâmetros de paginação `limit` e `offset`[cite: 5].
* **Documentação da API**: Documentação interativa e detalhada com o Swagger UI, acessível em `/api-docs`].
* **Estrutura de Código Modular**: O código é organizado em camadas de rotas, controladores e middlewares, promovendo alta manutenibilidade[cite: 5].

### **Tecnologias Utilizadas**

* **Backend**: Node.js, Express.js, TypeScript[cite: 5, 1].
* **Banco de Dados**: PostgreSQL, utilizado como fonte de dados para o Prisma ORM[cite: 2, 6, 7, 8, 9, 10, 11].
* **Autenticação**: `bcrypt` para criptografia de senhas e `jsonwebtoken` para tokens de acesso[cite: 5].
* **Documentação**: `swagger-ui-express` para gerar a documentação interativa[cite: 5].
* **Ambiente de Desenvolvimento**: `tsx` para um fluxo de trabalho de desenvolvimento ágil.

### **Pré-requisitos**

Antes de começar, certifique-se de ter instalado:

* Node.js (versão LTS)
* PostgreSQL [cite: 2, 11]
* Prisma CLI [cite: 2]

### **Instalação e Execução**

Siga os passos abaixo para rodar o projeto localmente:

1.  **Clone o repositório:**
    ```bash
    git clone [URL-DO-SEU-REPOSITÓRIO]
    cd movieflix-api
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis[cite: 6, 7, 8, 9, 10, 11]:
    ```dotenv
    DATABASE_URL="postgresql://[usuário]:[senha]@localhost:5432/movieflix?schema=public"
    JWT_SECRET="sua-chave-secreta-forte-e-aleatoria"
    ```
    (Substitua os valores entre colchetes pelos seus próprios).
4.  **Execute as migrações do banco de dados:**
    ```bash
    npx prisma migrate dev --name init
    ```
    Isso irá criar as tabelas `users`, `movies`, `genres` e `languages` no seu banco de dados[cite: 2].
5.  **Inicie o servidor em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A API estará rodando em `http://localhost:3000`[cite: 5].

### **Documentação da API**

A documentação completa da API está disponível no Swagger UI, que você pode acessar na seguinte URL:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### **Principais Endpoints da API**

| Método | Endpoint | Descrição | Requer Autenticação |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Cria um novo usuário. | Não |
| `POST` | `/api/users/login` | Autentica um usuário e retorna um token JWT. | Não |
| `GET` | `/api/movies` | Retorna uma lista de todos os filmes. | Não |
| `GET` | `/api/movies/{id}` | Retorna os detalhes de um filme específico. | Não |
| `POST` | `/api/movies` | Adiciona um novo filme ao banco de dados. | Sim |
| `PUT` | `/api/movies/{id}` | Atualiza as informações de um filme. | Sim |
| `DELETE` | `/api/movies/{id}` | Remove um filme do banco de dados. | Sim |
| `GET` | `/api/movies/genre/{genreName}` | Filtra filmes por gênero. | Não |
| `GET` | `/api/movies/language/{languageName}` | Filtra filmes por idioma. | Não |

### **Por que este projeto é especial**

Este projeto foi desenvolvido com uma mentalidade de engenharia de software profissional. Ele vai além de um simples CRUD, incorporando:
* **Padrões de Projeto**: A estrutura modular separa as preocupações de roteamento, lógica de negócio e segurança, facilitando a manutenção e a escalabilidade.
* **Foco em Segurança**: Demonstra conhecimento em como lidar com dados sensíveis, como senhas, e como proteger endpoints com um sistema de autenticação por token.
* **Qualidade de Código**: O uso de TypeScript garante a verificação de tipos e a detecção de erros em tempo de compilação, resultando em um código mais robusto.
* **Documentação**: A documentação interativa e atualizada é uma prova do meu compromisso em criar APIs que são fáceis de entender e usar, o que é um ponto crucial em times de desenvolvimento.

### **Autor**

Guilherme Anjos