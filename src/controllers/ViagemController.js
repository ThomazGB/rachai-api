const express = require('express');
const router = express.Router();
const Viagem = require('../models/schemas').Viagem;

// create
/**
 * @swagger
 * /nova_viagem:
 *      post:
 *          tags:
 *            - Viagem
 *          description: Cria uma nova viagem
 *          parameters:
 *            - name: status
 *              description: Status da viagem
 *              in: formData
 *              required: true
 *              type: string
 *              enum: [PENDENTE, EM_ANDAMENTO, CONCLUIDA, CANCELADA]
 *            - name: local_partida
 *              description: Local de partida da viagem
 *              in: formData
 *              required: true
 *              type: string
 *            - name: destino
 *              description: Destino da viagem
 *              in: formData
 *              required: true
 *              type: string
 *            - name: usuarios
 *              description: Usuários da viagem
 *              in: body
 *              required: true
 *              schema:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    nome:
 *                      type: string
 *                    email:
 *                      type: string
 *                    tipo_usuario:
 *                      type: enum [MOTORISTA, PASSAGEIRO]
 *            - name: pagamento
 *              description: Pagamento da viagem
 *              in: body
 *              required: true
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          metodo:
 *                              type: enum [NULL, PIX, CARTAO_CREDITO]
 *                          valor:
 *                              type: number
 *            - name: avaliacao
 *              description: Avaliação da viagem
 *              in: body
 *              required: true
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          nota:
 *                              type: number
 *                          feedback:
 *                              type: string
 *          responses:
 *              201:
 *                  description: Viagem criada com sucesso
 *              500:
 *                  description: Erro ao criar viagem
 */
router.post('/nova_viagem', async (req, res) => {
    try {
        const { status, local_partida, destino, usuarios, pagamento, avaliacao } = req.body;
        const dataNow = new Date();
        const viagem = new Viagem({ status, local_partida, destino, data: dataNow, usuarios, pagamento, avaliacao });
        await viagem.save();
        res.status(201).json({ message: 'Viagem criada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// find all
/**
 * @swagger
 * /viagens:
 *      get:
 *          tags:
 *              - Viagem
 *          description: Retorna todas as viagens
 *          responses:
 *              200:
 *                  description: Viagens encontradas
 *              500:
 *                  description: Erro ao buscar viagens
 */
router.get('/', async (req, res) => {
    try {
        const viagens = await Viagem.find();
        res.status(200).json(viagens);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

//find by id
/**
 * @swagger
 * /viagem/{id}:
 *  get:
 *      tags:
 *        - Viagem
 *      description: Retorna uma viagem pelo ID
 *      parameters:
 *        - name: id
 *          description: ID da viagem
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *          200:
 *              description: Viagem encontrada
 *          500:
 *              description: Erro ao buscar viagem
 *          404:
 *              description: Viagem não encontrada
 */
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
/**
 * @swagger
 *  /editar_viagem/{id}:
 *      put:
 *          tags:
 *            - Viagem
 *          description: Atualiza uma viagem
 *          parameters:
 *            - name: id
 *              description: ID da viagem
 *              in: path
 *              required: true
 *              type: string
 *            - name: status
 *              description: Status da viagem
 *              in: formData
 *              required: false
 *              type: string
 *            - name: local_partida
 *              description: Local de partida da viagem
 *              in: formData
 *              required: false
 *              type: string
 *            - name: destino
 *              description: Destino da viagem
 *              in: formData
 *              required: false
 *              type: string
 *            - name: usuarios
 *              description: Usuários da viagem
 *              in: formData
 *              required: false
 *              type: array
 *            - name: pagamento
 *              description: Pagamento da viagem
 *              in: body
 *              required: false
 *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          metodo:
 *                              type: enum [NULL, PIX, CARTAO_CREDITO]
 *                          valor:
 *                              type: number
 *            - name: avaliacao
 *              description: Avaliação da viagem
 *              in: body
 *              required: false
  *              schema:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          nota:
 *                              type: number
 *                          feedback:
 *                              type: string
 *          responses:
 *              200:
 *                  description: Viagem atualizada com sucesso
 *              500:
 *                  description: Erro ao atualizar viagem
 *              404:
 *                  description: Viagem não encontrada
 */
router.put('/editar_viagem/:id', async (req, res) => {
    try {
        const { status, local_partida, destino, usuarios, pagamento, avaliacao } = req.body;
        await Viagem.findByIdAndUpdate(req.params.id, { status, local_partida, destino, usuarios, pagamento, avaliacao })
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
/**
 * @swagger
 *  /deletar_viagem/{id}:
 *      delete:
 *          tags:
 *            - Viagem
 *          description: Deleta uma viagem pelo ID
 *          parameters:
 *            - name: id
 *              description: ID da viagem
 *              in: path
 *              required: true
 *              type: string
 *          responses:
 *              200:
 *                  description: Viagem deletada
 *              500:
 *                  description: Erro ao deletar viagem
 *              404:
 *                  description: Viagem não encontrada
 */
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