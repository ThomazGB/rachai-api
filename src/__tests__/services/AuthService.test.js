const AuthService = require('../../services/AuthService');
const AuthRepository = require('../../repositories/AuthRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../repositories/AuthRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    const email = 'test@example.com';
    const senha = 'Password123!';
    const hash = 'hashedPassword';
    const token = 'jwtToken';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registro', () => {
        it('should throw an error if email format is invalid', async () => {
            await expect(AuthService.registro('invalidEmail', senha)).rejects.toThrow('Formato de email inválido!');
        });

        it('should throw an error if password format is invalid', async () => {
            await expect(AuthService.registro(email, 'invalid')).rejects.toThrow('A senha deve conter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um caractere especial e um número.');
        });

        it('should throw an error if user already exists', async () => {
            AuthRepository.encontrarAuthPorEmail.mockResolvedValue({ email });
            await expect(AuthService.registro(email, senha)).rejects.toThrow('Usuário já cadastrado!');
        });

        it('should save user and return token', async () => {
            AuthRepository.encontrarAuthPorEmail.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue(hash);
            jwt.sign.mockReturnValue(token);
            AuthRepository.registro.mockResolvedValue();

            const result = await AuthService.registro(email, senha);

            expect(result).toBe(token);
            expect(AuthRepository.registro).toHaveBeenCalledWith({ email, senha: hash, token });
        });
    });

    describe('login', () => {
        it('should throw an error if user is not found', async () => {
            AuthRepository.login.mockResolvedValue(null);
            await expect(AuthService.login(email, senha)).rejects.toThrow('Usuário não encontrado!');
        });

        it('should throw an error if password is incorrect', async () => {
            AuthRepository.login.mockResolvedValue({ email, senha: hash });
            bcrypt.compare.mockResolvedValue(false);
            await expect(AuthService.login(email, senha)).rejects.toThrow('Senha incorreta!');
        });

        it('should return token if login is successful', async () => {
            AuthRepository.login.mockResolvedValue({ email, senha: hash, _id: 'userId' });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(token);

            const result = await AuthService.login(email, senha);

            expect(result).toBe(token);
            expect(AuthRepository.login).toHaveBeenCalledWith('userId', { token });
        });
    });

    describe('alterarSenha', () => {
        it('should throw an error if email format is invalid', async () => {
            await expect(AuthService.alterarSenha('invalidEmail', senha, 'NewPassword123!')).rejects.toThrow('Formato de email inválido!');
        });

        it('should throw an error if new password format is invalid', async () => {
            await expect(AuthService.alterarSenha(email, senha, 'invalid')).rejects.toThrow('A nova senha deve conter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um caractere especial e um número.');
        });

        it('should throw an error if user is not found', async () => {
            AuthRepository.encontrarAuthPorEmail.mockResolvedValue(null);
            await expect(AuthService.alterarSenha(email, senha, 'NewPassword123!')).rejects.toThrow('Usuário não encontrado!');
        });

        it('should throw an error if current password is incorrect', async () => {
            AuthRepository.encontrarAuthPorEmail.mockResolvedValue({ email, senha: hash });
            bcrypt.compare.mockResolvedValue(false);
            await expect(AuthService.alterarSenha(email, senha, 'NewPassword123!')).rejects.toThrow('Senha atual incorreta!');
        });

        it('should update password if current password is correct', async () => {
            AuthRepository.encontrarAuthPorEmail.mockResolvedValue({ email, senha: hash, _id: 'userId' });
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('newHashedPassword');
            AuthRepository.alterarSenha.mockResolvedValue();

            await AuthService.alterarSenha(email, senha, 'NewPassword123!');

            expect(AuthRepository.alterarSenha).toHaveBeenCalledWith('userId', { senha: 'newHashedPassword' });
        });
    });

    describe('logout', () => {
        it('should clear the token', async () => {
            AuthRepository.logout.mockResolvedValue();

            await AuthService.logout(email);

            expect(AuthRepository.logout).toHaveBeenCalledWith(email, { token: '' });
        });
    });
});