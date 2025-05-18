const express = require('express');
const router = express.Router();
const TarefaController = require('../controllers/TarefaController');

const frontRoutes = require('./frontRoutes');
const userRoutes = require('./userRoutes');

router.post('/tarefas', TarefaController.criarTarefa);
router.get('/tarefas', TarefaController.listarTarefas);
router.put('/tarefas/:id', TarefaController.editarTarefa);
router.delete('/tarefas/:id', TarefaController.excluirTarefa);

// Rotas para o front-end
router.use('/', frontRoutes);

// Rotas para a API de usuários
router.use('/users', userRoutes);

module.exports = router;