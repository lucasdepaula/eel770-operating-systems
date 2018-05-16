var app = require('./config/server');

var server = app.listen(8000, function(){
    console.log("Servidor online");
});

require('socket.io').listen(server);
