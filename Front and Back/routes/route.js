const express = require('express');
const controller = require('../controller/controller');
const router = express.Router();
const path = require('path');


/*
PAGINAS:
- registro
- login
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
// '/' --> go to registration page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + 'public/Authentication/SignUp Page/index.html'));
});

router.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname + ''));
});

router.get('/authentication', (req, res) => {
    res.sendFile(path.join(__dirname + ''));
});

router.get('/password-recovery', (req, res) => {
    res.sendFile(path.join(__dirname + ''));
});


router.get('/:email/search',       controller.getFromAPI);      // Search   Page
router.get('/:email/profile',      controller.getDataFromUser); // Profile  Page
router.get('/:email/playlist/:id', controller.getPlaylist);     // Playlist Page
router.get('/:email/home',         controller.getPlaylists);    // Home     Page

/*
    POST (getting data from frontend and passing them to backend)
*/
router.post('/registraion', controller.insertNewUser);
router.post('/authentication', controller.checkValidation);
/*
    PUT (updating data from backend)
    These datas are going to be updated according to whats passed in query
    Playlists will need (*nome, descricao, imagem)
    Users will need (nome, *email, senha)
*/
router.put('/:email/playlist', controller.getFromAPI); // Playlist Page
router.put('/:email/profile', controller.getFromAPI); // Profile Page
router.put('/password-recovery', controller.setNewPassword); // Password-Recovery Page

/*
    DELETE (deleting data from backend)
    Data will be deleted according to the primary key passed in query
    Playlist --> nome
    User --> email
*/
router.delete('/:email/playlist', controller.getFromAPI); // Playlist Page
router.delete('/:email/profile', controller.getFromAPI); // Profile Page
