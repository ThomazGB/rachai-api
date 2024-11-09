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
        res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
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

router.get('/usuario/motoristas', async (req, res) => {
    try {
        const motoristas = await Usuario.find({ tipo_usuario: 'MOTORISTA' });
        if (motoristas.length === 0) {
            return res.status(404).json({ erro: 'Infelizmente não encontramos nenhum motorista na sua área!' });
        }
        res.status(200).json(motoristas);
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
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ erro: 'Error fetching user' });
    }
});

router.put('/editar_usuario/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }
        res.status(200).json({ message: 'Usuário atualizado com sucesso!', usuario });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar o usuário' });
    }
});

router.delete('/deletar_usuario/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar o usuário' });
    }
});

module.exports = router;