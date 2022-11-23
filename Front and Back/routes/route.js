const express = require('express');
const controller = require('../controller/controller');
const router = express.Router();
const path = require('path');

/*
PAGINAS:
- registro
- login
- rec. senha
- senha
- home
- perfil
- busca
- playlist
*/

/*
    GET (getting data from backend and passing them to frontend)
    Registration, authentication and password-recovery don't need get since we're not passing data from back to front 
*/

/*
    Isso vai entrar em um loop infinito? Pq se agt vai pra essa pagina atraves do diretorio, ele faz um get, ai manda agt pra pagin de novo, e ai faz outro get, etc???
*/
// pattern no meu pc (do Marcos): 0, 45 + 27
const pattern = __dirname.substring(0, 45);
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


router.get('/:id/search', controller.getDataSearch); // Search Page // feito
router.get('/:id/profile', controller.getDataProfile); // Profile Page // feito
router.get('/:id/playlist/:idPl', controller.getDataPlaylist); // Playlist Page // feito
router.get('/:id/home', controller.getDataHome); // Home Page // feito


//router.get('/home', (req, res) => {
//    res.sendFile(path.join(pattern + '/public/Home/home.html'));
//});


/*
    POST (getting data from frontend and passing them to backend)
*/
router.post('/registration', controller.insertNewUser); // feito
router.post('/authentication', controller.checkValidation); // feito
// Criar playlist é aqui?
// Inserir musica é aqui?
router.post('/:id/home/insertPlaylist', controller.insertNewPlaylist); // feito
router.post('/:id/search/insertPlaylist', controller.insertNewPlaylist); // feito
router.post('/:id/profile/insertPlaylist', controller.insertNewPlaylist); // feito
router.post('/:id/playlist/:idPl/insertPlaylist', controller.insertNewPlaylist); // feito
router.post('/:id/search/insertMusicIntoPlaylist', controller.insertNewMusicIntoPlaylist); // feito
router.post('/:id/search', controller.searchFromAPI); // feito


/*
    PUT (updating data from backend)
    These datas are going to be updated according to whats passed in query
    Playlists will need (*nome, descricao, imagem)
    Users will need (nome, *email, senha)
*/
router.put('/:id/playlist/:idPl/updatePlaylist', controller.updatePlaylist); // Playlist Page // feito
router.put('/:id/profile/updatePlaylist', controller.updateUser); // Profile Page // feito
router.put('/password-recovery', controller.setNewPassword); // Password-Recovery Page // feito


/*
    DELETE (deleting data from backend)
    Data will be deleted according to the primary key passed in query
    Playlist --> nome
    User --> email
*/
// router.delete('/:id/playlist/deletePlaylist', controller.deletePlaylist); // Playlist Page // feito
// router.delete('/:id/profile/deleteUser', controller.deleteUser); // Profile Page // feito
// router.delete('/:id/playlist/deleteSong', controller.deleteSong); // Playlist Page // feito


module.exports = router;