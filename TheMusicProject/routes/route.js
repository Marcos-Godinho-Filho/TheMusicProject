const express = require('express')
const controller = require('../controller/controller')
const router = express.Router()

/*
    GET (getting data from backend and passing them to frontend)
    Registration, authentication and password-recovery don't need get since we're not passing data from back to front 
*/

// '/' --> go to registration page
router.get('/', (req, res) => {
    res.render('../public/views/sign-up.ejs')
})

router.get('/registration', (req, res) => {
    res.render('../public/views/sign-up.ejs')
})

router.get('/authentication', (req, res) => {
    res.render('../public/views/login.ejs')
})

router.get('/password-recovery', (req, res) => {
    res.render('../public/views/password-recovery.ejs')
})

router.get('/home/:id', controller.getDataHome) // Home Page // feito
router.get('/search/:id', controller.getDataSearch) // Search Page // feito
router.get('/profile/:id', controller.getDataProfile) // Profile Page // feito
router.get('/playlist/:id/:idPl', controller.getDataPlaylist) // Playlist Page // feito

router.get('/search/:id/results', controller.getDataSearchResult)

// /*
//     POST (getting data from frontend and passing them to backend)
// */
router.post('/registration', controller.insertNewUser) // feito
router.post('/authentication', controller.checkValidation) // feito
router.post('/search/:id/results', controller.searchFromAPI)


// /*
//     PUT (updating data from backend)
//     These datas are going to be updated according to whats passed in query
//     Playlists will need (*nome, descricao, imagem)
//     Users will need (nome, *email, senha)
// */
router.put('/playlist/:id/:idPl/updatePlaylist', controller.updatePlaylist) // Playlist Page // feito
router.put('/profile/:id/updateUser', controller.updateUser) // Profile Page // feito
router.put('/password-recovery', controller.setNewPassword) // Password-Recovery Page // feito
router.put('/home/:id/insertPlaylist', controller.insertNewPlaylist) // feito 
router.put('/search/:id/insertPlaylist', controller.insertNewPlaylist) // feito
router.put('/profile/:id/insertPlaylist', controller.insertNewPlaylist) // feito
router.put('/playlist/:id/insertPlaylist', controller.insertNewPlaylist) // feito
router.put('/search/:id/insertSong', controller.insertNewSongIntoPlaylist) // feito


// /*
//     DELETE (deleting data from backend)
//     Data will be deleted according to the primary key passed in query
//     Playlist --> nome
//     User --> email
// */
router.delete('/profile/:id/deleteUser', controller.deleteUser) // Profile Page // feito
//router.put('/playlist/deletePlaylist/:id/:idPl', controller.deletePlaylist) // Playlist Page // feito
//router.put('/playlist/deleteSong/:id/idPl/:idSong', controller.deleteSong) // Playlist Page // feito

module.exports = router