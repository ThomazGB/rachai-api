require('dotenv').config();
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Usuario = require('../../models/schemas').Usuario;
const UsuarioService = require('../../services/UsuarioService');
const router = require('../../controllers/UsuarioController');

const app = express();
app.use(express.json());
app.use('/api', router);

jest.mock('./../../models/schemas', () => ({
    Usuario: jest.fn()
}));

jest.mock('./../../services/UsuarioService', () => ({
    uploadImagem: jest.fn()
}));

describe('UsuarioController', () => {
    beforeAll(async () => {
        const URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Rachai';
        await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }, 60000);

    afterAll(async () => {
        await mongoose.connection.close();
    }, 60000);

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new user', async () => {
        const mockUser = { nome: 'Test', email: 'test@test.com', ra: '123', curso: 'CS', score: 10, tipo_usuario: 'admin', veiculos: [] };
        Usuario.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockUser)
        }));

        const res = await request(app).post('/api/criar_usuario').send(mockUser);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Usuário cadastrado com sucesso!');
    });

    it('should upload user image', async () => {
        UsuarioService.uploadImagem.mockResolvedValue('path/to/image');
        const res = await request(app).post('/api/usuario/1/upload');
        expect(res.status).toBe(200);
        expect(res.body.img_url).toBe('path/to/image');
    });

    it('should get all users', async () => {
        const mockUsers = [{ nome: 'Test', email: 'test@test.com' }];
        Usuario.find = jest.fn().mockResolvedValue(mockUsers);

        const res = await request(app).get('/api/');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUsers);
    });

    it('should get user by id', async () => {
        const mockUser = { nome: 'Test', email: 'test@test.com' };
        Usuario.findById = jest.fn().mockResolvedValue(mockUser);

        const res = await request(app).get('/api/usuario/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUser);
    });

    it('should return 404 if user not found by id', async () => {
        Usuario.findById = jest.fn().mockResolvedValue(null);

        const res = await request(app).get('/api/usuario/1');
        expect(res.status).toBe(404);
        expect(res.body.erro).toBe('Usuário não encontrado!');
    });

    it('should get user by email', async () => {
        const mockUser = { nome: 'Test', email: 'test@test.com' };
        Usuario.findOne = jest.fn().mockResolvedValue(mockUser);

        const res = await request(app).post('/api/usuario_email').send({ email: 'test@test.com' });
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUser);
    });

    it('should update user by id', async () => {
        Usuario.findByIdAndUpdate = jest.fn().mockResolvedValue({});

        const res = await request(app).put('/api/editar_usuario/1').send({ nome: 'Updated' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Usuário atualizado com sucesso!');
    });

    it('should delete user by id', async () => {
        Usuario.findByIdAndDelete = jest.fn().mockResolvedValue({});

        const res = await request(app).delete('/api/deletar_usuario/1');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Usuário deletado com sucesso!');
    });

    it('should return 500 if there is an error creating a user', async () => {
        Usuario.mockImplementation(() => ({
            save: jest.fn().mockRejectedValue(new Error('Database error'))
        }));

        const res = await request(app).post('/api/criar_usuario').send({ nome: 'Test' });
        expect(res.status).toBe(500);
        expect(res.body.erro).toBe('Database error');
    });

    it('should return 500 if there is an error uploading user image', async () => {
        UsuarioService.uploadImagem.mockRejectedValue(new Error('Upload error'));

        const res = await request(app).post('/api/usuario/1/upload');
        expect(res.status).toBe(500);
        expect(res.body.erro).toBe('Upload error');
    });

    it('should return 500 if there is an error getting all users', async () => {
        Usuario.find = jest.fn().mockRejectedValue(new Error('Database error'));

        const res = await request(app).get('/api/');
        expect(res.status).toBe(500);
        expect(res.body.erro).toBe('Database error');
    });

    it('should return 500 if there is an error getting user by id', async () => {
        Usuario.findById = jest.fn().mockRejectedValue(new Error('Database error'));

        const res = await request(app).get('/api/usuario/1');
        expect(res.status).toBe(500);
        expect(res.body.erro).toBe('Database error');
    });

    it('should return 500 if there is an error getting user by email', async () => {
        Usuario.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

        const res = await request(app).post('/api/usuario_email').send({ email: 'test@test.com' });
        expect(res.status).toBe(500);
        expect(res.body.erro).toBe('Database error');
    });

    it('should return 500 if there is an error updating user by id', async () => {
        Usuario.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

        const res = await request(app).put('/api/editar_usuario/1').send({ nome: 'Updated' });
        expect(res.status).toBe(500);
        expect(res.body.erro).toBe('Database error');
    });

    it('should return 500 if there is an error deleting user by id', async () => {
        Usuario.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

        const res = await request(app).delete('/api/deletar_usuario/1');
        expect(res.status).toBe(500);
        expect(res.body.erro).toBe('Database error');
    });

    it('should return 404 if there is a TypeError when getting user by email', async () => {
        Usuario.findOne = jest.fn().mockRejectedValue(new TypeError());

        const res = await request(app).post('/api/usuario_email').send({ email: 'test@test.com' });
        expect(res.status).toBe(404);
        expect(res.body.erro).toBe('Usuário não encontrado!');
    });

    it('should return 404 if there is a TypeError when updating user by id', async () => {
        Usuario.findByIdAndUpdate = jest.fn().mockRejectedValue(new TypeError());

        const res = await request(app).put('/api/editar_usuario/1').send({ nome: 'Updated' });
        expect(res.status).toBe(404);
        expect(res.body.erro).toBe('Usuário não encontrado!');
    });

    it('should return 404 if there is a TypeError when deleting user by id', async () => {
        Usuario.findByIdAndDelete = jest.fn().mockRejectedValue(new TypeError());

        const res = await request(app).delete('/api/deletar_usuario/1');
        expect(res.status).toBe(404);
        expect(res.body.erro).toBe('Usuário não encontrado!');
    });
});