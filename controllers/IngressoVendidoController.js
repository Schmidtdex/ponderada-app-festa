const IngressoVendido = require("../models/IngressoVendido");
const TipoIngresso = require("../models/TipoIngresso");
const Usuario = require("../models/Usuario");
const { v4: uuidv4 } = require('uuid');

// Criar (vender) um novo ingresso
exports.comprarIngresso = async (req, res) => {
  // Assuming authentication middleware adds req.user (the buyer)
  // const usuario_id = req.user.id;
  // TEMPORARY: Get user ID from request body until auth is implemented
  const { tipo_ingresso_id, usuario_id } = req.body;

  if (!tipo_ingresso_id || !usuario_id) {
    return res.status(400).json({ error: "Campos obrigatórios: tipo_ingresso_id, usuario_id." });
  }

  try {
    // 1. Validate User and Ticket Type exist
    const usuario = await Usuario.buscarPorId(usuario_id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário comprador não encontrado." });
    }
    const tipoIngresso = await TipoIngresso.buscarPorId(tipo_ingresso_id);
    if (!tipoIngresso) {
      return res.status(404).json({ message: "Tipo de ingresso não encontrado." });
    }

    // 2. Check available quantity and decrement (Transaction needed for atomicity)
    // This is a simplified version. Ideally, use a database transaction.
    let tipoIngressoAtualizado;
    try {
        tipoIngressoAtualizado = await TipoIngresso.decrementarDisponivel(tipo_ingresso_id, 1);
    } catch (error) {
        // Handle specific error from decrementarDisponivel (e.g., quantity unavailable)
        if (error.message.includes("indisponível")) {
            return res.status(409).json({ error: "Ingressos esgotados para este tipo." });
        }
        throw error; // Re-throw other errors
    }

    // 3. Generate unique QR code
    const codigo_qr = uuidv4(); // Generate a unique QR code

    // 4. Create the sold ticket record (assuming payment is handled elsewhere or starts as 'pendente')
    const status_pagamento = 'pendente'; // Or get from payment gateway integration
    const novoIngressoVendido = await IngressoVendido.criar(
      tipo_ingresso_id,
      usuario_id,
      codigo_qr,
      status_pagamento
    );

    res.status(201).json(novoIngressoVendido);

  } catch (err) {
    console.error("Erro ao comprar ingresso:", err);
    // If decrement succeeded but creation failed, we should ideally roll back the decrement.
    // This highlights the need for transactions.
    res.status(500).json({ error: "Erro interno ao processar a compra do ingresso." });
  }
};

// Listar ingressos comprados por um usuário
exports.listarIngressosDoUsuario = async (req, res) => {
  // Assuming authentication middleware adds req.user
  // const usuario_id = req.user.id;
  // TEMPORARY: Get user ID from URL parameter
  const { usuario_id } = req.params;

  // Authorization check: User should only see their own tickets
  // if (req.user.id !== usuario_id && req.user.tipo_usuario !== 'admin') {
  //    return res.status(403).json({ error: "Acesso não autorizado." });
  // }

  try {
    const ingressos = await IngressoVendido.buscarPorUsuarioId(usuario_id);
    res.status(200).json(ingressos);
  } catch (err) {
    console.error("Erro ao listar ingressos do usuário:", err);
    res.status(500).json({ error: "Erro interno ao listar ingressos." });
  }
};

// Buscar um ingresso vendido específico por ID
exports.buscarIngressoVendidoPorId = async (req, res) => {
  const { id } = req.params;
  // Add authorization check: Only owner or relevant organizer/admin?

  try {
    const ingresso = await IngressoVendido.buscarPorId(id);
    if (!ingresso) {
      return res.status(404).json({ message: "Ingresso vendido não encontrado." });
    }
    res.status(200).json(ingresso);
  } catch (err) {
    console.error("Erro ao buscar ingresso vendido por ID:", err);
    res.status(500).json({ error: "Erro interno ao buscar ingresso." });
  }
};

// Buscar um ingresso vendido por Código QR (e.g., for check-in)
exports.validarIngressoPorQRCode = async (req, res) => {
  const { codigo_qr } = req.params;
  // Authorization: Typically done by event staff/organizer app

  try {
    const ingresso = await IngressoVendido.buscarPorCodigoQR(codigo_qr);
    if (!ingresso) {
      return res.status(404).json({ message: "Ingresso inválido ou não encontrado.", valido: false });
    }

    // Add checks: Is payment status 'pago'? Has it already been used?
    if (ingresso.status_pagamento !== 'pago') {
        return res.status(402).json({ message: `Pagamento ${ingresso.status_pagamento}. Entrada não permitida.`, valido: false, ingresso: ingresso });
    }

    // Add logic here to mark the ticket as used if needed

    res.status(200).json({ message: "Ingresso válido.", valido: true, ingresso: ingresso });
  } catch (err) {
    console.error("Erro ao validar ingresso por QR Code:", err);
    res.status(500).json({ error: "Erro interno ao validar ingresso." });
  }
};

// Atualizar status de pagamento de um ingresso
exports.atualizarStatusPagamentoIngresso = async (req, res) => {
  const { id } = req.params;
  const { status_pagamento } = req.body;
  // Authorization: Typically done by payment gateway callback or admin

  if (!status_pagamento || !['pendente', 'pago', 'cancelado', 'reembolsado'].includes(status_pagamento)) {
      return res.status(400).json({ error: "Status de pagamento inválido." });
  }

  try {
    const ingressoExistente = await IngressoVendido.buscarPorId(id);
    if (!ingressoExistente) {
      return res.status(404).json({ message: "Ingresso vendido não encontrado." });
    }

    const ingressoAtualizado = await IngressoVendido.atualizarStatusPagamento(id, status_pagamento);
    res.status(200).json(ingressoAtualizado);
  } catch (err) {
    console.error("Erro ao atualizar status de pagamento:", err);
    res.status(500).json({ error: "Erro interno ao atualizar status de pagamento." });
  }
};

