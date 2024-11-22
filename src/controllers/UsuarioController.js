const express = require('express');
const router = express.Router();
const UsuarioService = require('./../services/UsuarioService');

router.post('/criar_usuario', async (req, res) => {
    try {
        const usuario = await UsuarioService.criarUsuario(req.body);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario });
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
        const usuarios = await UsuarioService.encontrarTodosUsuarios();
        res.status(200).json(usuarios);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.get('/usuario/motoristas', async (req, res) => {
    try {
        const motoristas = await UsuarioService.encontrarMotoristas();
        if (motoristas.length === 0) {
            return res.status(404).json({ erro: 'Infelizmente não encontramos nenhum motorista na sua área!' });
        }
        res.status(200).json(motoristas);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.get('/usuario/passageiros', async (req, res) => {
    try {
        const passageiros = await UsuarioService.encontrarPassageiros();
        if (passageiros.length === 0) {
            return res.status(404).json({ erro: 'Infelizmente não encontramos nenhum passageiro na sua área!' });
        }
        res.status(200).json(passageiros);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.get('/usuario/:id', async (req, res) => {
    try {
        const usuario = await UsuarioService.encontrarUsuarioPorId(req.params.id);
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
        const usuario = await UsuarioService.encontrarUsuarioPorEmail(req.body.email);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao encontrar o usuário' });
    }
});

router.put('/editar_usuario/:id', async (req, res) => {
    try {
        const usuario = await UsuarioService.atualizarUsuarioPorId(req.params.id, req.body);
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
        const usuario = await UsuarioService.deletarUsuarioPorId(req.params.id);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado!' });
        }
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar o usuário' });
    }
});

module.exports = router;