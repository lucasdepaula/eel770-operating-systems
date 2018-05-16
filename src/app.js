var app = require('./config/server');

var server = app.listen(80, function(){
    console.log("Servidor online");
});

var io = require('socket.io').listen(server);

app.set('io', io);

io.on('connection', function(socket){
    console.log('Jogador connectou');
});