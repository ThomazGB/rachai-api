const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Usuario = require('../../models/schemas').Usuario;
const UsuarioService = require('../../services/UsuarioService');
const usuarioController = require('../../controllers/UsuarioController');

const app = express();
app.use(express.json());
app.use('/usuarios', usuarioController);

jest.mock('../../models/schemas', () => ({
    Usuario: jest.fn()
}));

jest.mock('../../services/UsuarioService', () => ({
    uploadImagem: jest.fn()
}));

beforeAll(async () => {
    const URI = process.env.MONGO_URI_QA  || 'mongodb://127.0.0.1:27017/Rachai_Teste';
    await mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('UsuarioController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /usuarios/criar_usuario', () => {
        it('should create a new user', async () => {
            const mockUser = {
                save: jest.fn().mockResolvedValue({})
            };
            Usuario.mockImplementation(() => mockUser);

            const response = await request(app)
                .post('/usuarios/criar_usuario')
                .send({ nome: 'John', email: 'john@example.com', ra: '123', curso: 'CS', score: 100, tipo_usuario: 'student', veiculos: [] });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Usuário cadastrado com sucesso!');
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('should return 500 if there is an error', async () => {
            Usuario.mockImplementation(() => {
                throw new Error('Error');
            });

            const response = await request(app)
                .post('/usuarios/criar_usuario')
                .send({ nome: 'John', email: 'john@example.com', ra: '123', curso: 'CS', score: 100, tipo_usuario: 'student', veiculos: [] });

            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Erro ao cadastrar usuário');
        });
    });

    describe('POST /usuarios/usuario/:id/upload', () => {
        it('should upload an image', async () => {
            UsuarioService.uploadImagem.mockResolvedValue('path/to/image');

            const response = await request(app)
                .post('/usuarios/usuario/1/upload')
                .send();

            expect(response.status).toBe(200);
            expect(response.body.img_url).toBe('path/to/image');
        });

        it('should return 500 if there is an error', async () => {
            UsuarioService.uploadImagem.mockRejectedValue(new Error('Error'));

            const response = await request(app)
                .post('/usuarios/usuario/1/upload')
                .send();

            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Error');
        });
    });

    describe('GET /usuarios', () => {
        it('should get all users', async () => {
            Usuario.find = jest.fn().mockResolvedValue([{ nome: 'John' }]);

            const response = await request(app)
                .get('/usuarios')
                .send();

            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ nome: 'John' }]);
        });

        it('should return 500 if there is an error', async () => {
            Usuario.find = jest.fn().mockRejectedValue(new Error('Error'));

            const response = await request(app)
                .get('/usuarios')
                .send();

            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Error');
        });
    });

    describe('GET /usuarios/usuario/motoristas', () => {
        it('deve retornar uma lista de motoristas', async () => {
            Usuario.find = jest.fn().mockResolvedValue([
                { nome: 'Motorista 1', email: 'motorista1@example.com', tipo_usuario: 'MOTORISTA' },
                { nome: 'Motorista 2', email: 'motorista2@example.com', tipo_usuario: 'MOTORISTA' }
            ]);
    
            const res = await request(app).get('/usuarios/usuario/motoristas');
    
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0]).toHaveProperty('nome', 'Motorista 1');
            expect(res.body[1]).toHaveProperty('nome', 'Motorista 2');
        });
    
        it('deve retornar erro 404 se nenhum motorista for encontrado', async () => {
            Usuario.find = jest.fn().mockResolvedValue([]);
            const res = await request(app).get('/usuarios/usuario/motoristas');
    
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('erro', 'Infelizmente não encontramos nenhum motorista na sua área!');
        });
    
        it('deve retornar erro 500 em caso de erro no servidor', async () => {
            jest.spyOn(Usuario, 'find').mockImplementationOnce(() => {
                throw new Error('Erro no servidor');
            });
    
            const res = await request(app).get('/usuarios/usuario/motoristas');
    
            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('erro', 'Erro no servidor');
        });
    });

    describe('GET /usuarios/usuario/:id', () => {
        it('should get a user by id', async () => {
            Usuario.findById = jest.fn().mockResolvedValue({ nome: 'John' });

            const response = await request(app)
                .get('/usuarios/usuario/1')
                .send();

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ nome: 'John' });
        });

        it('should return 404 if user not found', async () => {
            Usuario.findById = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .get('/usuarios/usuario/1')
                .send();

            expect(response.status).toBe(404);
            expect(response.body.erro).toBe('Usuário não encontrado!');
        });

        it('should return 500 if there is an error', async () => {
            Usuario.findById = jest.fn().mockRejectedValue(new Error('Error'));

            const response = await request(app)
                .get('/usuarios/usuario/1')
                .send();

            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Error');
        });
    });

    describe('POST /usuarios/usuario_email', () => {
        it('should get a user by email', async () => {
            Usuario.findOne = jest.fn().mockResolvedValue({ nome: 'John' });

            const response = await request(app)
                .post('/usuarios/usuario_email')
                .send({ email: 'john@example.com' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ nome: 'John' });
        });

        it('should return 404 if user not found', async () => {
            Usuario.findOne = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .post('/usuarios/usuario_email')
                .send({ email: 'john@example.com' });

            expect(response.status).toBe(404);
            expect(response.body.erro).toBe('Usuário não encontrado!');
        });

        it('should return 500 if there is an error', async () => {
            Usuario.findOne = jest.fn().mockRejectedValue(new Error('Error'));

            const response = await request(app)
                .post('/usuarios/usuario_email')
                .send({ email: 'john@example.com' });

            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Error fetching user');
        });
    });

    describe('PUT /usuarios/editar_usuario/:id', () => {
        it('should update a user', async () => {
            Usuario.findByIdAndUpdate = jest.fn().mockResolvedValue({ nome: 'John' });

            const response = await request(app)
                .put('/usuarios/editar_usuario/1')
                .send({ nome: 'John' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Usuário atualizado com sucesso!');
            expect(response.body.usuario).toEqual({ nome: 'John' });
        });

        it('should return 404 if user not found', async () => {
            Usuario.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .put('/usuarios/editar_usuario/1')
                .send({ nome: 'John' });

            expect(response.status).toBe(404);
            expect(response.body.erro).toBe('Usuário não encontrado!');
        });

        it('should return 500 if there is an error', async () => {
            Usuario.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Error'));

            const response = await request(app)
                .put('/usuarios/editar_usuario/1')
                .send({ nome: 'John' });

            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Erro ao atualizar o usuário');
        });
    });

    describe('DELETE /usuarios/deletar_usuario/:id', () => {
        it('should delete a user', async () => {
            Usuario.findByIdAndDelete = jest.fn().mockResolvedValue({ nome: 'John' });

            const response = await request(app)
                .delete('/usuarios/deletar_usuario/1')
                .send();

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Usuário deletado com sucesso!');
        });

        it('should return 404 if user not found', async () => {
            Usuario.findByIdAndDelete = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .delete('/usuarios/deletar_usuario/1')
                .send();

            expect(response.status).toBe(404);
            expect(response.body.erro).toBe('Usuário não encontrado!');
        });

        it('should return 500 if there is an error', async () => {
            Usuario.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Error'));

            const response = await request(app)
                .delete('/usuarios/deletar_usuario/1')
                .send();

            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Erro ao deletar o usuário');
        });
    });
});