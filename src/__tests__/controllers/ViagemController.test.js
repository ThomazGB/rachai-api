require('dotenv').config();
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Viagem = require('./../../models/schemas').Viagem;
const router = require('./../../controllers/ViagemController');

const app = express();
app.use(express.json());
app.use('/api', router);

jest.mock('./../../models/schemas', () => ({
    Viagem: jest.fn()
}));

describe('ViagemController', () => {
    beforeAll(async () => {
        const URI = process.env.MONGO_URI_QA || 'mongodb://127.0.0.1:27017/Rachai_Teste';
        await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }, 60000);

    afterAll(async () => {
        await mongoose.connection.close();
    }, 60000);

    it('should create a new travel', async () => {
        const mockTravel = {
            status: 'PENDENTE',
            local_partida: 'São Paulo',
            destino: 'Rio de Janeiro',
            data: new Date(),
            usuarios: [{ nome: 'João', email: 'joao@example.com', tipo_usuario: 'PASSAGEIRO' }],
            pagamento: [{ metodo: 'PIX', valor: 150 }],
            avaliacao: [{ nota: 5, feedback: 'Ótima viagem' }]
        };
        Viagem.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockTravel)
        }));

        const res = await request(app).post('/api/nova_viagem').send(mockTravel);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Viagem criada com sucesso!');
    });

    it('should get all travels', async () => {
        const mockTravels = [{
            status: 'PENDENTE',
            local_partida: 'São Paulo',
            destino: 'Rio de Janeiro',
            usuarios: [{ nome: 'João', email: 'joao@example.com', tipo_usuario: 'PASSAGEIRO' }],
            pagamento: [{ metodo: 'PIX', valor: 150 }],
            avaliacao: [{ nota: 5, feedback: 'Ótima viagem' }]
        }];
        Viagem.find = jest.fn().mockResolvedValue(mockTravels);

        const res = await request(app).get('/api/');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockTravels);
    });

    it('should get travel by id', async () => {
        const mockTravel = {
            status: 'CONCLUIDA',
            local_partida: 'Curitiba',
            destino: 'Florianópolis',
            usuarios: [{ nome: 'Ana', email: 'ana@example.com', tipo_usuario: 'PASSAGEIRO' }],
            pagamento: [{ metodo: 'CARTAO_CREDITO', valor: 200 }],
            avaliacao: [{ nota: 4, feedback: 'Viagem tranquila' }]
        };
        Viagem.findById = jest.fn().mockResolvedValue(mockTravel);

        const res = await request(app).get('/api/viagem/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockTravel);
    });

    it('should update travel by id', async () => {
        Viagem.findByIdAndUpdate = jest.fn().mockResolvedValue({});

        const res = await request(app).put('/api/editar_viagem/1').send(
            {
                status: 'CONCLUIDA',
                local_partida: 'Brasília',
                destino: 'Salvador',
                usuarios: [{ nome: 'Carlos', email: 'carlos@example.com', tipo_usuario: 'MOTORISTA' }],
                pagamento: [{ metodo: 'PIX', valor: 200 }],
                avaliacao: [{ nota: 4, feedback: 'Excelente viagem!' }]
            }
        );
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Viagem atualizada com sucesso!');
    });

    it('should delete travel by id', async () => {
        Viagem.findByIdAndDelete = jest.fn().mockResolvedValue({});

        const res = await request(app).delete('/api/deletar_viagem/1');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Viagem deletada com sucesso!');
    });

    it('should return 404 if travel not found on get by id', async () => {
        Viagem.findById = jest.fn().mockRejectedValue(new TypeError());

        const res = await request(app).get('/api/viagem/1');
        expect(res.status).toBe(404);
        expect(res.body.erro).toBe('Viagem não encontrada!');
    });

    it('should return 404 if travel not found on update by id', async () => {
        Viagem.findByIdAndUpdate = jest.fn().mockRejectedValue(new TypeError());

        const res = await request(app).put('/api/editar_viagem/1').send(
            {
                status: 'CONCLUIDA',
                local_partida: 'Brasília',
                destino: 'Salvador',
                usuarios: [{ nome: 'Carlos', email: 'carlos@example.com', tipo_usuario: 'MOTORISTA' }],
                pagamento: [{ metodo: 'PIX', valor: 200 }],
                avaliacao: [{ nota: 4, feedback: 'Excelente viagem!' }]
            }
        );
        expect(res.status).toBe(404);
        expect(res.body.erro).toBe('Viagem não encontrada!');
    });

    it('should return 404 if travel not found on delete by id', async () => {
        Viagem.findByIdAndDelete = jest.fn().mockRejectedValue(new TypeError());

        const res = await request(app).delete('/api/deletar_viagem/1');
        expect(res.status).toBe(404);
        expect(res.body.erro).toBe('Viagem não encontrada!');
    });

    it('should return 500 if there is a server error on create travel', async () => {
        Viagem.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error('Server error'))
        }));

        const mockTravel = {
            status: 'PENDENTE',
            local_partida: 'São Paulo',
            destino: 'Rio de Janeiro',
            data: new Date(),
            usuarios: [{ nome: 'João', email: 'joao@example.com', tipo_usuario: 'PASSAGEIRO' }],
            pagamento: [{ metodo: 'PIX', valor: 150 }],
            avaliacao: [{ nota: 5, feedback: 'Ótima viagem' }]
        };

        const res = await request(app).post('/api/nova_viagem').send(mockTravel);
        expect(res.status).toBe(500);
        expect(res.body.erro).toBe('Server error');
    });

    it('should return 500 if there is a server error on get all travels', async () => {
        Viagem.find = jest.fn().mockRejectedValue(new Error('Server error'));

        const res = await request(app).get('/api/');
        expect(res.status).toBe(500);
        expect(res.body.erro).toBe('Server error');
    });

    it('should return 500 if there is a server error on get travel by id', async () => {
        Viagem.findById = jest.fn().mockRejectedValue(new Error('Server error'));

        const res = await request(app).get('/api/viagem/1');
        expect(res.status).toBe(500);
        expect(res.body.erro).toBe('Server error');
    });

    it('should return 500 if there is a server error on update travel by id', async () => {
        Viagem.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Server error'));

        const res = await request(app).put('/api/editar_viagem/1').send(
            {
                status: 'CONCLUIDA',
                local_partida: 'Brasília',
                destino: 'Salvador',
                usuarios: [{ nome: 'Carlos', email: 'carlos@example.com', tipo_usuario: 'MOTORISTA' }],
                pagamento: [{ metodo: 'PIX', valor: 200 }],
                avaliacao: [{ nota: 4, feedback: 'Excelente viagem!' }]
            }
        );
        expect(res.status).toBe(500);
        expect(res.body.erro).toBe('Server error');
    });

    it('should return 500 if there is a server error on delete travel by id', async () => {
        Viagem.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Server error'));

        const res = await request(app).delete('/api/deletar_viagem/1');
        expect(res.status).toBe(500);
        expect(res.body.erro).toBe('Server error');
    });
});