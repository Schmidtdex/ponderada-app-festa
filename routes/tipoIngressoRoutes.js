const express = require("express");
const router = express.Router();
const TipoIngressoController = require("../controllers/TipoIngressoController");
// const authMiddleware = require('../middleware/authMiddleware'); // Placeholder
// const organizerMiddleware = require('../middleware/organizerMiddleware'); // Placeholder

// Buscar um tipo de ingresso específico pelo seu ID (público? ou requer auth?)
router.get("/:id", TipoIngressoController.buscarTipoIngressoPorId);

// Editar um tipo de ingresso (requer autenticação e ser o organizador do evento associado)
// router.put("/:id", authMiddleware, organizerMiddleware, TipoIngressoController.editarTipoIngresso);
router.put("/:id", TipoIngressoController.editarTipoIngresso); // Temporário sem auth

// Excluir um tipo de ingresso (requer autenticação e ser o organizador do evento associado, e verificar se não há ingressos vendidos)
// router.delete("/:id", authMiddleware, organizerMiddleware, TipoIngressoController.excluirTipoIngresso);
router.delete("/:id", TipoIngressoController.excluirTipoIngresso); // Temporário sem auth

module.exports = router;

