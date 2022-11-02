const axios = require("axios");
const express = require('express');
const app = express();
const port = 3000;
const controller = require('.\\controller.js');

let retorno = [];

app.use(express.static('public'));
app.use(express.json());

app.get('/info/:dynamic', (req, res) => {
    const { dynamic } = req.params;
    const { key } = req.query;
    console.log(dynamic, key);
    res.status(200).json({ info: retorno });
    retorno = [];
});

app.post('/', (req, res) => {
    
    retorno = [];
    
    const { parcel } = req.body;
    console.log(parcel);

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
        function convertSecToMinutes(sec) {
            const totalSeconds = sec;

            const minutes = Math.floor(totalSeconds / 60);

            const seconds = totalSeconds % 60;

            function padTo2Digits(num) {
                return num.toString().padStart(2, '0');
            }

            const result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;

            return result;
        }
        for (let musica of response.data['data']) {

            console.log(musica["title_short"]);
            console.log(musica["artist"]["name"]);
            console.log(musica["album"]["title"]);
            console.log(convertSecToMinutes(musica["duration"]));
            console.log(musica["album"]["cover_medium"]);
            console.log(musica["preview"]);
            //retorno = musica["preview"];
            retorno.push({
                "title_short": musica["title_short"],
                "artist": musica["artist"]["name"],
                "album": musica["album"]["title"],
                "duration": convertSecToMinutes(musica["duration"]),
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

});


// Cadastro
app.post('/registration/', (req, res) => {
    let parcel = req.body;
    let nome = parcel[0];
    let email = parcel[1];
    let senha = parcel[2];

    try 
    { 
        controller.insertNewUser(email, nome, senha);
        res.redirect("./public/index.html"); // I dont know whether this is working or not
    }
    catch (error) { return res.send('Failed to signup'); } // Neither this
});


// Recuperacao de senha
app.post('/password-registration/', (req, res) => {
    let parcel = req.body;
    let email = parcel[0];
    let novaSenha = parcel[1];

    try
    {
        controller.recoverPassword(email, novaSenha);
        res.statusMessage = 'Password recovery worked out well';
    }
    catch (error) { return res.send('Fail in the process'); };
});


// Logar
app.post('/authentication/', (req, res) => {
    let parcel = req.body;

    try
    {
        if (controller.checkValidation(parcel))
            res.redirect('./public/index.html');
        else
            res.send('User not registered');
    }
    catch (error) { return res.send('Failed while trying to login'); }
});

app.listen(port, () => console.log('Server has started on port ' + port)); 
