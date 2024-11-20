const Auth = require('./../models/schemas').Auth;

const registro = async (authData) => {
    const auth = new Auth(authData);
    await auth.save();
    return auth;
};

const encontrarAuthPorEmail = async (email) => {
    return await Auth.findOne({ email });
};

const login = async (email) => {
    return await Auth.findOne({ email });
};

const alterarSenha = async (id, usuarioData) => {
    return await Auth.findByIdAndUpdate(id, usuarioData, { new: true });
};

const logout = async (email) => {
    return await Auth.findOneAndUpdate({ email }, { token: '' }, { new: true });
};

module.exports = {
    registro,
    encontrarAuthPorEmail,
    login,
    alterarSenha,
    logout
};