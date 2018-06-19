function PartidasDAO(conexao){
    this._conexao = conexao;
    //console.log(conexao);
}
PartidasDAO.prototype.criarPartida = function(numero, jogador){
    var MongoClient = require('mongodb').MongoClient;
    console.log('criar partida');
    var obj = {sala: numero, players:[{apelido: jogador}], vez: 1, tabuleiro:[0,0,0,0,0,0,0,0,0]};
    MongoClient.connect(this._conexao,function(err, client){
        const db = client.db('tictactoe');
        const collection = db.collection('partidas');
        collection.insert(obj);
        client.close();
    });
    
}

PartidasDAO.prototype.entrarNaPartida = function(numero, jogador, req, res, chat, game_channel){
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
                    res.render('game',{apelido: dadosForm.apelido, room_number: parseInt(req.body.sala), msgLog: "Você foi conectado a sala "+req.body.sala+" a partida será iniciada em instantes.",chat_channel:chat, game_channel: game_channel});
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

PartidasDAO.prototype.atualizarTabuleiro = function(posicao,busca, id_partida, callback_sucesso, callback_erro){
    var MongoClient = require('mongodb').MongoClient;
    console.log(busca);
    MongoClient.connect(this._conexao,function(err, client){
        const db = client.db('tictactoe');
        const collection = db.collection('partidas');
        var next = (id_partida==1) ? 2 : 1;
        console.log(next);
        collection.findOne(busca,{projection:{_id:0, tabuleiro:1}}, function(err, gameboard){
            if(err) console.log('[ERROR] Buscar o tabuleiro no banco');
            if(gameboard.tabuleiro[parseInt(posicao)]!=0) {
                callback_erro();
            }
            else {
                // atualiza o tabuleiro
                gameboard.tabuleiro[posicao] = id_partida;
                console.log('Status: ' + gameboard.tabuleiro);
                collection.updateOne(busca, {$set:{tabuleiro:gameboard.tabuleiro, vez: next}}, function(err, atualizado){
                    if (err) throw err;
                    console.log('[INFO] Tabuleiro atualizado em memoria. Passei a vez');
                    callback_sucesso();
                });
            }
        });
        
    });
}
module.exports = function(){ return PartidasDAO; }