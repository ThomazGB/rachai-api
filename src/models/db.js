const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:adminpassword@mongodb:27017/Rachai?authSource=admin';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB: '));

db.once('open', function() {
    console.log('Conexão com o MongoDB estabelecida com sucesso!');
});

module.exports = db;