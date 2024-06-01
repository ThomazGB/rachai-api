const multer = require('multer');
const path = require('path');
const port = process.env.PORT;
const Usuario = require('../models/schemas').Usuario;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = path.join(__dirname, '../upload/fotos_perfil');
        cb(null, dir);
        console.log(dir);
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

    const dir = await uploadPromise;
    const usuario = await Usuario.findById(req.params.id);
    usuario.img_url = dir;
    await usuario.save();

    return dir;
}

module.exports = { uploadImagem };