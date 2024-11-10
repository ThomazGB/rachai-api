const { registro, login, alterarSenha, logout } = require('./../../repositories/AuthRepository');
const { Auth } = require('./../../models/schemas');
const mongoose = require('mongoose');


describe('AuthRepository', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
        const URI = process.env.MONGO_URI_QA || 'mongodb://127.0.0.1:27017/Rachai_Teste';
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        }
    });

    afterAll(async () => {
        if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        }
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('registro should create a new user', async () => {
        const usuarioData = { email: 'test@example.com', senha: 'Senha*123*', token: 'someToken' };
        const usuario = await registro(usuarioData);
        expect(usuario.email).toBe(usuarioData.email);
    });

    test('login should find a user by email', async () => {
        const usuarioData = { email: 'test@example.com', senha: 'Senha*123*', token: 'someToken' };
        await new Auth(usuarioData).save();
        const usuario = await login(usuarioData.email);
        expect(usuario.email).toBe(usuarioData.email);
    });

    test('alterarSenha should update user senha', async () => {
        const usuarioData = { email: 'test@example.com', senha: 'Senha*123*', token: 'someToken' };
        const usuario = await new Auth(usuarioData).save();
        const updatedData = { senha: 'Newsenha##123' };
        const updatedUsuario = await alterarSenha(usuario._id, updatedData);
        expect(updatedUsuario.senha).toBe(updatedData.senha);
    });
});