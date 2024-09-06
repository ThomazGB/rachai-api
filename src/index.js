const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 8081;

const authController = require('./controllers/AuthController');
const usuarioController = require('./controllers/UsuarioController');
const viagemController = require('./controllers/ViagemController');

app.use(bodyParser.json());
app.use(cors());

// Função para carregar um arquivo Swagger JSON
const loadSwaggerFile = (filePath) => {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (e) {
    console.error(`Erro ao carregar o arquivo ${filePath}:`, e);
    return null;
  }
};

// Carregar os arquivos Swagger
const authSwaggerDocument = loadSwaggerFile(path.join(__dirname, 'swagger', 'auth-swagger.json'));
const usuarioSwaggerDocument = loadSwaggerFile(path.join(__dirname, 'swagger', 'usuario-swagger.json'));
const viagemSwaggerDocument = loadSwaggerFile(path.join(__dirname, 'swagger', 'viagem-swagger.json'));

// Adicionar basePath aos documentos Swagger se não estiver presente
const addBasePath = (document, basePath) => {
  if (!document.basePath) {
    document.basePath = basePath;
  }
  return document;
};

addBasePath(authSwaggerDocument, '/api/auth');
addBasePath(usuarioSwaggerDocument, '/api/usuario');
addBasePath(viagemSwaggerDocument, '/api/viagem');

// Função para mesclar os documentos Swagger manualmente
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

// Documento base Swagger
const baseSwaggerDocument = {
  swagger: '2.0',
  info: {
    title: 'Rachaí - O seu aplicativo de caronas fatecanas',
    description: 'Cuidado! Área de Testes',
    version: '1.0.0'
  },
  host: 'localhost:8081',
  basePath: '/api',
  schemes: ['http'],
  paths: {},
  definitions: {}
};

// Mesclar os documentos Swagger
const mergedSwaggerDocument = mergeSwaggerDocuments(baseSwaggerDocument, authSwaggerDocument, usuarioSwaggerDocument, viagemSwaggerDocument);

// Configurar o Swagger UI para o documento mesclado
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedSwaggerDocument));

app.use('/login', authController);
app.use('/usuarios', usuarioController);
app.use('/viagens', viagemController);

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Erro ao exibir a página: ' + error);
});

app.listen(port, () => console.log(`Servidor online. Acesse http://localhost:${port}/`));