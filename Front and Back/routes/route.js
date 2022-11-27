const express = require('express');
const controller = require('../controller/controller');
const router = express.Router();
const path = require('path');

/*
    GET (getting data from backend and passing them to frontend)
    Registration, authentication and password-recovery don't need get since we're not passing data from back to front 
*/

// pattern no meu pc (do Marcos): 0, 45 + 27
const pattern = __dirname.substring(0, 45 + 27);
// '/' --> go to registration page
router.get('/', (req, res) => {
    res.sendFile(path.join(pattern + '/public/Authentication/SignUp Page/index.html'));
});

router.get('/registration', (req, res) => {
    res.sendFile(path.join(pattern + '/public/Authentication/SignUp Page/index.html'));
});

router.get('/authentication', (req, res) => {
    res.sendFile(path.join(pattern + '/public/Authentication/Login Page/index.html'));
});

router.get('/password-recovery', (req, res) => {
    res.sendFile(path.join(pattern + '/public/Authentication/Password Recovery Page/index.html'));
});


router.get('/search/:id', controller.getDataSearch); // Search Page // feito
router.get('/profile/:id', controller.getDataProfile); // Profile Page // feito
router.get('/playlist/:id/:idPl', controller.getDataPlaylist); // Playlist Page // feito
router.get('/home/:id', controller.getDataHome); // Home Page // feito


/*
    POST (getting data from frontend and passing them to backend)
*/
router.post('/registration', controller.insertNewUser); // feito
router.post('/authentication', controller.checkValidation); // feito
router.post('/home/insertPlaylist/:id', controller.insertNewPlaylist); // feito
router.post('/search/insertPlaylist/:id', controller.insertNewPlaylist); // feito
router.post('/profile/insertPlaylist/:id', controller.insertNewPlaylist); // feito
router.post('/playlist/insertPlaylist/:id', controller.insertNewPlaylist); // feito
router.post('/search/insertMusic/:id', controller.insertNewMusicIntoPlaylist); // feito
router.post('/search/:id', controller.searchFromAPI); // feito


/*
    PUT (updating data from backend)
    These datas are going to be updated according to whats passed in query
    Playlists will need (*nome, descricao, imagem)
    Users will need (nome, *email, senha)
*/
router.put('/playlist/updatePlaylist/:id/:idPl', controller.updatePlaylist); // Playlist Page // feito
router.put('/profile/updatePlaylist/:id', controller.updateUser); // Profile Page // feito
router.put('/password-recovery', controller.setNewPassword); // Password-Recovery Page // feito


/*
    DELETE (deleting data from backend)
    Data will be deleted according to the primary key passed in query
    Playlist --> nome
    User --> email
*/
router.delete('/profile/deleteUser/:id', controller.deleteUser); // Profile Page // feito
// router.delete('/playlist/deletePlaylist/:id/:idPl', controller.deletePlaylist); // Playlist Page // feito
// router.delete('/playlist/deleteSong/:id/idPl/:idSong', controller.deleteSong); // Playlist Page // feito

module.exports = router;