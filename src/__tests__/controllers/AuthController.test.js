const request = require('supertest');
const express = require('express');
const AuthService = require('../../services/AuthService');
const AuthController = require('../../controllers/AuthController');

const app = express();
app.use(express.json());
app.use('/auth', AuthController);

jest.mock('../../services/AuthService');

describe('AuthController', () => {
    describe('POST /auth/cadastro', () => {
        it('should return 201 and token on successful registration', async () => {
            AuthService.registro.mockResolvedValue('mockToken');
            const response = await request(app)
                .post('/auth/cadastro')
                .send({ email: 'test@example.com', senha: 'password' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ token: 'mockToken' });
        });

        it('should return 500 on registration error', async () => {
            AuthService.registro.mockRejectedValue(new Error('Erro ao registrar usuário'));
            const response = await request(app)
                .post('/auth/cadastro')
                .send({ email: 'test@example.com', senha: 'password' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ erro: 'Erro ao registrar usuário' });
        });
    });

    describe('POST /auth/login', () => {
        it('should return 200 and token on successful login', async () => {
            AuthService.login.mockResolvedValue('mockToken');
            const response = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', senha: 'password' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ token: 'mockToken', email: 'test@example.com' });
        });

        it('should return 500 on login error', async () => {
            AuthService.login.mockRejectedValue(new Error('Erro ao realizar login'));
            const response = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', senha: 'password' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ erro: 'Erro ao realizar login' });
        });
    });

    describe('POST /auth/alterar_senha', () => {
        it('should return 200 on successful password change', async () => {
            AuthService.alterarSenha.mockResolvedValue();
            const response = await request(app)
                .post('/auth/alterar_senha')
                .send({ email: 'test@example.com', senha_atual: 'oldPassword', nova_senha: 'newPassword' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Senha alterada com sucesso!' });
        });

        it('should return 500 on password change error', async () => {
            AuthService.alterarSenha.mockRejectedValue(new Error('Erro ao alterar senha'));
            const response = await request(app)
                .post('/auth/alterar_senha')
                .send({ email: 'test@example.com', senha_atual: 'oldPassword', nova_senha: 'newPassword' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ erro: 'Erro ao alterar senha' });
        });
    });

    describe('DELETE /auth/logout', () => {
        it('should return 200 on successful logout', async () => {
            AuthService.logout.mockResolvedValue();
            const response = await request(app)
                .delete('/auth/logout')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Logout realizado com sucesso!' });
        });

        it('should return 500 on logout error', async () => {
            AuthService.logout.mockRejectedValue(new Error('Erro ao realizar logout'));
            const response = await request(app)
                .delete('/auth/logout')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ erro: 'Erro ao realizar logout' });
        });
    });
});