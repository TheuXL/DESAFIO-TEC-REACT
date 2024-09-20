// index.js do backend
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./database/models');
const authRoutes = require('./database/routes/auth');
const taskRoutes = require('./database/routes/task');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000', // URL do frontend
}));

// Rotas da API
app.use('/api/auth', authRoutes); // Rotas de autenticação
app.use('/api/tasks', taskRoutes); // Rotas de tarefas

// Middleware para tratamento de erros
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    sequelize.sync({ force: false })
      .then(() => {
        console.log('Banco de dados sincronizado.');
        app.listen(PORT, () => {
          console.log(`Servidor iniciado na porta ${PORT}`);
        });
      })
      .catch(error => {
        console.error('Erro ao sincronizar o banco de dados:', error);
      });
  })
  .catch(error => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });
