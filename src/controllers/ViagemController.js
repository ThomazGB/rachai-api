const express = require('express');
const router = express.Router();
const Viagem = require('../models/schemas').Viagem;

// create
router.post('/nova_viagem', async (req, res) => {
    try {
        const { status, local_partida, destino, data, usuarios, pagamento, avaliacao } = req.body;
        const viagem = new Viagem({ status, local_partida, destino, data, usuarios, pagamento, avaliacao });
        await viagem.save();
        res.status(201).json({ message: 'Viagem criada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// find all
router.get('/', async (req, res) => {
    try {
        const viagens = await Viagem.find();
        res.status(200).json(viagens);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

//find by id
router.get('/viagem/:id', async (req, res) => {
    try {
        const viagem = await Viagem.findById(req.params.id);
        res.status(200).json(viagem);
    } catch (erro) {
        if (erro instanceof TypeError) {
            res.status(404).json({ erro: 'Viagem não encontrada!' });
        } else {
            res.status(500).json({ erro: erro.message });
        }
    }
});

// update
router.put('/editar_viagem/:id', async (req, res) => {
    try {
        const { status, local_partida, destino, data, usuarios, pagamento, avaliacao } = req.body;
        await Viagem.findByIdAndUpdate(req.params.id, { status, local_partida, destino, data, usuarios, pagamento, avaliacao })
        res.status(200).json({ message: 'Viagem atualizada com sucesso!' });
    } catch (erro) {
        if (erro instanceof TypeError) {
            res.status(404).json({ erro: 'Viagem não encontrada!' });
        } else {
            res.status(500).json({ erro: erro.message })
        }
    }
});

// delete
router.delete('/deletar_viagem/:id', async (req, res) => {
    try {
        await Viagem.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Viagem deletada com sucesso!' });
    } catch (erro) {
        if (erro instanceof TypeError) {
            res.status(404).json({ erro: 'Viagem não encontrada!' });
        } else {
            res.status(500).json({ erro: erro.message })
        }
    }
});

module.exports = router;