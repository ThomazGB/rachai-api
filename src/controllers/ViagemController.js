const express = require('express');
const router = express.Router();
const ViagemService = require('./../services/ViagemService');

router.post('/nova_viagem', async (req, res) => {
    try {
        const { status, local_partida, destino, usuarios, pagamento, avaliacao } = req.body;
        const dataNow = new Date();
        const viagem = await ViagemService.criarViagem({ status, local_partida, destino, data: dataNow, usuarios, pagamento, avaliacao });
        res.status(201).json({ message: 'Viagem criada com sucesso!', viagem });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao criar a viagem' });
    }
});

router.get('/', async (req, res) => {
    try {
        const viagens = await ViagemService.encontrarTodasViagens();
        res.status(200).json(viagens);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao encontrar as viagens' });
    }
});

router.get('/viagem/:id', async (req, res) => {
    try {
        const viagem = await ViagemService.encontrarViagemPorId(req.params.id);
        if (!viagem) {
            return res.status(404).json({ erro: 'Viagem não encontrada!' });
        }
        res.status(200).json(viagem);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao encontrar a viagem' });
    }
});

router.get('/usuario/:id/viagens', async (req, res) => {
    try {
        const viagens = await ViagemService.encontrarViagensPorUsuarioId(req.params.id);
        res.status(200).json(viagens);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

router.put('/editar_viagem/:id', async (req, res) => {
    try {
        const { status, local_partida, destino, usuarios, pagamento, avaliacao } = req.body;
        const viagem = await ViagemService.atualizarViagemPorId(req.params.id, { status, local_partida, destino, usuarios, pagamento, avaliacao });
        if (!viagem) {
            return res.status(404).json({ erro: 'Viagem não encontrada!' });
        }
        res.status(200).json({ message: 'Viagem atualizada com sucesso!', viagem });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar a viagem' });
    }
});

router.delete('/deletar_viagem/:id', async (req, res) => {
    try {
        const viagem = await ViagemService.deletarViagemPorId(req.params.id);
        if (!viagem) {
            return res.status(404).json({ erro: 'Viagem não encontrada!' });
        }
        res.status(200).json({ message: 'Viagem deletada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar a viagem' });
    }
});

module.exports = router;