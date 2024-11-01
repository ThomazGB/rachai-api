const multer = require('multer');
const path = require('path');
const { uploadImagem } = require('../../services/UsuarioService');
const Usuario = require('./../../models/schemas').Usuario;

jest.mock('multer', () => {
    const mMulter = {
        diskStorage: jest.fn(() => ({
            _handleFile: jest.fn(),
            _removeFile: jest.fn()
        })),
        single: jest.fn(() => (req, res, next) => {
            req.file = { filename: './../images/rachai.png' };
            next();
        })
    };
    return Object.assign(() => mMulter, mMulter);
});
jest.mock('path');
jest.mock('./../../models/schemas');

describe('UsuarioService', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: '123' },
            file: { path: './images/rachai.png' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        Usuario.findById = jest.fn().mockResolvedValue({
            save: jest.fn().mockResolvedValue(true)
        });
    });

    it('should return 404 if user is not found', async () => {
        Usuario.findById.mockResolvedValue(null);

        await uploadImagem(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({ message: 'Usuário não encontrado' });
    });

    it('should upload an image and update the user', async () => {
        await uploadImagem(req, res);

        expect(Usuario.findById).toHaveBeenCalledWith('123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ message: 'Imagem enviada com sucesso!' });
    });

    it('should return 500 if there is an error during save', async () => {
        Usuario.findById.mockResolvedValue({
            save: jest.fn().mockRejectedValue(new Error('Save error'))
        });

        await uploadImagem(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ message: 'Save error' });
    });
});