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

PartidasDAO.prototype.entrarNaPartida = function(numero, jogador, req, res, chat){
    var MongoClient = require('mongodb').MongoClient;
    dadosForm = req.body;
    console.log('entrar partida');
    var obj = {sala:{$eq:parseInt(numero)}};
    var resultado, retorno=0;
    console.log(obj);
    MongoClient.connect(this._conexao,function(err, client){
        const db = client.db('tictactoe');
        const collection = db.collection('partidas');
        collection.findOne(obj, function(err, result){
            if (err) throw err;
            resultado = result;
            console.log(JSON.stringify(resultado));
            if (resultado.players.length<2) {
                // entra na sala e retorna verdadeiro.
                console.log(resultado.players);
                collection.updateOne(obj, {$push:{players:{apelido: jogador}}}, function(err, result){
                    if (err) throw err;
                    res.render('game',{apelido: dadosForm.apelido, room_number: parseInt(req.body.sala), msgLog: "Você foi conectado a sala "+req.body.sala+" a partida será iniciada em instantes.",chat_channel:chat, game_channel: {}});
                    client.close();
                    return true;
                });
                return true;
            }
            else {
                console.log('NAO PODE TER MAIS PLAYERS!!');
                res.render('index', {validacao:{}, sala_cheia: true});
                client.close();
                return false;
                // return false;
            }
        });
    });
}

PartidasDAO.prototype.vinculaBrowser = function(identificador, sala, id_jogo) {
    var MongoClient = require('mongodb').MongoClient;
    console.log('vinculando player');
    var obj = {sala: sala, player:identificador, id_partida:id_jogo};
    MongoClient.connect(this._conexao,function(err, client){
        const db = client.db('tictactoe');
        const collection = db.collection('players');
        collection.insert(obj);
        client.close();
    });
}

PartidasDAO.prototype.buscaPartidaByCookie = function(cookie, callback) {
    var obj = {player:{$eq:cookie}};
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(this._conexao,function(err, client){
        const db = client.db('tictactoe');
        const collection = db.collection('players');
        collection.findOne(obj, function(err, result){
            if (err) throw err;
            console.log('buscaPartidaByCookie = '+result);
            callback(result);
        });
    });
}

PartidasDAO.prototype.eMinhaVez = function(sala, id_partida, callback_sucesso, callback_erro) {
    var obj = {sala: {$eq:parseInt(sala)}};
    //console.log(obj);
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(this._conexao,function(err, client){
        const db = client.db('tictactoe');
        const collection = db.collection('partidas');
        collection.findOne(obj, function(err, result_vez){
            if (err) throw err;
            console.log(JSON.stringify(result_vez));
            if(result_vez.vez==id_partida)
                callback_sucesso(); // realizo a jogada
            else
                callback_erro(); // alerta de erro
        });
    });
}
module.exports = function(){ return PartidasDAO; }