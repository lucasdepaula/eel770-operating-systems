$(document).ready(function(){
    
});

function pintarTela(tabs) {
    for(var i=0;i<tabs.length;i++) {
        switch(tabs[i]) {
            case 1:
                $('#gameboard button:eq('+i+')').text("O");
                break;
            case 2:
                $('#gameboard button:eq('+i+')').text("X");
                break;
        }
    }
    //$('#gameboard button:eq('+id+')').text("O");
}

function verificaVitoria(tabs){
    if(
        ((tabs[0] != 0) && (tabs[0] == tabs[3]) && (tabs[3] == tabs[6])) ||
        ((tabs[1] != 0) && (tabs[1] == tabs[4]) && (tabs[4] == tabs[7])) ||
        ((tabs[2] != 0) && (tabs[2] == tabs[5]) && (tabs[5] == tabs[8])) ||
        ((tabs[0] != 0) && (tabs[0] == tabs[1]) && (tabs[1] == tabs[2])) ||
        ((tabs[3] != 0) && (tabs[3] == tabs[4]) && (tabs[4] == tabs[5])) ||
        ((tabs[6] != 0) && (tabs[6] == tabs[7]) && (tabs[7] == tabs[8])) ||
        ((tabs[0] != 0) && (tabs[0] == tabs[4]) && (tabs[4] == tabs[8])) ||
        ((tabs[2] != 0) && (tabs[2] == tabs[4]) && (tabs[4] == tabs[6]))

    ){
        // vitoria ocorreu
        if(game_channel_last_message == apelido + ' jogou') {
            alert('Você ganhou!');
            chat_channel.publish(apelido + ' ganhou!');
        } else {
            alert('Você perdeu!');
        }
    }
    else { // verifica velha
        var cont =0;
        for(var i =0;i<tabs.length;i++) {
            if(tabs[i]!=0) {
                cont++;
            }
        }
        if(cont==tabs.length) {
            alert('Vocês empataram!');
            chat_channel.publish('Vocês empataram!');
        }
    }
}