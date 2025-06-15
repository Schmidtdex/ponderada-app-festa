const Evento = require("../models/Evento");
const TipoIngresso = require("../models/TipoIngresso");
const IngressoVendido = require("../models/IngressoVendido");
const Usuario = require("../models/Usuario");

// Página de detalhes do evento
exports.detalhesEvento = async (req, res) => {
  try {
    const eventoId = req.params.id;
    
    // Buscar evento
    const evento = await Evento.buscarPorId(eventoId);
    if (!evento) {
      return res.status(404).render('layout/main', {
        pageTitle: 'Evento não encontrado',
        content: '../pages/erro-404',
        user: req.user || null
      });
    }

    // Buscar tipos de ingresso
    const tiposIngresso = await TipoIngresso.buscarPorEventoId(eventoId);
    
    // Buscar organizador
    const organizador = await Usuario.buscarPorId(evento.organizador_id);

    const eventoPassou = new Date(evento.data_hora_fim || evento.data_hora_inicio) < new Date()

    // Buscar atrações (simulação - seria implementado com EventoAtracao)
    const atracoes = [];

    res.render('layout/main', {
      pageTitle: evento.nome_evento,
      content: '../pages/cliente/evento-detalhes',
      user: req.user || null,
      evento,
      tiposIngresso,
      organizador,
      atracoes,
      eventoPassou
    });
  } catch (error) {
    console.error('Erro ao buscar detalhes do evento:', error);
    res.status(500).render('layout/main', {
      pageTitle: 'Erro interno',
      content: '../pages/erro-500',
      user: req.user || null
    });
  }
};

// Página de compra de ingressos
exports.comprarIngressos = async (req, res) => {
  try {
    const eventoId = req.params.id;
    
    // Verificar se o usuário está logado e é cliente
    if (!req.user || req.user.tipo_usuario !== 'cliente') {
      return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
    }

    // Buscar evento
    const evento = await Evento.buscarPorId(eventoId);
    if (!evento) {
      return res.status(404).render('layout/main', {
        pageTitle: 'Evento não encontrado',
        content: '../pages/erro-404',
        user: req.user
      });
    }

    // Verificar se o evento ainda não aconteceu
    if (new Date(evento.data_hora_inicio) < new Date()) {
      return res.render('layout/main', {
        pageTitle: 'Evento finalizado',
        content: '../pages/cliente/evento-finalizado',
        user: req.user,
        evento
      });
    }

    // Buscar tipos de ingresso disponíveis
    const tiposIngresso = await TipoIngresso.buscarPorEventoId(eventoId);
    const tiposDisponiveis = tiposIngresso.filter(tipo => tipo.quantidade_disponivel > 0);

    if (tiposDisponiveis.length === 0) {
      return res.render('layout/main', {
        pageTitle: 'Ingressos esgotados',
        content: '../pages/cliente/ingressos-esgotados',
        user: req.user,
        evento
      });
    }

    res.render('layout/main', {
      pageTitle: `Comprar Ingressos - ${evento.nome_evento}`,
      content: '../pages/cliente/comprar-ingressos',
      user: req.user,
      evento,
      tiposIngresso: tiposDisponiveis
    });
  } catch (error) {
    console.error('Erro na página de compra:', error);
    res.status(500).render('layout/main', {
      pageTitle: 'Erro interno',
      content: '../pages/erro-500',
      user: req.user
    });
  }
};

// Processar compra de ingressos
exports.processarCompra = async (req, res) => {
  try {
    const eventoId = req.params.id;
    const clienteId = req.user.id;
    const { ingressos, dados_pessoais } = req.body;

    // Validações básicas
    if (!ingressos || !Array.isArray(ingressos) || ingressos.length === 0) {
      return res.status(400).json({ error: 'Nenhum ingresso selecionado' });
    }

    // Buscar evento
    const evento = await Evento.buscarPorId(eventoId);
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    let valorTotal = 0;
    const ingressosComprados = [];

    // Processar cada tipo de ingresso
    for (const item of ingressos) {
      const { tipo_ingresso_id, quantidade } = item;
      
      if (!tipo_ingresso_id || !quantidade || quantidade <= 0) {
        continue;
      }

      // Buscar tipo de ingresso
      const tipoIngresso = await TipoIngresso.buscarPorId(tipo_ingresso_id);
      if (!tipoIngresso || tipoIngresso.evento_id !== parseInt(eventoId)) {
        return res.status(400).json({ 
          error: `Tipo de ingresso inválido: ${tipo_ingresso_id}` 
        });
      }

      // Verificar disponibilidade
      if (tipoIngresso.quantidade_disponivel < quantidade) {
        return res.status(400).json({ 
          error: `Quantidade indisponível para ${tipoIngresso.nome_tipo}. Disponível: ${tipoIngresso.quantidade_disponivel}` 
        });
      }

      // Calcular valor
      const valorItem = tipoIngresso.preco * quantidade;
      valorTotal += valorItem;

      // Simular criação de ingressos vendidos
      for (let i = 0; i < quantidade; i++) {
        ingressosComprados.push({
          cliente_id: clienteId,
          tipo_ingresso_id: tipo_ingresso_id,
          preco_pago: tipoIngresso.preco,
          codigo_ingresso: `${eventoId}-${tipo_ingresso_id}-${Date.now()}-${i}`,
          status: 'ativo'
        });
      }

      // Atualizar quantidade disponível
      await TipoIngresso.decrementarDisponivel(tipo_ingresso_id, quantidade);
    }

    // Simular processamento de pagamento
    // Em uma implementação real, aqui seria integrado com gateway de pagamento

    // Salvar ingressos vendidos (simulação)
    // for (const ingresso of ingressosComprados) {
    //   await IngressoVendido.criar(ingresso);
    // }

    res.json({
      success: true,
      message: 'Compra realizada com sucesso!',
      pedido: {
        evento: evento.nome_evento,
        quantidade_total: ingressosComprados.length,
        valor_total: valorTotal,
        ingressos: ingressosComprados
      }
    });

  } catch (error) {
    console.error('Erro ao processar compra:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Página "Meus Ingressos"
exports.meusIngressos = async (req, res) => {
  try {
    const clienteId = req.user.id;

    // Buscar ingressos do cliente (simulação)
    // const ingressos = await IngressoVendido.buscarPorClienteId(clienteId);
    const ingressos = []; // Simulação - lista vazia

    res.render('layout/main', {
      pageTitle: 'Meus Ingressos',
      content: '../pages/cliente/meus-ingressos',
      user: req.user,
      ingressos
    });
  } catch (error) {
    console.error('Erro ao buscar ingressos:', error);
    res.status(500).render('layout/main', {
      pageTitle: 'Erro interno',
      content: '../pages/erro-500',
      user: req.user
    });
  }
};

// Página de perfil do cliente
exports.perfil = async (req, res) => {
  try {
    const clienteId = req.user.id;

    // Buscar histórico de compras (simulação)
    const historicoCompras = [];

    // Buscar eventos favoritos (simulação)
    const eventosFavoritos = [];

    res.render('layout/main', {
      pageTitle: 'Meu Perfil',
      content: '../pages/cliente/perfil',
      user: req.user,
      historicoCompras,
      eventosFavoritos
    });
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    res.status(500).render('layout/main', {
      pageTitle: 'Erro interno',
      content: '../pages/erro-500',
      user: req.user
    });
  }
};

// Atualizar perfil do cliente
exports.atualizarPerfil = async (req, res) => {
  try {
    const clienteId = req.user.id;
    const { nome_completo, email, telefone, data_nascimento } = req.body;

    // Validações básicas
    if (!nome_completo || !email) {
      return res.status(400).json({ 
        error: 'Nome completo e email são obrigatórios' 
      });
    }

    // Verificar se email já existe (exceto o próprio usuário)
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente && usuarioExistente.id !== clienteId) {
      return res.status(400).json({ 
        error: 'Este email já está em uso por outro usuário' 
      });
    }

    // Atualizar usuário (seria necessário implementar método de atualização no modelo)
    // await Usuario.atualizar(clienteId, { nome_completo, email, telefone, data_nascimento });

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

