const mongoose = require('mongoose');
const Viagem = require('../../models/schemas').Viagem;

const {
    encontrarViagemPorId,
    atualizarViagemPorId,
    deletarViagemPorId,
    encontrarTodasViagens,
    encontrarViagensPorUsuarioId,
} = require('./../../repositories/ViagemRepository');

jest.mock('./../../models/schemas', () => ({
    Viagem: {
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        find: jest.fn(),
        save: jest.fn(),
        create: jest.fn()
    }
}));

describe('ViagemRepository', () => {
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

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('criarViagem', () => {
        it('deve criar uma nova viagem', async () => {
            const viagemData = {
                status: 'EM_ANDAMENTO',
                local_partida: '-23.597910548141385, -46.88896047131594',
                destino: '-23.5978449721046, 46.926853787987255',
                usuarios: [
                    {
                        nome: 'Teste 1',
                        email: 'teste@teste.com.br',
                        tipo_usuario: 'PASSAGEIRO'
                    },
                    {
                        nome: 'Teste 3',
                        email: 'teste3@teste.com.br',
                        tipo_usuario: 'MOTORISTA'
                    }
                ],
                pagamento: [
                    {
                        metodo: 'PIX',
                        valor: 5.62
                    }
                ],
                avaliacao: [
                    {
                        nota: 0,
                        feedback: 'Teste teste teste teste.'
                    }
                ]
            };
            Viagem.create.mockResolvedValue(viagemData);

            const viagem = await Viagem.create(viagemData);

            expect(Viagem.create).toHaveBeenCalled();
            expect(viagem).toEqual(viagemData);
        });
    });

    describe('encontrarViagemPorId', () => {
        it('deve encontrar uma viagem por ID', async () => {
            const viagemId = '123';
            const viagemData = { _id: viagemId, name: 'Test Viagem' };
            Viagem.findById.mockResolvedValue(viagemData);

            const result = await encontrarViagemPorId(viagemId);

            expect(Viagem.findById).toHaveBeenCalledWith(viagemId);
            expect(result).toEqual(viagemData);
        });
    });

    describe('atualizarViagemPorId', () => {
        it('deve atualizar uma viagem por ID', async () => {
            const viagemId = '123';
            const viagemData = { name: 'Updated Viagem' };
            Viagem.findByIdAndUpdate.mockResolvedValue(viagemData);

            const result = await atualizarViagemPorId(viagemId, viagemData);

            expect(Viagem.findByIdAndUpdate).toHaveBeenCalledWith(viagemId, viagemData, { new: true });
            expect(result).toEqual(viagemData);
        });
    });

    describe('deletarViagemPorId', () => {
        it('deve deletar uma viagem por ID', async () => {
            const viagemId = '123';
            Viagem.findByIdAndDelete.mockResolvedValue({ _id: viagemId });

            const result = await deletarViagemPorId(viagemId);

            expect(Viagem.findByIdAndDelete).toHaveBeenCalledWith(viagemId);
            expect(result).toEqual({ _id: viagemId });
        });
    });

    describe('encontrarTodasViagens', () => {
        it('deve encontrar todas as viagens', async () => {
            const viagens = [{ name: 'Viagem 1' }, { name: 'Viagem 2' }];
            Viagem.find.mockResolvedValue(viagens);

            const result = await encontrarTodasViagens();

            expect(Viagem.find).toHaveBeenCalled();
            expect(result).toEqual(viagens);
        });
    });

    describe('encontrarViagensPorUsuarioId', () => {
        it('deve encontrar viagens por ID de usuário', async () => {
            const usuarioId = '456';
            const viagens = [
                { name: 'Viagem 1', usuarios: [{ id: usuarioId }] },
                { name: 'Viagem 2', usuarios: [{ id: usuarioId }] }
            ];
            Viagem.find.mockResolvedValue(viagens);

            const result = await encontrarViagensPorUsuarioId(usuarioId);

            expect(Viagem.find).toHaveBeenCalledWith({ 'usuarios.id': usuarioId });
            expect(result).toEqual(viagens);
        });
    });
});
