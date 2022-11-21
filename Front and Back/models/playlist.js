const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    nome: String,
    imagem: String,
    desc: String
}, { collection: 'users' });

module.exports = { PlaylistSchema: playlistSchema }