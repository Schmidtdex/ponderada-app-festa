const Atracao = require("../models/Atracao");

// Criar uma nova atração
exports.criarAtracao = async (req, res) => {
  // Authorization check: Maybe only organizers can create attractions?
  // const tipo_usuario = req.user.tipo_usuario; // From auth middleware
  // if (tipo_usuario !== 'organizador') {
  //   return res.status(403).json({ error: "Apenas organizadores podem criar atrações." });
  // }

  const { nome_atracao, genero_musical } = req.body;

  if (!nome_atracao) {
    return res.status(400).json({ error: "O nome da atração é obrigatório." });
  }

  try {
    const novaAtracao = await Atracao.criar(nome_atracao, genero_musical);
    res.status(201).json(novaAtracao);
  } catch (err) {
    console.error("Erro ao criar atração:", err);
    res.status(500).json({ error: "Erro interno ao criar atração." });
  }
};

// Listar todas as atrações
exports.listarAtracoes = async (req, res) => {
  try {
    const atracoes = await Atracao.buscarTodas();
    res.status(200).json(atracoes);
  } catch (err) {
    console.error("Erro ao listar atrações:", err);
    res.status(500).json({ error: "Erro interno ao listar atrações." });
  }
};

// Buscar uma atração por ID
exports.buscarAtracaoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const atracao = await Atracao.buscarPorId(id);
    if (!atracao) {
      return res.status(404).json({ message: "Atração não encontrada." });
    }
    res.status(200).json(atracao);
  } catch (err) {
    console.error("Erro ao buscar atração por ID:", err);
    res.status(500).json({ error: "Erro interno ao buscar atração." });
  }
};

// Editar uma atração
exports.editarAtracao = async (req, res) => {
  // Authorization check: Maybe only organizers can edit attractions?
  const { id } = req.params;
  const { nome_atracao, genero_musical } = req.body;

  try {
    const atracaoExistente = await Atracao.buscarPorId(id);
    if (!atracaoExistente) {
      return res.status(404).json({ message: "Atração não encontrada." });
    }

    const atracaoAtualizada = await Atracao.atualizar(
      id,
      nome_atracao ?? atracaoExistente.nome_atracao,
      genero_musical ?? atracaoExistente.genero_musical
    );

    res.status(200).json(atracaoAtualizada);
  } catch (err) {
    console.error("Erro ao editar atração:", err);
    res.status(500).json({ error: "Erro interno ao editar atração." });
  }
};

// Excluir uma atração
exports.excluirAtracao = async (req, res) => {
  // Authorization check: Maybe only organizers can delete attractions?
  const { id } = req.params;

  try {
    // Check if attraction is linked to any event before deleting
    // This check might be better placed in the model or a service layer

    const atracaoDeletada = await Atracao.deletar(id);
    if (!atracaoDeletada) {
      return res.status(404).json({ message: "Atração não encontrada." });
    }

    res.status(200).json({ message: "Atração excluída com sucesso.", atracao: atracaoDeletada });
  } catch (err) {
    console.error("Erro ao excluir atração:", err);
     // Handle potential foreign key constraints if linked to Eventos_Atracoes
    if (err.code === '23503') { // foreign_key_violation
        return res.status(409).json({ error: "Não é possível excluir a atração pois está associada a um ou mais eventos." });
    }
    res.status(500).json({ error: "Erro interno ao excluir atração." });
  }
};

