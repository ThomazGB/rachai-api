const express = require('express');
const router = express.Router();
const UsuarioService = require('./../services/UsuarioService');

const Usuario = require('../models/schemas').Usuario;

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

router.post('/usuario/:id/upload', async (req, res) => {
    try {
        const dir = await UsuarioService.uploadImagem(req, res);
        res.status(200).json({ img_url: dir });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.get('/usuario/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }
        res.status(200).json(usuario);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

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

router.put('/editar_usuario/:id', async (req, res) => {
    try {
        const { nome, email, ra, curso, score, tipo_usuario, veiculos } = req.body;
        await Usuario.findByIdAndUpdate(req.params.id, { nome, email, ra, curso, score, tipo_usuario, veiculos });
        res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (erro) {
        if (erro instanceof TypeError) {
            res.status(404).json({ erro: 'Usuário não encontrado!' });
        } else {
            res.status(500).json({ erro: erro.message });
        }
    }
});

router.delete('/deletar_usuario/:id', async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (erro) {
        if (erro instanceof TypeError) {
            res.status(404).json({ erro: 'Usuário não encontrado!' });
        } else {
            res.status(500).json({ erro: erro.message });
        }
    }
});

module.exports = router;