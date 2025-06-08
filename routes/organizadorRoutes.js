const express = require('express');
const router = express.Router();
const OrganizadorController = require('../controllers/OrganizadorController');
const { verificarAutenticacao, verificarOrganizador, verificarProprietarioEvento } = require('../middleware/auth');

// Aplicar middleware de autenticação e verificação de organizador para todas as rotas
router.use(verificarAutenticacao);
router.use(verificarOrganizador);

// Dashboard do organizador
router.get('/dashboard', OrganizadorController.dashboard);

// Gerenciamento de eventos
router.get('/eventos', OrganizadorController.listarEventos);
router.get('/eventos/criar', OrganizadorController.exibirFormularioCriacao);
router.post('/eventos', OrganizadorController.criarEvento);

// Rotas que requerem verificação de propriedade do evento
router.get('/eventos/:id/editar', verificarProprietarioEvento, OrganizadorController.exibirFormularioEdicao);
router.put('/eventos/:id', verificarProprietarioEvento, OrganizadorController.atualizarEvento);
router.delete('/eventos/:id', verificarProprietarioEvento, OrganizadorController.deletarEvento);

// Gerenciamento de ingressos
router.get('/eventos/:id/ingressos', verificarProprietarioEvento, OrganizadorController.gerenciarIngressos);
router.post('/eventos/:id/ingressos', verificarProprietarioEvento, OrganizadorController.criarTipoIngresso);
router.put('/eventos/:id/ingressos/:tipoId', verificarProprietarioEvento, OrganizadorController.atualizarTipoIngresso);
router.delete('/eventos/:id/ingressos/:tipoId', verificarProprietarioEvento, OrganizadorController.deletarTipoIngresso);

// Gerenciamento de line-up
router.get('/eventos/:id/lineup', verificarProprietarioEvento, OrganizadorController.gerenciarLineup);

module.exports = router;

