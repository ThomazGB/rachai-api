const request = require('supertest');
const express = require('express');
const ViagemService = require('../../services/ViagemService');
const ViagemController = require('../../controllers/ViagemController');

const app = express();
app.use(express.json());
app.use('/viagens', ViagemController);

jest.mock('../../services/ViagemService');

describe('ViagemController', () => {
    describe('POST /viagens/nova_viagem', () => {
        it('should create a new viagem and return 201', async () => {
            const viagemData = {
                status: 'active',
                local_partida: 'A',
                destino: 'B',
                usuarios: ['user1', 'user2'],
                pagamento: 'paid',
                avaliacao: 5
            };
            ViagemService.criarViagem.mockResolvedValue({ id: 1, ...viagemData });

            const response = await request(app)
                .post('/viagens/nova_viagem')
                .send(viagemData);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Viagem criada com sucesso!');
            expect(response.body.viagem).toEqual({ id: 1, ...viagemData });
        });

        it('should return 500 if there is an error', async () => {
            ViagemService.criarViagem.mockRejectedValue(new Error('Erro ao criar a viagem'));

            const response = await request(app)
                .post('/viagens/nova_viagem')
                .send({});

            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Erro ao criar a viagem');
        });
    });

    describe('GET /viagens', () => {
        it('should return all viagens and return 200', async () => {
            const viagens = [{ id: 1, status: 'active' }];
            ViagemService.encontrarTodasViagens.mockResolvedValue(viagens);

            const response = await request(app)
                .get('/viagens');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(viagens);
        });

        it('should return 500 if there is an error', async () => {
            ViagemService.encontrarTodasViagens.mockRejectedValue(new Error('Erro ao encontrar as viagens'));

            const response = await request(app)
                .get('/viagens');

            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Erro ao encontrar as viagens');
        });
    });

    describe('GET /viagens/viagem/:id', () => {
        it('should return a viagem by id and return 200', async () => {
            const viagem = { id: 1, status: 'active' };
            ViagemService.encontrarViagemPorId.mockResolvedValue(viagem);

            const response = await request(app)
                .get('/viagens/viagem/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(viagem);
        });

        it('should return 404 if viagem is not found', async () => {
            ViagemService.encontrarViagemPorId.mockResolvedValue(null);

            const response = await request(app)
                .get('/viagens/viagem/1');

            expect(response.status).toBe(404);
            expect(response.body.erro).toBe('Viagem não encontrada!');
        });

        it('should return 500 if there is an error', async () => {
            ViagemService.encontrarViagemPorId.mockRejectedValue(new Error('Erro ao encontrar a viagem'));

            const response = await request(app)
                .get('/viagens/viagem/1');

            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Erro ao encontrar a viagem');
        });
    });

    describe('PUT /viagens/editar_viagem/:id', () => {
        it('should update a viagem by id and return 200', async () => {
            const viagemData = {
                status: 'active',
                local_partida: 'A',
                destino: 'B',
                usuarios: ['user1', 'user2'],
                pagamento: 'paid',
                avaliacao: 5
            };
            ViagemService.atualizarViagemPorId.mockResolvedValue({ id: 1, ...viagemData });

            const response = await request(app)
                .put('/viagens/editar_viagem/1')
                .send(viagemData);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Viagem atualizada com sucesso!');
            expect(response.body.viagem).toEqual({ id: 1, ...viagemData });
        });

        it('should return 404 if viagem is not found', async () => {
            ViagemService.atualizarViagemPorId.mockResolvedValue(null);

            const response = await request(app)
                .put('/viagens/editar_viagem/1')
                .send({});

            expect(response.status).toBe(404);
            expect(response.body.erro).toBe('Viagem não encontrada!');
        });

        it('should return 500 if there is an error', async () => {
            ViagemService.atualizarViagemPorId.mockRejectedValue(new Error('Erro ao atualizar a viagem'));

            const response = await request(app)
                .put('/viagens/editar_viagem/1')
                .send({});

            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Erro ao atualizar a viagem');
        });
    });

    describe('DELETE /viagens/deletar_viagem/:id', () => {
        it('should delete a viagem by id and return 200', async () => {
            ViagemService.deletarViagemPorId.mockResolvedValue(true);

            const response = await request(app)
                .delete('/viagens/deletar_viagem/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Viagem deletada com sucesso!');
        });

        it('should return 404 if viagem is not found', async () => {
            ViagemService.deletarViagemPorId.mockResolvedValue(false);

            const response = await request(app)
                .delete('/viagens/deletar_viagem/1');

            expect(response.status).toBe(404);
            expect(response.body.erro).toBe('Viagem não encontrada!');
        });

        it('should return 500 if there is an error', async () => {
            ViagemService.deletarViagemPorId.mockRejectedValue(new Error('Erro ao deletar a viagem'));

            const response = await request(app)
                .delete('/viagens/deletar_viagem/1');

            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Erro ao deletar a viagem');
        });
    });
});