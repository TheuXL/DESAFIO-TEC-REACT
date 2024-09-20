// auth.js (middleware de autenticação)
const jwt = require('jsonwebtoken');
const { User } = require('../database/models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ message: 'Token não fornecido.' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido.' });
    
    // Adiciona userId ao req
    req.userId = user.id;
    
    // Opcional: Verificar se o usuário existe no banco de dados (se necessário)
    // const existingUser = await User.findByPk(user.id);
    // if (!existingUser) return res.status(404).json({ message: 'Usuário não encontrado.' });
    
    next();
  });
};

module.exports = { authenticateToken };
