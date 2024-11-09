const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { fromEnv } = require('@aws-sdk/credential-provider-env');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Usuario = require('./../models/schemas').Usuario;
require('dotenv').config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: fromEnv()
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            const userId = req.params.id;
            const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
            const filePath = `imagens/${userId}/${fileName}`;
            cb(null, filePath);
        },
        contentDisposition: function (req, file, cb) {
            cb(null, 'inline');
        }
    }),
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Apenas arquivos de imagem são permitidos (jpeg, jpg, png, webp)'));
        }
    }
});

const uploadImagem = async (req, res) => {
    try {
        const uploadPromise = new Promise((resolve, reject) => {
            upload.single('imagem')(req, res, function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(req.file);
            });
        });
        const file = await uploadPromise;
        if (!file) {
            throw new Error('Arquivo não encontrado');
        }
        const { id } = req.params;
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        usuario.img_url = file.location;
        await usuario.save();
        return file.location;
    } catch (error) {
        if (error.message === 'Arquivo não encontrado') {
            res.status(400).json({ error: error.message });
        } else if (error.message === 'Usuário não encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
};

module.exports = {
    uploadImagem
};