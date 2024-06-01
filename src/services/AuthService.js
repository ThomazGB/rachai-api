const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT_SECRET_KEY;

require('dotenv').config({ path: '../.env' });

const Auth = require('../models/schemas').Auth;

async function registro(email, senha) {
    const auth = await Auth.findOne({ email });
    if (auth) {
        throw new Error('Usuário já cadastrado!');
    }
    const hash = await bcrypt.hash(senha, 10);
    const token = jwt.sign({ email }, JWT, { expiresIn: '1m' });
    await new Auth({ email, senha: hash, token }).save();
    return token;
}

async function login(email, senha) {
    const auth = await Auth.findOne({ email });
    if (!auth) {
        throw new Error('Usuário não encontrado!');
    }
    if (!await bcrypt.compare(senha, auth.senha)) {
        throw new Error('Senha incorreta!');
    }
    const token = jwt.sign({ email }, JWT, { expiresIn: '6h' });
    await Auth.findByIdAndUpdate(auth._id, { token });
    return token;
}

async function alterarSenha(email, senha_atual, nova_senha) {
    const auth = await Auth.findOne({ email });
    if (!auth) {
        throw new Error('Usuário não encontrado!');
    }
    if (!await bcrypt.compare(senha_atual, auth.senha)) {
        throw new Error('Senha atual incorreta!');
    }
    const hash = await bcrypt.hash(nova_senha, 10);
    await Auth.findByIdAndUpdate(auth._id, { senha: hash });
}

async function logout(email) {
    await Auth.findOne({ email });
    await Auth.findOneAndUpdate({ email }, { token: '' });
}

module.exports = { registro, login, alterarSenha, logout };