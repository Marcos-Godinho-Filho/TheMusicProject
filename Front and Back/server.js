const axios = require("axios");
const express = require('express');
const app = express();
const port = 3000;

let retorno = [];

app.use(express.static('public'));
app.use(express.json());

app.get('/info/:dynamic', (req, res) => {
    const { dynamic } = req.params;
    const { key } = req.query;
    // console.log(dynamic, key);
    res.status(200).json({ info: retorno });
    retorno = [];
});

app.post('/', (req, res) => {

    retorno = [];

    const { parcel } = req.body;
    // console.log(parcel);

    const optionsAxios = {
        method: 'GET',
        url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
        params: { q: `${parcel}` },
        headers: {
            'X-RapidAPI-Key': 'b6673e4b40mshb71dfa28e006655p1cdcfdjsn1c72cddfef35',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };

    axios.request(optionsAxios).then(function(response) {
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

            // console.log(musica["title_short"]);
            // console.log(musica["artist"]["name"]);
            // console.log(musica["album"]["title"]);
            // console.log(convertSecToMinutes(musica["duration"]));
            // console.log(musica["album"]["cover_medium"]);
            // console.log(musica["preview"]);
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
    }).catch(function(error) {
        console.error(error);
    });
    if (!parcel) {
        return res.status(400).send({ status: 'failed' });
    }
    res.status(200).send({ status: 'received' });

});

app.listen(port, () => console.log('Server has started on port ' + port));