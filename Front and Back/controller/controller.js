const axios = require('axios');
const path = require('path');

const db = require('../database/db');
const user = require('../models/user');
const playlist = require('../models/playlist');
const { Schema } = require('mongoose');


const Users = db.Mongoose.model('esquemaUsuario', user.UserSchema, 'users');
const Playlists = db.Mongoose.model('esquemaPlaylist', playlist.PlaylistSchema, 'playlists');

const pattern = __dirname.substring(0, 45);


let retorno = [];

exports.searchFromAPI = ('/:email/search', async (req, res) => {

    retorno = [];

    let email = req.params.email;
    let parcel = req.query.parcel;

    try {
        if (checkExistentUser(email)) {
            const optionsAxios = {
                method: 'GET',
                url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
                params: { q: `${parcel}` },
                headers: {
                    'X-RapidAPI-Key': 'b6673e4b40mshb71dfa28e006655p1cdcfdjsn1c72cddfef35',
                    'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
                }
            };

            axios.request(optionsAxios).then(function (response) {
                for (let musica of response.data['data']) {
                    retorno.push({
                        "title_short": musica["title_short"],
                        "artist": musica["artist"]["name"],
                        "album": musica["album"]["title"],
                        "image": musica["album"]["cover_medium"],
                        "preview": musica["preview"]
                    });

                }
            }).catch(function (error) {
                console.error(error);
            });
            if (!parcel) {
                return res.status(400).send({ status: 'failed' });
            }
            res.status(200).send({ status: 'received' });
        }
        else { res.json({ found: false }) }
    }
    catch (erro) { throw new Error(erro); }
});

exports.getDataSearch = ('/:email/search', async (req, res) => {
    res.sendFile(path.join(pattern + '/public/search/index.html'));

    let email = req.params.email;
    try {
        if (checkExistentUser(email)) {
            res.status(200).json({ info: retorno });
            retorno = [];
        }
        else { res.json({ found: false }) }
    }
    catch (erro) { throw new Error(erro); }

    const playlists = await Playlists.find();

    try {
        res.status(200).json({ playlists: playlists });  
    }
    catch (erro) { throw new Error (erro); }
});

exports.getDataHome = ('/:id/home', async (req, res) => {
    res.sendFile(path.join(pattern + '/public/Home/home.html'));

    const playlists = await Playlists.find();

    try {
        res.status(200).json({ playlists: playlists });  
    }
    catch (erro) { throw new Error (erro); }
})

exports.getDataPlaylist = ('/:id/playlist/:idPl', async (req, res) => {
    res.sendFile(path.join(pattern + '/public/Playlist/playlist.html'));

    const playlists = await Playlists.find();

    try {
        res.status(200).json({ playlists: playlists });  
    }
    catch (erro) { throw new Error (erro); }

    
})

async function isUserExistent(email){

    let listaUsuarios = await Users.find({email:email}).lean().exec();
    console.log(listaUsuarios.length > 0);
    if (listaUsuarios.length > 0) return true;
    
    return false;
}

exports.insertNewUser = ('/registration', async (req, res) => {

    const parcel = req.body.parcel;
    let email = parcel[0];
    let nome = parcel[1];
    let senha = parcel[2];

    let result = await isUserExistent(email);
    if (!result) {
        // Errado, falta coisa que ta no esquema
        let usuario = new Users({ nome, email, senha });
        console.log(usuario);

        try {
            //await usuario.save();
            usuario.save((err) => {
                if (err) return handleError(err); // saved!
              });
            // Redirecionar para home
        }
        catch (err) { next(err); }
    }
    else { res.json({ success: false }); } // Existe no banco de dados
});


exports.setNewPassword = ('/password-recovery', async (req, res) => {
    const parcel = req.body.parcel;

    let email = parcel[0];
    let novaSenha = parcel[1];

    let result = await isUserExistent(email);
    if (result) {
        await Users.updateOne({ email: email }, { $set: { senha: novaSenha } });
        // Redirecionar para home
    }
    else { res.json({ success: false }); } // Não existe no banco de dados
});


exports.checkValidation = ('/authentication', async (req, res) => {

    const parcel = req.body.parcel;
    let email = parcel[0];
    let senha = parcel[1];

    let listaUsuarios = await Users.find({email:email,senha:senha}).lean().exec();
    if (listaUsuarios.length > 0) { res.json({ success: true }); console.log("LOGADO"); }
    else { res.json({ success: false }); console.log("NAO LOGADO"); }
});

isPlaylistExistent = async (idPlaylist) => {
    if (await Playlists.findById({ "_id": idPlaylist }) !== null)
        return true;

    return false;
}


exports.insertNewPlaylist = ('/:id/home/insertPlaylist', async (req, res) => {

    const parcel = req.body.parcel;

    let nomePlaylist = parcel[0];
    let img = parcel[1];
    let desc = parcel[2];

    let playlist = new Playlists({ nomePlaylist, img, desc });

    try {
        await playlist.save();
        // Redirecionar para a playlist
    } catch (erro) { next(erro); }
});

exports.insertNewMusicIntoPlaylist = (':id/search/insertMusicInPlaylist', async (req, res) => {

    const parcel = req.body.parcel;

    let nomeMusica = parcel[0];
    let nomeArtista = parcel[1];
    let nomeAlbum = parcel[2];
    let previewMusica = parcel[3];
    let imagem = parcel[4];
    let idPlaylist = parcel[5];

    let music = { nomeMusica: nomeMusica, nomeArtista: nomeArtista, nomeAlbum: nomeAlbum, previewMusica: previewMusica, imagem: imagem }

    let songs;
    try {
        const registro = await Playlists.findById({ "_id": idPlaylist });
        songs = registro.songs;
    } 
    catch (erro) 
    {
        res.json({ success: false });
    }
    songs.push(music);

    try {
        if (isPlaylistExistent(idPlaylist))
            await Playlists.updateOne({ "_id": idPlaylist }, { $set: { songs: songs} })
    }
    catch (erro)
    {
        res.json({ success: false });
    }
})
