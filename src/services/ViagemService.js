const ViagemRepository = require('./../repositories/ViagemRepository');

const criarViagem = async (viagemData) => {
    return await ViagemRepository.criarViagem(viagemData);
};

const encontrarViagemPorId = async (id) => {
    return await ViagemRepository.encontrarViagemPorId(id);
};

const atualizarViagemPorId = async (id, viagemData) => {
    return await ViagemRepository.atualizarViagemPorId(id, viagemData);
};

const deletarViagemPorId = async (id) => {
    return await ViagemRepository.deletarViagemPorId(id);
};

const encontrarTodasViagens = async () => {
    return await ViagemRepository.encontrarTodasViagens();
};

module.exports = {
    criarViagem,
    encontrarViagemPorId,
    atualizarViagemPorId,
    deletarViagemPorId,
    encontrarTodasViagens
};