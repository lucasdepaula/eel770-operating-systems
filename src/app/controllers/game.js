const crypto = require('crypto');
const secret_chat_channel = 'ASDAasdas123%S';
module.exports.show = function(application,req,res){

    var dadosForm = req.body;

    req.assert('apelido','Nome ou apelido é obrigatório').notEmpty();
    req.assert('sala','O número da sala é obrigatório').no
    req.assert('apelido','Nome ou apelido deve conter entre 3 e 15 caracteres').len(3, 15);

    var erros = req.validationErrors();

    if(erros){
        res.render("index", {validacao : erros})
        return;
    }
    console.log(req.body);
    var chat_channel = crypto.createHmac('sha256', secret_chat_channel)
                       .update(dadosForm.sala)
                       .digest('hex');
    res.render('game',{apelido: dadosForm.apelido, room_number: parseInt(req.body.sala), msgLog: "Você foi conectado a sala "+req.body.sala+" a partida será iniciada em instantes.",chat_channel:chat_channel});
    console.log(chat_channel);
}

module.exports.createroom = function(application,req,res){
    var dadosForm=req.body;
    var number = Math.floor(Math.random()*1000+1);
    
    var chat_channel = crypto.createHmac('sha256', secret_chat_channel)
                       .update(number.toString())
                       .digest('hex');
    console.log(chat_channel);
    res.render('game',{apelido: dadosForm.apelido,room_number: number, msgLog: "Sua sala foi criada. O número da sala é " + number + "\nAguardando o segundo jogador...", chat_channel: chat_channel});
}