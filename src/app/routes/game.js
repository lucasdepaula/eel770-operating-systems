module.exports = function(app) {
    app.post('/play', function(req,res){
        app.app.controllers.game.show(app,req,res);
    });
    app.post('/jogada', function(req,res){
        app.app.controllers.game.efetuarJogada(app,req,res);
    });
    app.post('/create_room', function(req,res){
        app.app.controllers.game.createroom(app,req,res);
    });
}