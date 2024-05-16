const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
/*
const authController = require('./controllers/AuthController');
const motoristaController = require('./controllers/MotoristaController');
const usuarioController = require('./controllers/UsuarioController');
const viagemController = require('./controllers/ViagemController');
const avaliacaoController = require('./controllers/AvaliacaoController');
const pagamentoController = require('./controllers/PagamentoController');
*/

app.use(bodyParser.json());
app.use(cors());

/*
app.use('/', (req, res) => {});
app.use('/login', authController);
app.use('/cadastro_motorista', motoristaController);
app.use('/cadastro_usuario', usuarioController);
app.use('/viagem', viagemController);
app.use('/avaliacao', avaliacaoController);
app.use('/pagamento', pagamentoController);
*/

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Erro ao exibir a página: ' + error);
});

app.listen(port, () => console.log(`Servidor online. Acesse http://localhost:${port}/`));