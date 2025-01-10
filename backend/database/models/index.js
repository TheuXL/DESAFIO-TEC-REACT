const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const setupDatabase = (config) => {
  const sequelize = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      dialect: 'mysql',
      logging: false
  });

const db = {};

// Carregar todos os modelos
fs.readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
    .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
    });

// Estabelecer relacionamentos se houver
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
  
  return db;
};

// Importante: Usar configuração do ambiente de testes para testes.
const config = process.env.NODE_ENV === 'test'
? {
    username: process.env.DB_USER || 'test',
    password: process.env.DB_PASSWORD || 'test',
    database: process.env.DB_NAME || 'test',
    host: process.env.DB_HOST || 'test'
    } : 
{
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST
};

const db = setupDatabase(config);

module.exports = db;