const axios = require('axios');

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
exports.selectAllFrom = (requiredSelection, from) => {
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
exports.selectFromWhere = (requiredSelection, from, selectionCondition) => {
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

// Insere um novo usuario
exports.insertNewUser = (email, nome, senha) => {
    try {
        if (checkValidation('Usuario', 'email = ' + email))
            throw new Error('User already registered');
        else {
            request = new Request(`insert into tmp.Usuario (email, nome, senha) values (${email},${nome},${senha});`, function (err) {
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

exports.insertNewSong = (idMusica, nomeMusica, nomeArtista, nomeAlbum, previewMusica, imagemAlbum) => {
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
exports.checkValidation = (from, condition) => {
    try {
        request = new Request(`select count(*) from tmp.${from} where ${condition};`, function (err) {
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

        if (cont == 0) {
            throw new Error('User not found in database');
            return false; // is not valid
        }

        return true; // is valid, already in database
    }
    catch (erro) { throw new Error(erro); }
}

let retorno = [];

exports.searchFromAPI = ('/search/:parcel', async(req, res) => {

    retorno = [];

    const { parcel } = req.query.parcel;

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

});


exports.getFromAPI = ('/search', async(req, res) => {
    res.status(200).json({ info: retorno });
    retorno = [];
});