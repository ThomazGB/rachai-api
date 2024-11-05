require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT_SECRET_KEY;

const Auth = require('../models/schemas').Auth;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

async function registro(email, senha) {
    if (!emailRegex.test(email)) {
        throw new Error('Formato de email inválido!');
    }
    if (!senhaRegex.test(senha)) {
        throw new Error('A senha deve conter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um caractere especial e um número.');
    }

    const auth = await Auth.findOne({ email });
    if (auth) {
        throw new Error('Usuário já cadastrado!');
    }

    const hash = await bcrypt.hash(senha, 10);
    const token = jwt.sign({ email }, JWT, { expiresIn: '1m' });

    try {
        const newAuth = new Auth({ email, senha: hash, token });
        await newAuth.save();
        console.log('Usuário salvo com sucesso');
        return token;
    } catch (error) {
        console.error('Erro ao salvar o usuário no banco de dados:', error);
        throw new Error('Erro ao salvar o usuário no banco de dados');
    }
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
    if (!emailRegex.test(email)) {
        throw new Error('Formato de email inválido!');
    }
    if (!senhaRegex.test(nova_senha)) {
        throw new Error('A nova senha deve conter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um caractere especial e um número.');
    }

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