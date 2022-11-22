const mongoose = require('mongoose')

const Schema = mongoose.Schema

const musicSchema = new Schema({
    nomeMusica: String,
    nomeArtista: String,
    nomeAlbum: String,
    previewMusica: String,
    imagem: String,
})

module.exports = { MusicSchema: musicSchema }