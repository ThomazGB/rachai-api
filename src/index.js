const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 8081;

const authController = require('./controllers/AuthController');
const usuarioController = require('./controllers/UsuarioController');
const viagemController = require('./controllers/ViagemController');
/*

*/

app.use(bodyParser.json());
app.use(cors());

app.use('/login', authController);
app.use('/usuarios', usuarioController);
app.use('/viagens', viagemController);

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Erro ao exibir a página: ' + error);
});

app.listen(port, () => console.log(`Servidor online. Acesse http://localhost:${port}/`));