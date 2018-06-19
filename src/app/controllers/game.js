const crypto = require('crypto');
const secret_chat_channel = 'oE!Kah&6Or56Pj3Clhob&1zHPB33SVADPS*w*r*Isz8YwkEiIY';
const secret_game_channel = '$63CQipk!$YdXoz7gSw#1crbdbn&2Zlk5DgkLff%6MdXT^Yv@s';
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

    if(partidasDAO.entrarNaPartida(dadosForm.sala, dadosForm.apelido)){
        var chat_channel = crypto.createHmac('sha256', secret_chat_channel)
                        .update(dadosForm.sala)
                        .digest('hex');
        var game_channel = crypto.createHmac('sha256', secret_game_channel)
                        .update(dadosForm.sala)
                        .digest('hex');                   
        res.render('game',{apelido: dadosForm.apelido, room_number: parseInt(req.body.sala), msgLog: "Você foi conectado a sala "+req.body.sala+" a partida será iniciada em instantes.",chat_channel:chat_channel, game_channel: game_channel});
    }
    else {
        res.render('index', {validacao:{}, sala_cheia: true});
    }
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

    partidasDAO.criarPartida(number, dadosForm.apelido);
    var chat_channel = crypto.createHmac('sha256', secret_chat_channel)
                       .update(number.toString())
                       .digest('hex');
    var game_channel = crypto.createHmac('sha256', secret_game_channel)
                       .update(number.toString())
                       .digest('hex');
    //console.log(chat_channel);
    res.render('game',{apelido: dadosForm.apelido,room_number: number, msgLog: "Sua sala foi criada. O número da sala é " + number + "\nAguardando o segundo jogador...", chat_channel: chat_channel,game_channel: game_channel});
}