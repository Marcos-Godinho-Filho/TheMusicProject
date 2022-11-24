const axios = require('axios');
const path = require('path');
const db = require('../database/db');
const user = require('../models/user');



const Users = db.Mongoose.model('esquemaUsuario', user.UserSchema, 'users');

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

    let idUser = req.params.id;
    let playlists = await Users.findById({ "_id": idUser }).playlists;

    try {
        res.status(200).json({ playlists: playlists });
    }
    catch (erro) { throw new Error(erro); }
});

exports.getDataHome = ('/:id/home', async (req, res) => {
    res.sendFile(path.join(pattern + '/public/Home/home.html'));

    let idUser = req.params.id;
    let playlists = await Users.findById({ "_id": idUser }).playlists;

    try {
        res.status(200).json({ playlists: playlists, idUser: idUser });
    }
    catch (erro) { throw new Error(erro); }
})

exports.getDataPlaylist = ('/:id/playlist/:idPl', async (req, res) => {
    res.sendFile(path.join(pattern + '/public/Playlist/playlist.html'));

    let idUser = req.params.id;
    let idPlaylist = req.params.idPl;
    let playlists = await Users.findById({ "_id": idUser }).playlists;
    let playlist = playlists[idPlaylist];

    try {
        res.status(200).json({ playlists: playlists, idUser: idUser, playlist: playlist, idPlaylist: idPlaylist });
    }
    catch (erro) { throw new Error(erro); }
})

exports.getDataProfile = ('/:id/profile', async (req, res) => {
    res.sendFile(path.join(pattern + '/public/Profile/'));

    let idUser = req.params.id;
    let user = await Users.findById({ "_id": idUser });
    let playlists = usuario.playlists;

    try {
        res.status(200).json({ playlists: playlists, idUser: idUser, user: user });
    }
    catch (erro) { throw new Error(erro); }

})

async function isUserExistent(email) {

    let listaUsuarios = await Users.find({ email: email }).lean().exec();
    if (listaUsuarios.length > 0) return true;

    return false;
}

async function getUserID(email) {
    let listaUsuarios = await Users.find({}).lean().exec();
    for (let user of listaUsuarios) {
        if (user["email"] == email) {
            return user["_id"] + ""
        }
    }
}

exports.insertNewUser = ('/registration', async (req, res) => {

    const parcel = req.body.parcel;
    let url = req.url;
    let email = parcel[0];
    let nome = parcel[1];
    let senha = parcel[2];
    let imagemPerfil = "";
    let corFundo = "";
    let desc = "";
    let playlists = [];

    let result = await isUserExistent(email);
    if (!result) {
        let usuario = new Users({ email, nome, senha, imagemPerfil, corFundo, desc, playlists });

        try {
            await usuario.save();
            // Redireciona para home com o id cadastrado
            let id = await getUserID(email);
            res.json({ success: true, id: id });
        }
        catch (err) { console.log(err); }
    }
    else { res.json({ success: false }); return } // Já existe no banco de dados
});


exports.setNewPassword = ('/password-recovery', async (req, res) => {
    const parcel = req.body.parcel;

    let email = parcel[0];
    let novaSenha = parcel[1];

    let result = await isUserExistent(email);
    if (result) {
        await Users.updateOne({ email: email }, { $set: { senha: novaSenha } });
        let id = await getUserID(email);
        res.json({ success: true, id: id });
    }
    else { res.json({ success: false }); }
});

exports.updateUser = ('/:id/profile/updateUser', async (req, res) => {

    let nome = req.body.nome;
    let email = req.body.email;
    let imagemPerfil = req.body.imagemPerfil;
    let descPerfil = req.body.descPerfil;
    let corFundo = req.body.corFundo;

    if (isUserExistent(email, senha)) {
        await Users.updateOne({ $set: { nome: nome } }, { $set: { email: email } }, { $set: { imagemPerfil: imagemPerfil } }, { $set: { descPerfil: descPerfil } }, { $set: { corFundo: corFundo } });
    }
    else { res.json({ success: false }); }
});

exports.updatePlaylist = ('/:id/playlist/:idPl', async (req, res) => {

    let namePlaylist = req.body.name;
    let descPlaylist = req.body.description;
    let image = req.body.img;
    let posicaoPlaylist = req.params.idPl;
    let idUser = req.params.id

    let playlists
    try {
        const registro = await Users.findById({ "_id": idUser })
        playlists = registro.playlists
    }
    catch (erro) { res.json({ success: false }); }

    let music = playlists[posicaoPlaylist].songs
    playlists[posicaoPlaylist] = { namePlaylist, descPlaylist, image, music }

    try {
        if (isUserExistent(idUser)) {
            await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
        }
    }
    catch (erro) { res.json({ success: false }) }
});


exports.checkValidation = ('/authentication', async (req, res) => {

    const parcel = req.body.parcel;
    let email = parcel[0];
    let senha = parcel[1];

    let listaUsuarios = await Users.find({ email: email, senha: senha }).lean().exec();
    if (listaUsuarios.length > 0) 
    { 
        let id = await getUserID(email);
        res.json({ success: true, id: id }); console.log("LOGADO"); 
    }
    else { res.json({ success: false }); console.log("NAO LOGADO"); }
});

isPlaylistExistent = async (idUser, posPlaylist) => {
    if (await Users.findById({ "_id": idUser }) !== null) {
        if ((await Users.findById({ "_id": idUser })).playlists.length - 1 > posPlaylist)
            return false;

        return true;
    }

    return false;
}

exports.insertNewPlaylist = ('/:id/home/insertPlaylist' || '/:id/playlist/:idPl/insertPlaylist' || '/:id/profile/insertPlaylist' || '/:id/search/insertPlaylist', async (req, res) => {

    const parcel = req.body.parcel;

    let nomePlaylist = parcel[0];
    let img = parcel[1];
    let desc = parcel[2];
    let songs = [];
    let idUser = req.params.id;

    let playlist = { nomePlaylist, img, desc, songs };

    let playlists;
    try {
        if (isUserExistent(idUser)) {
            const usuario = await Users.findById({ "_id": idUser })
            playlists = usuario.playlists;
        }
    }
    catch (erro) {
        res.json({ success: false });
    }
    playlists.push(playlist);

    try {
        if (isUserExistent(idUser))
            await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
    }
    catch (erro) {
        res.json({ success: false });
    }
});

exports.insertNewMusicIntoPlaylist = (':id/search/insertMusicIntoPlaylist', async (req, res) => {

    const parcel = req.body.parcel;
    let nomeMusica = parcel[0];
    let nomeArtista = parcel[1];
    let nomeAlbum = parcel[2];
    let previewMusica = parcel[3];
    let imagem = parcel[4];
    let posPlaylist = parcel[5];
    let idUser = req.params.id;

    let music = { nomeMusica: nomeMusica, nomeArtista: nomeArtista, nomeAlbum: nomeAlbum, previewMusica: previewMusica, imagem: imagem }

    try {
        if (isUserExistent(idUser)) {
            const registro = await Users.findById({ "_id": idUser });
            playlists = registro.playlists;
        }
    }
    catch (erro) {
        res.json({ success: false });
    }

    if (isPlaylistExistent(idUser, pos)) {
        playlists[posPlaylist].songs = playlists[posPlaylist].songs.push(music);
        try {
            if (isUserExistent(idUser))
                await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
        }
        catch (erro) {
            res.json({ success: false });
        }
    }
    else
        res.json({ success: false });

})

exports.deleteUser = (':id/profile/deleteUser', async (req, res) => {
    const parcel = req.body.parcel;

    let idUser = req.params.id;

    await Users.deleteOne({ "_id": idUser })
})

exports.deletePlaylist = (':id/playlist/deletePlaylist'), async (req, res) => {
    
    let posicaoPlaylist = req.body.idPl
    let idUser = req.params.id

    let playlists
    try {
        const registro = await Users.findById({ "_id": idUser })
        playlists = registro.playlists
    }
    catch (erro) { res.json({ success: false }); }

    const halfBeforeTheUnwantedElement = playlists.slice(posicaoPlaylist)
    const halfAfterTheUnwantedElement = playlists(posicaoPlaylist + 1);
    const copyWithoutRemovedElement = halfBeforeTheUnwantedElement.concat(halfAfterTheUnwantedElement);

    playlists = copyWithoutRemovedElement;
    try {
        if (isUserExistent(idUser)) {
            await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
        }
    }
    catch (erro) { res.json({ success: false }) }
}

exports.deleteSong = ('id:/playlist/deleteSong'), async (req, res) => {

    let posicaoPlaylist = req.body.posPl;
    let posicaoMusica = req.body.posMs;
    let idUser = req.params.id;

    let playlists
    try {
        const registro = await Users.findById({ "_id": idUser })
        playlists = registro.playlists
    }
    catch (erro) { res.json({ success: false }); }

    try {
        if (isUserExistent(idUser)) {
            await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
        }
    }
    catch (erro) { res.json({ success: false }) }
    try {
        const musicas = playlists[posicaoPlaylist].songs;
        const halfBeforeTheUnwantedElement = musicas.slice(posicaoMusica)
        const halfAfterTheUnwantedElement = musicas(posicaoMusica + 1);
        const copyWithoutRemovedElement = halfBeforeTheUnwantedElement.concat(halfAfterTheUnwantedElement);

        playlists[posicaoPlaylist].songs = copyWithoutRemovedElement;

        try {
            if (isUserExistent(idUser))
                await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
        }
        catch (erro) {
            res.json({ success: false });
        }
    }
    catch (erro) {
        res.json({ success: false });
    }
}