require('dotenv').config();
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const AuthController = require('../../controllers/AuthController');
const AuthService = require('../../services/AuthService');

const app = express();
app.use(express.json());
app.use('/auth', AuthController);

jest.mock('./../../services/AuthService');

describe('AuthController', () => {
    beforeAll(async () => {
        const URI = process.env.MONGO_URI_QA || 'mongodb://127.0.0.1:27017/Rachai_Teste';
        await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }, 60000);

    afterAll(async () => {
        await mongoose.connection.close();
    }, 60000);

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /auth/cadastro', () => {
        it('should return 201 and token on successful registration', async () => {
            AuthService.registro.mockResolvedValue('mockToken');
            const response = await request(app)
                .post('/auth/cadastro')
                .send({ email: 'test@example.com', senha: 'password' });
            expect(response.status).toBe(201);
            expect(response.body.token).toBe('mockToken');
        });

        it('should return 500 on registration error', async () => {
            AuthService.registro.mockRejectedValue(new Error('Registration error'));
            const response = await request(app)
                .post('/auth/cadastro')
                .send({ email: 'test@example.com', senha: 'password' });
            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Registration error');
        });
    });

    describe('POST /auth/login', () => {
        it('should return 200 and token on successful login', async () => {
            AuthService.login.mockResolvedValue('mockToken');
            const response = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', senha: 'password' });
            expect(response.status).toBe(200);
            expect(response.body.token).toBe('mockToken');
            expect(response.body.email).toBe('test@example.com');
        });

        it('should return 500 on login error', async () => {
            AuthService.login.mockRejectedValue(new Error('Login error'));
            const response = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', senha: 'password' });
            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Login error');
        });
    });

    describe('POST /auth/alterar_senha', () => {
        it('should return 200 on successful password change', async () => {
            AuthService.alterarSenha.mockResolvedValue();
            const response = await request(app)
                .post('/auth/alterar_senha')
                .send({ email: 'test@example.com', senha_atual: 'oldPassword', nova_senha: 'newPassword' });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Senha alterada com sucesso!');
        });

        it('should return 500 on password change error', async () => {
            AuthService.alterarSenha.mockRejectedValue(new Error('Password change error'));
            const response = await request(app)
                .post('/auth/alterar_senha')
                .send({ email: 'test@example.com', senha_atual: 'oldPassword', nova_senha: 'newPassword' });
            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Password change error');
        });
    });

    describe('DELETE /auth/logout', () => {
        it('should return 200 on successful logout', async () => {
            AuthService.logout.mockResolvedValue();
            const response = await request(app)
                .delete('/auth/logout')
                .send({ email: 'test@example.com' });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Logout realizado com sucesso!');
        });

        it('should return 500 on logout error', async () => {
            AuthService.logout.mockRejectedValue(new Error('Logout error'));
            const response = await request(app)
                .delete('/auth/logout')
                .send({ email: 'test@example.com' });
            expect(response.status).toBe(500);
            expect(response.body.erro).toBe('Logout error');
        });
    });
});