module.exports.home = function(app, req, res) {
    res.render("index",  {validacao: {}, sala_cheia:false, sala_inexistente: false});
}