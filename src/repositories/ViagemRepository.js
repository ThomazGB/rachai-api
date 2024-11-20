const Viagem = require('./../models/schemas').Viagem;

const criarViagem = async (viagemData) => {
    const viagem = new Viagem(viagemData);
    await viagem.save();
    return viagem;
};

const encontrarViagemPorId = async (id) => {
    return await Viagem.findById(id);
};

const atualizarViagemPorId = async (id, viagemData) => {
    return await Viagem.findByIdAndUpdate(id, viagemData, { new: true });
};

const deletarViagemPorId = async (id) => {
    return await Viagem.findByIdAndDelete(id);
};

const encontrarTodasViagens = async () => {
    return await Viagem.find();
};

const encontrarViagensPorUsuarioId = async (usuarioId) => {
    return await Viagem.find({ 'usuarios.id': usuarioId });
};

module.exports = {
    criarViagem,
    encontrarViagemPorId,
    atualizarViagemPorId,
    deletarViagemPorId,
    encontrarTodasViagens,
    encontrarViagensPorUsuarioId
};