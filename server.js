const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

// Rotas
const routes = require('./routes/index');

// Middleware para processar JSON
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Configura o mecanismo de visualização para usar EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.use('/', routes);

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});