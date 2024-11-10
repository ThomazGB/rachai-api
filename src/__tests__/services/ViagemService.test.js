const ViagemService = require('../../services/ViagemService');
const ViagemRepository = require('../../repositories/ViagemRepository');

jest.mock('../../repositories/ViagemRepository');

describe('ViagemService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('criarViagem', () => {
        it('should create a new viagem', async () => {
            const viagemData = { destino: 'Paris', data: '2023-10-10' };
            ViagemRepository.criarViagem.mockResolvedValue(viagemData);

            const result = await ViagemService.criarViagem(viagemData);

            expect(result).toEqual(viagemData);
            expect(ViagemRepository.criarViagem).toHaveBeenCalledWith(viagemData);
        });
    });

    describe('encontrarViagemPorId', () => {
        it('should find a viagem by id', async () => {
            const viagemData = { id: 1, destino: 'Paris', data: '2023-10-10' };
            ViagemRepository.encontrarViagemPorId.mockResolvedValue(viagemData);

            const result = await ViagemService.encontrarViagemPorId(1);

            expect(result).toEqual(viagemData);
            expect(ViagemRepository.encontrarViagemPorId).toHaveBeenCalledWith(1);
        });
    });

    describe('atualizarViagemPorId', () => {
        it('should update a viagem by id', async () => {
            const viagemData = { destino: 'London', data: '2023-11-11' };
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
            const viagens = [
                { id: 1, destino: 'Paris', data: '2023-10-10' },
                { id: 2, destino: 'London', data: '2023-11-11' }
            ];
            ViagemRepository.encontrarTodasViagens.mockResolvedValue(viagens);

            const result = await ViagemService.encontrarTodasViagens();

            expect(result).toEqual(viagens);
            expect(ViagemRepository.encontrarTodasViagens).toHaveBeenCalled();
        });
    });
});