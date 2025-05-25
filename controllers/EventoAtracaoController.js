const EventoAtracao = require("../models/EventoAtracao");
const Evento = require("../models/Evento");
const Atracao = require("../models/Atracao");

// Adicionar uma atração a um evento
exports.adicionarAtracaoAoEvento = async (req, res) => {
  // Authorization check: Only the event organizer should be able to add attractions
  // const requestingUserId = req.user.id; // From auth middleware
  const { evento_id, atracao_id, horario_apresentacao } = req.body;

  if (!evento_id || !atracao_id) {
    return res.status(400).json({ error: "evento_id e atracao_id são obrigatórios." });
  }

  try {
    // Validate if event and attraction exist
    const evento = await Evento.buscarPorId(evento_id);
    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }
    const atracao = await Atracao.buscarPorId(atracao_id);
    if (!atracao) {
      return res.status(404).json({ message: "Atração não encontrada." });
    }

    // Authorization check (Example)
    // if (evento.organizador_id !== requestingUserId) {
    //   return res.status(403).json({ error: "Você não tem permissão para adicionar atrações a este evento." });
    // }

    // Check if the combination already exists (optional, depends on desired behavior)

    const novaAssociacao = await EventoAtracao.adicionarAtracaoAoEvento(evento_id, atracao_id, horario_apresentacao);
    res.status(201).json(novaAssociacao);
  } catch (err) {
    console.error("Erro ao adicionar atração ao evento:", err);
    // Handle potential unique constraint violation if combination already exists
    if (err.code === '23505') { // unique_violation
        return res.status(409).json({ error: "Esta atração já está associada a este evento." });
    }
    res.status(500).json({ error: "Erro interno ao adicionar atração ao evento." });
  }
};

// Listar atrações de um evento específico
exports.listarAtracoesDoEvento = async (req, res) => {
  const { evento_id } = req.params; // Get event_id from URL parameters

  try {
    // Optional: Check if event exists first
    const evento = await Evento.buscarPorId(evento_id);
    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    const atracoes = await EventoAtracao.buscarAtracoesPorEventoId(evento_id);
    res.status(200).json(atracoes);
  } catch (err) {
    console.error("Erro ao listar atrações do evento:", err);
    res.status(500).json({ error: "Erro interno ao listar atrações do evento." });
  }
};

// Remover uma atração de um evento
exports.removerAtracaoDoEvento = async (req, res) => {
  // Authorization check: Only the event organizer should be able to remove attractions
  // const requestingUserId = req.user.id; // From auth middleware
  const { evento_id, atracao_id } = req.params; // Get IDs from URL parameters

  try {
    // Optional: Validate if event exists and check authorization
    const evento = await Evento.buscarPorId(evento_id);
    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }
    // if (evento.organizador_id !== requestingUserId) {
    //   return res.status(403).json({ error: "Você não tem permissão para remover atrações deste evento." });
    // }

    const associacaoRemovida = await EventoAtracao.removerAtracaoDoEvento(evento_id, atracao_id);
    if (!associacaoRemovida) {
      return res.status(404).json({ message: "Associação entre evento e atração não encontrada." });
    }

    res.status(200).json({ message: "Atração removida do evento com sucesso.", associacao: associacaoRemovida });
  } catch (err) {
    console.error("Erro ao remover atração do evento:", err);
    res.status(500).json({ error: "Erro interno ao remover atração do evento." });
  }
};

// Add method to update presentation time if needed

