const Usuario = require('../models/schemas').Usuario;

const criarUsuario = async (usuarioData) => {
    const usuario = new Usuario(usuarioData);
    await usuario.create();
    return usuario;
};

const encontrarUsuarioPorId = async (id) => {
    return await Usuario.findById(id);
};

const encontrarUsuarioPorEmail = async (email) => {
    return await Usuario.findOne({ email });
};

const atualizarUsuarioPorId = async (id, usuarioData) => {
    return await Usuario.findByIdAndUpdate(id, usuarioData, { new: true });
};

const deletarUsuarioPorId = async (id) => {
    return await Usuario.findByIdAndDelete(id);
};

const encontrarMotoristas = async () => {
    return await Usuario.find({ tipo_usuario: 'MOTORISTA' });
};

const encontrarTodosUsuarios = async () => {
    return await Usuario.find();
};

module.exports = {
    criarUsuario,
    encontrarUsuarioPorId,
    encontrarUsuarioPorEmail,
    atualizarUsuarioPorId,
    deletarUsuarioPorId,
    encontrarMotoristas,
    encontrarTodosUsuarios
};