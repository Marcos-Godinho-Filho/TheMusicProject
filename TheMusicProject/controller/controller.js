const axios = require('axios')
const db = require('../database/db')
const user = require('../models/user')


const Users = db.Mongoose.model('esquemaUsuario', user.UserSchema, 'users')

let retorno = []

// SELECIONAR

exports.getDataHome = ('/home/:id', async (req, res) => {

    let idUser = req.params.id
    let playlists = await getUsersPlaylists(idUser)

    try {
        res.render('../public/views/home.ejs', { idUser: idUser, playlists: playlists })
    }
    catch (erro) { throw new Error(erro) }
})

exports.getDataSearch = ('/search/:id', async (req, res) => {

    let idUser = req.params.id
    let playlists = await getUsersPlaylists(idUser)

    try {
        res.render('../public/views/search.ejs', { idUser: idUser, playlists: playlists })
    }
    catch (erro) { throw new Error(erro) }
})

exports.searchFromAPI = ('/search/:id/results', async (req, res) => {

    retorno = []

    let parcel = req.body.parcel

    try {
        const optionsAxios = {
            method: 'GET',
            url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
            params: { q: `${parcel}` },
            headers: {
                'X-RapidAPI-Key': 'b6673e4b40mshb71dfa28e006655p1cdcfdjsn1c72cddfef35',
                'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
            }
        }

        axios.request(optionsAxios).then(function (response) {
            for (let musica of response.data["data"]) {
                retorno.push({
                    "nome": musica["title_short"],
                    "artista": musica["artist"]["name"],
                    "album": musica["album"]["title"],
                    "imagem": musica["album"]["cover_medium"],
                    "preview": musica["preview"]
                })
            }
        }).catch(function (error) {
            console.error(error)
        })
    }
    catch (erro) { console.log(erro) }

    console.log(retorno)
})

exports.getSearchResults = ('/search/:id/results', async (req, res) => {

    try {
        res.status(200).json({ retorno: retorno })
    } catch (erro) { throw new Error(erro) }
})

exports.getDataProfile = ('/profile/:id', async (req, res) => {

    let idUser = req.params.id
    let user = await Users.findById({ "_id": idUser })
    let playlists = user.playlists

    if (user == undefined)
        throw new Error("Erro! Usuário inexistente!")

    playlists = user["playlists"]

    try {
        res.render('../public/views/profile.ejs', { playlists: playlists, idUser: idUser, user: user })
    }
    catch (erro) { throw new Error(erro) }
})

exports.getDataPlaylist = ('/playlist/:id/:idPl', async (req, res) => {

    let idUser = req.params.id
    let idPlaylist = Number(req.params.idPl)
    let playlists = await getUsersPlaylists(idUser)
    let playlist = playlists[idPlaylist]

    try {
        res.render('../public/views/playlists.ejs', { playlists: playlists, idUser: idUser, playlist: playlist, idPlaylist: idPlaylist })
    }
    catch (erro) { throw new Error(erro) }
})

async function getUsersPlaylists(idUser) {

    let playlists = []
    let user = await Users.findById({ "_id": idUser })

    if (user == undefined)
        throw new Error("Erro! Usuário inexistente!")

    playlists = user["playlists"]

    return playlists
}

async function isUserExistent(email) {

    let listaUsuarios = await Users.find({ email: email }).lean().exec()
    if (listaUsuarios.length > 0) return true

    return false
}

async function getUserID(email) {

    let listaUsuarios = await Users.find({}).lean().exec()
    for (let user of listaUsuarios) {
        if (user["email"] == email) {
            return user["_id"] + ""
        }
    }
}

// INSERIR

exports.insertNewUser = ('/registration', async (req, res) => {

    const parcel = req.body.parcel
    let email = parcel[0]
    let nome = parcel[1]
    let senha = parcel[2]
    let imagemPerfil = ""
    let corFundo = ""
    let desc = ""
    let playlists = []

    let result = await isUserExistent(email)
    if (!result) {
        let usuario = new Users({ email, nome, senha, imagemPerfil, corFundo, desc, playlists })

        try {
            await usuario.save()
            // Redireciona para home com o id cadastrado
            let id = await getUserID(email)
            res.json({ success: true, id: id })

        }
        catch (err) { console.log(err) }
    }
    else { res.json({ success: false }); return } // Já existe no banco de dados
})

isPlaylistExistent = async (idUser, posPlaylist) => {

    try {
        let usuario = await Users.findById({ "_id": idUser }).lean().exec()
        if (usuario.playlists.length > posPlaylist && posPlaylist >= 0)
            return true
        else
            return false
    }
    catch (err) { return false }
}

exports.insertNewPlaylist = ('/home/:id/insertPlaylist' || '/search/:id/insertPlaylist/' || '/profile/:id/insertPlaylist' || '/playlist/:id/:idPl/insertPlaylist', async (req, res) => {

    let nomePlaylist = req.body.nome
    let img = req.body.imagem
    let desc = req.body.descricao
    let songs = []
    let idUser = req.params.id

    let playlist = { nomePlaylist: nomePlaylist, imagem: img, descricao: desc, musicas: songs }

    let playlists = []
    try {
        playlists = await getUsersPlaylists(idUser)
    }
    catch (erro) {
        console.log(erro)
        res.json({ success: false })
    }
    playlists.push(playlist)
    try {
        // Nao precisa testar se o usuario existe, ja que se ele chegou ate aqui, é pq ele tem o id necessario para isso
        await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
        res.json({ idPl: playlists.length - 1 })
    }
    catch (erro) {
        res.json({ success: false })
    }
})

exports.insertNewSongIntoPlaylist = ('/search/:id/insertSong', async (req, res) => {

    let nomeMusica = req.body.nomeMusica
    let nomeArtista = req.body.nomeArtista
    let nomeAlbum = req.body.nomeAlbum
    let previewMusica = req.body.previewMusica
    let imagem = req.body.imagem
    let posPlaylist = Number(req.body.posPlaylist)
    let idUser = req.params.id

    let song = { nomeMusica: nomeMusica, nomeArtista: nomeArtista, nomeAlbum: nomeAlbum, previewMusica: previewMusica, imagem: imagem }

    try {
        const registro = await Users.findById({ "_id": idUser })
        playlists = registro.playlists
    }
    catch (erro) {
        res.json({ success: false })
    }

    if (isPlaylistExistent(idUser, pos)) {
        playlists[posPlaylist].musicas = playlists[posPlaylist].musicas.push(song)
        try {
            if (await isUserExistent(idUser))
                await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
        }
        catch (erro) {
            res.json({ success: false })
        }
    }
    else
        res.json({ success: false })

})

// EDITAR

exports.setNewPassword = ('/password-recovery', async (req, res) => {

    const parcel = req.body.parcel

    let email = parcel[0]
    let novaSenha = parcel[1]

    let result = await isUserExistent(email)
    if (result) {
        await Users.updateOne({ email: email }, { $set: { senha: novaSenha } })
        let id = await getUserID(email)
        res.json({ success: true, id: id })
    }
    else { res.json({ success: false }) }
})

exports.updateUser = ('/profile/:id/updateUser', async (req, res) => {

    let idUser = req.params.id
    let nome = req.body.nome
    let imagemPerfil = req.body.imagemPerfil
    let descPerfil = req.body.descPerfil
    let corFundo = req.body.corFundo

    try {
        await Users.updateOne({ "_id": idUser }, { $set: { nome: nome, imagemPerfil: imagemPerfil, desc: descPerfil, corFundo: corFundo } })
    } catch (erro) { res.json({ success: false }) }
})

exports.updatePlaylist = ('/playlist/:id/:idPl/updatePlaylist', async (req, res) => {

    let namePlaylist = req.body.name
    let descPlaylist = req.body.description
    let image = req.body.img
    let posicaoPlaylist = Number(req.params.idPl)
    let idUser = req.params.id

    let playlists
    try {
        let user = await Users.findById({ "_id": idUser })
        playlists = user.playlists
    }
    catch (erro) { res.json({ success: false }) }

    let songs = playlists[posicaoPlaylist].musicas
    playlists[posicaoPlaylist] = { nomePlaylist: namePlaylist, imagem: image, descricao: descPlaylist, musicas: songs }

    try {
        await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
    }
    catch (erro) { res.json({ success: false }) }
})

exports.checkValidation = ('/authentication', async (req, res) => {

    const parcel = req.body.parcel
    let email = parcel[0]
    let senha = parcel[1]

    let listaUsuarios = await Users.find({ email: email, senha: senha }).lean().exec()
    if (listaUsuarios.length > 0) {
        let id = await getUserID(email)
        res.json({ success: true, id: id });
    }
    else { res.json({ success: false }); }
})

// DELETAR

exports.deleteUser = ('/profile/:id/deleteUser', async (req, res) => {

    let idUser = req.params.id

    try {
        await Users.deleteOne({ "_id": idUser })
    } catch (erro) { res.json({ success: false }) }
})

exports.deletePlaylist = ('/playlist/:id/:idPl/deletePlaylist', async (req, res) => {

    let posicaoPlaylist = Number(req.params.idPl)
    let idUser = req.params.id

    let playlists
    try {
        let user = await Users.findById({ "_id": idUser })
        playlists = user.playlists
    }
    catch (erro) { res.json({ success: false }) }

    let before = playlists.slice(0, posicaoPlaylist)
    let after = playlists.slice(posicaoPlaylist + 1)
    playlists = before.concat(after)

    try {
        await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
    }
    catch (erro) { res.json({ success: false }) }
})

exports.deleteSong = ('/playlist/deleteSong/:id/:idPl/:idSong', async (req, res) => {

    let posicaoPlaylist = req.body.idPl
    let posicaoMusica = req.body.idSong
    let idUser = req.params.id

    let playlists
    try {
        const registro = await Users.findById({ "_id": idUser })
        playlists = registro.playlists
    }
    catch (erro) { res.json({ success: false }) }

    try {

        const musicas = playlists[posicaoPlaylist].songs
        let before = musicas.slice(0, posicaoMusica)
        let after = musicas.slice(posicaoMusica)
        musicas = before.concat(after)

        playlists[posicaoPlaylist].musicas = musicas

        try {
            if (await isUserExistent(idUser))
                await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
        }
        catch (erro) {
            res.json({ success: false })
        }
    }
    catch (erro) {
        res.json({ success: false })
    }
})