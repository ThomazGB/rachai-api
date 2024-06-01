const express = require('express');
const router = express.Router();
const AuthService = require('./../services/AuthService');

// cadastrar login
/**
 * @swagger
 * /cadastro:
 *      post:
 *          tags:
 *            - Auth
 *          description: Cadastra um novo login
 *          parameters:
 *            - name: email
 *              description: Email do usuário
 *              in: formData
 *              required: true
 *              type: string
 *            - name: senha
 *              description: Senha do usuário
 *              in: formData
 *              required: true
 *              type: string
 *          responses:
 *              201:
 *                  description: Login criado com sucesso
 *              500:
 *                  description: Erro ao criar login 
 */
router.post('/cadastro', async (req, res) => {
    try {
        const token = await AuthService.registro(req.body.email, req.body.senha);
        res.status(201).json({ token });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// fazer login (encriptar senha e retornar token)
/**
 * @swagger
 *  /auth:
 *      post:
 *          tags:
 *            - Auth
 *          description: Faz login
 *          parameters:
 *            - name: email
 *              description: Email do usuário
 *              in: formData
 *              required: true
 *              type: string
 *            - name: senha
 *              description: Senha do usuário
 *              in: formData
 *              required: true
 *              type: string
 *          responses:
 *              200:
 *                  description: Login realizado com sucesso
 *              500:
 *                  description: Erro ao fazer login
 */
router.post('/auth', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const token = await AuthService.login(email, senha);
        res.status(200).json({ token, email });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// alterar senha (encriptar nova senha)
/**
 * @swagger
 *  /alterar_senha:
 *      post:
 *          tags:
 *            - Auth
 *          description: Altera a senha do usuário
 *          parameters:
 *            - name: email
 *              description: Email do usuário
 *              in: formData
 *              required: true
 *              type: string
 *            - name: senha_atual
 *              description: Senha atual do usuário
 *              in: formData
 *              required: true
 *              type: string
 *            - name: nova_senha
 *              description: Nova senha do usuário
 *              in: formData
 *              required: true
 *              type: string
 *          responses:
 *              200:
 *                  description: Senha alterada com sucesso
 *              500:
 *                  description: Erro ao alterar senha
 */
router.post('/alterar_senha', async (req, res) => {
    try {
        await AuthService.alterarSenha(req.body.email, req.body.senha_atual, req.body.nova_senha);
        res.status(200).json({ message: 'Senha alterada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// fazer logout (remover token)
/**
 * @swagger
 *  /logout:
 *      delete:
 *          tags:
 *            - Auth
 *          description: Faz logout
 *          parameters:
 *            - name: email
 *              description: Email do usuário
 *              in: formData
 *              required: true
 *              type: string
 *          responses:
 *              200:
 *                  description: Logout realizado com sucesso
 *              500:
 *                  description: Erro ao fazer logout
 */
router.delete('/logout', async (req, res) => {
    try {
        await AuthService.logout(req.body.email);
        res.status(200).json({ message: 'Logout realizado com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

module.exports = router;