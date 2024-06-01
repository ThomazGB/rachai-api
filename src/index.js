const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const port = process.env.PORT || 8081;

const authController = require('./controllers/AuthController');
const usuarioController = require('./controllers/UsuarioController');
const viagemController = require('./controllers/ViagemController');

app.use(bodyParser.json());
app.use(cors());

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Rachaí - O seu aplicativo de caronas fatecanas",
            description: "Cuidado! Área de testes!",
            contact: {
                name: "Eni Essi"
            },
            servers: [`http://localhost:${port}`]
        }
    },
    tags: [{ name: "Usuario", description: "Endpoints de usuário" }, { name: "Auth", description: "Endpoints de autenticação" }, { name: "Viagem", description: "Endpoints de viagem" }],
    apis: ["controllers/UsuarioController.js", "controllers/AuthController.js", "controllers/ViagemController.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/login', authController);
app.use('/usuarios', usuarioController);
app.use('/viagens', viagemController);

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Erro ao exibir a página: ' + error);
});

app.listen(port, () => console.log(`Servidor online. Acesse http://localhost:${port}/`));