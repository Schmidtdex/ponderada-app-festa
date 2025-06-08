const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');
const { verificarAutenticacao, verificarCliente } = require('../middleware/auth');

// Rotas públicas (não requerem autenticação)
router.get('/eventos/:id', ClienteController.detalhesEvento);

// Rotas que requerem autenticação como cliente
router.get('/eventos/:id/comprar', verificarAutenticacao, verificarCliente, ClienteController.comprarIngressos);
router.post('/eventos/:id/comprar', verificarAutenticacao, verificarCliente, ClienteController.processarCompra);

router.get('/cliente/ingressos', verificarAutenticacao, verificarCliente, ClienteController.meusIngressos);
router.get('/cliente/perfil', verificarAutenticacao, verificarCliente, ClienteController.perfil);
router.put('/cliente/perfil', verificarAutenticacao, verificarCliente, ClienteController.atualizarPerfil);

module.exports = router;

