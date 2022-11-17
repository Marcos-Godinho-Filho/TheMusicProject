const axios = require('axios');
const path = require('path');

let Connection = require('tedious').Connection;

let config =
{
    server: 'REGULUS',  //update me
    authentication:
    {
        type: 'default',
        options: {
            userName: 'BD22142', //update me
            password: 'vemvamosemboraqueesperarnaoesaber'  //update me
        }
    },
    options:
    {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: 'BD22142',  //update me
        trustServerCertificate: true
    }
};

let connection = new Connection(config);
connection.on('connect', function (err) {
    console.log("Succefully Connected to SQL Server");
});

connection.connect();

let request = require('tedious').Request;
let TYPES = require('tedious').TYPES;

connection.on('debug', function (err) { console.log('debug:', err); });

// Seleciona tudo da tabela
function selectAllFrom(requiredSelection, from)
{
    try {
        request = new Request(`select ${requiredSelection} from tmp.${from};`, function (err) {
            if (err)
                console.log(err);
        });

        let result = "";

        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null)
                    console.log('NULL');
                else
                    result += column.value + " ";
            });
            console.log(result);
            result = "";
        });

        request.on('done', function (rowCount, more) {
            console.log(rowCount + ' rows returned');
        });

        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        });
        connection.execSql(request);
    }
    catch (erro) { throw new Error(erro); }
}


// Seleciona a partir de uma condicao
exports.selectPlaylistFromUser = (requiredSelection, from, selectionCondition) => {
    try {
        request = new Request(`select ${requiredSelection} from tmp.${from} where ${selectionCondition};`, function (err) {
            if (err)
                console.log(err);
        });

        let result = "";

        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null)
                    console.log('NULL');
                else
                    result += column.value + " ";
            });
            console.log(result);
            result = "";
        });

        request.on('done', function (rowCount, more) {
            console.log(rowCount + ' rows returned');
        });

        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        });
        connection.execSql(request);
    }
    catch (erro) { throw new Error(erro); }
}


exports.deleteFromWhere = (requiredDelete, from, deleteCondition) => {
    try {
        request = new Request(`delete ${requiredDelete} from tmp.${from} where ${deleteCondition};`, function (err) {
            if (err)
                console.log(err);
        });

        let result = "";

        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null)
                    console.log('NULL');
                else
                    result += column.value + " ";
            });
            console.log(result);
            result = "";
        });

        request.on('done', function (rowCount, more) {
            console.log(rowCount + ' rows returned');
        });

        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        });
        connection.execSql(request);
    }
    catch (erro) { throw new Error(erro); }
}

// function insertNewRegister(into, condition, fields, values) {
//     try {
//         if (checkValidation(into, condition))
//             throw new Erros(into + ' ja registrada');
//         else {
//             request = new Request(`insert into tmp.${into} (${fields}) values (${values});`, function (err) {
//                 if (err)
//                     console.log(err);
//             });

//             request.on('row', function (columns) {
//                 columns.forEach(function (column) {
//                     if (column.value === null)
//                         console.log('NULL');
//                     else
//                         console.log("Product id of inserted item is " + column.value);
//                 });
//             });


//             request.on("requestCompleted", function (rowCount, more) {
//                 connection.close();
//             });
//             connection.execSql(request);
//         }
//     }
//     catch (erro) { throw new Error(erro); }
// }

exports.insertNewSong = () => {
    let idMusica = 1;
    let nomeMusica = 1;
    let nomeArtista = 1;
    let nomeAlbum = 1;
    let previewMusica = 1;
    let imagemAlbum = 1;


    try {
        if (checkValidation('Musica', 'idMusica = ' + idMusica))
            throw new Error('Song already registered');
        else {
            request = new Request(`insert into tmp.Musica (id, nomeMusica, nomeArtista, nomeAlbum, previewMusica, imagemAlbum) values (${nomeMusica},${nomeArtista},${nomeAlbum},${previewMusica},${imagemAlbum});`, function (err) {
                if (err)
                    console.log(err);
            });

            // request.addParameter('Name', TYPES.NVarChar,'SQL Server Express 2014');  
            // request.addParameter('Number', TYPES.NVarChar , 'SQLEXPRESS2014');  
            // request.addParameter('Cost', TYPES.Int, 11);  
            // request.addParameter('Price', TYPES.Int,11);  

            request.on('row', function (columns) {
                columns.forEach(function (column) {
                    if (column.value === null)
                        console.log('NULL');
                    else
                        console.log("Product id of inserted item is " + column.value);
                });
            });


            request.on("requestCompleted", function (rowCount, more) {
                connection.close();
            });
            connection.execSql(request);
        }
    }
    catch (erro) { throw new Error(erro); }
}

exports.insertNewPlaylist = (idPlaylist, nome, descricao, imagem, email) => {
    try {
        if (checkValidation('Playlist', 'idPlaylist = ' + idPlaylist))
            throw new Error('Playlist already registered');
        else {
            request = new Request(`insert into tmp.Playlist (idPlaylist, nome, descricao, imagem, email) values (${nome},${descricao},${imagem},${email});`, function (err) {
                if (err)
                    console.log(err);
            });

            // request.addParameter('Name', TYPES.NVarChar,'SQL Server Express 2014');  
            // request.addParameter('Number', TYPES.NVarChar , 'SQLEXPRESS2014');  
            // request.addParameter('Cost', TYPES.Int, 11);  
            // request.addParameter('Price', TYPES.Int,11);  

            request.on('row', function (columns) {
                columns.forEach(function (column) {
                    if (column.value === null)
                        console.log('NULL');
                    else
                        console.log("Product id of inserted item is " + column.value);
                });
            });


            request.on("requestCompleted", function (rowCount, more) {
                connection.close();
            });
            connection.execSql(request);
        }
    }
    catch (erro) { throw new Error(erro); }
}

exports.insertNewPlaylistSong = (idPlaylist, idMusica) => {
    if (checkValidation('PlaylistMusica', 'idPlaylist = ' + idPlaylist && 'idMusica = ' + idMusica))
        throw new Error('PlaylistMusica already registered');
    else {
        try {
            request = new Request(`insert into tmp.PlaylistMusica (idPlaylist, idMusica) values (${idPlaylist},${idMusica});`, function (err) {
                if (err)
                    console.log(err);
            });

            // request.addParameter('Name', TYPES.NVarChar,'SQL Server Express 2014');  
            // request.addParameter('Number', TYPES.NVarChar , 'SQLEXPRESS2014');  
            // request.addParameter('Cost', TYPES.Int, 11);  
            // request.addParameter('Price', TYPES.Int,11);  

            request.on('row', function (columns) {
                columns.forEach(function (column) {
                    if (column.value === null)
                        console.log('NULL');
                    else
                        console.log("Product id of inserted item is " + column.value);
                });
            });


            request.on("requestCompleted", function (rowCount, more) {
                connection.close();
            });
            connection.execSql(request);
        }
        catch (erro) { throw new Error(erro); }
    }
}

// Recuperacao de senha
exports.recoverPassword = (email, novaSenha) => {
    try {
        if (!checkValidation("Usuario", "email = " + email))
            throw new Error('User not found in database');
        else {
            request = new Request(`update tmp.Usuario set senha = ${novaSenha} where email = ${email};`, function (err) {
                if (err)
                    console.log(err);
            });

            request.on("requestCompleted", function (rowCount, more) {
                connection.close();
            });
            connection.execSql(request);
        }
    }
    catch (erro) { throw new Error(erro); }
}



// Checa se um email é válido (cadastrado)
function checkExistentUser(email)
{
    try 
    {
        request = new Request(`select * from tmp.Usuario where email = ${email};`, function (err) {
            if (err)
                console.log(err);
        });

        let cont = 0;
        request.on('row', function (columns) {
            columns.forEach(function (column) {
                if (column.value === null)
                    console.log('NULL');
                else {
                    console.log("Product id of inserted item is " + column.value);
                    cont++;
                }
            });
        });

        request.on("requestCompleted", function (rowCount, more) {
            connection.close();
        });
        connection.execSql(request);

        if (cont == 0) 
            return false; // Nao existe no banco de dados

        return true; // Existe no banco de dados
    }
    catch (erro) { throw new Error(erro); }
}




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

const pattern = __dirname.substring(0,44);
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


exports.getDataFromUser = ('/:email/profile', async(req, res) => {
    res.sendFile(path.join(pattern + '/public/Profile/html'))

    let email = req.params.email;
    try 
    {
        if (checkExistentUser(email))
        {
            res.json({ info: selectAllFrom(Usuario, email) });
        } 
        else { res.json({found: false}) }
    }
    catch (erro) { throw new Error(erro); }
});


exports.getPlaylists = ('/:email/home', async(req, res) => {
    res.sendFile(path.join(pattern +'/public/Home/home.html'))

    let email = req.params.email;
    try 
    {
        if (checkExistentUser(email))
        {
            res.json({ info: selectAllFrom(Playlist, email) });
        } else { res.json({found: false}) }
    }
    catch (erro) { throw new Error(erro); }
    
});


exports.getPlaylist = ('/:email/playlist/:id', (req, res) => {
    res.sendFile(path.join(pattern+'/public/Playlists/playlist.html'))

    let email = req.params.emai;
    let id = req.params.id; // A pessoa sabe o id da playlist? Agt vai colocar na url quando ela estiver na pagina?

    try
    {
        if (checkExistentUser(email))
        {
            res.json({ info: selectAllFrom(Playlist, id) });
        }
        else { res.json({found: false}) }
    }
    catch (erro) { throw new Error(erro); }
});

exports.insertNewUser = ('/registration', async(req, res) => 
{

    let email = req.query.email;
    let nome  = req.query.username;
    let senha = req.query.password;

    try 
    {
        if (checkExistentUser(email)) { throw new Error('User already registered'); }
        else 
        {
            request = new Request(`insert into tmp.Usuario (email, nome, senha) values (${email},${nome},${senha});`, function (err) { if (err) console.log(err); });

            // request.addParameter('Name', TYPES.NVarChar,'SQL Server Express 2014');  
            // request.addParameter('Number', TYPES.NVarChar , 'SQLEXPRESS2014');  
            // request.addParameter('Cost', TYPES.Int, 11);  
            // request.addParameter('Price', TYPES.Int,11);  


            request.on("requestCompleted", function (rowCount, more) { connection.close(); });
            connection.execSql(request);
        }
    }
    catch (erro) { throw new Error(erro); }

    // Redirecionar o usuario para home
    res.sendFile(path.join(__dirname + 'public/Home/home.html'));
});



exports.checkValidation = ('/authentication', (req, res) => {

    let email = req.query.email;

    try
    {
        if (checkExistentUser(email))
        {
            res.json({ found: true }); // Usuario encontrado
            // Redirecionar para home
            res.sendFile(path.join(__dirname + 'public/Home/home.html'));
        }
        else { res.json({ found: false });} // Usuario nao encontrado 
    }
    catch (erro) { throw new Error(erro); }
});



exports.setNewPassword = ('/password-recovery', (req, res) => {

    let email = req.query.email;
    let newPassword = req.query.password;

    try
    {
        if (checkExistentUser(email))
        {
            request = new Request(`update tmp.Usuario set senha = ${newPassword} where email = ${email};`, function (err) { if(err) console.log(err); });
            request.on("requestCompleted", function (rowCount, more) { connection.close(); });
            connection.execSql(request);
            res.json({ sucess: true }); 
            // Redirecionar para login
            res.sendFile(path.join(__dirname + 'public/Authentication/SignUp Page/index.html'));
        }
        else { res.json({ found: false }); }
    }
    catch (erro) { throw new Error(erro); }
});


exports.updatePlaylist = ('/:email/playlist', (req, res) => {

    let email = req.params.id;
    let nome = req.query.playlistName;
    let desc = req.query.description;
    let image = req.query.image;

    try
    {
        if (checkExistentUser(email))
        {
            request = new Request(`update tmp.Playlist set Nome = ${nome} set Descricao = ${desc} set Image = ${image} where email = ${email};`, function (err) { if(err) console.log(err); });
            request.on("requestCompleted", function (rowCount, more) { connection.close(); });
            connection.execSql(request);
            res.json({ sucess: true }); 
            // Atualizar pagina
        }
        else { res.json({ found: false }); }
    }
    catch (erro) { throw new Error(erro); }
});


exports.updateUser = ('/:email/profile', (req, res) => {

    let email = req.params.id;
    let nome = req.query.playlistName;
    let senha = req.query.senha;

    try
    {
        if (checkExistentUser(email))
        {
            request = new Request(`update tmp.Playlist set Nome = ${nome} set Senha = ${senha} where email = ${email};`, function (err) { if(err) console.log(err); });
            request.on("requestCompleted", function (rowCount, more) { connection.close(); });
            connection.execSql(request);
            res.json({ sucess: true }); 
            // Atualizar pagina
        }
        else { res.json({ found: false }); }
    }
    catch (erro) { throw new Error(erro); }
});


exports.deletePlaylist = ('/:email/playlist', (req, res) => {

    let email = req.params.id;
    let nome = req.query.playlistName;

    try
    {
        if (checkExistentUser(email))
        {
            request = new Request(`delete from tmp.Playlist where email = ${email} and Nome = ${nome};`, function (err) { if(err) console.log(err); });
            request.on("requestCompleted", function (rowCount, more) { connection.close(); });
            connection.execSql(request);
            res.json({ sucess: true }); 
            // Redirecionar para home
            res.sendFile(path.join(__dirname + 'public/Authentication/Home/home.html'));
        }
        else { res.json({ found: false }); }
    }
    catch (erro) { throw new Error(erro); }

});


exports.deleteUser = ('/:email/user', (req, res) => {

    let email = req.params.id;

    try
    {
        if (checkExistentUser(email))
        {
            request = new Request(`delete from tmp.Usuario where email = ${email};`, function (err) { if(err) console.log(err); });
            request.on("requestCompleted", function (rowCount, more) { connection.close(); });
            connection.execSql(request);
            res.json({ sucess: true }); 
            res.sendFile(path.join(__dirname + 'public/Authentication/SignUp Page/index.html'));
        }
        else { res.json({ found: false }); }
    }
    catch (erro) { throw new Error(erro); }

});


exports.createPlaylist = ('/:email/playlist', (req, res) => { //?

    let email = req.params.id;
    let nome = req.query.playlistName;
    let desc = req.query.description;
    let image = req.query.image;

    try
    {
        if (checkExistentUser(email))
        {
            request = new Request(`insert into tmp.Playlist (Nome, Descricao, Imagem) values (${nome},${desc},${image}) where email = ${email};`, function (err) { if(err) console.log(err); });
            request.on("requestCompleted", function (rowCount, more) { connection.close(); });
            connection.execSql(request);
            res.json({ sucess: true }); 
            // Redirecionar para home
        }
        else { res.json({ found: false }); }
    }
    catch (erro) { throw new Error(erro); }
});


exports.insertMusicPlaylist = ('/:email/search/insertMusic', (req, res) => {

    let email = req.params.id;
    // Dados da musica
    let nome = req.query.playlistName;
    let desc = req.query.description;
    let image = req.query.image;
    let idPlaylist = req.query.playlistId;

    try
    {
        if (checkExistentUser(email))
        {
            request = new Request(`insert into tmp.Playlist (Nome, Descricao, Imagem) values (${nome},${desc},${image}) where email = ${email};`, function (err) { if(err) console.log(err); });
            request.on("requestCompleted", function (rowCount, more) { connection.close(); });
            connection.execSql(request);
            res.json({ sucess: true }); 
            // Redirecionar para home
        }
        else { res.json({ found: false }); }
    }
    catch (erro) { throw new Error(erro); }


});