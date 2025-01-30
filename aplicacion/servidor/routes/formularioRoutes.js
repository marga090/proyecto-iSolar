const express = require("express");
const router = express.Router();
const { registrarCliente } = require("../controllers/formularioController");
const validarDatosFormulario = require("../middlewares/validarDatosFormulario");

router.post("/registrarCliente", validarDatosFormulario, registrarCliente);

module.exports = router;