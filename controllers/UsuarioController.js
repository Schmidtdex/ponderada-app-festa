const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Assuming JWT for authentication later

// Placeholder for JWT secret - move to config/env variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_very_secret_key'; 
const SALT_ROUNDS = 10;

// Criar um novo usuário (Registro)
exports.registrarUsuario = async (req, res) => {
  const { nome_completo, email, senha, tipo_usuario } = req.body;

  if (!nome_completo || !email || !senha || !tipo_usuario) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios: nome_completo, email, senha, tipo_usuario' });
  }

  if (!['organizador', 'cliente'].includes(tipo_usuario)) {
    return res.status(400).json({ error: 'Tipo de usuário inválido. Use \'organizador\' ou \'cliente\'.' });
  }

  try {
    // Verificar se o email já existe
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }

    // Hash da senha
    const senha_hash = await bcrypt.hash(senha, SALT_ROUNDS);

    // Criar usuário no banco
    const novoUsuario = await Usuario.criar(nome_completo, email, senha_hash, tipo_usuario);

    // Remover hash da senha da resposta
    delete novoUsuario.senha_hash;

    res.status(201).json(novoUsuario);
  } catch (err) {
    console.error("Erro ao registrar usuário:", err);
    res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
  }
};

// Login de usuário
exports.loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas.' }); // Email not found
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas.' }); // Password incorrect
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, tipo_usuario: usuario.tipo_usuario },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Remover hash da senha da resposta
    delete usuario.senha_hash;

    res.status(200).json({ 
        message: 'Login bem-sucedido!', 
        token: token, 
        usuario: { id: usuario.id, nome: usuario.nome_completo, email: usuario.email, tipo: usuario.tipo_usuario } 
    });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: 'Erro interno ao tentar fazer login.' });
  }
};

// Buscar usuário por ID (protegido, exemplo)
exports.buscarUsuarioPorId = async (req, res) => {
  // Example: Check if the requesting user is the same user or an admin
  // This requires authentication middleware which is not implemented here yet
  const { id } = req.params;
  // const requestingUserId = req.user.id; // From JWT middleware
  // if (id !== requestingUserId && req.user.tipo_usuario !== 'admin') { // Assuming an admin role
  //   return res.status(403).json({ error: 'Acesso não autorizado.' });
  // }

  try {
    const usuario = await Usuario.buscarPorId(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.status(200).json(usuario);
  } catch (err) {
    console.error("Erro ao buscar usuário por ID:", err);
    res.status(500).json({ error: 'Erro interno ao buscar usuário.' });
  }
};

// Outros métodos (atualizar, deletar) podem ser adicionados conforme necessário
// Lembre-se de adicionar validações e tratamento de erros adequados

