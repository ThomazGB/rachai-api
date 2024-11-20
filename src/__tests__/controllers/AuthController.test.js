const request = require('supertest');
const express = require('express');
const AuthController = require('../../controllers/AuthController');

const app = express();
app.use(express.json());
app.use('/auth', AuthController);

describe('AuthController', () => {
    describe('POST /auth/cadastro', () => {
        it('should return 400 if email is invalid', async () => {
            const response = await request(app)
                .post('/auth/cadastro')
                .send({ email: 'invalidemail', senha: 'password123' });
            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe('Email inválido');
        });

        it('should return 400 if password is less than 8 characters', async () => {
            const response = await request(app)
                .post('/auth/cadastro')
                .send({ email: 'test@example.com', senha: 'short' });
            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe('A senha deve conter no mínimo 8 caracteres');
        });
    });

    describe('POST /auth/login', () => {
        it('should return 400 if email is invalid', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ email: 'invalidemail', senha: 'password123' });
            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe('Email inválido');
        });

        it('should return 400 if password is less than 8 characters', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', senha: 'short' });
            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe('A senha deve conter no mínimo 8 caracteres');
        });
    });

    describe('POST /auth/alterar_senha', () => {
        it('should return 400 if email is invalid', async () => {
            const response = await request(app)
                .post('/auth/alterar_senha')
                .send({ email: 'invalidemail', senha_atual: 'password123', nova_senha: 'newpassword123' });
            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe('Email inválido');
        });

        it('should return 400 if current password is less than 8 characters', async () => {
            const response = await request(app)
                .post('/auth/alterar_senha')
                .send({ email: 'test@example.com', senha_atual: 'short', nova_senha: 'newpassword123' });
            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe('A senha atual deve conter no mínimo 8 caracteres');
        });

        it('should return 400 if new password is less than 8 characters', async () => {
            const response = await request(app)
                .post('/auth/alterar_senha')
                .send({ email: 'test@example.com', senha_atual: 'password123', nova_senha: 'short' });
            expect(response.status).toBe(400);
            expect(response.body.errors[0].msg).toBe('A nova senha deve conter no mínimo 8 caracteres');
        });
    });
});