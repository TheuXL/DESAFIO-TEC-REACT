// backend/database/routes/auth.js
const express = require('express');
const authController = require('../../controllers/authController');
const router = express.Router();

// Rota para cadastro de usuário
router.post('/signup', authController.signup);

// Rota para login de usuário
router.post('/login', authController.login);

module.exports = router;
