const multer = require('multer');
const path = require('path');
const Usuario = require('../models/schemas').Usuario;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = path.join(__dirname, '../upload/fotos_perfil');
        cb(null, dir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

async function uploadImagem(req, res) {
    const uploadPromise = new Promise((resolve, reject) => {
        upload.single('imagem')(req, res, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(req.file.path);
            }
        });
    });

    try {
        const filePath = await uploadPromise;
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }
        usuario.fotoPerfil = filePath;
        await usuario.save();
        res.status(200).send({ message: 'Imagem enviada com sucesso!' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

module.exports = {
    uploadImagem
};