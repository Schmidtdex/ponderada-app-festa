// Middleware de autenticação e autorização
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware para verificar se o usuário está autenticado
exports.verificarAutenticacao = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    // Verificar o token JWT (assumindo que você tem uma chave secreta)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_aqui');
    
    // Buscar o usuário no banco de dados
    const usuario = await Usuario.buscarPorId(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Adicionar informações do usuário à requisição
    req.user = usuario;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar se o usuário é um organizador
exports.verificarOrganizador = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  if (req.user.tipo_usuario !== 'organizador') {
    return res.status(403).json({ error: 'Acesso negado. Apenas organizadores podem acessar esta funcionalidade.' });
  }

  next();
};

// Middleware para verificar se o usuário é um cliente
exports.verificarCliente = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  if (req.user.tipo_usuario !== 'cliente') {
    return res.status(403).json({ error: 'Acesso negado. Apenas clientes podem acessar esta funcionalidade.' });
  }

  next();
};

// Middleware para verificar se o usuário é dono do recurso (evento)
exports.verificarProprietarioEvento = async (req, res, next) => {
  try {
    const eventoId = req.params.id || req.params.eventoId;
    const Evento = require('../models/Evento');
    
    const evento = await Evento.buscarPorId(eventoId);
    
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    if (evento.organizador_id !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado. Você não é o organizador deste evento.' });
    }

    req.evento = evento;
    next();
  } catch (error) {
    console.error('Erro ao verificar proprietário do evento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

