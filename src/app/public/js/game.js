$(document).ready(function(){
    $('#gameboard button').click(function(){
        var id = $('#gameboard button').index(this);
        pintarTela(id);
    });
});

function pintarTela(id) {
    $('#gameboard button:eq('+id+')').text("O");
}