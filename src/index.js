const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8081;

const usuarioController = require('./controllers/UsuarioController');
/*
const authController = require('./controllers/AuthController');
const viagemController = require('./controllers/ViagemController');
*/

app.use(bodyParser.json());
app.use(cors());


app.use('/usuarios', usuarioController);

/*
app.use('/', (req, res) => {});
app.use('/login', authController);
app.use('/cadastro_motorista', motoristaController);
app.use('/viagem', viagemController);
app.use('/avaliacao', avaliacaoController);
app.use('/pagamento', pagamentoController);
*/

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Erro ao exibir a página: ' + error);
});

app.listen(port, () => console.log(`Servidor online. Acesse http://localhost:${port}/`));