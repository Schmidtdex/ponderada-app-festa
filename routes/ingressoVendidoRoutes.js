const express = require("express");
const router = express.Router();
const IngressoVendidoController = require("../controllers/IngressoVendidoController");
// const authMiddleware = require("../middleware/authMiddleware"); // Placeholder

// Comprar (criar) um novo ingresso (requer autenticação do comprador)
// router.post("/comprar", authMiddleware, IngressoVendidoController.comprarIngresso);
router.post("/comprar", IngressoVendidoController.comprarIngresso); // Temporário sem auth. Body: { tipo_ingresso_id, usuario_id }

// Listar ingressos comprados por um usuário específico (requer autenticação do próprio usuário ou admin)
// router.get("/usuario/:usuario_id", authMiddleware, IngressoVendidoController.listarIngressosDoUsuario);
router.get("/usuario/:usuario_id", IngressoVendidoController.listarIngressosDoUsuario); // Temporário sem auth

// Buscar um ingresso vendido específico pelo seu ID (requer autenticação do dono ou organizador/admin)
// router.get("/:id", authMiddleware, IngressoVendidoController.buscarIngressoVendidoPorId);
router.get("/:id", IngressoVendidoController.buscarIngressoVendidoPorId); // Temporário sem auth

// Validar um ingresso usando seu Código QR (requer autenticação de staff/organizador)
// router.get("/validar/:codigo_qr", authMiddleware, /* staffMiddleware? */ IngressoVendidoController.validarIngressoPorQRCode);
router.get("/validar/:codigo_qr", IngressoVendidoController.validarIngressoPorQRCode); // Temporário sem auth

// Atualizar status de pagamento de um ingresso (requer autenticação de sistema de pagamento/admin)
// router.patch("/:id/status-pagamento", /* paymentOrAdminAuth */ IngressoVendidoController.atualizarStatusPagamentoIngresso);
router.patch("/:id/status-pagamento", IngressoVendidoController.atualizarStatusPagamentoIngresso); // Temporário sem auth. Body: { status_pagamento }

module.exports = router;

