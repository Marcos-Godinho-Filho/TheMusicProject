const axios = require('axios')
const path = require('path')
const db = require('../database/db')
const user = require('../models/user')


const Users = db.Mongoose.model('esquemaUsuario', user.UserSchema, 'users')

// pattern no meu pc (do Marcos): 0, 45 + 27
const pattern = __dirname.substring(0, 45 + 27)


let retorno = []

// MÉTODOS GET

exports.getDataHome = ('/home/:id', async (req, res) => {

    let idUser = req.params.id
    let playlists = getUsersPlaylists(idUser)

    try {
        // res.sendFile(path.join(pattern + '/public/Home/home.html'))
        res.render('../public/views/home', { idUser: idUser, playlists: playlists })
    }
    catch (erro) { console.log(erro) }
})

exports.getDataSearch = ('/search/:id', async (req, res) => {

    let idUser = req.params.id
    let playlists = await Users.findById({ "_id": idUser }).playlists
    if (playlists == undefined)
        playlists = []

    try {
        res.render(pattern + '/public/views/search.ejs', { idUser: idUser, playlists: playlists, info: retorno })

        retorno = []
    }
    catch (erro) { throw new Error(erro) }
})

exports.searchFromAPI = ('/search/:id', async (req, res) => {

    retorno = []

    let email = req.params.email
    let parcel = req.query.parcel

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
            }

            axios.request(optionsAxios).then(function (response) {
                for (let musica of response.data['data']) {
                    retorno.push({
                        "title_short": musica["title_short"],
                        "artist": musica["artist"]["name"],
                        "album": musica["album"]["title"],
                        "image": musica["album"]["cover_medium"],
                        "preview": musica["preview"]
                    })

                }
            }).catch(function (error) {
                console.error(error)
            })
            if (!parcel) {
                return res.status(400).send({ status: 'failed' })
            }
            res.status(200).send({ status: 'received' })
        }
        else { res.json({ found: false }) }
    }
    catch (erro) { throw new Error(erro) }
})

exports.getDataProfile = ('/profile/:id', async (req, res) => {

    let idUser = req.params.id
    let user = await Users.findById({ "_id": idUser })
    let playlists = user.playlists
    if (playlists == undefined)
        playlists = []

    try {
        res.render(pattern + '/public/views/profile.ejs', { playlists: playlists, idUser: idUser, user: user })
    }
    catch (erro) { throw new Error(erro) }
})

// exports.getDataPlaylist = ('/playlist/:id/:idPl', async (req, res) => {
//     res.sendFile(path.join(pattern + '/public/Playlist/playlist.html'))

//     let idUser = req.params.id
//     let idPlaylist = req.params.idPl
//     let playlists = await Users.findById({ "_id": idUser }).playlists
//     let playlist = playlists[idPlaylist]

//     try {
//         res.status(200).json({ playlists: playlists, idUser: idUser, playlist: playlist, idPlaylist: idPlaylist })
//     }
//     catch (erro) { throw new Error(erro) }
// })

async function getUsersPlaylists(idUser) {

    let playlists = []
    if (isUserExistent(idUser)) {
        playlists = await Users.findById({ "_id": idUser }).playlists
    }

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

// // MÉTODOS POST

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

//'/home/:id/insertPlaylist' || '/playlist/:id/:idPl/insertPlaylist' || '/profile/:id/insertPlaylist' || '/search/:id/insertPlaylist/'
exports.insertNewPlaylist = ('/profile/:id/insertPlaylist', async (req, res) => {
    let nomePlaylist = req.body.nome
    let img = req.body.imagem
    let desc = req.body.descricao
    let songs = []
    let idUser = req.params.id

    let playlist = { nomePlaylist: nomePlaylist, imagem: img, descricao: desc, musicas: songs }

    let playlists = []
    try {
        playlists = getUsersPlaylists(idUser)
    }
    catch (erro) {
        res.json({ success: false })
    }
    playlists.push(playlist)

    try {
        // Nao precisa testar se o usuario existe, ja que se ele chegou ate aqui, é pq ele tem o id necessario para isso
        await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
    }
    catch (erro) {
        res.json({ success: false })
    }
    // Direcionar para a pagina de playlist e ja carregar a playlist no aside 
    try {
        res.render('../public/views/playlist', { idUser: idUser, playlists: playlists, playlist: playlist })
    }
    catch (erro) { console.log(erro) }
})

// exports.insertNewMusicIntoPlaylist = ('/search/insertMusic/:id/', async (req, res) => {

//     let nomeMusica = req.body.nomeMusica
//     let nomeArtista = req.body.nomeArtista
//     let nomeAlbum = req.body.nomeAlbum
//     let previewMusica = req.body.previewMusica
//     let imagem = req.body.imagem
//     let posPlaylist = req.body.posPlaylist
//     let idUser = req.body.idUser

//     let song = { nomeMusica: nomeMusica, nomeArtista: nomeArtista, nomeAlbum: nomeAlbum, previewMusica: previewMusica, imagem: imagem }

//     try {
//         if (isUserExistent(idUser)) {
//             const registro = await Users.findById({ "_id": idUser })
//             playlists = registro.playlists
//         }
//     }
//     catch (erro) {
//         res.json({ success: false })
//     }

//     if (isPlaylistExistent(idUser, pos)) {
//         playlists[posPlaylist].songs = playlists[posPlaylist].songs.push(song)
//         try {
//             if (isUserExistent(idUser))
//                 await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
//         }
//         catch (erro) {
//             res.json({ success: false })
//         }
//     }
//     else
//         res.json({ success: false })

// })

// // MÉTODOS PUT

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
    let email = req.body.email
    let imagemPerfil = req.body.imagemPerfil
    let descPerfil = req.body.descPerfil
    let corFundo = req.body.corFundo

    if (isUserExistent(email)) {
        await Users.updateOne({ "_id": idUser }, { $set: { nome: nome, imagemPerfil: imagemPerfil, desc: descPerfil, corFundo: corFundo } })
    }
    else { res.json({ success: false }) }
})

// exports.updatePlaylist = ('/playlist/:id/:idPl', async (req, res) => {

//     let namePlaylist = req.body.name
//     let descPlaylist = req.body.description
//     let image = req.body.img
//     let posicaoPlaylist = req.params.idPl
//     let idUser = req.params.id

//     let playlists
//     try {
//         const registro = await Users.findById({ "_id": idUser })
//         playlists = registro.playlists
//     }
//     catch (erro) { res.json({ success: false }) }

//     let music = playlists[posicaoPlaylist].songs
//     playlists[posicaoPlaylist] = { namePlaylist, descPlaylist, image, music }

//     try {
//         if (isUserExistent(idUser)) {
//             await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
//         }
//     }
//     catch (erro) { res.json({ success: false }) }
// })

exports.checkValidation = ('/authentication', async (req, res) => {

    const parcel = req.body.parcel
    let email = parcel[0]
    let senha = parcel[1]

    let listaUsuarios = await Users.find({ email: email, senha: senha }).lean().exec()
    if (listaUsuarios.length > 0) {
        let id = await getUserID(email)
        res.json({ success: true, id: id }); console.log("LOGADO")
    }
    else { res.json({ success: false }); console.log("NAO LOGADO") }
})

// // MÉTODOS DELETE

exports.deleteUser = ('/profile/deleteUser/:id', async (req, res) => {

    let idUser = req.params.id

    await Users.deleteOne({ "_id": idUser })
    // Redirecionar para pagina de registro
    res.render('../public/views/sign-up', {})
})

exports.deletePlaylist = ('/playlist/deletePlaylist/:id/:idPl'), async (req, res) => { // Agt ainda fetch com idPl no final?

    let posicaoPlaylist = req.body.idPl
    let idUser = req.params.id

    let playlists
    try {
        const registro = await Users.findById({ "_id": idUser })
        playlists = registro.playlists
    }
    catch (erro) { res.json({ success: false }) }

    // Que que é tudo isso
    const halfBeforeTheUnwantedElement = playlists.slice(posicaoPlaylist)
    const halfAfterTheUnwantedElement = playlists(posicaoPlaylist + 1)
    const copyWithoutRemovedElement = halfBeforeTheUnwantedElement.concat(halfAfterTheUnwantedElement)

    playlists = copyWithoutRemovedElement
    try {
        if (isUserExistent(idUser)) {
            await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
        }
    }
    catch (erro) { res.json({ success: false }) }
    // Redirecionar para home
    res.render('../public/views/home', { idUser: idUser, playlists: playlists })
}

// exports.deleteSong = ('/playlist/deleteSong/:id/:idPl/:idSong'), async (req, res) => {

//     let posicaoPlaylist = req.body.idPl
//     let posicaoMusica = req.body.idSong
//     let idUser = req.params.id

//     let playlists
//     try {
//         const registro = await Users.findById({ "_id": idUser })
//         playlists = registro.playlists
//     }
//     catch (erro) { res.json({ success: false }) }

//     try {
//         const musicas = playlists[posicaoPlaylist].songs
//         const halfBeforeTheUnwantedElement = musicas.slice(posicaoMusica)
//         const halfAfterTheUnwantedElement = musicas(posicaoMusica + 1)
//         const copyWithoutRemovedElement = halfBeforeTheUnwantedElement.concat(halfAfterTheUnwantedElement)

//         playlists[posicaoPlaylist].songs = copyWithoutRemovedElement

//         try {
//             if (isUserExistent(idUser))
//                 await Users.updateOne({ "_id": idUser }, { $set: { playlists: playlists } })
//         }
//         catch (erro) {
//             res.json({ success: false })
//         }
//     }
//     catch (erro) {
//         res.json({ success: false })
//     }
// }