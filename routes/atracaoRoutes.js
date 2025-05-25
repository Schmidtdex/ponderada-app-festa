const express = require("express");
const router = express.Router();
const AtracaoController = require("../controllers/AtracaoController");
// const authMiddleware = require('../middleware/authMiddleware'); // Placeholder
// const organizerMiddleware = require('../middleware/organizerMiddleware'); // Placeholder

// Criar uma nova atração (requer autenticação e ser organizador?)
// router.post("/", authMiddleware, organizerMiddleware, AtracaoController.criarAtracao);
router.post("/", AtracaoController.criarAtracao); // Temporário sem auth

// Listar todas as atrações (público)
router.get("/", AtracaoController.listarAtracoes);

// Buscar uma atração por ID (público)
router.get("/:id", AtracaoController.buscarAtracaoPorId);

// Editar uma atração (requer autenticação e ser organizador?)
// router.put("/:id", authMiddleware, organizerMiddleware, AtracaoController.editarAtracao);
router.put("/:id", AtracaoController.editarAtracao); // Temporário sem auth

// Excluir uma atração (requer autenticação e ser organizador?)
// router.delete("/:id", authMiddleware, organizerMiddleware, AtracaoController.excluirAtracao);
router.delete("/:id", AtracaoController.excluirAtracao); // Temporário sem auth

module.exports = router;

