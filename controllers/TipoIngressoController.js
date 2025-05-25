const TipoIngresso = require("../models/TipoIngresso");
const Evento = require("../models/Evento"); // For validation/authorization

// Criar um novo tipo de ingresso para um evento
exports.criarTipoIngresso = async (req, res) => {
  // Authorization check: Only the event organizer should create ticket types
  // const requestingUserId = req.user.id; // From auth middleware
  const { evento_id, nome_tipo, preco, quantidade_total } = req.body;

  if (!evento_id || !nome_tipo || preco === undefined || preco === null || quantidade_total === undefined || quantidade_total === null) {
    return res.status(400).json({ error: "Campos obrigatórios: evento_id, nome_tipo, preco, quantidade_total." });
  }

  if (typeof preco !== 'number' || preco < 0 || typeof quantidade_total !== 'number' || quantidade_total <= 0) {
      return res.status(400).json({ error: "Preço deve ser um número não negativo e quantidade_total deve ser um número positivo." });
  }

  try {
    // Validate if event exists
    const evento = await Evento.buscarPorId(evento_id);
    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    // Authorization check (Example)
    // if (evento.organizador_id !== requestingUserId) {
    //   return res.status(403).json({ error: "Você não tem permissão para criar tipos de ingresso para este evento." });
    // }

    const novoTipoIngresso = await TipoIngresso.criar(evento_id, nome_tipo, preco, quantidade_total);
    res.status(201).json(novoTipoIngresso);
  } catch (err) {
    console.error("Erro ao criar tipo de ingresso:", err);
    res.status(500).json({ error: "Erro interno ao criar tipo de ingresso." });
  }
};

// Listar todos os tipos de ingresso de um evento específico
exports.listarTiposIngressoDoEvento = async (req, res) => {
  const { evento_id } = req.params; // Get evento_id from URL parameters

  try {
    // Optional: Check if event exists first
    const evento = await Evento.buscarPorId(evento_id);
    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    const tiposIngresso = await TipoIngresso.buscarPorEventoId(evento_id);
    res.status(200).json(tiposIngresso);
  } catch (err) {
    console.error("Erro ao listar tipos de ingresso do evento:", err);
    res.status(500).json({ error: "Erro interno ao listar tipos de ingresso do evento." });
  }
};

// Buscar um tipo de ingresso por ID
exports.buscarTipoIngressoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const tipoIngresso = await TipoIngresso.buscarPorId(id);
    if (!tipoIngresso) {
      return res.status(404).json({ message: "Tipo de ingresso não encontrado." });
    }
    res.status(200).json(tipoIngresso);
  } catch (err) {
    console.error("Erro ao buscar tipo de ingresso por ID:", err);
    res.status(500).json({ error: "Erro interno ao buscar tipo de ingresso." });
  }
};

// Editar um tipo de ingresso
exports.editarTipoIngresso = async (req, res) => {
  // Authorization check: Only the event organizer?
  const { id } = req.params;
  const { nome_tipo, preco, quantidade_total, quantidade_disponivel } = req.body;

  try {
    const tipoIngressoExistente = await TipoIngresso.buscarPorId(id);
    if (!tipoIngressoExistente) {
      return res.status(404).json({ message: "Tipo de ingresso não encontrado." });
    }

    // Authorization check (Example)
    // const evento = await Evento.buscarPorId(tipoIngressoExistente.evento_id);
    // if (evento.organizador_id !== requestingUserId) {
    //   return res.status(403).json({ error: "Você não tem permissão para editar este tipo de ingresso." });
    // }

    // Add validation: Cannot decrease quantidade_total below tickets sold?
    // Cannot set quantidade_disponivel > quantidade_total?

    const tipoIngressoAtualizado = await TipoIngresso.atualizar(
      id,
      nome_tipo ?? tipoIngressoExistente.nome_tipo,
      preco ?? tipoIngressoExistente.preco,
      quantidade_total ?? tipoIngressoExistente.quantidade_total,
      quantidade_disponivel ?? tipoIngressoExistente.quantidade_disponivel
    );

    res.status(200).json(tipoIngressoAtualizado);
  } catch (err) {
    console.error("Erro ao editar tipo de ingresso:", err);
    res.status(500).json({ error: "Erro interno ao editar tipo de ingresso." });
  }
};

// Excluir um tipo de ingresso
exports.excluirTipoIngresso = async (req, res) => {
  // Authorization check: Only the event organizer?
  const { id } = req.params;

  try {
    const tipoIngressoExistente = await TipoIngresso.buscarPorId(id);
    if (!tipoIngressoExistente) {
      return res.status(404).json({ message: "Tipo de ingresso não encontrado." });
    }

    // Authorization check (Example)
    // const evento = await Evento.buscarPorId(tipoIngressoExistente.evento_id);
    // if (evento.organizador_id !== requestingUserId) {
    //   return res.status(403).json({ error: "Você não tem permissão para excluir este tipo de ingresso." });
    // }

    // IMPORTANT CHECK: Prevent deletion if any tickets of this type have been sold.
    // This requires checking the Ingressos_Vendidos table.
    // Example (needs IngressoVendido model/method):
    // const ingressosVendidos = await IngressoVendido.contarPorTipoIngressoId(id);
    // if (ingressosVendidos > 0) {
    //   return res.status(409).json({ error: "Não é possível excluir o tipo de ingresso pois já existem ingressos vendidos." });
    // }

    const tipoIngressoDeletado = await TipoIngresso.deletar(id);
    if (!tipoIngressoDeletado) { // Should not happen if buscarPorId worked
        return res.status(404).json({ message: "Tipo de ingresso não encontrado para exclusão." });
    }

    res.status(200).json({ message: "Tipo de ingresso excluído com sucesso.", tipoIngresso: tipoIngressoDeletado });
  } catch (err) {
    console.error("Erro ao excluir tipo de ingresso:", err);
     // Handle potential foreign key constraints if linked to Ingressos_Vendidos
    if (err.code === '23503') { // foreign_key_violation
        return res.status(409).json({ error: "Não é possível excluir o tipo de ingresso pois existem ingressos vendidos associados." });
    }
    res.status(500).json({ error: "Erro interno ao excluir tipo de ingresso." });
  }
};

