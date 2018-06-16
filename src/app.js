const clus = require('clusterws');
var container = [];
const cws = new clus({
    worker: Worker,
    workers: 2,//require('os').cpus().length,
    port: 8000
});

function Worker() {
    const wss = this.wss;
    const sv = this.server;

    var app = require('./config/server');

    //var server = app.listen(8000, function(){
    //    console.log("Servidor online");
    //});

    //var io = require('socket.io').listen(server);
    sv.on('request', app);
    //app.set('io', io);

    wss.on('connection', (socket) => {
        console.log('Jogador connectou ao processo ' + require('process').pid);
    });
    // io.on('connection', function(socket){
    //     console.log('Jogador connectou ao processo ' + require('process').pid);
    // });
}