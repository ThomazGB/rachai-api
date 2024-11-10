const UsuarioService = require('../../services/UsuarioService');
const UsuarioRepository = require('../../repositories/UsuarioRepository');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { fromEnv } = require('@aws-sdk/credential-provider-env');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

jest.mock('../../repositories/UsuarioRepository');
jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/credential-provider-env');
jest.mock('multer');
jest.mock('multer-s3');
jest.mock('uuid', () => ({
    v4: jest.fn()
}));

describe('UsuarioService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('criarUsuario', () => {
        it('should create a user', async () => {
            const usuarioData = { name: 'John Doe' };
            UsuarioRepository.criarUsuario.mockResolvedValue(usuarioData);

            const result = await UsuarioService.criarUsuario(usuarioData);

            expect(UsuarioRepository.criarUsuario).toHaveBeenCalledWith(usuarioData);
            expect(result).toEqual(usuarioData);
        });
    });

    describe('encontrarUsuarioPorId', () => {
        it('should find a user by id', async () => {
            const userId = '123';
            const user = { id: userId, name: 'John Doe' };
            UsuarioRepository.encontrarUsuarioPorId.mockResolvedValue(user);

            const result = await UsuarioService.encontrarUsuarioPorId(userId);

            expect(UsuarioRepository.encontrarUsuarioPorId).toHaveBeenCalledWith(userId);
            expect(result).toEqual(user);
        });
    });

    describe('encontrarUsuarioPorEmail', () => {
        it('should find a user by email', async () => {
            const email = 'john.doe@example.com';
            const user = { id: '123', email: email, name: 'John Doe' };
            UsuarioRepository.encontrarUsuarioPorEmail.mockResolvedValue(user);

            const result = await UsuarioService.encontrarUsuarioPorEmail(email);

            expect(UsuarioRepository.encontrarUsuarioPorEmail).toHaveBeenCalledWith(email);
            expect(result).toEqual(user);
        });
    });

    describe('atualizarUsuarioPorId', () => {
        it('should update a user by id', async () => {
            const userId = '123';
            const usuarioData = { name: 'John Doe Updated' };
            UsuarioRepository.atualizarUsuarioPorId.mockResolvedValue(usuarioData);

            const result = await UsuarioService.atualizarUsuarioPorId(userId, usuarioData);

            expect(UsuarioRepository.atualizarUsuarioPorId).toHaveBeenCalledWith(userId, usuarioData);
            expect(result).toEqual(usuarioData);
        });
    });

    describe('deletarUsuarioPorId', () => {
        it('should delete a user by id', async () => {
            const userId = '123';
            UsuarioRepository.deletarUsuarioPorId.mockResolvedValue(true);

            const result = await UsuarioService.deletarUsuarioPorId(userId);

            expect(UsuarioRepository.deletarUsuarioPorId).toHaveBeenCalledWith(userId);
            expect(result).toBe(true);
        });
    });

    describe('encontrarMotoristas', () => {
        it('should find all drivers', async () => {
            const drivers = [{ id: '123', name: 'John Doe' }];
            UsuarioRepository.encontrarMotoristas.mockResolvedValue(drivers);

            const result = await UsuarioService.encontrarMotoristas();

            expect(UsuarioRepository.encontrarMotoristas).toHaveBeenCalled();
            expect(result).toEqual(drivers);
        });
    });

    describe('encontrarTodosUsuarios', () => {
        it('should find all users', async () => {
            const users = [{ id: '123', name: 'John Doe' }];
            UsuarioRepository.encontrarTodosUsuarios.mockResolvedValue(users);

            const result = await UsuarioService.encontrarTodosUsuarios();

            expect(UsuarioRepository.encontrarTodosUsuarios).toHaveBeenCalled();
            expect(result).toEqual(users);
        });
    });
});