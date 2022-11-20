const axios = require('axios');
const path = require('path');

const db = require('../database/db');
const user = require('../models/user');
const playlist = require('../models/playlist');
const music = require('../models/music');



let retorno = [];

exports.searchFromAPI = ('/:email/search', async(req, res) => {

    retorno = [];

    let email = req.params.email;
    let parcel = req.query.parcel;

    try
    {
        if (checkExistentUser(email))
        {
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
                for (let musica of response.data['data']) {
                    retorno.push({
                        "title_short": musica["title_short"],
                        "artist": musica["artist"]["name"],
                        "album": musica["album"]["title"],
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
        }
        else { res.json({found: false}) }
    }
    catch (erro) { throw new Error(erro); }
});

const pattern = __dirname.substring(0,84);
exports.getFromAPI = ('/:email/search', async(req, res) => {
    res.sendFile(path.join(pattern + '/public/search/index.html'));

    let email = req.params.email;
    try
    {
        if (checkExistentUser(email))
        {
            res.status(200).json({ info: retorno });
            retorno = [];
        }
        else { res.json({found: false}) }
    }
    catch (erro) { throw new Error(erro); }
});
