const express = require("express");
const app = express();
const port = 3000;
const rota = require('./routes/route');


app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(__dirname + '/public/stylesheets'));
app.use(express.static(__dirname + '/public/imgs'));
app.use(express.static(__dirname + '/public/spotifyFont'));
app.use('/', rota);


app.listen(port, () => console.log('Server has started on port ' + port));