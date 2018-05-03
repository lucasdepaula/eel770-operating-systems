module.exports = function(app) {
    app.get('/play', function(req,res){
        app.app.controllers.game.show(app,req,res);
    });
}