var express = require('express');

var consign = require('consign');

var bodyParser = require('body-parser');

var expressValidator = require('express-validator');

var app = express();


// setar variaveis view engine

app.set('view engine', 'ejs');
app.set('views', './app/views');

//configurar middlewares
app.use(express.static('./app/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());

//incluindo diretorios no consign

consign()
    .include('app/routes')
    .include('app/models')
    .include('app/controllers')
    .into(app); //carrega dentro do objeto app
module.exports = app;