const crypto = require('crypto');
const secret_chat_channel = 'oE!Kah&6Or56Pj3Clhob&1zHPB33SVADPS*w*r*Isz8YwkEiIY';
const secret_game_channel = '$63CQipk!$YdXoz7gSw#1crbdbn&2Zlk5DgkLff%6MdXT^Yv@s';
const secret_unique_id = 'HkKHvYfRTEaeDByrD^aeeCg#FDiM7x0Y2$iGNyrIjeqkNUnCSI';

module.exports.show = function(application,req,res){

    var dadosForm = req.body;

    req.assert('apelido','Nome ou apelido é obrigatório').notEmpty();
    req.assert('sala','O número da sala é obrigatório').notEmpty();
    req.assert('apelido','Nome ou apelido deve conter entre 3 e 15 caracteres').len(3, 15);

    var erros = req.validationErrors();

    if(erros){
        res.render("index", {validacao : erros, sala_cheia:false})
        return;
    }


    var connection = application.config.dbconnection;
    var partidasDAO = new application.app.models.partidasDAO(connection);
    //var criei = partidasDAO.entrarNaPartida(dadosForm.sala, dadosForm.apelido);
    var chat_channel = crypto.createHmac('sha256', secret_chat_channel)
                        .update(dadosForm.sala)
                        .digest('hex');
    var game_channel = crypto.createHmac('sha256', secret_game_channel)
                        .update(dadosForm.sala)
                        .digest('hex');
    partidasDAO.entrarNaPartida(dadosForm.sala, dadosForm.apelido, req, res, chat_channel, game_channel);
    var unique_id = crypto.createHmac('sha256', secret_unique_id)
    .update(req.headers.cookie + dadosForm.sala + 2)
    .digest('hex');
    
    partidasDAO.vinculaBrowser(unique_id , parseInt(dadosForm.sala),2);                   
    
}

module.exports.createroom = function(application,req,res){
    var dadosForm=req.body;
    var number = Math.floor(Math.random()*1000+1);
    req.assert('apelido','Nome ou apelido é obrigatório').notEmpty();
    req.assert('apelido','Nome ou apelido deve conter entre 3 e 15 caracteres').len(3, 15);
    var erros = req.validationErrors();

    if(erros){
        res.render("index", {validacao : erros, sala_cheia:false})
        return;
    }
    var connection = application.config.dbconnection;
    var partidasDAO = new application.app.models.partidasDAO(connection);
    var unique_id = req.headers.cookie + number.toString() + 1;
    unique_id = crypto.createHmac('sha256', secret_unique_id)
                       .update(unique_id)
                       .digest('hex');
    console.log('unique_id-admin => ' + unique_id);
    partidasDAO.vinculaBrowser(unique_id, number, 1);
    partidasDAO.criarPartida(number, dadosForm.apelido);
    var chat_channel = crypto.createHmac('sha256', secret_chat_channel)
                       .update(number.toString())
                       .digest('hex');
    var game_channel = crypto.createHmac('sha256', secret_game_channel)
                       .update(number.toString())
                       .digest('hex');
    //console.log(chat_channel);
    res.render('game',{apelido: dadosForm.apelido,room_number: number, msgLog: "Sua sala foi criada. O número da sala é " + number + "\nAguardando o segundo jogador...", chat_channel: chat_channel,game_channel: game_channel, unique_id:unique_id});
}

module.exports.getTabuleiro = function(application,req,res) {
    var connection = application.config.dbconnection;
    var partidasDAO = new application.app.models.partidasDAO(connection);
    // pego o id da partida
    partidasDAO.buscaPartidaByCookie(req.body.uniq, function(result_partida){
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(partidasDAO._conexao,function(err, client){
            if(err) console.log('[ERROR] Problema ao conectar com o banco de dados - ' + err);
            const db = client.db('tictactoe');
            const collection = db.collection('partidas');
            collection.findOne({sala:{$eq:result_partida.sala}},{projection:{_id:0, tabuleiro:1}}, function(err, gameboard){
                if(err) {
                    console.log('[ERROR] Nao foi possivel obter o gameboard');
                    res.status(400).json({msg: '[ERROR] Nao foi possivel obter o gameboard'});
                }
                //console.log('result_partida => ' + JSON.stringify(result_partida));
                //console.log('gameboard => ' + JSON.stringify(gameboard));
                res.json(gameboard.tabuleiro);
                client.close();
                console.log('[INFO] mongo client closed');
            });
        });
    });
}

module.exports.efetuarJogada = function(application,req,res){
    //console.log(req.headers.cookie);
    var connection = application.config.dbconnection;
    var partidasDAO = new application.app.models.partidasDAO(connection);
    // pego o id da partida
    partidasDAO.buscaPartidaByCookie(req.body.uniq, function(result_partida){
        //console.log('Encontrei o cookie na base - Sala ' + result_partida.sala + ' jogador ' + result_partida.id_partida);
        //console.log('result_partida abaixo');
        //console.log(result_partida);
        partidasDAO.eMinhaVez(result_partida.sala, result_partida.id_partida, function(){
            //realizo a jogada e passo a vez pro proximo
            console.log('É a sua vez!');
            partidasDAO.atualizarTabuleiro(req.body.ind,{sala:{$eq:parseInt(result_partida.sala)}},result_partida.id_partida, function(){
                //callback de sucesso
                console.log('Tabuleiro atualizado.');
                res.json({status: 'OK'});
            }, function(){
                // callback de erro
                res.status(400).json({msg: "Essa casa ja esta ocupada."});
            });
            
        },
        function() { // se nao for a vez
            res.status(400).json({msg: "É a vez do outro jogador, aguarde a sua vez."});
        });
    });
};