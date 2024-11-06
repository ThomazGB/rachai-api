require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const db = require('../../models/db');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const URI = process.env.MONGO_URI_QA || 'mongodb://127.0.0.1:27017/Rachai_Teste';

    await mongoose.disconnect();
    await mongoose.connect(URI, {
    });
}, 20000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

test('should connect to MongoDB', (done) => {
    db.on('connected', () => {
        expect(mongoose.connection.readyState).toBe(1);
        done();
    });

    mongoose.disconnect().then(() => {
        mongoose.connect(mongoServer.getUri(), {
        }).catch((err) => done(err));
    }).catch((err) => done(err));
}, 20000);

test('should handle connection error', (done) => {
    mongoose.connection.on('error', (error) => {
        expect(error).toBeDefined();
        done();
    });

    mongoose.connect('invalid-uri', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 60000,
        socketTimeoutMS: 60000,
        connectTimeoutMS: 60000
    }).catch(() => {});
}, 10000);


test('should disconnect from MongoDB', (done) => {
    mongoose.disconnect().then(() => {
        expect(mongoose.connection.readyState).toBe(0);
        done();
    }).catch((err) => done(err));
}, 20000);

test('should reconnect to MongoDB', (done) => {
    mongoose.connection.on('connected', () => {
        expect(mongoose.connection.readyState).toBe(1);
        done();
    });

    mongoose.disconnect().then(() => {
        mongoose.connect(mongoServer.getUri(), {
        });
    });
}, 10000);
