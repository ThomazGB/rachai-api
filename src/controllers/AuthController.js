const express = require('express');
const router = express.Router();
const AuthService = require('./../services/AuthService');

router.post('/cadastro', async (req, res) => {
    try {
        const token = await AuthService.registro(req.body.email, req.body.senha);
        res.status(201).json({ token });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const token = await AuthService.login(email, senha);
        res.status(200).json({ token, email });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.post('/alterar_senha', async (req, res) => {
    try {
        await AuthService.alterarSenha(req.body.email, req.body.senha_atual, req.body.nova_senha);
        res.status(200).json({ message: 'Senha alterada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.delete('/logout', async (req, res) => {
    try {
        await AuthService.logout(req.body.email);
        res.status(200).json({ message: 'Logout realizado com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;