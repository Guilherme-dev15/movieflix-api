import express from 'express';

const port = 3000;
const app = express();

//GET POST PUT DELETE PATCH 



app.get('/movies', (req, res) => {
   res.send('Films list');
});

app.listen(port, () => {
   console.log(`Servidor em execução em http://localhost:${port}`);
});