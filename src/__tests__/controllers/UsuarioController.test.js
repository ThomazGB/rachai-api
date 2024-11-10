const request = require('supertest');
const express = require('express');
const router = require('../../controllers/UsuarioController');
const UsuarioService = require('../../services/UsuarioService');

const app = express();
app.use(express.json());
app.use('/api', router);

jest.mock('../../services/UsuarioService');

describe('UsuarioController', () => {
    describe('POST /api/criar_usuario', () => {
        it('should create a new user and return 201', async () => {
            const mockUser = { id: 1, name: 'Test User' };
            UsuarioService.criarUsuario.mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/api/criar_usuario')
                .send({ name: 'Test User' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'Usuário cadastrado com sucesso!', usuario: mockUser });
        });

        it('should return 500 if there is an error', async () => {
            UsuarioService.criarUsuario.mockRejectedValue(new Error('Erro ao cadastrar usuário'));

            const response = await request(app)
                .post('/api/criar_usuario')
                .send({ name: 'Test User' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ erro: 'Erro ao cadastrar usuário' });
        });
    });

    describe('POST /api/usuario/:id/upload', () => {
        it('should upload an image and return 200', async () => {
            const mockDir = 'path/to/image.jpg';
            UsuarioService.uploadImagem.mockResolvedValue(mockDir);

            const response = await request(app)
                .post('/api/usuario/1/upload')
                .send();

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ img_url: mockDir });
        });

        it('should return 500 if there is an error', async () => {
            UsuarioService.uploadImagem.mockRejectedValue(new Error('Erro ao fazer upload'));

            const response = await request(app)
                .post('/api/usuario/1/upload')
                .send();

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ erro: 'Erro ao fazer upload' });
        });
    });

    describe('GET /api/', () => {
        it('should return all users and return 200', async () => {
            const mockUsers = [{ id: 1, name: 'Test User' }];
            UsuarioService.encontrarTodosUsuarios.mockResolvedValue(mockUsers);

            const response = await request(app).get('/api/');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUsers);
        });

        it('should return 500 if there is an error', async () => {
            UsuarioService.encontrarTodosUsuarios.mockRejectedValue(new Error('Erro ao buscar usuários'));

            const response = await request(app).get('/api/');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ erro: 'Erro ao buscar usuários' });
        });
    });

    describe('GET /api/usuario/motoristas', () => {
        it('should return all drivers and return 200', async () => {
            const mockDrivers = [{ id: 1, name: 'Test Driver' }];
            UsuarioService.encontrarMotoristas.mockResolvedValue(mockDrivers);

            const response = await request(app).get('/api/usuario/motoristas');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockDrivers);
        });

        it('should return 404 if no drivers are found', async () => {
            UsuarioService.encontrarMotoristas.mockResolvedValue([]);

            const response = await request(app).get('/api/usuario/motoristas');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ erro: 'Infelizmente não encontramos nenhum motorista na sua área!' });
        });

        it('should return 500 if there is an error', async () => {
            UsuarioService.encontrarMotoristas.mockRejectedValue(new Error('Erro ao buscar motoristas'));

            const response = await request(app).get('/api/usuario/motoristas');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ erro: 'Erro ao buscar motoristas' });
        });
    });

    describe('GET /api/usuario/:id', () => {
        it('should return a user by id and return 200', async () => {
            const mockUser = { id: 1, name: 'Test User' };
            UsuarioService.encontrarUsuarioPorId.mockResolvedValue(mockUser);

            const response = await request(app).get('/api/usuario/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
        });

        it('should return 404 if user is not found', async () => {
            UsuarioService.encontrarUsuarioPorId.mockResolvedValue(null);

            const response = await request(app).get('/api/usuario/1');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ erro: 'Usuário não encontrado!' });
        });

        it('should return 500 if there is an error', async () => {
            UsuarioService.encontrarUsuarioPorId.mockRejectedValue(new Error('Erro ao encontrar o usuário'));

            const response = await request(app).get('/api/usuario/1');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ erro: 'Erro ao encontrar o usuário' });
        });
    });

    describe('POST /api/usuario_email', () => {
        it('should return a user by email and return 200', async () => {
            const mockUser = { id: 1, email: 'test@example.com' };
            UsuarioService.encontrarUsuarioPorEmail.mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/api/usuario_email')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
        });

        it('should return 404 if user is not found', async () => {
            UsuarioService.encontrarUsuarioPorEmail.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/usuario_email')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ erro: 'Usuário não encontrado!' });
        });

        it('should return 500 if there is an error', async () => {
            UsuarioService.encontrarUsuarioPorEmail.mockRejectedValue(new Error('Erro ao encontrar o usuário'));

            const response = await request(app)
                .post('/api/usuario_email')
                .send({ email: 'test@example.com' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ erro: 'Erro ao encontrar o usuário' });
        });
    });

    describe('PUT /api/editar_usuario/:id', () => {
        it('should update a user by id and return 200', async () => {
            const mockUser = { id: 1, name: 'Updated User' };
            UsuarioService.atualizarUsuarioPorId.mockResolvedValue(mockUser);

            const response = await request(app)
                .put('/api/editar_usuario/1')
                .send({ name: 'Updated User' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Usuário atualizado com sucesso!', usuario: mockUser });
        });

        it('should return 404 if user is not found', async () => {
            UsuarioService.atualizarUsuarioPorId.mockResolvedValue(null);

            const response = await request(app)
                .put('/api/editar_usuario/1')
                .send({ name: 'Updated User' });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ erro: 'Usuário não encontrado!' });
        });

        it('should return 500 if there is an error', async () => {
            UsuarioService.atualizarUsuarioPorId.mockRejectedValue(new Error('Erro ao atualizar o usuário'));

            const response = await request(app)
                .put('/api/editar_usuario/1')
                .send({ name: 'Updated User' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ erro: 'Erro ao atualizar o usuário' });
        });
    });

    describe('DELETE /api/deletar_usuario/:id', () => {
        it('should delete a user by id and return 200', async () => {
            UsuarioService.deletarUsuarioPorId.mockResolvedValue(true);

            const response = await request(app).delete('/api/deletar_usuario/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Usuário deletado com sucesso!' });
        });

        it('should return 404 if user is not found', async () => {
            UsuarioService.deletarUsuarioPorId.mockResolvedValue(false);

            const response = await request(app).delete('/api/deletar_usuario/1');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ erro: 'Usuário não encontrado!' });
        });

        it('should return 500 if there is an error', async () => {
            UsuarioService.deletarUsuarioPorId.mockRejectedValue(new Error('Erro ao deletar o usuário'));

            const response = await request(app).delete('/api/deletar_usuario/1');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ erro: 'Erro ao deletar o usuário' });
        });
    });
});