const ViagemRepository = require('./../repositories/ViagemRepository');
const UsuarioService = require('./../services/UsuarioService');

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

const encontrarViagensPorUsuarioId = async (usuarioId) => {
    const usuario = await UsuarioService.encontrarUsuarioPorId(usuarioId);
    if (!usuario) {
        throw new Error('Usuário não encontrado!');
    }
    return await ViagemRepository.encontrarViagensPorUsuarioId(usuarioId);
};

module.exports = {
    criarViagem,
    encontrarViagemPorId,
    atualizarViagemPorId,
    deletarViagemPorId,
    encontrarTodasViagens,
    encontrarViagensPorUsuarioId
};