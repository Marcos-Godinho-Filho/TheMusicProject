const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    nome: String,
    imagem: String,
    desc: String,  
    songs: Array
}, { collection: 'tmp' });

module.exports = { PlaylistSchema: playlistSchema }