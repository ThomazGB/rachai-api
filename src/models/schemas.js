const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./db');

const AuthSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, { collection: 'Auth' });

const UsuarioSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    img_url: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    ra: {
        type: Number,
        required: true
    },
    curso: {
        type: String,
        enum: ['GE', 'GPI', 'CD', 'DSM', 'CE', 'DP'],
        required: true
    },
    score: {
        type: Number,
        required: false
    },
    tipo_usuario: {
        type: String,
        enum: ['MOTORISTA', 'PASSAGEIRO'],
        required: true
    },
    veiculos: [{
        modelo: {
            type: String,
            required: false
        },
        cor: {
            type: String,
            required: false
        },
        placa: {
            type: String,
            required: false
        }
    }]
}, { collection: 'Usuario' });

const ViagemSchema = new Schema({
    status: {
        type: String,
        enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'],
        required: true
    },
    local_partida: {
        type: String,
        required: true
    },
    destino: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    usuarios: [{
        id: {
            type: String,
            required: true
        },
        nome: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        tipo_usuario: {
            type: String,
            enum: ['MOTORISTA', 'PASSAGEIRO'],
            required: true
        },
    }],
    pagamento: [{
        metodo: {
            type: String,
            enum: ['NULL', 'PIX', 'CARTAO_CREDITO'],
            required: true
        },
        valor: {
            type: Number,
            required: true
        },
    }],
    avaliacao: [{
        nota: {
            type: Number,
            required: true
        },
        feedback: {
            type: String,
            required: true
        }
    }],
}, { collection: 'Viagem' });

const Auth = mongoose.model('Auth', AuthSchema);
const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Viagem = mongoose.model('Viagem', ViagemSchema);

module.exports = {
    Auth,
    Usuario,
    Viagem
};