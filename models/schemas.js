const db = require('./db');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    tipo: {
        type: Enumerator('motorista', 'usuario'),
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, { collection: 'Auth' });

const MotoristaSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    ra: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    curso: {
        type: String,
        required: true
    },
    veiculos: [{
        modelo: {
            type: String,
            required: true
        },
        cor: {
            type: String,
            required: true
        },
        placa: {
            type: String,
            required: true
        }
    }]
}, { collection: 'Motorista' });

const UsuarioSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    ra: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    curso: {
        type: String,
        required: true
    }
}, { collection: 'Usuario' });

const ViagemSchema = new Schema({
    usuario_nome: {
        type: String,
        required: true
    },
    motorista_nome: {
        type: String,
        required: true
    },
    status: {
        type: Enumerator('pendente', 'confirmada', 'cancelada'),
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
    }
}, { collection: 'Viagem' });

const AvaliacaoSchema = new Schema({
    viagem_id: {
        type: String,
        required: true
    },
    avaliacao: {
        type: Number,
        required: true
    },
    feedback: {
        type: Text,
        required: true
    }
}, { collection: 'Avaliacao' });

const PagamentoSchema = new Schema({
    viagem_id: {
        type: String,
        required: true
    },
    metodo: {
        type: String,
        required: true
    },
    quantia: {
        type: Number,
        required: true
    }
}, { collection: 'Pagamento' });

const Auth = mongoose.model('Auth', AuthSchema);
const Motorista = mongoose.model('Motorista', MotoristaSchema);
const Usuario = mongoose.model('Usuario', UsuarioSchema);
const Viagem = mongoose.model('Viagem', ViagemSchema);
const Avaliacao = mongoose.model('Avaliacao', AvaliacaoSchema);
const Pagamento = mongoose.model('Pagamento', PagamentoSchema);

module.exports = {
    Auth,
    Motorista,
    Usuario,
    Viagem,
    Avaliacao,
    Pagamento
}