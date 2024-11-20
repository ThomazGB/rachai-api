require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT_SECRET_KEY;

const AuthRepository = require('./../repositories/AuthRepository');
const UsuarioService = require('./UsuarioService');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

async function registro(email, senha) {
    if (!emailRegex.test(email)) {
        throw new Error('Formato de email inválido!');
    }
    if (!senhaRegex.test(senha)) {
        throw new Error('A senha deve conter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um caractere especial e um número.');
    }

    const auth = await AuthRepository.encontrarAuthPorEmail(email);
    if (auth) {
        throw new Error('Usuário já cadastrado!');
    }

    const hash = await bcrypt.hash(senha, 10);
    const token = jwt.sign({ email }, JWT, { expiresIn: '1d' });

    try {
        await AuthRepository.registro({ email, senha: hash, token });
        console.log('Usuário salvo com sucesso');
        return token;
    } catch (error) {
        if (error.message.includes('Erro ao salvar o usuário no banco de dados: ', error)) {
            throw new Error('Erro ao salvar o usuário no banco de dados:!');
        }
    }
}

async function login(email, senha) {
    const auth = await AuthRepository.login(email);
    if (!auth) {
        throw new Error('Usuário não encontrado!');
    }
    if (!await bcrypt.compare(senha, auth.senha)) {
        throw new Error('Senha incorreta!');
    }
    const token = jwt.sign({ email }, JWT, { expiresIn: '1d' });
    await AuthRepository.login(auth._id, { token });

    // Obter as informações do usuário diretamente do UsuarioService
    const userInfo = await UsuarioService.encontrarUsuarioPorEmail(email);

    return { token, userInfo };
}

async function alterarSenha(email, senha_atual, nova_senha) {
    if (!emailRegex.test(email)) {
        throw new Error('Formato de email inválido!');
    }
    if (!senhaRegex.test(nova_senha)) {
        throw new Error('A nova senha deve conter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um caractere especial e um número.');
    }

    const auth = await AuthRepository.encontrarAuthPorEmail(email);
    if (!auth) {
        throw new Error('Usuário não encontrado!');
    }
    if (!await bcrypt.compare(senha_atual, auth.senha)) {
        throw new Error('Senha atual incorreta!');
    }
    const hash = await bcrypt.hash(nova_senha, 10);
    await AuthRepository.alterarSenha(auth._id, { senha: hash });
}

async function logout(email) {
    await AuthRepository.logout(email);
}

module.exports = { registro, login, alterarSenha, logout };