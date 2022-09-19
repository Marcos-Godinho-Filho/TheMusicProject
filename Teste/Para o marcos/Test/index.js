const axios = require('axios');
const express = require('express');
const app = express();
const port = suaPortaX;

app.listen(port, () => console.log(`Server has started on port: ${port}`));

const options = {
    method: 'GET',
    url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
    params: {q: 'eminem'},
    headers: {
      'X-RapidAPI-Key': 'b6673e4b40mshb71dfa28e006655p1cdcfdjsn1c72cddfef35',
      'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
    }
  };
  
  app.request(options).then(function (response) {
    app.get('/', (req, res) => {
        res.status(200).send('<h1>Lol</h1>');
    });
    console.log(response.data);
  }).catch(function (error) {
      console.error(error);
  });
