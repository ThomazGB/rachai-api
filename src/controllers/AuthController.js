const express = require('express');
const router = express.Router();
const AuthService = require('./../services/AuthService');
const { body, header, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

router.post('/cadastro', [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 8 }).withMessage('A senha deve conter no mínimo 8 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const token = await AuthService.registro(req.body.email, req.body.senha);
        res.status(201).json({ token });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao registrar usuário' });
    }
});

router.post('/login', [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 8 }).withMessage('A senha deve conter no mínimo 8 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, senha } = req.body;
        const { token, userInfo } = await AuthService.login(email, senha);
        res.status(200).json({ token, userInfo, email });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao realizar login' });
    }
});

router.post('/alterar_senha', [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha_atual').isLength({ min: 8 }).withMessage('A senha atual deve conter no mínimo 8 caracteres'),
    body('nova_senha').isLength({ min: 8 }).withMessage('A nova senha deve conter no mínimo 8 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        await AuthService.alterarSenha(req.body.email, req.body.senha_atual, req.body.nova_senha);
        res.status(200).json({ message: 'Senha alterada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao alterar senha' });
    }
});

router.delete('/logout', [
    header('Authorization').isString().withMessage('Token inválido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        await AuthService.logout(decoded.email);
        res.status(200).json({ message: 'Logout realizado com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao realizar logout' });
    }
});

module.exports = router;