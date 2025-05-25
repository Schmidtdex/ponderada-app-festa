const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");
// const authMiddleware = require('../middleware/authMiddleware'); // Placeholder for auth middleware

// Rota pública para registrar um novo usuário
router.post("/registrar", UsuarioController.registrarUsuario);

// Rota pública para login de usuário
router.post("/login", UsuarioController.loginUsuario);

// Rota protegida para buscar um usuário por ID (exemplo)
// router.get("/:id", authMiddleware, UsuarioController.buscarUsuarioPorId);
// Rota temporária (sem auth) para buscar usuário por ID
router.get("/:id", UsuarioController.buscarUsuarioPorId);

// Outras rotas de usuário (atualizar, deletar) podem ser adicionadas aqui
// Exemplo: router.put("/:id", authMiddleware, UsuarioController.atualizarUsuario);
// Exemplo: router.delete("/:id", authMiddleware, UsuarioController.deletarUsuario);

module.exports = router;

