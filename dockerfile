# Use a imagem base oficial do Node.js
FROM node:20

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY ["package.json", "package-lock.json", "./"]

# Copie o restante do código da aplicação para o diretório de trabalho
COPY . .

# Instale as dependências do projeto
RUN npm install

# Exponha a porta que a aplicação irá rodar
EXPOSE 8081

# Comando para iniciar a aplicação
CMD ["npx", "nodemon", "src/index.js"]