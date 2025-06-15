const Evento = require("../models/Evento");
const Usuario = require("../models/Usuario"); // Needed for authorization checks

// Criar um novo evento
exports.criarEvento = async (req, res) => {
  // Assuming authentication middleware adds req.user
  // const organizador_id = req.user.id;
  // const tipo_usuario = req.user.tipo_usuario;

  // TEMPORARY: Get organizer ID from request body until auth is implemented
  const { organizador_id, nome_evento, descricao, data_hora_inicio, data_hora_fim, local_evento, capacidade_maxima, url_imagem_capa } = req.body;

  // Basic validation
  if (!organizador_id || !nome_evento || !data_hora_inicio || !local_evento) {
    return res.status(400).json({ error: "Campos obrigatórios: organizador_id, nome_evento, data_hora_inicio, local_evento." });
  }

  // Authorization check (Example - needs proper implementation with middleware)
  // if (tipo_usuario !== 'organizador') {
  //   return res.status(403).json({ error: "Apenas organizadores podem criar eventos." });
  // }

  try {
    // Optional: Validate if organizador_id exists and is an 'organizador'
    const organizador = await Usuario.buscarPorId(organizador_id);
    if (!organizador || organizador.tipo_usuario !== 'organizador') {
        return res.status(400).json({ error: "ID do organizador inválido ou não é um organizador." });
    }

    const novoEvento = await Evento.criar(
      organizador_id, 
      nome_evento, 
      descricao, 
      data_hora_inicio, 
      data_hora_fim, 
      local_evento, 
      capacidade_maxima, 
      url_imagem_capa
    );
    res.status(201).json(novoEvento);
  } catch (err) {
    console.error("Erro ao criar evento:", err);
    res.status(500).json({ error: "Erro interno ao criar evento." });
  }
};

// Listar todos os eventos
exports.listarEventos = async (req, res) => {
  console.log("Rota /api/eventos chamada")
  try {
    const eventos = await Evento.buscarTodos();
    res.status(200).json(eventos);
  } catch (err) {
    console.error("Erro ao listar eventos:", err);
    res.status(500).json({ error: "Erro interno ao listar eventos." });
  }
};

// Buscar um evento por ID
exports.buscarEventoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const evento = await Evento.buscarPorId(id);
    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }
    res.status(200).json(evento);
  } catch (err) {
    console.error("Erro ao buscar evento por ID:", err);
    res.status(500).json({ error: "Erro interno ao buscar evento." });
  }
};

// Editar um evento
exports.editarEvento = async (req, res) => {
  const { id } = req.params;
  const { nome_evento, descricao, data_hora_inicio, data_hora_fim, local_evento, capacidade_maxima, url_imagem_capa } = req.body;
  // const requestingUserId = req.user.id; // From auth middleware

  try {
    const eventoExistente = await Evento.buscarPorId(id);
    if (!eventoExistente) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    // Authorization check: Only the organizer who created the event can edit it
    // if (eventoExistente.organizador_id !== requestingUserId) {
    //   return res.status(403).json({ error: "Você não tem permissão para editar este evento." });
    // }

    const eventoAtualizado = await Evento.atualizar(
      id,
      nome_evento ?? eventoExistente.nome_evento, // Use existing value if not provided
      descricao ?? eventoExistente.descricao,
      data_hora_inicio ?? eventoExistente.data_hora_inicio,
      data_hora_fim ?? eventoExistente.data_hora_fim,
      local_evento ?? eventoExistente.local_evento,
      capacidade_maxima ?? eventoExistente.capacidade_maxima,
      url_imagem_capa ?? eventoExistente.url_imagem_capa
    );

    res.status(200).json(eventoAtualizado);
  } catch (err) {
    console.error("Erro ao editar evento:", err);
    res.status(500).json({ error: "Erro interno ao editar evento." });
  }
};

// Excluir um evento
exports.excluirEvento = async (req, res) => {
  const { id } = req.params;
  // const requestingUserId = req.user.id; // From auth middleware

  try {
    const eventoExistente = await Evento.buscarPorId(id);
    if (!eventoExistente) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    // Authorization check: Only the organizer who created the event can delete it
    // if (eventoExistente.organizador_id !== requestingUserId) {
    //   return res.status(403).json({ error: "Você não tem permissão para excluir este evento." });
    // }

    // Add check: Cannot delete event if tickets have been sold?

    const eventoDeletado = await Evento.deletar(id);
    if (!eventoDeletado) { // Should not happen if buscarPorId worked, but good practice
        return res.status(404).json({ message: "Evento não encontrado para exclusão." });
    }

    res.status(200).json({ message: "Evento excluído com sucesso.", evento: eventoDeletado });
  } catch (err) {
    console.error("Erro ao excluir evento:", err);
    // Handle potential foreign key constraints if tickets/etc. exist
    if (err.code === '23503') { // foreign_key_violation
        return res.status(409).json({ error: "Não é possível excluir o evento pois existem ingressos ou outros itens associados." });
    }
    res.status(500).json({ error: "Erro interno ao excluir evento." });
  }
};

