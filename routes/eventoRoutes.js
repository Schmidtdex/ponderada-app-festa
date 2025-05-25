const express = require("express");
const router = express.Router();
const EventoController = require("../controllers/EventoController");
const EventoAtracaoController = require("../controllers/EventoAtracaoController");
const TipoIngressoController = require("../controllers/TipoIngressoController");
// const authMiddleware = require('../middleware/authMiddleware'); // Placeholder
// const organizerMiddleware = require('../middleware/organizerMiddleware'); // Placeholder

// --- Rotas de Eventos ---

// Criar um novo evento (requer autenticação e ser organizador)
// router.post("/", authMiddleware, organizerMiddleware, EventoController.criarEvento);
router.post("/", EventoController.criarEvento); // Temporário sem auth

// Listar todos os eventos (público)
router.get("/", EventoController.listarEventos);

// Buscar um evento por ID (público)
router.get("/:id", EventoController.buscarEventoPorId);

// Editar um evento (requer autenticação e ser o organizador do evento)
// router.put("/:id", authMiddleware, organizerMiddleware, EventoController.editarEvento);
router.put("/:id", EventoController.editarEvento); // Temporário sem auth

// Excluir um evento (requer autenticação e ser o organizador do evento)
// router.delete("/:id", authMiddleware, organizerMiddleware, EventoController.excluirEvento);
router.delete("/:id", EventoController.excluirEvento); // Temporário sem auth

// --- Rotas de Atrações do Evento ---

// Listar todas as atrações de um evento específico (público)
router.get("/:evento_id/atracoes", EventoAtracaoController.listarAtracoesDoEvento);

// Adicionar uma atração a um evento (requer autenticação e ser o organizador do evento)
// router.post("/:evento_id/atracoes", authMiddleware, organizerMiddleware, EventoAtracaoController.adicionarAtracaoAoEvento); // Body: { atracao_id, horario_apresentacao }
router.post("/:evento_id/atracoes", EventoAtracaoController.adicionarAtracaoAoEvento); // Temporário sem auth

// Remover uma atração de um evento (requer autenticação e ser o organizador do evento)
// router.delete("/:evento_id/atracoes/:atracao_id", authMiddleware, organizerMiddleware, EventoAtracaoController.removerAtracaoDoEvento);
router.delete("/:evento_id/atracoes/:atracao_id", EventoAtracaoController.removerAtracaoDoEvento); // Temporário sem auth

// --- Rotas de Tipos de Ingresso do Evento ---

// Listar todos os tipos de ingresso de um evento específico (público)
router.get("/:evento_id/tipos-ingresso", TipoIngressoController.listarTiposIngressoDoEvento);

// Criar um novo tipo de ingresso para um evento (requer autenticação e ser o organizador do evento)
// router.post("/:evento_id/tipos-ingresso", authMiddleware, organizerMiddleware, TipoIngressoController.criarTipoIngresso);
router.post("/:evento_id/tipos-ingresso", TipoIngressoController.criarTipoIngresso); // Temporário sem auth

module.exports = router;

