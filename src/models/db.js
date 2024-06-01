const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Rachai", {
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB: '));

db.once('open', function() {
    console.log('Conexão com o MongoDB estabelecida com sucesso!');
});

module.exports = db;