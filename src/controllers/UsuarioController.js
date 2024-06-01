const express = require('express');
const router = express.Router();
const UsuarioService = require('./../services/UsuarioService');

const Usuario = require('../models/schemas').Usuario;

// create
/**
 * @swagger
 * /usuarios/criar_usuario:
 *   post:
 *     tags:
 *      - Usuario
 *     description: Cria um novo usuário
 *     parameters:
 *       - name: nome
 *         description: Nome do usuário
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: Email do usuário
 *         in: formData
 *         required: true
 *         type: string
 *       - name: ra
 *         description: RA do usuário
 *         in: formData
 *         required: true
 *         type: string
 *       - name: curso
 *         description: Curso do usuário
 *         in: formData
 *         required: true
 *         type: string
 *       - name: score
 *         description: Score do usuário
 *         in: formData
 *         required: true
 *         type: number
 *       - name: tipo_usuario
 *         description: Tipo do usuário
 *         in: formData
 *         required: true
 *         type: string
 *       - name: veiculos
 *         description: Veículos do usuário
 *         in: formData
 *         required: true
 *         type: array
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post('/criar_usuario', async (req, res) => {
    try {
        const { nome, email, ra, curso, score, tipo_usuario, veiculos } = req.body;
        const usuario = new Usuario({ nome, email, ra, curso, score, tipo_usuario, veiculos });
        await usuario.save();
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// Upload de imagem
/**
 * @swagger
 * /usuarios/usuario/{id}/upload:
 *   post:
 *     tags:
 *       - Usuario
 *     description: Faz o upload de uma imagem para o usuário
 *     parameters:
 *       - name: id
 *         description: ID do usuário
 *         in: path
 *         required: true
 *         type: string
 *       - name: imagem
 *         description: Imagem do usuário
 *         in: formData
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: Imagem enviada com sucesso
 */
router.post('/usuario/:id/upload', async (req, res) => {
    try {
        const dir = await UsuarioService.uploadImagem(req, res);
        res.status(200).json({ img_url: dir });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// find all
/**
 * @swagger
 * /usuarios:
 *  get:
 *      tags:
 *        - Usuario
 *      description: Retorna todos os usuários
 *      responses:
 *          200:
 *              description: Usuários encontrados
 *          500:
 *              description: Erro ao buscar usuários
 *          404:
 *              description: Usuários não encontrados
 * 
 */
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

//find by id
/**
 * @swagger
 *  /usuarios/usuario/{id}:
 *      get:
 *          tags:
 *           - Usuario
 *          description: Retorna um usuário pelo ID
 *          parameters:
 *            - name: id
 *              description: ID do usuário
 *              in: path
 *              required: true
 *              type: string
 *          responses:
 *              200:
 *                  description: Usuário encontrado
 *              500:
 *                  description: Erro ao buscar usuário
 *              404:
 *                  description: Usuário não encontrado
 */
router.get('/usuario/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        res.status(200).json(usuario);
    } catch (erro) {
        if (erro instanceof TypeError) {
            res.status(404).json({ erro: 'Usuário não encontrado!' });
        } else {
            res.status(500).json({ erro: erro.message });
        }
    }
});

//find by email
/**
 * @swagger
 *  /usuarios/usuario_email:
 *      post:
 *          tags:
 *            - Usuario
 *          description: Retorna um usuário pelo email
 *          parameters:
 *            - name: email
 *              description: Email do usuário
 *              in: path
 *              required: true
 *              type: string
 *          responses:
 *              200:
 *                  description: Usuário encontrado
 *              500:
 *                  description: Erro ao buscar usuário
 *              404:
 *                  description: Usuário não encontrado
 */
router.post('/usuario_email', async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ email: req.body.email });
        res.status(200).json(usuario);
    } catch (erro) {
        if (erro instanceof TypeError) {
            res.status(404).json({ erro: 'Usuário não encontrado!' });
        } else {
            res.status(500).json({ erro: erro.message });
        }
    }
});

// update
/**
 * @swagger
 *  /usuarios/editar_usuario/{id}:
 *      put:
 *          tags:
 *            - Usuario
 *          description: Atualiza um usuário pelo ID
 *          parameters:
 *            - name: id
 *              description: ID do usuário
 *              in: path
 *              required: true
 *              type: string
 *            - name: nome
 *              description: Nome do usuário
 *              in: formData
 *              required: false
 *              type: string
 *            - name: email
 *              description: Email do usuário
 *              in: formData
 *              required: false
 *              type: string
 *            - name: ra
 *              description: RA do usuário
 *              in: formData
 *              required: false
 *              type: string
 *            - name: curso
 *              description: Curso do usuário
 *              in: formData
 *              required: false
 *              type: string
 *            - name: score
 *              description: Score do usuário
 *              in: formData
 *              required: false
 *              type: number
 *            - name: tipo_usuario
 *              description: Tipo do usuário
 *              in: formData
 *              required: false
 *              type: string
 *            - name: veiculos
 *              description: Veículos do usuário
 *              in: formData
 *              required: false
 *              type: array
 *          responses:
 *              200:
 *                  description: Usuário atualizado
 *              500:
 *                  description: Erro ao atualizar usuário
 *              404:
 *                  description: Usuário não encontrado
 * 
 */
router.put('/editar_usuario/:id', async (req, res) => {
    try {
        const { nome, email, ra, curso, score, tipo_usuario, veiculos } = req.body;
        await Usuario.findByIdAndUpdate(req.params.id, { nome, email, ra, curso, score, tipo_usuario, veiculos })
        res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (erro) {
        if (erro instanceof TypeError) {
            res.status(404).json({ erro: 'Usuário não encontrado!' });
        } else {
            res.status(500).json({ erro: erro.message })
        }
    }
});

// delete
/**
 * @swagger
 *  /usuarios/deletar_usuario/{id}:
 *      delete:
 *          tags:
 *              - Usuario
 *          description: Deleta um usuário pelo ID
 *          parameters:
 *            - name: id
 *              description: ID do usuário
 *              in: path
 *              required: true
 *              type: string
 *          responses:
 *              200:
 *                  description: Usuário deletado
 *              500:
 *                  description: Erro ao deletar usuário
 *              404:
 *                  description: Usuário não encontrado
 */
router.delete('/deletar_usuario/:id', async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (erro) {
        if (erro instanceof TypeError) {
            res.status(404).json({ erro: 'Usuário não encontrado!' });
        } else {
            res.status(500).json({ erro: erro.message })
        }
    }
});

module.exports = router;