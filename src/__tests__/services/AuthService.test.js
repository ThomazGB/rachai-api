const AuthService = require('../../services/AuthService');
const AuthRepository = require('../../repositories/AuthRepository');
const UsuarioService = require('../../services/UsuarioService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../repositories/AuthRepository');
jest.mock('../../services/UsuarioService');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    const email = 'test@example.com';
    const senha = 'Password123!';
    const JWT_SECRET_KEY = 'testsecret';

    beforeAll(() => {
        process.env.JWT_SECRET_KEY = JWT_SECRET_KEY;
    });

    describe('registro', () => {
        it('should throw an error if email format is invalid', async () => {
            await expect(AuthService.registro('invalid-email', senha)).rejects.toThrow('Formato de email inválido!');
        });

        it('should throw an error if password format is invalid', async () => {
            await expect(AuthService.registro(email, 'invalid')).rejects.toThrow('A senha deve conter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um caractere especial e um número.');
        });

        it('should throw an error if user already exists', async () => {
            AuthRepository.encontrarAuthPorEmail.mockResolvedValue({ email });
            await expect(AuthService.registro(email, senha)).rejects.toThrow('Usuário já cadastrado!');
        });

        it('should register a new user and return a token', async () => {
            AuthRepository.encontrarAuthPorEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedpassword');
            jwt.sign.mockReturnValue('token');
            AuthRepository.registro.mockResolvedValue();

            const token = await AuthService.registro(email, senha);

            expect(token).toBe('token');
            expect(AuthRepository.registro).toHaveBeenCalledWith({ email, senha: 'hashedpassword', token: 'token' });
        });
    });

    describe('login', () => {
        it('should throw an error if user is not found', async () => {
            AuthRepository.login.mockResolvedValue(null);
            await expect(AuthService.login(email, senha)).rejects.toThrow('Usuário não encontrado!');
        });

        it('should throw an error if password is incorrect', async () => {
            AuthRepository.login.mockResolvedValue({ email, senha: 'hashedpassword' });
            bcrypt.compare.mockResolvedValue(false);
            await expect(AuthService.login(email, senha)).rejects.toThrow('Senha incorreta!');
        });

        it('should login a user and return a token and user info', async () => {
            AuthRepository.login.mockResolvedValue({ email, senha: 'hashedpassword' });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');
            UsuarioService.encontrarUsuarioPorEmail.mockResolvedValue({ email, name: 'Test User' });

            const result = await AuthService.login(email, senha);

            expect(result.token).toBe('token');
            expect(result.userInfo).toEqual({ email, name: 'Test User' });
        });
    });

    describe('alterarSenha', () => {
        it('should throw an error if email format is invalid', async () => {
            await expect(AuthService.alterarSenha('invalid-email', senha, 'NewPassword123!')).rejects.toThrow('Formato de email inválido!');
        });

        it('should throw an error if new password format is invalid', async () => {
            await expect(AuthService.alterarSenha(email, senha, 'invalid')).rejects.toThrow('A nova senha deve conter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um caractere especial e um número.');
        });

        it('should throw an error if user is not found', async () => {
            AuthRepository.encontrarAuthPorEmail.mockResolvedValue(null);
            await expect(AuthService.alterarSenha(email, senha, 'NewPassword123!')).rejects.toThrow('Usuário não encontrado!');
        });

        it('should throw an error if current password is incorrect', async () => {
            AuthRepository.encontrarAuthPorEmail.mockResolvedValue({ email, senha: 'hashedpassword' });
            bcrypt.compare.mockResolvedValue(false);
            await expect(AuthService.alterarSenha(email, senha, 'NewPassword123!')).rejects.toThrow('Senha atual incorreta!');
        });
    });

    describe('logout', () => {
        it('should logout the user successfully', async () => {
            AuthRepository.logout.mockResolvedValue();

            await AuthService.logout(email);

            expect(AuthRepository.logout).toHaveBeenCalledWith(email);
        });
    });
});