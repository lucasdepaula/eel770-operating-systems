function PartidasDAO(conexao){
    this._conexao = conexao;
    //console.log(conexao);
}
PartidasDAO.prototype.criarPartida = function(numero, jogador){
    var MongoClient = require('mongodb').MongoClient;
    console.log('criar partida');
    var obj = {sala: numero, players:[{apelido: jogador}], vez: 1};
    MongoClient.connect(this._conexao,function(err, client){
        const db = client.db('tictactoe');
        const collection = db.collection('partidas');
        collection.insert(obj);
        client.close();
    });
    
}

PartidasDAO.prototype.entrarNaPartida = function(numero, jogador){
    var MongoClient = require('mongodb').MongoClient;
    console.log('entrar partida');
    var obj = {sala:{$eq:parseInt(numero)}};
    var resultado;
    console.log(obj);
    MongoClient.connect(this._conexao,function(err, client){
        const db = client.db('tictactoe');
        const collection = db.collection('partidas');
        collection.findOne(obj, function(err, result){
            resultado = result;
            if (resultado.players.length<2) {
                // entra na sala e retorna verdadeiro.
                console.log(resultado.players);
                collection.updateOne(obj, {$push:{players:{apelido: jogador}}}, function(err, result){
                    client.close();
                    return true;
                });
            }
            else {
                console.log('NAO PODE TER MAIS PLAYERS!!');
                client.close();
                return false;
            }
        });
    });
}
module.exports = function(){ return PartidasDAO; }