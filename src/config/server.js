var express = require('express');

var consign = require('consign');

var bodyParser = require('body-parser');

var expressValidator = require('express-validator');

// var expressSession = require('express-session');

var app = express();


// setar variaveis view engine

app.set('view engine', 'ejs');
app.set('views', './app/views');

//configurar middlewares
app.use(express.static('./app/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());
// app.use(expressSession({
//     secret: 'pmM!x$jOUOV^$hDe0$s65jiA4JY8O0%bI3eon6#tL0Sb8KlK2T',
//     resave: true,
//     saveUninitialized: false
// }));

//incluindo diretorios no consign

consign()
    .include('app/routes')
    .then('config/dbconnection.js')
    .then('app/models')
    .then('app/controllers')
    .into(app); //carrega dentro do objeto app
module.exports = app;