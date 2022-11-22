const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nome: String,
    email: String,
    senha: String
}, { collection: 'tmp' });

module.exports = { UserSchema: userSchema }