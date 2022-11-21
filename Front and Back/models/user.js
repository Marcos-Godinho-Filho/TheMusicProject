const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nome: String,
    email: String,
    senha: String,
    imagemPerfil: String,
    desc: String
}, { collection: 'users' });

module.exports = { UserSchema: userSchema }