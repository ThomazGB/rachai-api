const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.MONGO_URI_PROD || 'mongodb+srv://gustavo:123@rachai.3cpjxlv.mongodb.net/';

mongoose.connect(URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 10000,
  connectTimeoutMS: 10000
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Conexão com o MongoDB estabelecida com sucesso!');
});

db.on('error', (error) => {
  console.error('Erro de conexão com o MongoDB:', error);
});

db.on('disconnected', () => {
  console.log('Conexão com o MongoDB foi desconectada.');
});

db.on('reconnected', () => {
  console.log('Conexão com o MongoDB foi reconectada.');
});

module.exports = db;