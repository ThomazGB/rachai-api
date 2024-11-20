const ViagemService = require('../../services/ViagemService');
const ViagemRepository = require('../../repositories/ViagemRepository');
const UsuarioService = require('../../services/UsuarioService');

jest.mock('../../repositories/ViagemRepository');
jest.mock('../../services/UsuarioService');

describe('ViagemService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('criarViagem', () => {
        it('should create a new viagem', async () => {
            const viagemData = { destino: 'Paris' };
            ViagemRepository.criarViagem.mockResolvedValue(viagemData);

            const result = await ViagemService.criarViagem(viagemData);

            expect(result).toEqual(viagemData);
            expect(ViagemRepository.criarViagem).toHaveBeenCalledWith(viagemData);
        });
    });

    describe('encontrarViagemPorId', () => {
        it('should find a viagem by id', async () => {
            const viagem = { id: 1, destino: 'Paris' };
            ViagemRepository.encontrarViagemPorId.mockResolvedValue(viagem);

            const result = await ViagemService.encontrarViagemPorId(1);

            expect(result).toEqual(viagem);
            expect(ViagemRepository.encontrarViagemPorId).toHaveBeenCalledWith(1);
        });
    });

    describe('atualizarViagemPorId', () => {
        it('should update a viagem by id', async () => {
            const viagemData = { destino: 'London' };
            ViagemRepository.atualizarViagemPorId.mockResolvedValue(viagemData);

            const result = await ViagemService.atualizarViagemPorId(1, viagemData);

            expect(result).toEqual(viagemData);
            expect(ViagemRepository.atualizarViagemPorId).toHaveBeenCalledWith(1, viagemData);
        });
    });

    describe('deletarViagemPorId', () => {
        it('should delete a viagem by id', async () => {
            ViagemRepository.deletarViagemPorId.mockResolvedValue(true);

            const result = await ViagemService.deletarViagemPorId(1);

            expect(result).toBe(true);
            expect(ViagemRepository.deletarViagemPorId).toHaveBeenCalledWith(1);
        });
    });

    describe('encontrarTodasViagens', () => {
        it('should find all viagens', async () => {
            const viagens = [{ id: 1, destino: 'Paris' }];
            ViagemRepository.encontrarTodasViagens.mockResolvedValue(viagens);

            const result = await ViagemService.encontrarTodasViagens();

            expect(result).toEqual(viagens);
            expect(ViagemRepository.encontrarTodasViagens).toHaveBeenCalled();
        });
    });

    describe('encontrarViagensPorUsuarioId', () => {
        it('should find viagens by usuario id', async () => {
            const usuario = { id: 1, nome: 'John Doe' };
            const viagens = [{ id: 1, destino: 'Paris' }];
            UsuarioService.encontrarUsuarioPorId.mockResolvedValue(usuario);
            ViagemRepository.encontrarViagensPorUsuarioId.mockResolvedValue(viagens);

            const result = await ViagemService.encontrarViagensPorUsuarioId(1);

            expect(result).toEqual(viagens);
            expect(UsuarioService.encontrarUsuarioPorId).toHaveBeenCalledWith(1);
            expect(ViagemRepository.encontrarViagensPorUsuarioId).toHaveBeenCalledWith(1);
        });

        it('should throw an error if usuario not found', async () => {
            UsuarioService.encontrarUsuarioPorId.mockResolvedValue(null);

            await expect(ViagemService.encontrarViagensPorUsuarioId(1)).rejects.toThrow('Usuário não encontrado!');
            expect(UsuarioService.encontrarUsuarioPorId).toHaveBeenCalledWith(1);
        });
    });
});