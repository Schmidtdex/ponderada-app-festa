const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/landing.html'));
})

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
