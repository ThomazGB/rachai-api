const mongoose = require('mongoose');
const Usuario = require('../../models/schemas').Usuario;

const {
    encontrarUsuarioPorId,
    encontrarUsuarioPorEmail,
    atualizarUsuarioPorId,
    deletarUsuarioPorId,
    encontrarMotoristas,
    encontrarTodosUsuarios
} = require('../../repositories/UsuarioRepository');

jest.mock('../../models/schemas', () => ({
    Usuario: {
        create: jest.fn().mockImplementation((data) => Promise.resolve(data)),
        findById: jest.fn(),
        findOne: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        find: jest.fn()
    }
}));

describe('UsuarioRepository', () => {
    beforeAll(async () => {
        const URI = process.env.MONGO_URI_QA || 'mongodb://127.0.0.1:27017/Rachai_Teste';
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar um novo usuário', async () => {
        const usuarioData = { 
            nome: 'Teste', 
            email: 'teste@example.com', 
            ra: '20240123456789', 
            curso: 'CD', 
            score: 4.0, 
            tipo_usuario: 'PASSAGEIRO' 
        };
        Usuario.create.mockResolvedValue(usuarioData);

        const usuario = await Usuario.create(usuarioData);

        expect(Usuario.create).toHaveBeenCalled();
        expect(usuario).toEqual(usuarioData);
    });

    it('deve encontrar um usuário por ID', async () => {
        const usuarioId = '123';
        const usuarioData = { _id: usuarioId, nome: 'Teste' };
        Usuario.findById.mockResolvedValue(usuarioData);

        const usuario = await encontrarUsuarioPorId(usuarioId);

        expect(Usuario.findById).toHaveBeenCalledWith(usuarioId);
        expect(usuario).toEqual(usuarioData);
    });

    it('deve encontrar um usuário por email', async () => {
        const email = 'teste@example.com';
        const usuarioData = { _id: '123', email: email };
        Usuario.findOne.mockResolvedValue(usuarioData);

        const usuario = await encontrarUsuarioPorEmail(email);

        expect(Usuario.findOne).toHaveBeenCalledWith({ email });
        expect(usuario).toEqual(usuarioData);
    });

    it('deve atualizar um usuário por ID', async () => {
        const usuarioId = '123';
        const usuarioData = { nome: 'Teste Atualizado' };
        Usuario.findByIdAndUpdate.mockResolvedValue(usuarioData);

        const usuario = await atualizarUsuarioPorId(usuarioId, usuarioData);

        expect(Usuario.findByIdAndUpdate).toHaveBeenCalledWith(usuarioId, usuarioData, { new: true });
        expect(usuario).toEqual(usuarioData);
    });

    it('deve deletar um usuário por ID', async () => {
        const usuarioId = '123';
        Usuario.findByIdAndDelete.mockResolvedValue({ _id: usuarioId });

        const usuario = await deletarUsuarioPorId(usuarioId);

        expect(Usuario.findByIdAndDelete).toHaveBeenCalledWith(usuarioId);
        expect(usuario).toEqual({ _id: usuarioId });
    });

    it('deve encontrar todos os motoristas', async () => {
        const motoristas = [{ nome: 'Motorista 1' }, { nome: 'Motorista 2' }];
        Usuario.find.mockResolvedValue(motoristas);

        const resultado = await encontrarMotoristas();

        expect(Usuario.find).toHaveBeenCalledWith({ tipo_usuario: 'MOTORISTA' });
        expect(resultado).toEqual(motoristas);
    });

    it('deve encontrar todos os usuários', async () => {
        const usuarios = [{ nome: 'Usuário 1' }, { nome: 'Usuário 2' }];
        Usuario.find.mockResolvedValue(usuarios);

        const resultado = await encontrarTodosUsuarios();

        expect(Usuario.find).toHaveBeenCalled();
        expect(resultado).toEqual(usuarios);
    });
});