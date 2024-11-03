const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const authSwaggerDocument = require('./swagger/auth-swagger.json');
const usuarioSwaggerDocument = require('./swagger/usuario-swagger.json');
const viagemSwaggerDocument = require('./swagger/viagem-swagger.json');
const authController = require('./controllers/AuthController');
const usuarioController = require('./controllers/UsuarioController');
const viagemController = require('./controllers/ViagemController');

app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));

const url = process.env.URL || 'http://localhost';
const port = process.env.PORT || 8081;

const mergeSwaggerDocuments = (baseDoc, ...docs) => {
  docs.forEach(doc => {
    Object.keys(doc.paths).forEach(path => {
      baseDoc.paths[path] = doc.paths[path];
    });
    if (doc.definitions) {
      baseDoc.definitions = { ...baseDoc.definitions, ...doc.definitions };
    }
  });
  return baseDoc;
};

const baseSwaggerDocument = {
  swagger: '2.0',
  info: {
    title: 'Rachaí - O seu aplicativo de caronas fatecanas',
    description: 'Cuidado! Área de Testes',
    version: '1.0.0'
  },
  host: `${url}:${port}`,	
  basePath: '/',
  schemes: ['http'],
  paths: {},
  definitions: {}
};

const mergedSwaggerDocument = mergeSwaggerDocuments(baseSwaggerDocument, authSwaggerDocument, usuarioSwaggerDocument, viagemSwaggerDocument);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedSwaggerDocument));

app.use('/auth', authController);
app.use('/usuarios', usuarioController);
app.use('/viagens', viagemController);

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send('Erro ao exibir a página: ' + error);
});

app.listen(port, () => console.log(`Servidor online. Acesse ${url}:${port}/`));