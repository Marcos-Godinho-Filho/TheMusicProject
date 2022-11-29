const express = require("express");
const app = express();
const port = 3000;
const rota = require('./routes/route');


app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));
app.use(express.json({ limit: '50mb' }));

app.use(express.static('public'));
app.use(express.static(__dirname + '/public/stylesheets'));
app.use(express.static(__dirname + '/public/imgs'));
app.use(express.static(__dirname + '/public/fonts'));
app.use(express.static(__dirname + '/public/scripts'));
app.use('/', rota);


app.listen(port, () => console.log('Server has started on port ' + port));