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
function selectAllFrom(requiredSelection, from) {
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
function selectFromWhere(requiredSelection, from, selectionCondition) {
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


function deleteFromWhere(requiredDelete, from, deleteCondition) {
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
function insertNewUser(email, nome, senha) {
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

function insertNewSong(idMusica, nomeMusica, nomeArtista, nomeAlbum, previewMusica, imagemAlbum) {
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

function insertNewPlaylist(idPlaylist, nome, descricao, imagem, email) {
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

function insertNewPlaylistSong(idPlaylist, idMusica) {
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
function recoverPassword(email, novaSenha) {
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
function checkValidation(from, condition) {
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



//Exportando as funcoes
exports.selectAllFrom = selectAllFrom;
exports.selectFromWhere = selectFromWhere;
exports.deleteFromWhere = deleteFromWhere;
exports.insertNewUser = insertNewUser;
exports.insertNewSong = insertNewSong;
exports.insertNewPlaylist = insertNewPlaylist;
exports.insertNewPlaylistSong = insertNewPlaylistSong;
exports.recoverPassword = recoverPassword;
exports.checkValidation = checkValidation;