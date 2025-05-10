const express = require('express');
const router = express.Router();

const frontRoutes = require('./frontRoutes');
const userRoutes = require('./userRoutes');

// Rotas para o front-end
router.use('/', frontRoutes);

// Rotas para a API de usuários
router.use('/users', userRoutes);

module.exports = router;