const clus = require('clusterws');
var container = [];
// Ao levantar o servidor, limpar o banco
var MongoClient = require('mongodb').MongoClient;
var url = require('./config/dbconnection.js');

MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   var dbo = db.db("tictactoe");
   dbo.collection("partidas").drop(function(err, delOK) {
     if (err) console.log('[WARNING] Não consegui deletar a collection partidas. Possivelmente ela já nao existe.');
     if (delOK) console.log("Collection partidas deleted... Iniciando...");
     dbo.collection("players").drop(function(err, delOK) {
        if (err) console.log('[WARNING] Não consegui deletar a collection players. Possivelmente ela já nao existe.');
        if (delOK) console.log("Collection players deleted... Iniciando...");
        db.close();
     });
   });
}); 

const cws = new clus({
    worker: Worker,
    workers: 2,//require('os').cpus().length,
    port: 8000
});

function Worker() {
    const wss = this.wss;
    const sv = this.server;

    var app = require('./config/server');

    

    //var io = require('socket.io').listen(server);
    sv.on('request', app);
    //app.set('io', io);

    wss.on('connection', (socket) => {
        console.log('Jogador connectou ao processo ' + require('process').pid);
    });
   
}