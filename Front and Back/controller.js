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
connection.on('connect', function(err) 
{   
    console.log("Succefully Connected to SQL Server");   
});  

connection.connect();

let Request = require('tedious').Request;  
let TYPES = require('tedious').TYPES;  

connection.on('debug', function(err) { console.log('debug:', err);});

// Seleciona tudo da tabela
function selectAllFrom(requiredSelection, from) 
{  
    try 
    {
        request = new Request(`select ${requiredSelection} from TheMusicProject.${from};`, function(err) {  
            if (err) 
                console.log(err);
        });

        let result = "";  

        request.on('row', function(columns) 
        {  
            columns.forEach(function(column) 
            {  
                if (column.value === null)  
                    console.log('NULL');  
                else   
                    result += column.value + " ";  
            });  
            console.log(result);  
            result = "";  
        });  

        request.on('done', function(rowCount, more) 
        {  
            console.log(rowCount + ' rows returned');  
        });  
        
        request.on("requestCompleted", function (rowCount, more) 
        {
            connection.close();
        });
        connection.execSql(request);  
    }
    catch (erro) { throw new Error(erro); }
}


// Seleciona a partir de uma condicao
function selectFromWhere(requiredSelection, from, selectionCondition) 
{  
    try 
    {
        request = new Request(`select ${requiredSelection} from TheMusicProject.${from} where ${selectionCondition};`, function(err) {  
            if (err) 
                console.log(err);
        });

        let result = "";  

        request.on('row', function(columns) 
        {  
            columns.forEach(function(column) 
            {  
                if (column.value === null)  
                    console.log('NULL');  
                else   
                    result += column.value + " ";  
            });  
            console.log(result);  
            result = "";  
        });  

        request.on('done', function(rowCount, more) 
        {  
            console.log(rowCount + ' rows returned');  
        });  
        
        request.on("requestCompleted", function (rowCount, more) 
        {
            connection.close();
        });
        connection.execSql(request);  
    }
    catch (erro) { throw new Error(erro); }
}


// Insere um novo usuario
function insertNewUser(email, nome, senha) 
{  
    try
    {
        request = new Request(`insert into TheMusicProject.Usuario (Email, Nome, Senha) values (${email},${nome},${senha});`, function(err) {  
            if (err)   
                console.log(err); 
        });  
        /*
        I dont know what does this do
        request.addParameter('Name', TYPES.NVarChar,'SQL Server Express 2014');  
        request.addParameter('Number', TYPES.NVarChar , 'SQLEXPRESS2014');  
        request.addParameter('Cost', TYPES.Int, 11);  
        request.addParameter('Price', TYPES.Int,11);  
        */
        request.on('row', function(columns) 
        {  
            columns.forEach(function(column) 
            {  
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


//Exportando as funcoes
exports.selectAllFrom = selectAllFrom;
exports.selectFromWhere = selectFromWhere;
exports.insertNewUser = insertNewUser;