var mongo = require('mongodb');
var connMongo = function(){
    console.log('conectei ao banco');
    var db = new mongo.Db(
        'tictactoe',
        new mongo.Server(
            '127.0.0.1',
            27017,
            {}
        ),
        {}
    );
    return db;
}
var dbServer = 'mongodb://127.0.0.1:27017';
//module.exports = function(){
//    return connMongo;
//}
module.exports = dbServer;