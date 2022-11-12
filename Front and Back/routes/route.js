const express = require('express');
const controller = require('../controller/controller');
const router = express.Router();



// ## AUTHENTICATION
// Cadastro
router.post('/registration', controller.insertNewUser);
// login
router.post('/authentication', controller.checkValidation);
// Recuperacao Senha
router.post('/password-recovery', controller.recoverPassword);



// ## BUSCA NA SEARCH
// Posta pro backend
router.post('/search', controller.searchFromAPI);
// Pega do backend
router.get('/search', controller.getFromAPI);


// ## HOME
router.get('/home/');