// database/routes/index.js

const express = require('express');
const authRoutes = require('./auth');
const taskRoutes = require('./task');

const router = express.Router();

// Use os arquivos de rota
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;