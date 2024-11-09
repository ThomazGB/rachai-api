const { registro, login, alterarSenha, logout } = require('../../services/AuthService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Auth } = require('../../models/schemas');
const mongoose = require('mongoose');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../models/schemas');

describe('AuthService', () => {
    beforeAll(async () => {
        const uri = process.env.MONGODB_URI_QA || 'mongodb://127.0.0.1:27017/Rachai_Teste';
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
    const email = 'test@example.com';
    const senha = 'Password@123';
    const novaSenha = 'NewPassword@123';
    const token = 'fake-jwt-token';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registro', () => {
        it('should throw an error if email format is invalid', async () => {
            await expect(registro('invalid-email', senha)).rejects.toThrow('Formato de email inválido!');
        });

        it('should throw an error if password format is invalid', async () => {
            await expect(registro(email, 'invalid')).rejects.toThrow('A senha deve conter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um caractere especial e um número.');
        });

        it('should throw an error if user already exists', async () => {
            Auth.findOne.mockResolvedValue({ email });
            await expect(registro(email, senha)).rejects.toThrow('Usuário já cadastrado!');
        });

        it('should register a new user and return a token', async () => {
            Auth.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed-password');
            jwt.sign.mockReturnValue(token);
            Auth.prototype.save = jest.fn().mockResolvedValue({});

            const result = await registro(email, senha);

            expect(result).toBe(token);
            expect(Auth.prototype.save).toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should throw an error if user is not found', async () => {
            Auth.findOne.mockResolvedValue(null);
            await expect(login(email, senha)).rejects.toThrow('Usuário não encontrado!');
        });

        it('should throw an error if password is incorrect', async () => {
            Auth.findOne.mockResolvedValue({ email, senha: 'hashed-password' });
            bcrypt.compare.mockResolvedValue(false);
            await expect(login(email, senha)).rejects.toThrow('Senha incorreta!');
        });

        it('should return a token if login is successful', async () => {
            Auth.findOne.mockResolvedValue({ _id: 'user-id', email, senha: 'hashed-password' });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(token);
            Auth.findByIdAndUpdate.mockResolvedValue({});

            const result = await login(email, senha);

            expect(result).toBe(token);
            expect(Auth.findByIdAndUpdate).toHaveBeenCalledWith('user-id', { token });
        });
    });

    describe('alterarSenha', () => {
        it('should throw an error if email format is invalid', async () => {
            await expect(alterarSenha('invalid-email', senha, novaSenha)).rejects.toThrow('Formato de email inválido!');
        });

        it('should throw an error if new password format is invalid', async () => {
            await expect(alterarSenha(email, senha, 'invalid')).rejects.toThrow('A nova senha deve conter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um caractere especial e um número.');
        });

        it('should throw an error if user is not found', async () => {
            Auth.findOne.mockResolvedValue(null);
            await expect(alterarSenha(email, senha, novaSenha)).rejects.toThrow('Usuário não encontrado!');
        });

        it('should throw an error if current password is incorrect', async () => {
            Auth.findOne.mockResolvedValue({ email, senha: 'hashed-password' });
            bcrypt.compare.mockResolvedValue(false);
            await expect(alterarSenha(email, senha, novaSenha)).rejects.toThrow('Senha atual incorreta!');
        });

        it('should update the password if current password is correct', async () => {
            Auth.findOne.mockResolvedValue({ _id: 'user-id', email, senha: 'hashed-password' });
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('new-hashed-password');
            Auth.findByIdAndUpdate.mockResolvedValue({});

            await alterarSenha(email, senha, novaSenha);

            expect(Auth.findByIdAndUpdate).toHaveBeenCalledWith('user-id', { senha: 'new-hashed-password' });
        });
    });

    describe('logout', () => {
        it('should clear the token for the user', async () => {
            Auth.findOne.mockResolvedValue({ email });
            Auth.findOneAndUpdate.mockResolvedValue({});

            await logout(email);

            expect(Auth.findOneAndUpdate).toHaveBeenCalledWith({ email }, { token: '' });
        });
    });
});