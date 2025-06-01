const express = require('express');
const router = express.Router();
const path = require('path');

// Roteamento para páginas dinâmicas
router.get('/', (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Página Inicial',
    content: path.join(__dirname, '../views/pages/page1')
  });
});

// Rota para a página de registro
router.get('/registro', (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Registro de Usuário',
    content: path.join(__dirname, '../views/pages/registro')
  });
});

// Rota para a página de login
router.get('/login', (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Login',
    content: path.join(__dirname, '../views/pages/login')
  });
});

// Rota para a página de eventos
router.get('/eventos', (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Eventos',
    content: path.join(__dirname, '../views/pages/eventos')
  });
});

router.get('/about', (req, res) => {
  res.render(path.join(__dirname, '../views/layout/main'), {
    pageTitle: 'Sobre',
    content: path.join(__dirname, '../views/pages/page2')
  });
});



module.exports = router;
