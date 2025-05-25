const express = require("express");
const router = express.Router();

// Remover rotas de exemplo Tarefas se não forem mais necessárias
// const TarefaController = require('../controllers/TarefaController');
// router.post('/tarefas', TarefaController.criarTarefa);
// router.get('/tarefas', TarefaController.listarTarefas);
// router.put('/tarefas/:id', TarefaController.editarTarefa);
// router.delete('/tarefas/:id', TarefaController.excluirTarefa);

// Importar as novas rotas
const frontRoutes = require("./frontRoutes");
const userRoutes = require("./userRoutes");
const eventoRoutes = require("./eventoRoutes");
const atracaoRoutes = require("./atracaoRoutes");
const tipoIngressoRoutes = require("./tipoIngressoRoutes");
const ingressoVendidoRoutes = require("./ingressoVendidoRoutes");

// Rotas para o front-end (se houver)
router.use("/", frontRoutes);

// Rotas da API
router.use("/api/usuarios", userRoutes); // Prefixo /api/usuarios
router.use("/api/eventos", eventoRoutes); // Prefixo /api/eventos
router.use("/api/atracoes", atracaoRoutes); // Prefixo /api/atracoes
router.use("/api/tipos-ingresso", tipoIngressoRoutes); // Prefixo /api/tipos-ingresso
router.use("/api/ingressos", ingressoVendidoRoutes); // Prefixo /api/ingressos

module.exports = router;

