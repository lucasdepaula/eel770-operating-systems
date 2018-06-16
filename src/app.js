var cluster = require('cluster')
var container = [];
if(cluster.isMaster) {
    var cpuCount = require('os').cpus().length;

    // Cria um processo filho pra cada core
    for (var i = 0; i < cpuCount; i += 1) {
        var wrkr = cluster.fork();

        container[i]=wrkr;
    }
} else {
    var app = require('./config/server');

    var server = app.listen(8000, function(){
        console.log("Servidor online");
    });

    var io = require('socket.io').listen(server);

    app.set('io', io);

    io.on('connection', function(socket){
        console.log('Jogador connectou ao processo ' + cluster.worker.id);
    });
}