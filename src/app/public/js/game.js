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