const express = require("express");
const router = express.Router();
const { registrarFeedback } = require("../controllers/feedbackController");
const validarDatosFeedback = require("../middlewares/validarDatosFeedback");

router.post("/registrarFeedback", validarDatosFeedback, registrarFeedback);

module.exports = router;