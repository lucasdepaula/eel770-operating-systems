module.exports = function(app) {
    app.post('/play', function(req,res){
        app.app.controllers.game.show(app,req,res);
    });
}