const express = require("express");
const router = express.Router();


// Importar as novas rotas
const frontRoutes = require("./frontRoutes");
const userRoutes = require("./userRoutes");
const eventoRoutes = require("./eventoRoutes");
const atracaoRoutes = require("./atracaoRoutes");
const tipoIngressoRoutes = require("./tipoIngressoRoutes");
const ingressoVendidoRoutes = require("./ingressoVendidoRoutes");
const organizadorRoutes = require("./organizadorRoutes");
const clienteRoutes = require("./clienteRoutes");


router.use("/", frontRoutes);

// Rotas da API
router.use("/api/usuarios", userRoutes); // Prefixo /api/usuarios
router.use("/api/eventos", eventoRoutes); // Prefixo /api/eventos
router.use("/api/atracoes", atracaoRoutes); // Prefixo /api/atracoes
router.use("/api/tipos-ingresso", tipoIngressoRoutes); // Prefixo /api/tipos-ingresso
router.use("/api/ingressos", ingressoVendidoRoutes); // Prefixo /api/ingressos

// Rotas do organizador
router.use("/organizador", organizadorRoutes); // Prefixo /organizador

// Rotas do cliente
router.use("/", clienteRoutes); 

module.exports = router;

