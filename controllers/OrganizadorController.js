const Evento = require("../models/Evento");
const TipoIngresso = require("../models/TipoIngresso");
const Atracao = require("../models/Atracao");
const EventoAtracao = require("../models/EventoAtracao");
const IngressoVendido = require("../models/IngressoVendido");

// Dashboard do organizador
exports.dashboard = async (req, res) => {
  try {
    const organizadorId = req.user.id;
    
    // Buscar eventos do organizador
    const eventos = await Evento.buscarTodos();
    const eventosOrganizador = eventos.filter(evento => evento.organizador_id === organizadorId);
    
    // Calcular estatísticas
    const totalEventos = eventosOrganizador.length;
    const eventosAtivos = eventosOrganizador.filter(evento => new Date(evento.data_hora_inicio) > new Date()).length;
    
    // Buscar vendas de ingressos (simulação - seria necessário implementar query específica)
    let totalVendas = 0;
    let totalIngressosVendidos = 0;
    
    for (const evento of eventosOrganizador) {
      const tiposIngresso = await TipoIngresso.buscarPorEventoId(evento.id);
      for (const tipo of tiposIngresso) {
        const vendidos = tipo.quantidade_total - tipo.quantidade_disponivel;
        totalIngressosVendidos += vendidos;
        totalVendas += vendidos * tipo.preco;
      }
    }

    const estatisticas = {
      totalEventos,
      eventosAtivos,
      totalVendas,
      totalIngressosVendidos
    };

    res.render('layout/main', {
      pageTitle: 'Dashboard - Organizador',
      content: '../pages/organizador/dashboard',
      user: req.user,
      eventos: eventosOrganizador.slice(0, 5), // Últimos 5 eventos
      estatisticas
    });
  } catch (error) {
    console.error('Erro no dashboard:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Listar eventos do organizador
exports.listarEventos = async (req, res) => {
  try {
    const organizadorId = req.user.id;
    const eventos = await Evento.buscarTodos();
    const eventosOrganizador = eventos.filter(evento => evento.organizador_id === organizadorId);

    res.render('layout/main', {
      pageTitle: 'Meus Eventos',
      content: '../pages/organizador/gerenciar-eventos',
      user: req.user,
      eventos: eventosOrganizador
    });
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Exibir formulário de criação de evento
exports.exibirFormularioCriacao = (req, res) => {
  res.render('layout/main', {
    pageTitle: 'Criar Evento',
    content: '../pages/organizador/criar-evento',
    user: req.user
  });
};

// Criar novo evento
exports.criarEvento = async (req, res) => {
  try {
    const organizadorId = req.user.id;
    const { 
      nome_evento, 
      descricao, 
      data_hora_inicio, 
      data_hora_fim, 
      local_evento, 
      capacidade_maxima, 
      url_imagem_capa 
    } = req.body;

    // Validações básicas
    if (!nome_evento || !data_hora_inicio || !local_evento) {
      return res.status(400).json({ 
        error: "Campos obrigatórios: nome_evento, data_hora_inicio, local_evento." 
      });
    }

    const novoEvento = await Evento.criar(
      organizadorId,
      nome_evento,
      descricao,
      data_hora_inicio,
      data_hora_fim,
      local_evento,
      capacidade_maxima || 100,
      url_imagem_capa
    );

    res.status(201).json({ 
      success: true, 
      evento: novoEvento,
      message: 'Evento criado com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Exibir formulário de edição de evento
exports.exibirFormularioEdicao = async (req, res) => {
  try {
    const evento = req.evento; // Vem do middleware verificarProprietarioEvento

    res.render('layout/main', {
      pageTitle: `Editar ${evento.nome_evento}`,
      content: '../pages/organizador/editar-evento',
      user: req.user,
      evento
    });
  } catch (error) {
    console.error('Erro ao exibir formulário de edição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Atualizar evento
exports.atualizarEvento = async (req, res) => {
  try {
    const eventoId = req.params.id;
    const { 
      nome_evento, 
      descricao, 
      data_hora_inicio, 
      data_hora_fim, 
      local_evento, 
      capacidade_maxima, 
      url_imagem_capa 
    } = req.body;

    const eventoAtualizado = await Evento.atualizar(
      eventoId,
      nome_evento,
      descricao,
      data_hora_inicio,
      data_hora_fim,
      local_evento,
      capacidade_maxima,
      url_imagem_capa
    );

    res.json({ 
      success: true, 
      evento: eventoAtualizado,
      message: 'Evento atualizado com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Deletar evento
exports.deletarEvento = async (req, res) => {
  try {
    const eventoId = req.params.id;
    
    // Verificar se há ingressos vendidos
    const tiposIngresso = await TipoIngresso.buscarPorEventoId(eventoId);
    let temIngressosVendidos = false;
    
    for (const tipo of tiposIngresso) {
      if (tipo.quantidade_total > tipo.quantidade_disponivel) {
        temIngressosVendidos = true;
        break;
      }
    }

    if (temIngressosVendidos) {
      return res.status(400).json({ 
        error: 'Não é possível deletar evento com ingressos vendidos' 
      });
    }

    await Evento.deletar(eventoId);
    res.json({ 
      success: true, 
      message: 'Evento deletado com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Gerenciar tipos de ingresso
exports.gerenciarIngressos = async (req, res) => {
  try {
    const evento = req.evento;
    const tiposIngresso = await TipoIngresso.buscarPorEventoId(evento.id);

    res.render('layout/main', {
      pageTitle: `Ingressos - ${evento.nome_evento}`,
      content: '../pages/organizador/gerenciar-ingressos',
      user: req.user,
      evento,
      tiposIngresso
    });
  } catch (error) {
    console.error('Erro ao gerenciar ingressos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Criar tipo de ingresso
exports.criarTipoIngresso = async (req, res) => {
  try {
    const eventoId = req.params.id;
    const { nome_tipo, preco, quantidade_total } = req.body;

    if (!nome_tipo || !preco || !quantidade_total) {
      return res.status(400).json({ 
        error: 'Todos os campos são obrigatórios' 
      });
    }

    const novoTipo = await TipoIngresso.criar(
      eventoId,
      nome_tipo,
      parseFloat(preco),
      parseInt(quantidade_total)
    );

    res.status(201).json({ 
      success: true, 
      tipoIngresso: novoTipo,
      message: 'Tipo de ingresso criado com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao criar tipo de ingresso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Atualizar tipo de ingresso
exports.atualizarTipoIngresso = async (req, res) => {
  try {
    const tipoId = req.params.tipoId;
    const { nome_tipo, preco, quantidade_total, quantidade_disponivel } = req.body;

    const tipoAtualizado = await TipoIngresso.atualizar(
      tipoId,
      nome_tipo,
      parseFloat(preco),
      parseInt(quantidade_total),
      parseInt(quantidade_disponivel)
    );

    res.json({ 
      success: true, 
      tipoIngresso: tipoAtualizado,
      message: 'Tipo de ingresso atualizado com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao atualizar tipo de ingresso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Deletar tipo de ingresso
exports.deletarTipoIngresso = async (req, res) => {
  try {
    const tipoId = req.params.tipoId;
    
    // Verificar se há ingressos vendidos deste tipo
    const tipo = await TipoIngresso.buscarPorId(tipoId);
    if (tipo.quantidade_total > tipo.quantidade_disponivel) {
      return res.status(400).json({ 
        error: 'Não é possível deletar tipo de ingresso com vendas realizadas' 
      });
    }

    await TipoIngresso.deletar(tipoId);
    res.json({ 
      success: true, 
      message: 'Tipo de ingresso deletado com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao deletar tipo de ingresso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Gerenciar line-up
exports.gerenciarLineup = async (req, res) => {
  try {
    const evento = req.evento;
    
    // Buscar atrações do evento (seria necessário implementar no modelo EventoAtracao)
    // Por enquanto, vamos simular
    const atracoes = [];

    res.render('layout/main', {
      pageTitle: `Line-up - ${evento.nome_evento}`,
      content: '../pages/organizador/gerenciar-lineup',
      user: req.user,
      evento,
      atracoes
    });
  } catch (error) {
    console.error('Erro ao gerenciar line-up:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

